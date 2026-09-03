// components/events/EventFilters.tsx
"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const COMPETITIONS = ["Premier League", "Champions League"];

/**
 * Filters live in the URL (?competition=&query=&sort=) rather than local
 * component state — makes a filtered view shareable/bookmarkable and keeps
 * app/(fan)/events/page.tsx (a server component) as the single source of
 * truth for what gets fetched, instead of duplicating filter state on
 * both the client and server.
 */
export function EventFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}` as never);
    });
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-2 transition-opacity ${isPending ? "opacity-60" : ""}`}
    >
      <input
        defaultValue={searchParams.get("query") ?? ""}
        onChange={(e) => updateParam("query", e.target.value)}
        placeholder="Search a team or venue"
        className="min-w-[220px] flex-1 rounded-full border border-[var(--color-ink)]/12 bg-white px-4 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/40 focus:border-[var(--color-sky)] focus:outline-none"
      />

      <select
        value={searchParams.get("competition") ?? ""}
        onChange={(e) => updateParam("competition", e.target.value)}
        className="rounded-full border border-[var(--color-ink)]/12 bg-white px-4 py-2.5 text-sm text-[var(--color-ink)] focus:border-[var(--color-sky)] focus:outline-none"
      >
        <option value="">All competitions</option>
        {COMPETITIONS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("sort") ?? "date_asc"}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="rounded-full border border-[var(--color-ink)]/12 bg-white px-4 py-2.5 text-sm text-[var(--color-ink)] focus:border-[var(--color-sky)] focus:outline-none"
      >
        <option value="date_asc">Soonest first</option>
        <option value="price_asc">Cheapest first</option>
      </select>
    </div>
  );
}