import {
  Camera,
  Heart,
  Image,
  MessageCircle,
  Quote,
  Sparkles,
} from "lucide-react";

type PostType = "quote" | "photo" | "food";

type Post = {
  type: PostType;
  title: string;
  text: string;
  likes: number;
  comments: number;
};

const posts: Post[] = [
  {
    type: "quote",
    title: "Choose Pain",
    text: "Choose the pain of effort over the pain of regret.",
    likes: 42,
    comments: 8,
  },
  {
    type: "quote",
    title: "Train Daily",
    text: "Discipline is a muscle. Use it or lose it.",
    likes: 37,
    comments: 5,
  },
  {
    type: "quote",
    title: "Identity",
    text: "Conquer your mind, and nothing else can control you.",
    likes: 56,
    comments: 11,
  },
  {
    type: "quote",
    title: "Stare Weakness",
    text: "Stop feeding distraction, excuses, and easy pleasure.",
    likes: 31,
    comments: 4,
  },
  {
    type: "photo",
    title: "Morning session",
    text: "Another one done before the day even started.",
    likes: 28,
    comments: 3,
  },
  {
    type: "quote",
    title: "Endure",
    text: "Discomfort isn't danger. Stay inside it until it loses power.",
    likes: 63,
    comments: 14,
  },
  {
    type: "quote",
    title: "Command",
    text: "Your mind suggests. You decide. You are not your thoughts.",
    likes: 71,
    comments: 16,
  },
  {
    type: "quote",
    title: "Persevere",
    text: "Even when your mind screams for you to stop, keep going.",
    likes: 49,
    comments: 9,
  },
  {
    type: "food",
    title: "Fuel the work.",
    text: "Simple food. Enough protein. Stay consistent.",
    likes: 22,
    comments: 6,
  },
  {
    type: "quote",
    title: "Progress is quiet.",
    text: "Keep going even when nobody notices.",
    likes: 45,
    comments: 7,
  },
];

function PostVisual({ post }: { post: Post }) {
  if (post.type === "quote") {
    return (
      <div className="flex min-h-64 items-end bg-[var(--text)] p-7">
        <div>
          <Quote
            className="mb-6 text-[var(--primary)]"
            size={28}
          />

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            {post.title}
          </p>

          <p className="mt-3 text-2xl font-bold leading-tight text-[var(--surface)]">
            “{post.text}”
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-64 items-end p-7 ${
        post.type === "food"
          ? "bg-[#d8c2a0]"
          : "bg-[var(--primary-soft)]"
      }`}
    >
      <div>
        {post.type === "photo" ? (
          <Camera
            className="text-[var(--primary)]"
            size={28}
          />
        ) : (
          <Image
            className="text-[var(--primary)]"
            size={28}
          />
        )}

        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary-hover)]">
          {post.type}
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#30261E]">
          {post.title}
        </h2>
      </div>
    </div>
  );
}

export default function Mindset() {
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

      {/* Community feed */}
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

          <span className="hidden text-sm text-[var(--text-muted)] md:block">
            Inspiration from the MoosclesPro community
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {posts.map((post, index) => (
            <article
              key={`${post.title}-${index}`}
              className="group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <PostVisual post={post} />

              <div className="p-7">
                <p className="leading-relaxed text-[var(--text-muted)]">
                  {post.type === "quote"
                    ? `A reminder to keep showing up, even when progress feels slow.`
                    : post.text}
                </p>

                <div className="mt-6 flex items-center gap-5 text-[var(--text-muted)]">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs transition hover:text-[var(--primary)]"
                    aria-label={`Like ${post.title}`}
                  >
                    <Heart size={14} />
                    {post.likes}
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs transition hover:text-[var(--primary)]"
                    aria-label={`Comment on ${post.title}`}
                  >
                    <MessageCircle size={14} />
                    {post.comments}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Future social section */}
      <section className="overflow-hidden rounded-[2rem] bg-[var(--text)] p-8 text-[var(--surface)] md:p-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            Coming later
          </p>

          <h2 className="mt-4 text-3xl font-black md:text-4xl">
            Your progress could inspire someone else.
          </h2>

          <p className="mt-4 leading-relaxed text-[var(--text-muted)]">
            Share gym photos, meals, personal milestones, motivational
            thoughts and quotes. The future MoosclesPro community will make
            progress something worth sharing.
          </p>

          <button
            type="button"
            className="mt-8 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
          >
            Create a post
          </button>
        </div>
      </section>
    </main>
  );
}