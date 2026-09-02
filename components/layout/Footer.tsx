// components/layout/Footer.tsx
import Link from "next/link";

const LEGAL_LINKS = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Refunds", href: "/refunds" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-ink)]/8">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink)]/40">
          Etihad Stadium &middot; Manchester
        </p>

        <nav className="flex gap-5">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-[var(--color-ink)]/50 hover:text-[var(--color-ink)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-[var(--color-ink)]/35">
          &copy; {new Date().getFullYear()} Etihad Tickets. Not affiliated with Manchester City FC.
        </p>
      </div>
    </footer>
  );
}