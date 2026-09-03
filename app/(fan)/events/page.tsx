// app/(fan)/events/page.tsx
import type { Metadata } from "next";
import { fetchEvents } from "@/lib/api/events";
import { EventCard } from "@/components/events/EventCard";
import { EventFilters } from "@/components/events/EventFilters";
import type { EventListFilters } from "@/types/event";

export const metadata: Metadata = {
  title: "Fixtures",
};

type PageProps = {
  searchParams: Promise<{ competition?: string; query?: string; sort?: string }>;
};

export default async function EventsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters: EventListFilters = {
    competition: params.competition || undefined,
    query: params.query || undefined,
    sort: params.sort === "price_asc" ? "price_asc" : "date_asc",
  };

  const events = await fetchEvents(filters);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-sky-deep)]">
        Fixtures
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-[var(--color-ink)]">
        Find your matchday
      </h1>

      <div className="mt-6">
        <EventFilters />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {events.length === 0 ? (
          <EmptyState query={filters.query} />
        ) : (
          events.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </div>
    </div>
  );
}

function EmptyState({ query }: { query?: string }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-ink)]/15 bg-white/50 py-12 text-center">
      <p className="text-sm text-[var(--color-ink)]/60">
        {query ? `No fixtures match "${query}".` : "No fixtures on sale right now."}
      </p>
    </div>
  );
}