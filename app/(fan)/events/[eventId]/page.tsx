// app/(fan)/events/[eventId]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchEventById } from "@/lib/api/events";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import { formatFixtureDate, formatMoney } from "@/lib/utils";
import { ROUTES } from "@/lib/utils/constants";

type PageProps = {
  params: Promise<{ eventId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = await fetchEventById(eventId);
  if (!event) return { title: "Fixture not found" };
  return { title: `${event.homeTeam} vs ${event.awayTeam}` };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { eventId } = await params;
  const event = await fetchEventById(eventId);
  if (!event) notFound();

  const { day, date, time } = formatFixtureDate(event.kickoffAt);
  const bookable = event.status === "on_sale";

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12">
      <Link href={ROUTES.events} className="text-xs text-[var(--color-ink)]/50 hover:text-[var(--color-ink)]">
        &larr; All fixtures
      </Link>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-sky-deep)]">
          {event.competition}
        </p>
        <EventStatusBadge status={event.status} />
      </div>

      <h1 className="mt-2 text-4xl font-bold tracking-tight text-[var(--color-ink)]">
        {event.homeTeam} <span className="text-[var(--color-ink)]/35">vs</span> {event.awayTeam}
      </h1>

      <p className="mt-2 text-sm text-[var(--color-ink)]/60">
        {day} {date} &middot; {time} kick-off &middot; {event.venue.name}, {event.venue.city}
        {event.broadcaster ? ` \u00b7 Live on ${event.broadcaster}` : ""}
      </p>

      <p className="mt-6 text-sm leading-relaxed text-[var(--color-ink)]/70">{event.description}</p>

      <div className="mt-8 flex items-center justify-between rounded-[var(--radius-card)] border border-[var(--color-ink)]/10 bg-white p-5">
        <div>
          <p className="text-xs text-[var(--color-ink)]/50">Tickets from</p>
          <p className="text-2xl font-bold text-[var(--color-ink)]">
            {formatMoney(event.priceFrom, event.currency)}
          </p>
        </div>

        {bookable ? (
          event.hasSeatMap ? (
            <Link
              href={ROUTES.seatmap(event.id)}
              className="rounded-[var(--radius-pill)] bg-[var(--color-sky)] px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-[var(--color-night)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              View seats
            </Link>
          ) : (
            <span className="rounded-[var(--radius-pill)] bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white">
              Book tickets
            </span>
          )
        ) : (
          <span className="rounded-[var(--radius-pill)] border border-[var(--color-ink)]/15 px-5 py-2.5 text-sm font-medium text-[var(--color-ink)]/40">
            Not on sale
          </span>
        )}
      </div>
    </div>
  );
}