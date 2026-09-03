// components/checkout/OrderSummary.tsx
"use client";

import { HoldTimer } from "@/components/seatmap/overlay/HoldTimer";
import { formatMoney } from "@/lib/utils";
import type { OrderItem } from "@/types/order";

const FEE_RATE = 0.05;

export function OrderSummary({
  eventTitle,
  venueName,
  items,
}: {
  eventTitle: string;
  venueName: string;
  items: OrderItem[];
}) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const fees = Math.round(subtotal * FEE_RATE);
  const total = subtotal + fees;

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-ink)]/10 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-sky-deep)]">
            {venueName}
          </p>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">{eventTitle}</h2>
        </div>
        <HoldTimer />
      </div>

      <div className="mt-4 flex flex-col divide-y divide-[var(--color-ink)]/8">
        {items.map((item) => (
          <div key={item.seatId} className="flex items-center justify-between py-2.5 text-sm">
            <div>
              <p className="font-medium text-[var(--color-ink)]">
                {item.section} &middot; Row {item.row}, Seat {item.number}
              </p>
              <p className="text-xs text-[var(--color-ink)]/50">{item.categoryLabel}</p>
            </div>
            <span className="font-mono text-[var(--color-ink)]">{formatMoney(item.price)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-1.5 border-t border-[var(--color-ink)]/10 pt-4 text-sm">
        <div className="flex justify-between text-[var(--color-ink)]/60">
          <span>Subtotal</span>
          <span className="font-mono">{formatMoney(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[var(--color-ink)]/60">
          <span>Service fee</span>
          <span className="font-mono">{formatMoney(fees)}</span>
        </div>
        <div className="mt-1 flex justify-between text-base font-semibold text-[var(--color-ink)]">
          <span>Total</span>
          <span className="font-mono">{formatMoney(total)}</span>
        </div>
      </div>
    </div>
  );
}