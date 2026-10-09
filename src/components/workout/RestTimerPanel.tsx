import {
  ArrowDownRight,
  Bell,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { createPortal } from "react-dom";

import Card from "../ui/Card";

type RestTimerPanelProps = {
  restTime: number;
  restDuration: number;
  onAdd: () => void;
  onRemove: () => void;
  onStop: () => void;
};

type Position = {
  left: number;
  top: number;
};

type DragState = Position & {
  pointerId: number;
  startX: number;
  startY: number;
};

export default function RestTimerPanel({
  restTime,
  restDuration,
  onAdd,
  onRemove,
  onStop,
}: RestTimerPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const percentage =
    restDuration > 0
      ? Math.min(100, Math.max(0, (restTime / restDuration) * 100))
      : 0;

  useEffect(() => {
    const keepPanelVisible = () => {
      window.requestAnimationFrame(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const bounds = panel.getBoundingClientRect();

        setPosition((current) => current
          ? clampPanelPosition(current, bounds.width, bounds.height)
          : current);
      });
    };

    window.addEventListener("resize", keepPanelVisible);
    window.visualViewport?.addEventListener("resize", keepPanelVisible);
    return () => {
      window.removeEventListener("resize", keepPanelVisible);
      window.visualViewport?.removeEventListener("resize", keepPanelVisible);
    };
  }, []);

  function handleDragStart(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;

    const panel = panelRef.current;
    if (!panel) return;

    const bounds = panel.getBoundingClientRect();
    const startPosition = {
      left: bounds.left,
      top: bounds.top,
    };

    dragRef.current = {
      ...startPosition,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
    setPosition(startPosition);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleDragMove(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    const panel = panelRef.current;
    if (!drag || !panel || drag.pointerId !== event.pointerId) return;

    const bounds = panel.getBoundingClientRect();
    setPosition(clampPanelPosition({
      left: drag.left + event.clientX - drag.startX,
      top: drag.top + event.clientY - drag.startY,
    }, bounds.width, bounds.height));
  }

  function handleDragEnd(event: PointerEvent<HTMLButtonElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleDragKeys(event: KeyboardEvent<HTMLButtonElement>) {
    const direction = {
      ArrowDown: [0, 16],
      ArrowLeft: [-16, 0],
      ArrowRight: [16, 0],
      ArrowUp: [0, -16],
    }[event.key];

    if (!direction) return;
    event.preventDefault();

    const panel = panelRef.current;
    if (!panel) return;

    const bounds = panel.getBoundingClientRect();
    const current = position ?? {
      left: bounds.left,
      top: bounds.top,
    };

    setPosition(clampPanelPosition({
      left: current.left + direction[0],
      top: current.top + direction[1],
    }, bounds.width, bounds.height));
  }

  function toggleCollapsed(collapsed: boolean) {
    setIsCollapsed(collapsed);
    window.requestAnimationFrame(() => {
      const bounds = panelRef.current?.getBoundingClientRect();
      if (!bounds) return;
      setPosition((current) => current
        ? clampPanelPosition(current, bounds.width, bounds.height)
        : current);
    });
  }

  const floatingStyle = position
    ? {
        bottom: "auto",
        left: `${position.left}px`,
        right: "auto",
        top: `${position.top}px`,
        transform: "none",
      }
    : undefined;

  return createPortal(
    <div
      ref={panelRef}
      className={`fixed left-1/2 z-[60] w-[min(23rem,calc(100vw-1.5rem))] -translate-x-1/2 sm:bottom-5 sm:left-auto sm:right-5 sm:translate-x-0 ${position ? "" : "bottom-[calc(env(safe-area-inset-bottom)+1rem)]"}`}
      style={floatingStyle}
    >
      {isCollapsed ? (
        <Card className="overflow-hidden border-[var(--border-strong)] bg-[var(--surface)] shadow-[var(--shadow-lg)] backdrop-blur-2xl">
          <div className="flex min-h-14 items-center gap-2 px-2.5">
            <button
              type="button"
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
              onKeyDown={handleDragKeys}
              className="flex h-10 w-8 shrink-0 touch-none cursor-grab items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text)] active:cursor-grabbing"
              aria-label="Move rest timer. Use arrow keys to reposition."
              title="Drag to move"
            >
              <GripVertical size={17} aria-hidden="true" />
            </button>

            <Bell size={16} className="shrink-0 text-[var(--primary)]" aria-hidden="true" />
            <span className="min-w-0 flex-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Rest
            </span>
            <span className="font-mono text-lg font-black tabular-nums text-[var(--text)]" aria-live="polite">
              {formatRestTime(restTime)}
            </span>
            <button
              type="button"
              onClick={() => setPosition(null)}
              className="flex h-9 shrink-0 items-center justify-center gap-1 rounded-xl px-2 text-[10px] font-bold text-[var(--text-muted)] transition-[background-color,color] hover:bg-[var(--surface-soft)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              aria-label="Return rest timer to its dock"
              title="Return to dock"
            >
              <ArrowDownRight size={14} aria-hidden="true" />
              Dock
            </button>
            <button
              type="button"
              onClick={() => toggleCollapsed(false)}
              className="ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--text-muted)] transition-[background-color,color,transform] duration-200 hover:bg-[var(--surface-soft)] hover:text-[var(--text)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              aria-label="Expand rest timer controls"
            >
              <ChevronUp size={18} aria-hidden="true" />
            </button>
          </div>
        </Card>
      ) : (
        <Card
          role="region"
          aria-label="Rest timer"
          className="overflow-hidden border-[var(--border-strong)] bg-[var(--surface)] shadow-[var(--shadow-lg)] backdrop-blur-2xl"
        >
          <div className="flex items-center gap-2.5 px-3.5 pb-2 pt-3 sm:px-4 sm:pt-3.5">
            <button
              type="button"
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
              onKeyDown={handleDragKeys}
              className="flex h-10 w-8 shrink-0 touch-none cursor-grab items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text)] active:cursor-grabbing"
              aria-label="Move rest timer. Use arrow keys to reposition."
              title="Drag to move"
            >
              <GripVertical size={17} aria-hidden="true" />
            </button>

            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <Bell size={17} strokeWidth={2.1} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Rest timer
              </p>
            </div>
            <span className="font-mono text-2xl font-black tabular-nums tracking-tight text-[var(--text)]" aria-live="polite">
              {formatRestTime(restTime)}
            </span>
            <button
              type="button"
              onClick={() => setPosition(null)}
              className="flex h-9 shrink-0 items-center justify-center gap-1 rounded-xl px-2 text-[10px] font-bold text-[var(--text-muted)] transition-[background-color,color] hover:bg-[var(--surface-soft)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              aria-label="Return rest timer to its dock"
              title="Return to dock"
            >
              <ArrowDownRight size={14} aria-hidden="true" />
              Dock
            </button>
            <button
              type="button"
              onClick={() => toggleCollapsed(true)}
              className="ml-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--text-muted)] transition-[background-color,color,transform] duration-200 hover:bg-[var(--surface-soft)] hover:text-[var(--text)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              aria-label="Minimize rest timer"
            >
              <ChevronDown size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="px-4">
            <div
              className="h-1 overflow-hidden rounded-full bg-[var(--surface-soft)]"
              role="progressbar"
              aria-label="Rest time remaining"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(percentage)}
            >
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-[width] duration-1000 ease-linear"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_1fr_auto] gap-2.5 p-3.5 sm:px-4 sm:pb-4">
            <button
              type="button"
              onClick={onRemove}
              className="flex min-h-11 items-center justify-center gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm font-bold text-[var(--text)] transition-[background-color,border-color,transform] duration-200 hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              aria-label="Remove 15 seconds from rest timer"
            >
              <Minus size={15} aria-hidden="true" />
              15 sec
            </button>
            <button
              type="button"
              onClick={onAdd}
              className="flex min-h-11 items-center justify-center gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm font-bold text-[var(--text)] transition-[background-color,border-color,transform] duration-200 hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              aria-label="Add 15 seconds to rest timer"
            >
              <Plus size={15} aria-hidden="true" />
              15 sec
            </button>
            <button
              type="button"
              onClick={onStop}
              className="flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-[var(--primary)] px-3.5 text-sm font-bold text-[var(--primary-foreground)] shadow-sm transition-[background-color,box-shadow,transform] duration-200 hover:bg-[var(--primary-hover)] hover:shadow-md active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
              aria-label="Skip rest timer"
            >
              <RotateCcw size={14} aria-hidden="true" />
              Skip
            </button>
          </div>
        </Card>
      )}
    </div>,
    document.body,
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function clampPanelPosition(position: Position, width: number, height: number): Position {
  const viewport = window.visualViewport;
  const offsetLeft = viewport?.offsetLeft ?? 0;
  const offsetTop = viewport?.offsetTop ?? 0;
  const viewportWidth = viewport?.width ?? window.innerWidth;
  const viewportHeight = viewport?.height ?? window.innerHeight;

  return {
    left: clamp(position.left, offsetLeft + 8, offsetLeft + viewportWidth - width - 8),
    top: clamp(position.top, offsetTop + 8, offsetTop + viewportHeight - height - 16),
  };
}

function formatRestTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}
