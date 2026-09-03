// components/events/EventCard.tsx
import Link from "next/link";
import { EventStatusBadge } from "./EventStatusBadge";
import { formatFixtureDate, formatMoney } from "@/lib/utils";
import { ROUTES } from "@/lib/utils/constants";
import type { EventSummary } from "@/types/event";

export function EventCard({ event }: { event: EventSummary }) {
  const { day, date, time } = formatFixtureDate(event.kickoffAt);
  const bookable = event.status === "on_sale";

  return (
    <Link
      href={ROUTES.event(event.id)}
      className="group flex items-center justify-between gap-4 rounded-[var(--radius-card)] border border-[var(--color-ink)]/10 bg-white p-4 transition-colors hover:border-[var(--color-sky)]/50"
    >
      <div className="flex items-center gap-4">
        <div className="flex w-14 shrink-0 flex-col items-center rounded-xl bg-[var(--color-ink)] py-2 text-white">
          <span className="font-mono text-[10px] uppercase tracking-wide text-white/60">{day}</span>
          <span className="text-lg font-bold leading-none">{date.split(" ")[0]}</span>
          <span className="font-mono text-[9px] text-white/60">{date.split(" ")[1]}</span>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-sky-deep)]">
            {event.competition}
          </p>
          <h3 className="text-base font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-sky-deep)]">
            {event.homeTeam} <span className="text-[var(--color-ink)]/35">vs</span> {event.awayTeam}
          </h3>
          <p className="text-xs text-[var(--color-ink)]/50">
            {time} kick-off &middot; {event.venue.name}, {event.venue.city}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <EventStatusBadge status={event.status} />
        {bookable && (
          <p className="text-xs text-[var(--color-ink)]/60">
            from <span className="font-semibold text-[var(--color-ink)]">{formatMoney(event.priceFrom, event.currency)}</span>
          </p>
        )}
      </div>
    </Link>
  );
}