export default function PageLoader() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[40vh] items-center justify-center">
      <span aria-hidden="true" className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--text)]" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
