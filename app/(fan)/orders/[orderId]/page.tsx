// app/(fan)/orders/[orderId]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchOrderById } from "@/lib/api/orders";
import { fetchEventById } from "@/lib/api/events";
import { formatMoney, formatFixtureDate } from "@/lib/utils";
import { ROUTES } from "@/lib/utils/constants";

export const metadata: Metadata = { title: "Order confirmed" };

type PageProps = { params: Promise<{ orderId: string }> };

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { orderId } = await params;
  const order = await fetchOrderById(orderId);
  if (!order) notFound();

  const event = await fetchEventById(order.eventId).catch(() => null);
  console.log("event", event);

  const kickoff = event?.kickoffAt ? formatFixtureDate(event.kickoffAt) : null;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-[var(--color-pitch)]/12 text-[var(--color-pitch)]">
        <CheckIcon />
      </span>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-sky-deep)]">
          Order confirmed
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-ink)]">
          {event ? `${event.homeTeam} vs ${event.awayTeam}` : "You're going"}
        </h1>
        {kickoff && event && (
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">
            {kickoff.day} {kickoff.date} · {kickoff.time} kick-off
            {event.venue?.name ? ` · ${event.venue.name}` : null}
          </p>
        )}
      </div>

      <div className="w-full rounded-[var(--radius-card)] border border-[var(--color-ink)]/10 bg-white p-5 text-left">
        {(order.items ?? []).map((item) => (
          <div
            key={item.seatId}
            className="flex items-center justify-between border-b border-[var(--color-ink)]/8 py-2 text-sm last:border-0"
          >
            <span className="text-[var(--color-ink)]">
              {item.section} · Row {item.row}, Seat {item.number}
            </span>
            <span className="font-mono text-[var(--color-ink)]/60">
              {formatMoney(item.price)}
            </span>
          </div>
        ))}
        <div className="mt-3 flex justify-between border-t border-[var(--color-ink)]/10 pt-3 text-base font-semibold text-[var(--color-ink)]">
          <span>Total paid</span>
          <span className="font-mono">
            {formatMoney(order.total, order.currency)}
          </span>
        </div>
      </div>

      <p className="text-xs text-[var(--color-ink)]/40">
        Order <span className="font-mono">{order.id}</span> · tickets are in{" "}
        <Link href="/orders" className="underline underline-offset-4">
          My tickets
        </Link>
      </p>

      <Link
        href={ROUTES.events}
        className="text-sm font-medium text-[var(--color-ink)] underline underline-offset-4"
      >
        Find another fixture
      </Link>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}