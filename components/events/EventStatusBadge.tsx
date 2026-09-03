// components/events/EventStatusBadge.tsx
import type { EventStatus } from "@/types/event";

const STATUS_CONFIG: Record<EventStatus, { label: string; className: string }> = {
  on_sale: { label: "On sale", className: "bg-[var(--color-pitch)]/12 text-[var(--color-pitch)]" },
  upcoming: { label: "On sale soon", className: "bg-[var(--color-sky)]/12 text-[var(--color-sky-deep)]" },
  sold_out: { label: "Sold out", className: "bg-[var(--color-ink)]/8 text-[var(--color-ink)]/50" },
  postponed: { label: "Postponed", className: "bg-[var(--color-flag)]/12 text-[var(--color-flag)]" },
  cancelled: { label: "Cancelled", className: "bg-[var(--color-flag)]/12 text-[var(--color-flag)]" },
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${config.className}`}
    >
      {config.label}
    </span>
  );
}