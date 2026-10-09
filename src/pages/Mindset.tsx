import {
  Bookmark,
  EyeOff,
  Heart,
  MessageCircle,
  Quote,
  Send,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { mindsetApi, type MindsetPost, type MindsetView } from "../api/mindset";
import { authClient } from "../lib/auth-client";

export default function Mindset() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [posts, setPosts] = useState<MindsetPost[]>([]);
  const [view, setView] = useState<MindsetView>("all");
  const [draft, setDraft] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [pendingPosts, setPendingPosts] = useState<Set<string>>(() => new Set());
  const signedIn = Boolean(session?.user);

  useEffect(() => {
    let cancelled = false;

    mindsetApi.list(view)
      .then((result) => {
        if (!cancelled) setPosts(result.posts);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : "Could not load the mindset feed.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [view, session?.user?.id]);

  async function submitPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!requireSignIn()) return;
    const text = draft.trim();
    if (!text) return;

    setIsPosting(true);
    setError("");
    try {
      const { post } = await mindsetApi.create(text);
      setPosts((current) => [post, ...current.filter((item) => item.id !== post.id)]);
      setDraft("");
      setNotice("Your note is in the feed.");
      setView("all");
      setIsLoading(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Your post could not be saved.");
    } finally {
      setIsPosting(false);
    }
  }

  function requireSignIn() {
    if (signedIn) return true;
    setNotice("Sign in to post, comment, like, or save a reminder.");
    return false;
  }

  async function runAction(postId: string, action: "like" | "save" | "hide", enabled: boolean) {
    if (!requireSignIn()) return;
    if (pendingPosts.has(postId)) return;

    const originalPost = posts.find((post) => post.id === postId);
    if (!originalPost) return;

    setPendingPosts((current) => new Set(current).add(postId));
    setError("");

    if (action === "hide" || (action === "save" && !enabled && view === "saved")) {
      setPosts((current) => current.filter((post) => post.id !== postId));
    } else {
      setPosts((current) => current.map((post) => {
        if (post.id !== postId) return post;
        if (action === "like") {
          return { ...post, liked: enabled, likes: Math.max(0, post.likes + (enabled ? 1 : -1)) };
        }
        return { ...post, saved: enabled };
      }));
    }

    try {
      await mindsetApi.setAction(action, postId, enabled);
      if (action === "hide") {
        setNotice("Hidden from your feed.");
      }
    } catch (requestError) {
      setPosts((current) => current.some((post) => post.id === postId)
        ? current.map((post) => post.id === postId ? originalPost : post)
        : [originalPost, ...current]);
      setError(requestError instanceof Error ? requestError.message : "That action could not be saved.");
    } finally {
      setPendingPosts((current) => {
        const next = new Set(current);
        next.delete(postId);
        return next;
      });
    }
  }

  function changeView(nextView: MindsetView) {
    if (nextView === view) return;
    setError("");
    setIsLoading(true);
    setView(nextView);
  }

  async function submitComment(event: FormEvent<HTMLFormElement>, postId: string) {
    event.preventDefault();
    if (!requireSignIn()) return;
    const text = commentDrafts[postId]?.trim();
    if (!text) return;

    setError("");
    try {
      const { comment } = await mindsetApi.comment(postId, text);
      setPosts((current) => current.map((post) => post.id === postId
        ? { ...post, comments: post.comments + 1, recentComments: [...post.recentComments, comment].slice(-3) }
        : post));
      setCommentDrafts((current) => ({ ...current, [postId]: "" }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Your comment could not be saved.");
    }
  }

  return (
    <main className="page-stack mx-auto max-w-[1500px] space-y-7 sm:space-y-9">
      <PageHeader
        eyebrow="Mindset"
        icon={<Sparkles size={15} />}
        title="A stronger inner voice."
        description="Good training is built one choice at a time. Keep a thought close, share what helped, and encourage someone else."
      />

      {notice && (
        <div role="status" className="flex flex-col gap-3 rounded-2xl border border-[var(--primary)]/25 bg-[var(--primary-soft)] px-4 py-3 text-sm text-[var(--text)] sm:flex-row sm:items-center sm:justify-between">
          <span>{notice}</span>
          {!signedIn && !isSessionPending && (
            <Link to="/login" className="font-bold text-[var(--primary)] underline">Sign in to join in</Link>
          )}
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-2xl border border-[var(--danger)]/25 bg-[var(--danger-soft)] px-4 py-3 text-sm font-semibold text-[var(--danger)]">
          {error}
        </div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:gap-9">
        <div className="min-w-0 space-y-5">
          {signedIn ? (
            <Card className="p-4 sm:p-6">
              <form onSubmit={(event) => void submitPost(event)}>
                <label htmlFor="mindset-post" className="block text-sm font-bold">Share a thought from your training</label>
                <textarea
                  id="mindset-post"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="A small win, a lesson, or a reminder for someone else…"
                  maxLength={500}
                  rows={4}
                  className="mt-3 min-h-28 w-full resize-y rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm leading-relaxed text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)]"
                />
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[var(--text-muted)]">{draft.length}/500 characters · Be kind and keep it useful.</p>
                  <Button type="submit" loading={isPosting} disabled={!draft.trim()} className="w-full sm:w-auto">
                    <Send size={16} aria-hidden="true" />
                    Share note
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="font-bold">Make this space yours</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Sign in to share a note and save the reminders you want to keep.</p>
              </div>
              <Link to="/login"><Button variant="secondary" className="w-full sm:w-auto">Sign in</Button></Link>
            </Card>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">The feed</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{view === "saved" ? "Your saved reminders" : "Notes for the journey"}</h2>
            </div>
            <div role="group" aria-label="Mindset feed filter" className="grid grid-cols-2 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
              <FeedFilter active={view === "all"} onClick={() => changeView("all")}>For you</FeedFilter>
              <FeedFilter active={view === "saved"} onClick={() => {
                if (!requireSignIn()) return;
                changeView("saved");
              }}>Saved</FeedFilter>
            </div>
          </div>

          {isLoading ? (
            <FeedSkeleton />
          ) : posts.length ? (
            <section className="grid gap-4 lg:grid-cols-2 2xl:gap-5" aria-label="Mindset posts">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                post={post}
                currentUserName={session?.user?.name ?? "You"}
                isPending={pendingPosts.has(post.id)}
                  isCommentsOpen={openComments === post.id}
                  commentDraft={commentDrafts[post.id] ?? ""}
                  onLike={() => void runAction(post.id, "like", !post.liked)}
                  onSave={() => void runAction(post.id, "save", !post.saved)}
                  onHide={() => void runAction(post.id, "hide", true)}
                  onToggleComments={() => setOpenComments((current) => current === post.id ? null : post.id)}
                  onCommentDraftChange={(text) => setCommentDrafts((current) => ({ ...current, [post.id]: text }))}
              onComment={(event) => void submitComment(event, post.id)}
                />
              ))}
            </section>
          ) : (
            <Card className="p-8 text-center sm:p-12">
              <Bookmark size={25} className="mx-auto text-[var(--primary)]" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-black">{view === "saved" ? "Nothing saved yet" : "A quiet moment"}</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
                {view === "saved" ? "Tap Save on a quote or note and it will be here next time." : "There are no notes to show yet. Share the first one when you are ready."}
              </p>
            </Card>
          )}
        </div>

        <aside className="space-y-5 xl:sticky xl:top-28">
          <Card className="mindset-quote p-6 sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <Quote size={20} aria-hidden="true" />
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">A note to keep</p>
            <blockquote className="mt-3 text-2xl font-black leading-tight tracking-tight sm:text-3xl">
              “Progress is built in the sessions you choose to return to.”
            </blockquote>
            <p className="mt-4 text-sm text-[var(--text-muted)]">A MoosclesPro reminder</p>
            <div className="mt-7 h-px bg-[var(--border)]" />
            <div className="mt-5 flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--success-soft)] text-[var(--success)]">
                <Sparkles size={17} aria-hidden="true" />
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                You can hide any post from your own feed. It will not change what other people see.
              </p>
            </div>
          </Card>
          <Card className="p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">A gentle reminder</p>
            <p className="mt-3 text-lg font-bold leading-snug">You are allowed to begin again at any time.</p>
            <Link to="/workouts" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--primary)]">
              Back to your training <span aria-hidden="true">→</span>
            </Link>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function FeedFilter({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={"min-h-10 rounded-full px-4 text-xs font-bold transition-colors sm:text-sm " + (active ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text)]")}
    >
      {children}
    </button>
  );
}

function PostCard({
  post,
  currentUserName,
  isPending,
  isCommentsOpen,
  commentDraft,
  onLike,
  onSave,
  onHide,
  onToggleComments,
  onCommentDraftChange,
  onComment,
}: {
  post: MindsetPost;
  currentUserName: string;
  isPending: boolean;
  isCommentsOpen: boolean;
  commentDraft: string;
  onLike: () => void;
  onSave: () => void;
  onHide: () => void;
  onToggleComments: () => void;
  onCommentDraftChange: (value: string) => void;
  onComment: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const initials = post.author.trim().slice(0, 1).toUpperCase() || "M";

  return (
    <article className="site-card overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]">
      {post.kind === "quote" && (
        <div className="mindset-quote border-b border-[var(--border)] px-5 pb-5 pt-6 sm:px-7 sm:pb-6 sm:pt-7">
          <Quote size={20} className="text-[var(--primary)]" aria-hidden="true" />
          {post.title && <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--primary)]">{post.title}</p>}
          <p className="mt-2 text-xl font-black leading-snug tracking-tight sm:text-2xl">“{post.text}”</p>
        </div>
      )}

      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)] text-sm font-black text-[var(--primary)]">{initials}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{post.author || currentUserName}</p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">{post.kind === "quote" ? "Daily reminder" : formatTime(post.createdAt)}</p>
          </div>
          <button type="button" onClick={onHide} disabled={isPending} className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)] disabled:opacity-50" aria-label="Hide this post from your feed" title="Hide for you">
            <EyeOff size={17} aria-hidden="true" />
          </button>
        </div>

        {post.kind === "member" && <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed sm:text-base">{post.text}</p>}

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
          <ActionButton active={post.liked} disabled={isPending} label={post.liked ? "Unlike" : "Like"} count={post.likes} onClick={onLike} icon={<Heart size={17} fill={post.liked ? "currentColor" : "none"} />} />
          <ActionButton active={false} expanded={isCommentsOpen} label="Comment" count={post.comments} onClick={onToggleComments} icon={<MessageCircle size={17} />} />
          <button type="button" onClick={onSave} disabled={isPending} aria-pressed={post.saved} className={"ml-auto inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-xs font-bold transition-colors disabled:opacity-50 " + (post.saved ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]")}>
            <Bookmark size={16} fill={post.saved ? "currentColor" : "none"} aria-hidden="true" />
            {post.saved ? "Saved" : "Save"}
          </button>
        </div>

        {isCommentsOpen && (
          <div className="mt-4 border-t border-[var(--border)] pt-4">
            {post.recentComments.length ? (
              <div className="space-y-3">
                {post.recentComments.map((comment) => (
                  <div key={comment.id} className="flex gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-soft)] text-xs font-bold text-[var(--primary)]">{comment.author.slice(0, 1).toUpperCase()}</span>
                    <p className="min-w-0 flex-1 rounded-2xl bg-[var(--surface-soft)] px-3.5 py-2.5 text-sm leading-relaxed">
                      <span className="font-bold">{comment.author}</span>
                      <span className="text-[var(--text-muted)]"> {comment.text}</span>
                    </p>
                  </div>
                ))}
                {post.comments > post.recentComments.length && (
                  <p className="pl-10 text-xs text-[var(--text-muted)]">Showing the latest {post.recentComments.length} of {post.comments} comments.</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">Be the first to leave a kind note.</p>
            )}
            <form onSubmit={onComment} className="mt-4 flex items-center gap-2">
              <label htmlFor={"comment-" + post.id} className="sr-only">Write a comment</label>
              <input
                id={"comment-" + post.id}
                value={commentDraft}
                maxLength={280}
                onChange={(event) => onCommentDraftChange(event.target.value)}
                placeholder="Add a thoughtful comment…"
                className="min-h-11 min-w-0 flex-1 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)]"
              />
              <button type="submit" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]" aria-label="Send comment">
                <Send size={16} aria-hidden="true" />
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}

function ActionButton({ active, expanded, disabled, label, count, onClick, icon }: { active: boolean; expanded?: boolean; disabled?: boolean; label: string; count: number; onClick: () => void; icon: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label + ", " + count}
      aria-pressed={active}
      aria-expanded={expanded}
      className={"inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-xs font-bold transition-colors disabled:opacity-50 " + (active ? "bg-[var(--danger-soft)] text-[var(--danger)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]")}
    >
      {icon}
      <span>{count}</span>
      <span className="sr-only">{label}</span>
    </button>
  );
}

function formatTime(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Community note";
  const age = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.floor(age / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return minutes + "m ago";
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + "h ago";
  const days = Math.floor(hours / 24);
  return days < 30 ? days + "d ago" : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function FeedSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2" role="status" aria-label="Loading mindset feed">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="h-72 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />
      ))}
    </div>
  );
}
