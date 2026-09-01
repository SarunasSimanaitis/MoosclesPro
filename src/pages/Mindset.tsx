import {
  Bookmark,
  Camera,
  Heart,
  Image,
  MessageCircle,
  Quote,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

type PostType = "quote" | "photo" | "food";

type Post = {
  id: string;
  type: PostType;
  title: string;
  text: string;
  likes: number;
  comments: number;
  imageUrl: string;
};

const posts: Post[] = [
  {
    id: "choose-pain",
    type: "quote",
    title: "Choose Pain",
    text: "Choose the pain of effort over the pain of regret.",
    likes: 42,
    comments: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "train-daily",
    type: "quote",
    title: "Train Daily",
    text: "Discipline is a muscle. Use it or lose it.",
    likes: 37,
    comments: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "identity",
    type: "quote",
    title: "Identity",
    text: "Conquer your mind, and nothing else can control you.",
    likes: 56,
    comments: 11,
    imageUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "stare-weakness",
    type: "quote",
    title: "Stare Weakness",
    text: "Stop feeding distraction, excuses, and easy pleasure.",
    likes: 31,
    comments: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "morning-session",
    type: "photo",
    title: "Morning session",
    text: "Another one done before the day even started.",
    likes: 28,
    comments: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "endure",
    type: "quote",
    title: "Endure",
    text: "Discomfort isn't danger. Stay inside it until it loses power.",
    likes: 63,
    comments: 14,
    imageUrl:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "command",
    type: "quote",
    title: "Command",
    text: "Your mind suggests. You decide. You are not your thoughts.",
    likes: 71,
    comments: 16,
    imageUrl:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "persevere",
    type: "quote",
    title: "Persevere",
    text: "Even when your mind screams for you to stop, keep going.",
    likes: 49,
    comments: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "fuel",
    type: "food",
    title: "Fuel the work.",
    text: "Simple food. Enough protein. Stay consistent.",
    likes: 22,
    comments: 6,
    imageUrl:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "progress",
    type: "quote",
    title: "Progress is quiet.",
    text: "Keep going even when nobody notices.",
    likes: 45,
    comments: 7,
    imageUrl:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85",
  },
];

export default function Mindset() {
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  const toggleLike = (postId: string) => {
    setLikedPosts((current) =>
      current.includes(postId)
        ? current.filter((id) => id !== postId)
        : [...current, postId],
    );
  };

  const toggleSave = (postId: string) => {
    setSavedPosts((current) =>
      current.includes(postId)
        ? current.filter((id) => id !== postId)
        : [...current, postId],
    );
  };

  return (
    <main className="space-y-10">
      {/* Hero */}
      <section>
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
          <Sparkles size={16} />
          Mindset
        </p>

        <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-[var(--text)] md:text-6xl">
          Train your body.
          <br />
          Build your mindset.
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)]">
          A place for progress, motivation, meals, routines, ideas and the
          moments that keep you moving forward.
        </p>
      </section>

      {/* Feed header */}
      <section>
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Community
            </p>

            <h2 className="mt-2 text-3xl font-black text-[var(--text)]">
              Keep moving forward.
            </h2>
          </div>

          <p className="hidden text-sm text-[var(--text-muted)] md:block">
            Inspiration from the MoosclesPro community
          </p>
        </div>

        {/* Feed */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post) => {
            const isLiked = likedPosts.includes(post.id);
            const isSaved = savedPosts.includes(post.id);

            return (
              <article
                key={post.id}
                className="group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative isolate min-h-[330px] overflow-hidden rounded-t-[2rem]">
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="absolute inset-[-1px] h-[calc(100%+2px)] w-[calc(100%+2px)] object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
                  />

                  {/* Dark gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/5" />

                  {/* Post type */}
                  <div className="absolute left-6 top-6">
                    <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                      {post.type}
                    </span>
                  </div>

                  {/* Save */}
                  <button
                    type="button"
                    onClick={() => toggleSave(post.id)}
                    aria-label={
                      isSaved
                        ? `Remove ${post.title} from saved posts`
                        : `Save ${post.title}`
                    }
                    className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:bg-white/20"
                  >
                    <Bookmark
                      size={16}
                      fill={isSaved ? "currentColor" : "none"}
                    />
                  </button>

                  {/* Quote / title */}
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    {post.type === "quote" ? (
                      <>
                        <Quote
                          size={22}
                          className="mb-4 text-[var(--primary)]"
                        />

                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
                          {post.title}
                        </p>

                        <p className="mt-2 text-xl font-black leading-tight">
                          “{post.text}”
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="mb-4">
                          {post.type === "photo" ? (
                            <Camera
                              size={22}
                              className="text-[var(--primary)]"
                            />
                          ) : (
                            <Image
                              size={22}
                              className="text-[var(--primary)]"
                            />
                          )}
                        </div>

                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
                          {post.type}
                        </p>

                        <h3 className="mt-2 text-2xl font-black">
                          {post.title}
                        </h3>
                      </>
                    )}
                  </div>
                </div>

                {/* Post body */}
                <div className="p-6">
                  <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                    {post.type === "quote"
                      ? "A reminder to keep showing up, even when progress feels slow."
                      : post.text}
                  </p>

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <button
                        type="button"
                        onClick={() => toggleLike(post.id)}
                        aria-label={
                          isLiked
                            ? `Unlike ${post.title}`
                            : `Like ${post.title}`
                        }
                        className={`flex items-center gap-1.5 text-xs transition ${isLiked
                            ? "text-[var(--primary)]"
                            : "text-[var(--text-muted)] hover:text-[var(--primary)]"
                          }`}
                      >
                        <Heart
                          size={15}
                          fill={isLiked ? "currentColor" : "none"}
                        />
                        {post.likes + (isLiked ? 1 : 0)}
                      </button>

                      <button
                        type="button"
                        className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] transition hover:text-[var(--primary)]"
                        aria-label={`View comments on ${post.title}`}
                      >
                        <MessageCircle size={15} />
                        {post.comments}
                      </button>
                    </div>

                    <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                      MoosclesPro
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Community CTA */}
      <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--text)] p-8 text-[var(--surface)] md:p-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              <Sparkles size={16} />
              Coming later
            </p>

            <h2 className="mt-4 text-3xl font-black md:text-4xl">
              Your progress could inspire someone else.
            </h2>

            <p className="mt-4 leading-relaxed text-[var(--text-muted)]">
              Share gym photos, meals, personal milestones, motivational
              thoughts and the moments that keep you moving. Progress doesn't
              have to happen alone.
            </p>
          </div>

          <button
            type="button"
            className="shrink-0 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
          >
            Create a post
          </button>
        </div>
      </section>
    </main>
  );
}