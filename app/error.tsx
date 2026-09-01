"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-[var(--color-paper)] px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-flag)]">
        Something broke
      </p>
      <h1 className="text-2xl font-semibold text-[var(--color-ink)]">
        This page didn&apos;t load
      </h1>
      <p className="max-w-sm text-sm text-[var(--color-ink)]/60">
        {error.digest ? `Reference: ${error.digest}` : "Try again, or head back and pick a different fixture."}
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-full bg-[var(--color-ink)] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white"
      >
        Try again
      </button>
    </div>
  );
}
