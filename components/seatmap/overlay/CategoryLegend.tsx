// components/seatmap/overlay/CategoryLegend.tsx
"use client";

import { formatMoney } from "@/lib/utils";
import type { SeatCategory } from "@/types/seatmap";

export function CategoryLegend({ categories }: { categories: SeatCategory[] }) {
  return (
    <div className="pointer-events-auto rounded-xl border border-white/10 bg-[var(--color-night)]/80 p-3 backdrop-blur-md">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Categories</p>
      <div className="flex flex-col gap-1.5">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-2 text-white">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: c.color }} aria-hidden />
              {c.label}
            </span>
            <span className="font-mono text-white/50">{formatMoney(c.price, c.currency)}</span>
          </div>
        ))}
        <div className="mt-1 flex items-center gap-2 border-t border-white/10 pt-1.5 text-xs text-white/50">
          <span className="h-2.5 w-2.5 rounded-sm bg-[var(--color-gold)]" aria-hidden />
          Selected
          <span className="ml-2 h-2.5 w-2.5 rounded-sm bg-white/20" aria-hidden />
          Sold
        </div>
      </div>
    </div>
  );
}