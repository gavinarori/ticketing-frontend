// components/layout/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GalleryVerticalEndIcon, MenuIcon } from "lucide-react";
import { MobileNav } from "./MobileNav";
import { NAV_LINKS } from "./nav-links";
import { ROUTES } from "@/lib/utils/constants";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push(ROUTES.home as never);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-ink)]/8 bg-[var(--color-paper)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href={ROUTES.home} className="flex items-center gap-2 font-semibold text-[var(--color-ink)]">
          <span className="flex size-7 items-center justify-center rounded-md bg-[var(--color-ink)] text-white">
            <GalleryVerticalEndIcon className="size-4" />
          </span>
          Etihad Tickets
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--color-ink)] text-white"
                    : "text-[var(--color-ink)]/65 hover:text-[var(--color-ink)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            {isLoading ? null : user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--color-ink)]/70">{user.firstName}</span>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-[var(--color-ink)]/15 px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-flag)]/50"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href={ROUTES.login}
                className="rounded-full border border-[var(--color-ink)]/15 px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-sky)]/60"
              >
                Sign in
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex size-9 items-center justify-center rounded-full text-[var(--color-ink)] md:hidden"
          >
            <MenuIcon className="size-5" />
          </button>
        </div>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}