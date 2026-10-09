import { apiRequest } from "./client";

export type MindsetComment = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  canDelete?: boolean;
};

export type MindsetPost = {
  id: string;
  kind: "quote" | "member";
  title?: string;
  text: string;
  author: string;
  authorId?: string;
  createdAt: string;
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  recentComments: MindsetComment[];
};

export type MindsetView = "all" | "saved" | "hidden";

export const mindsetApi = {
  list(view: MindsetView = "all"): Promise<{ posts: MindsetPost[] }> {
    return apiRequest<{ posts: MindsetPost[] }>(
      "/api/mindset" + (view === "all" ? "" : `?view=${view}`),
    );
  },

  comments(postId: string): Promise<{ comments: MindsetComment[] }> {
    return apiRequest<{ comments: MindsetComment[] }>(
      `/api/mindset?commentsFor=${encodeURIComponent(postId)}`,
    );
  },

  create(text: string): Promise<{ post: MindsetPost }> {
    return apiRequest<{ post: MindsetPost }>("/api/mindset", {
      method: "POST",
      body: { action: "create", text },
    });
  },

  setAction(action: "like" | "save" | "hide", postId: string, enabled: boolean): Promise<{ ok: true }> {
    return apiRequest<{ ok: true }>("/api/mindset", {
      method: "POST",
      body: { action, postId, enabled },
    });
  },

  comment(postId: string, text: string): Promise<{ comment: MindsetComment }> {
    return apiRequest<{ comment: MindsetComment }>("/api/mindset", {
      method: "POST",
      body: { action: "comment", postId, text },
    });
  },

  deletePost(postId: string): Promise<{ ok: true }> {
    return apiRequest<{ ok: true }>("/api/mindset", {
      method: "POST",
      body: { action: "delete-post", postId },
    });
  },

  deleteComment(postId: string, commentId: string): Promise<{ ok: true }> {
    return apiRequest<{ ok: true }>("/api/mindset", {
      method: "POST",
      body: { action: "delete-comment", postId, commentId },
    });
  },
};
