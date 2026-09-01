import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-[var(--color-paper)] px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-sky-deep)]">
        404
      </p>
      <h1 className="text-2xl font-semibold text-[var(--color-ink)]">
        Nothing at this address
      </h1>
      <p className="max-w-sm text-sm text-[var(--color-ink)]/60">
        Search for a fixture instead —every match has its own page once it&apos;s on sale.
      </p>
      <Link
        href="/search"
        className="mt-2 rounded-full bg-[var(--color-sky)] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-night)]"
      >
        Find a fixture
      </Link>
    </div>
  );
}
