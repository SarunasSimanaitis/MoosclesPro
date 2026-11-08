/*
 * A tiny canvas confetti burst for celebrations (personal records, finished
 * workouts). No dependency, about 1.5 seconds long, and it does nothing at
 * all when the user prefers reduced motion.
 */

type ConfettiOptions = {
  /** Burst origin as a fraction of the viewport (0–1). Defaults to the centre. */
  x?: number;
  y?: number;
  /** Number of pieces. */
  count?: number;
  /** Upward launch spread; bigger means a wider burst. */
  spread?: number;
};

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  color: string;
  shape: "rect" | "circle";
};

const COLORS = ["#2563eb", "#4b8bff", "#16a34a", "#f59e0b", "#ec4899", "#a855f7"];
const DURATION_MS = 1600;
const GRAVITY = 0.32;
const DRAG = 0.985;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function launchConfetti(options: ConfettiOptions = {}) {
  if (typeof window === "undefined" || prefersReducedMotion()) return;

  const { x = 0.5, y = 0.45, count = 110, spread = 1 } = options;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "200",
  });
  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");
  if (!context) {
    canvas.remove();
    return;
  }

  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.scale(ratio, ratio);

  const originX = width * x;
  const originY = height * y;
  const pieces: Piece[] = Array.from({ length: count }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9 * spread;
    const speed = 7 + Math.random() * 9;
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 5 + Math.random() * 6,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() > 0.3 ? "rect" : "circle",
    };
  });

  const startedAt = performance.now();

  function frame(now: number) {
    const elapsed = now - startedAt;
    const fade = Math.max(0, 1 - Math.max(0, elapsed - DURATION_MS * 0.6) / (DURATION_MS * 0.4));

    context!.clearRect(0, 0, width, height);
    context!.globalAlpha = fade;

    for (const piece of pieces) {
      piece.vx *= DRAG;
      piece.vy = piece.vy * DRAG + GRAVITY;
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.rotation += piece.spin;

      context!.save();
      context!.translate(piece.x, piece.y);
      context!.rotate(piece.rotation);
      context!.fillStyle = piece.color;
      if (piece.shape === "rect") {
        context!.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
      } else {
        context!.beginPath();
        context!.arc(0, 0, piece.size / 3, 0, Math.PI * 2);
        context!.fill();
      }
      context!.restore();
    }

    if (elapsed < DURATION_MS) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(frame);
}
