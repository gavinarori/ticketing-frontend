// components/auth/auth-shell.tsx
import Link from "next/link";
import { GalleryVerticalEndIcon } from "lucide-react";
import { PatternBackground } from "@/components/ui/pattern-background";
import { ROUTES } from "@/lib/utils/constants";

type AuthShellProps = {
  kicker: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ kicker, title, subtitle, children }: AuthShellProps) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-[var(--color-paper)]">
      <PatternBackground tone="cream" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(247,244,238,0.35)_0%,rgba(247,244,238,0.92)_60%,#F7F4EE_100%)]" />

      <div className="relative flex min-h-svh flex-col items-center px-6 py-10">
        <Link href={ROUTES.home} className="flex items-center gap-2 self-start font-medium text-[var(--color-ink)] md:self-center">
          <span className="flex size-7 items-center justify-center rounded-md bg-[var(--color-ink)] text-white">
            <GalleryVerticalEndIcon className="size-4" />
          </span>
          Etihad Tickets
        </Link>

        <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[var(--color-sky)]">
              {kicker}
            </p>
            <h1 className="max-w-2xl text-5xl font-black uppercase leading-[0.95] tracking-tight text-[var(--color-ink)] md:text-6xl">
              {title}
            </h1>
            <p className="max-w-md text-sm text-[var(--color-ink)]/60">{subtitle}</p>
          </div>

          <div className="w-full max-w-sm rounded-3xl border border-[var(--color-ink)]/10 bg-white/60 p-8 text-left shadow-[0_20px_60px_-15px_rgba(13,19,28,0.25)] backdrop-blur-xl">
            {children}
          </div>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-ink)]/30">
          Etihad Stadium &middot; Manchester
        </p>
      </div>
    </div>
  );
}