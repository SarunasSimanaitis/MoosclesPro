import {
  X,
} from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
} from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  closeOnOverlayClick?: boolean;
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  closeOnOverlayClick = true,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  const dialogRef =
    useRef<HTMLDivElement>(null);

  const previousActiveElement =
    useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    previousActiveElement.current =
      document.activeElement instanceof
      HTMLElement
        ? document.activeElement
        : null;

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const animationFrame =
      window.requestAnimationFrame(() => {
        dialogRef.current?.focus();
      });

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog =
        dialogRef.current;

      if (!dialog) {
        return;
      }

      const focusableElements =
        dialog.querySelectorAll<HTMLElement>(
          [
            "button:not([disabled])",
            "a[href]",
            "input:not([disabled])",
            "textarea:not([disabled])",
            "select:not([disabled])",
            "[tabindex]:not([tabindex='-1'])",
          ].join(","),
        );

      if (
        focusableElements.length === 0
      ) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first =
        focusableElements[0];

      const last =
        focusableElements[
          focusableElements.length - 1
        ];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.cancelAnimationFrame(
        animationFrame,
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        originalOverflow;

      previousActiveElement.current?.focus();
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-end
        justify-center
        bg-black/55
        p-3
        backdrop-blur-sm
        sm:items-center
        sm:p-5
      "
      onMouseDown={(event) => {
        if (
          closeOnOverlayClick &&
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={
          description
            ? descriptionId
            : undefined
        }
        tabIndex={-1}
        className={`
          flex
          max-h-[calc(100dvh-1.5rem)]
          w-full
          ${sizeClasses[size]}
          flex-col
          overflow-hidden
          rounded-[var(--radius-xl)]
          border
          border-[var(--border)]
          bg-[var(--surface)]
          shadow-[var(--shadow-lg)]
          outline-none
          sm:max-h-[calc(100dvh-2.5rem)]
        `}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-5 md:px-7 md:py-6">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
              MoosclesPro
            </p>

            <h2
              id={titleId}
              className="mt-1.5 text-xl font-black tracking-tight text-[var(--text)] md:text-2xl"
            >
              {title}
            </h2>

            {description && (
              <p
                id={descriptionId}
                className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]"
              >
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-[var(--radius-md)]
              text-[var(--text-muted)]
              transition-colors
              hover:bg-[var(--surface-soft)]
              hover:text-[var(--text)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--primary)]
            "
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-7 md:py-6">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}