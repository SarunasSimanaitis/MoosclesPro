import type { Filter } from "mongodb";
import { database, ensureMindsetIndexes } from "../src/lib/mongodb.js";
import { getSession, methodNotAllowedResponse, requireSession, unauthorizedResponse } from "../src/lib/api.js";
import { mindsetQuotes } from "../src/data/mindsetQuotes.js";

type StoredPost = {
  id: string;
  kind: "quote" | "member";
  title?: string;
  text: string;
  author: string;
  authorId?: string;
  createdAt: string;
  likedBy?: string[];
  savedBy?: string[];
  hiddenBy?: string[];
};

type StoredComment = {
  id: string;
  postId: string;
  userId: string;
  author: string;
  text: string;
  createdAt: string;
};

const ALLOWED_METHODS = ["GET", "POST"];
const MAX_POST_LENGTH = 500;
const MAX_COMMENT_LENGTH = 280;

export const runtime = "nodejs";

export default {
  async fetch(request: Request) {
    if (!ALLOWED_METHODS.includes(request.method)) {
      return methodNotAllowedResponse(ALLOWED_METHODS);
    }

    try {
      await ensureMindsetIndexes();

      if (request.method === "GET") {
        return await getFeed(request);
      }

      return await handleAction(request);
    } catch (error) {
      console.error("Mindset API error:", error);
      return Response.json(
        { error: "The mindset feed is unavailable right now. Please try again." },
        { status: 500 },
      );
    }
  },
};

async function getFeed(request: Request) {
  const session = await getSession(request);
  const userId = session?.user?.id;
  const posts = database.collection<StoredPost>("mindsetPosts");
  const comments = database.collection<StoredComment>("mindsetComments");
  const url = new URL(request.url);
  const commentsFor = url.searchParams.get("commentsFor");
  const view = url.searchParams.get("view");

  if (commentsFor) {
    if (!(await ensurePostExists(commentsFor))) {
      return Response.json({ error: "That post is no longer available." }, { status: 404 });
    }

    const thread = await comments.find({ postId: commentsFor }).sort({ createdAt: 1 }).toArray();
    return Response.json({
      comments: thread.map((comment) => ({
        id: comment.id,
        author: comment.author,
        text: comment.text,
        createdAt: comment.createdAt,
        canDelete: comment.userId === userId,
      })),
    });
  }

  const memberPostQuery: Filter<StoredPost> = view === "hidden" && userId
    ? { kind: "member", hiddenBy: userId }
    : view === "saved" && userId
      ? { kind: "member", savedBy: userId }
      : view === "hidden" || view === "saved"
        ? { kind: "member", id: { $in: [] } }
        : { kind: "member" };
  const [storedQuotes, memberPosts] = await Promise.all([
    posts.find({ id: { $in: mindsetQuotes.map((quote) => quote.id) } }).toArray(),
    posts.find(memberPostQuery).sort({ createdAt: -1 }).limit(view === "all" ? 60 : 200).toArray(),
  ]);

  const byId = new Map(storedQuotes.map((post) => [post.id, post] as const));
  const quotePosts: StoredPost[] = mindsetQuotes.map((quote, index) => {
    const prior = byId.get(quote.id);
    return {
      id: quote.id,
      kind: "quote",
      title: quote.title,
      text: quote.text,
      author: "MoosclesPro",
      createdAt: prior?.createdAt ?? new Date(Date.now() - index * 86_400_000).toISOString(),
      likedBy: prior?.likedBy ?? [],
      savedBy: prior?.savedBy ?? [],
      hiddenBy: prior?.hiddenBy ?? [],
    };
  });

  const visible = [...quotePosts, ...memberPosts]
    .filter((post) => {
      const isHidden = Boolean(userId && post.hiddenBy?.includes(userId));
      if (view === "hidden") return isHidden;
      if (isHidden) return false;
      return view !== "saved" || Boolean(userId && post.savedBy?.includes(userId));
    })
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 40);

  const ids = visible.map((post) => post.id);
  const grouped = ids.length
    ? await comments.aggregate<{
        _id: string;
        count: number;
        recent: Array<Pick<StoredComment, "id" | "userId" | "author" | "text" | "createdAt">>;
      }>([
        { $match: { postId: { $in: ids } } },
        { $sort: { createdAt: -1 } },
        { $group: {
          _id: "$postId",
          count: { $sum: 1 },
          recent: { $push: { id: "$id", userId: "$userId", author: "$author", text: "$text", createdAt: "$createdAt" } },
        } },
        { $project: { count: 1, recent: { $slice: ["$recent", 3] } } },
      ]).toArray()
    : [];

  const commentByPost = new Map(grouped.map((item) => [item._id, item] as const));

  return Response.json({
    posts: visible.map((post) => {
      const postComments = commentByPost.get(post.id);
      return {
        id: post.id,
        kind: post.kind,
        ...(post.title ? { title: post.title } : {}),
        text: post.text,
        author: post.author,
        ...(post.authorId ? { authorId: post.authorId } : {}),
        createdAt: post.createdAt,
        likes: post.likedBy?.length ?? 0,
        comments: postComments?.count ?? 0,
        liked: Boolean(userId && post.likedBy?.includes(userId)),
        saved: Boolean(userId && post.savedBy?.includes(userId)),
        recentComments: (postComments?.recent ?? []).map((comment) => ({
          id: comment.id,
          author: comment.author,
          text: comment.text,
          createdAt: comment.createdAt,
          canDelete: comment.userId === userId,
        })),
      };
    }),
  });
}

async function handleAction(request: Request) {
  const authResult = await requireSession(request);
  if (!authResult) return unauthorizedResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!isRecord(body) || typeof body.action !== "string") {
    return Response.json({ error: "Choose a valid feed action." }, { status: 400 });
  }

  const posts = database.collection<StoredPost>("mindsetPosts");
  const comments = database.collection<StoredComment>("mindsetComments");
  const userId = authResult.user.id;
  const author = authResult.user.name?.trim() || "Member";

  if (body.action === "create") {
    const text = normalizeText(body.text, MAX_POST_LENGTH);
    if (!text) return Response.json({ error: "Write a note of up to 500 characters." }, { status: 400 });

    const post: StoredPost = {
      id: crypto.randomUUID(),
      kind: "member",
      text,
      author,
      authorId: userId,
      createdAt: new Date().toISOString(),
      likedBy: [],
      savedBy: [],
      hiddenBy: [],
    };

    await posts.insertOne(post);
    return Response.json({
      post: {
        id: post.id,
        kind: post.kind,
        text: post.text,
        author: post.author,
        authorId: post.authorId,
        createdAt: post.createdAt,
        likes: 0,
        comments: 0,
        liked: false,
        saved: false,
        recentComments: [],
      },
    }, { status: 201 });
  }

  const postId = typeof body.postId === "string" ? body.postId : "";
  if (!postId) {
    return Response.json({ error: "Choose a valid post." }, { status: 400 });
  }

  if (body.action === "delete-post") {
    const post = await posts.findOne({ id: postId, kind: "member" });
    if (!post) return Response.json({ error: "That post is no longer available." }, { status: 404 });
    if (post.authorId !== userId) return Response.json({ error: "You can only delete your own posts." }, { status: 403 });

    await posts.deleteOne({ id: postId, kind: "member", authorId: userId });
    await comments.deleteMany({ postId });
    return Response.json({ ok: true });
  }

  if (body.action === "delete-comment") {
    const commentId = typeof body.commentId === "string" ? body.commentId : "";
    if (!commentId) return Response.json({ error: "Choose a valid comment." }, { status: 400 });

    const comment = await comments.findOne({ id: commentId, postId });
    if (!comment) return Response.json({ error: "That comment is no longer available." }, { status: 404 });
    if (comment.userId !== userId) return Response.json({ error: "You can only delete your own comments." }, { status: 403 });

    await comments.deleteOne({ id: commentId, postId, userId });
    return Response.json({ ok: true });
  }

  if (!(await ensurePostExists(postId))) {
    return Response.json({ error: "That post is no longer available." }, { status: 404 });
  }

  if (body.action === "like" || body.action === "save" || body.action === "hide") {
    const enabled = body.enabled === true;
    if (body.action === "like") {
      await posts.updateOne({ id: postId }, enabled ? { $addToSet: { likedBy: userId } } : { $pull: { likedBy: userId } });
    } else if (body.action === "save") {
      await posts.updateOne({ id: postId }, enabled ? { $addToSet: { savedBy: userId } } : { $pull: { savedBy: userId } });
    } else if (enabled) {
      await posts.updateOne({ id: postId }, { $addToSet: { hiddenBy: userId } });
    } else {
      await posts.updateOne({ id: postId }, { $pull: { hiddenBy: userId } });
    }
    return Response.json({ ok: true });
  }

  if (body.action === "comment") {
    const text = normalizeText(body.text, MAX_COMMENT_LENGTH);
    if (!text) return Response.json({ error: "Write a comment of up to 280 characters." }, { status: 400 });

    const comment: StoredComment = {
      id: crypto.randomUUID(),
      postId,
      userId,
      author,
      text,
      createdAt: new Date().toISOString(),
    };

    await comments.insertOne(comment);
    return Response.json({
      comment: {
        id: comment.id,
        author: comment.author,
        text: comment.text,
        createdAt: comment.createdAt,
        canDelete: true,
      },
    }, { status: 201 });
  }

  return Response.json({ error: "Choose a valid feed action." }, { status: 400 });
}

async function ensurePostExists(postId: string): Promise<boolean> {
  const posts = database.collection<StoredPost>("mindsetPosts");
  const quote = mindsetQuotes.find((item) => item.id === postId);
  if (quote) {
    await posts.updateOne(
      { id: quote.id },
      { $setOnInsert: {
        id: quote.id,
        kind: "quote",
        title: quote.title,
        text: quote.text,
        author: "MoosclesPro",
        createdAt: new Date().toISOString(),
        likedBy: [],
        savedBy: [],
        hiddenBy: [],
      } },
      { upsert: true },
    );
    return true;
  }

  return Boolean(await posts.findOne({ id: postId, kind: "member" }, { projection: { _id: 1 } }));
}

function normalizeText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (!text || text.length > maxLength) return null;
  return text;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
