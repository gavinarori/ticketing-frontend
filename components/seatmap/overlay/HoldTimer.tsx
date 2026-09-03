// components/seatmap/overlay/HoldTimer.tsx
"use client";

import { useHoldTimer } from "@/hooks/useHoldTimer";

export function HoldTimer() {
  const { secondsLeft, isActive, percentRemaining } = useHoldTimer();
  if (!isActive) return null;

  const urgent = secondsLeft <= 60;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="pointer-events-none flex items-center gap-2 rounded-full border border-white/10 bg-[var(--color-night)]/85 px-3 py-1.5 backdrop-blur-md">
      <svg width="18" height="18" viewBox="0 0 36 36" className="shrink-0">
        <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-sky-deep)" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke={urgent ? "var(--color-flag)" : "var(--color-sky)"}
          strokeWidth="3"
          strokeDasharray={2 * Math.PI * 15.5}
          strokeDashoffset={2 * Math.PI * 15.5 * (1 - percentRemaining)}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <span className={`font-mono text-xs tabular-nums ${urgent ? "text-[var(--color-flag)]" : "text-white"}`}>
        {minutes}:{seconds.toString().padStart(2, "0")} held
      </span>
    </div>
  );
}