// components/waiting-room/QueuePosition.tsx
"use client";

export function QueuePosition({
  position,
  startPosition,
  estimatedWaitSeconds,
}: {
  position: number;
  startPosition: number;
  estimatedWaitSeconds: number;
}) {
  const progress = startPosition > 0 ? 1 - position / startPosition : 0;
  const minutes = Math.ceil(estimatedWaitSeconds / 60);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[var(--color-sky)]">
        You&apos;re in the queue
      </p>

      <div className="flex flex-col items-center">
        <span className="font-mono text-7xl font-bold tabular-nums text-white">{position}</span>
        <span className="mt-1 text-sm text-white/50">fans ahead of you</span>
      </div>

      <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[var(--color-sky)] transition-[width] duration-1000 ease-linear"
          style={{ width: `${Math.min(100, Math.max(4, progress * 100))}%` }}
        />
      </div>

      <p className="text-sm text-white/60">
        Estimated wait: {minutes <= 1 ? "under a minute" : `about ${minutes} minutes`}
      </p>

      <p className="max-w-xs text-xs text-white/35">
        Keep this tab open — you&apos;ll move through automatically and land straight in the seat map.
      </p>
    </div>
  );
}