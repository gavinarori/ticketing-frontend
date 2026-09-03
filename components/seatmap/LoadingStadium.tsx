// components/seatmap/LoadingStadium.tsx
"use client";

export function LoadingStadium() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#C5D4E8]">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 animate-ping rounded-full bg-[var(--color-sky)]/30" />
        <div className="absolute inset-2 rounded-full border-2 border-[var(--color-sky)] border-t-transparent animate-spin" />
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-ink)]/50">
        Lighting the pitch
      </p>
    </div>
  );
}