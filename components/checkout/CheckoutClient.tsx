// components/checkout/CheckoutClient.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSeatSelectionStore } from "@/stores/seat-selection";
import { OrderSummary } from "./OrderSummary";
import { StripePaymentForm } from "./StripePaymentForm";
import { ROUTES } from "@/lib/utils/constants";
import type { Order, OrderItem } from "@/types/order";
import type { EventDetail } from "@/types/event";
import type { VenueLayout } from "@/types/seatmap";

export function CheckoutClient({ event, layout }: { event: EventDetail; layout: VenueLayout }) {
  const router = useRouter();
  const selectedSeatIds = useSeatSelectionStore((s) => s.selectedSeatIds);
  const clearSelection = useSeatSelectionStore((s) => s.clearSelection);

  const items: OrderItem[] = layout.seats
    .filter((seat) => selectedSeatIds.has(seat.id))
    .map((seat) => {
      const category = layout.categories.find((c) => c.id === seat.categoryId);
      return {
        seatId: seat.id,
        section: seat.section,
        row: seat.row,
        number: seat.number,
        categoryLabel: category?.label ?? "General",
        price: category?.price ?? 0,
      };
    });

  const total = Math.round(items.reduce((sum, i) => sum + i.price, 0) * 1.05);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-24 text-center">
        <p className="text-sm text-[var(--color-ink)]/60">
          Your seat selection has expired or wasn&apos;t found. Head back and pick your seats again.
        </p>
        <Link
          href={ROUTES.seatmap(event.id)}
          className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Choose seats
        </Link>
      </div>
    );
  }

  function handleSuccess(order: Order) {
    clearSelection();
    router.push(`/orders/${order.id}` as never);
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6 px-6 py-12 md:grid-cols-2">
      <OrderSummary
        eventTitle={`${event.homeTeam} vs ${event.awayTeam}`}
        venueName={event.venue.name}
        items={items}
      />

      <div className="rounded-[var(--radius-card)] border border-[var(--color-ink)]/10 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">Payment</h2>
        <StripePaymentForm eventId={event.id} items={items} total={total} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}