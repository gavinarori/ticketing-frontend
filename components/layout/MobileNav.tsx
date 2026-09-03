// components/layout/MobileNav.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { XIcon } from "lucide-react";
import { NAV_LINKS } from "./nav-links";
import { ROUTES } from "@/lib/utils/constants";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  // Close automatically on route change, and lock body scroll while open.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-[var(--color-night)]/50 backdrop-blur-sm"
      />

      <div className="absolute inset-x-3 top-3 rounded-3xl border border-[var(--color-ink)]/10 bg-[var(--color-paper)] p-5 shadow-[0_20px_60px_-15px_rgba(13,19,28,0.35)]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-sky-deep)]">
            Menu
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-9 items-center justify-center rounded-full text-[var(--color-ink)]"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-3 text-base font-medium text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-4 flex flex-col gap-2 border-t border-[var(--color-ink)]/10 pt-4">
          <Link
            href={ROUTES.login}
            className="rounded-full border border-[var(--color-ink)]/15 px-4 py-2.5 text-center text-sm font-medium text-[var(--color-ink)]"
          >
            Sign in
          </Link>
          <Link
            href={ROUTES.register}
            className="rounded-full bg-[var(--color-ink)] px-4 py-2.5 text-center text-sm font-medium text-white"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}