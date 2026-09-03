// components/seatmap/Fallback2DMap.tsx
"use client";

import { useMemo, useState } from "react";
import { useSeatSelectionStore } from "@/stores/seat-selection";
import { useSeatSelection } from "@/hooks/useSeatSelection";
import { formatMoney } from "@/lib/utils";
import type { Seat, VenueLayout } from "@/types/seatmap";

type Props = {
  layout: VenueLayout;
  eventId: string;
  onBackTo3D?: () => void;
};

export function Fallback2DMap({ layout, eventId, onBackTo3D }: Props) {
  const selectedSeatIds = useSeatSelectionStore((s) => s.selectedSeatIds);
  const toggleSeat = useSeatSelectionStore((s) => s.toggleSeat);
  const openDetail = useSeatSelectionStore((s) => s.openDetail);
  const { total, selectedCount, holdAndContinue, isHolding } = useSeatSelection(layout, eventId);

  const [activeStand, setActiveStand] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  const categoryColor = useMemo(() => {
    const m = new Map<string, string>();
    layout.categories.forEach((c) => m.set(c.id, c.color));
    return m;
  }, [layout.categories]);

  const filtered = useMemo(() => {
    return layout.seats.filter((seat) => {
      const standId = standFromSection(seat.section, layout);
      if (activeStand !== "all" && standId !== activeStand) return false;
      if (activeCategory !== "all" && seat.categoryId !== activeCategory) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!seat.id.toLowerCase().includes(q) && !seat.section.toLowerCase().includes(q) && !seat.row.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [layout, activeStand, activeCategory, query]);

  const bySection = useMemo(() => groupBySection(filtered), [filtered]);

  return (
    <div className="flex h-full w-full flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-ink)]/10 bg-white px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]/50">2D seat map</p>
          <h2 className="text-lg font-bold tracking-tight">{layout.venue.name}</h2>
        </div>
        {onBackTo3D && (
          <button
            type="button"
            onClick={onBackTo3D}
            className="rounded-full border border-[var(--color-sky)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-sky-deep)] transition hover:bg-[var(--color-sky)]/10"
          >
            Back to 3D
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-ink)]/10 bg-white px-4 py-2.5">
        <input
          type="search"
          placeholder="Search section / row / seat\u2026"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-[180px] flex-1 rounded-lg border border-[var(--color-ink)]/12 bg-[var(--color-paper)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-sky)]"
        />
        <select
          value={activeStand}
          onChange={(e) => setActiveStand(e.target.value)}
          className="rounded-lg border border-[var(--color-ink)]/12 bg-white px-3 py-1.5 text-sm"
        >
          <option value="all">All stands</option>
          {layout.venue.stands.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="rounded-lg border border-[var(--color-ink)]/12 bg-white px-3 py-1.5 text-sm"
        >
          <option value="all">All categories</option>
          {layout.categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-3 border-b border-[var(--color-ink)]/10 bg-[var(--color-paper)] px-4 py-2 text-[11px]">
        {layout.categories.map((c) => (
          <span key={c.id} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: c.color }} />
            {c.label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-[var(--color-gold)]" />
          Selected
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-[var(--color-ink)]/40" />
          Sold / held
        </span>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="relative overflow-hidden rounded-xl border-2 border-white bg-gradient-to-b from-[var(--color-pitch)] to-[#0F5C2E] py-10 text-center shadow-inner">
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/40" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50" />
            <p className="relative font-mono text-[10px] uppercase tracking-[0.35em] text-white/90">Pitch</p>
          </div>

          {bySection.size === 0 && (
            <p className="rounded-xl border border-dashed border-[var(--color-ink)]/15 bg-white py-12 text-center text-sm text-[var(--color-ink)]/50">
              No seats match your filters.
            </p>
          )}

          {Array.from(bySection.entries()).map(([section, seats]) => {
            const byRow = groupByRow(seats);
            const sample = seats[0];
            const color = categoryColor.get(sample?.categoryId ?? "") ?? "#6CABDD";

            return (
              <div key={section} className="overflow-hidden rounded-xl border border-[var(--color-ink)]/10 bg-white shadow-sm">
                <div className="flex items-center justify-between px-3 py-2" style={{ borderLeft: `4px solid ${color}` }}>
                  <div>
                    <p className="text-sm font-semibold">{section}</p>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink)]/50">
                      {seats.length} seats &middot; {availableCount(seats)} available
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5 px-3 pb-3">
                  {Array.from(byRow.entries()).map(([row, rowSeats]) => (
                    <div key={row} className="flex items-center gap-2">
                      <span className="w-6 shrink-0 text-center font-mono text-[10px] font-bold text-[var(--color-ink)]/50">
                        {row}
                      </span>
                      <div className="flex flex-wrap gap-0.5">
                        {rowSeats
                          .slice()
                          .sort((a, b) => a.number - b.number)
                          .map((seat) => {
                            const selected = selectedSeatIds.has(seat.id);
                            const disabled = seat.status === "sold" || seat.status === "held" || seat.status === "unavailable";
                            const base = categoryColor.get(seat.categoryId) ?? "#6CABDD";
                            return (
                              <button
                                key={seat.id}
                                type="button"
                                disabled={disabled}
                                title={`${seat.id} \u00b7 ${seat.status}`}
                                onClick={() => {
                                  if (disabled) {
                                    openDetail(seat.id);
                                    return;
                                  }
                                  toggleSeat(seat);
                                  openDetail(seat.id);
                                }}
                                className={`h-6 min-w-[22px] rounded-[3px] px-0.5 font-mono text-[9px] font-medium transition ${
                                  selected
                                    ? "bg-[var(--color-gold)] text-[var(--color-night)] ring-2 ring-[var(--color-gold)]"
                                    : disabled
                                      ? "cursor-not-allowed bg-[var(--color-ink)]/30 text-white/70"
                                      : "text-white hover:scale-110 hover:brightness-110 active:scale-95"
                                }`}
                                style={selected || disabled ? undefined : { backgroundColor: base }}
                              >
                                {seat.number}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[var(--color-ink)]/10 bg-white px-4 py-3">
        <div>
          <p className="text-xs text-[var(--color-ink)]/50">
            {selectedCount === 0 ? "Tap seats to select" : `${selectedCount} seat${selectedCount === 1 ? "" : "s"} selected`}
          </p>
          {selectedCount > 0 && <p className="text-sm font-bold">{formatMoney(total, "GBP")}</p>}
        </div>
        <button
          type="button"
          disabled={selectedCount === 0 || isHolding}
          onClick={holdAndContinue}
          className="rounded-full bg-[var(--color-sky)] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isHolding ? "Holding\u2026" : "Hold & continue"}
        </button>
      </div>
    </div>
  );
}

function groupBySection(seats: Seat[]) {
  const map = new Map<string, Seat[]>();
  for (const seat of seats) {
    const arr = map.get(seat.section) ?? [];
    arr.push(seat);
    map.set(seat.section, arr);
  }
  return map;
}

function groupByRow(seats: Seat[]) {
  const map = new Map<string, Seat[]>();
  for (const seat of seats) {
    const arr = map.get(seat.row) ?? [];
    arr.push(seat);
    map.set(seat.row, arr);
  }
  return new Map([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

function availableCount(seats: Seat[]) {
  return seats.filter((s) => s.status === "available").length;
}

function standFromSection(section: string, layout: VenueLayout): string {
  const first = section.split("-")[0]?.toLowerCase() ?? "";
  for (const stand of layout.venue.stands) {
    if (stand.name.toLowerCase().startsWith(first) || stand.id.startsWith(first)) return stand.id;
  }
  if (first.includes("pep") || first.includes("north")) return "north";
  if (first.includes("south")) return "south";
  if (first.includes("east")) return "east";
  if (first.includes("colin") || first.includes("west")) return "west";
  return "all";
}