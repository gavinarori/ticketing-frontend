// components/waiting-room/AdmissionStatus.tsx
"use client";

export function AdmissionStatus() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-[var(--color-pitch)]/15 text-[var(--color-pitch)]">
        <CheckIcon />
      </span>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[var(--color-pitch)]">
          You&apos;re in
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Taking you to your seats{"\u2026"}</h2>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}