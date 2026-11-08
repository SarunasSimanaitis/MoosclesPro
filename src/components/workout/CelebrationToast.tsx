import { Trophy } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type CelebrationToastProps = {
  title: string;
  detail: string;
  onDone: () => void;
};

/** A short, upbeat banner at the top of the screen (e.g. a new personal record). */
export default function CelebrationToast({ title, detail, onDone }: CelebrationToastProps) {
  useEffect(() => {
    const timeout = window.setTimeout(onDone, 3500);
    return () => window.clearTimeout(timeout);
  }, [onDone]);

  // Portalled to <body> so no page container can clip it or stack it under the top bar.
  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+0.75rem)] z-[150] flex justify-center px-4">
      <div
        role="status"
        className="celebration-toast pointer-events-auto flex max-w-sm items-center gap-3 rounded-full bg-[var(--text)] py-2 pl-2 pr-5 text-[var(--background)] shadow-[var(--shadow-xl)]"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--warning)] text-white">
          <Trophy size={18} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold">{title}</span>
          <span className="block truncate text-xs opacity-80">{detail}</span>
        </span>
      </div>
    </div>,
    document.body,
  );
}
