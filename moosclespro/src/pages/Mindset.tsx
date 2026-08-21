import {
  Camera,
  Heart,
  Image,
  MessageCircle,
  Quote,
  Sparkles,
} from "lucide-react";

const posts = [
  {
    type: "quote",
    title: "Consistency beats motivation.",
    text: "You don't need to feel ready. You just need to show up.",
  },
  {
    type: "photo",
    title: "Morning session",
    text: "Another one done before the day even started.",
  },
  {
    type: "food",
    title: "Fuel the work.",
    text: "Simple food. Enough protein. Stay consistent.",
  },
  {
    type: "quote",
    title: "Progress is quiet.",
    text: "Keep going even when nobody notices.",
  },
];

export default function Mindset() {
  return (
    <main className="space-y-10">
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

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {posts.map((post, index) => (
          <article
            key={index}
            className="group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`flex min-h-64 items-end p-7 ${
                post.type === "quote"
                  ? "bg-[var(--text)]"
                  : post.type === "food"
                    ? "bg-[#d8c2a0]"
                    : "bg-[var(--primary-soft)]"
              }`}
            >
              {post.type === "quote" ? (
                <div>
                  <Quote className="mb-6 text-[var(--primary)]" size={28} />

                  <p className="text-2xl font-bold leading-tight text-[var(--surface)]">
                    “{post.title}”
                  </p>
                </div>
              ) : (
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
              )}
            </div>

            <div className="p-7">
              <p className="leading-relaxed text-[var(--text-muted)]">
                {post.text}
              </p>

              <div className="mt-6 flex items-center gap-4 text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5 text-xs">
                  <Heart size={14} />
                  24
                </span>

                <span className="flex items-center gap-1.5 text-xs">
                  <MessageCircle size={14} />
                  6
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>

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