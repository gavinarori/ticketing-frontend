// components/seatmap/overlay/OnboardingGuide.tsx
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "seatmap:onboarding-seen";

const STEPS = [
  { title: "Click any available seat", body: "Blue and gold seats are available. Click one to preview the view from exactly there." },
  { title: "Scroll to zoom in", body: "Once you're looking at a seat, scroll or pinch to move in closer — right down to eye level." },
  { title: "\u201CView from this seat\u201D for the full experience", body: "The seat card's button drops you into the exact first-person sightline a fan in that seat would get." },
  { title: "Pick a few, then hold & continue", body: "Select up to 8 seats. Your picks stay reserved for a short hold while you check out." },
];

export function OnboardingGuide() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      // localStorage unavailable — skip auto-open
    }
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* noop */
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => {
          setStep(0);
          setOpen(true);
        }}
        aria-label="How booking works"
        className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[var(--color-night)]/80 font-mono text-xs text-white/60 backdrop-blur-md transition-colors hover:text-white"
      >
        ?
      </button>
    );
  }

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step]!;

  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-[var(--color-night)]/60 backdrop-blur-sm">
      <div className="w-80 rounded-2xl border border-white/10 bg-[var(--color-night)]/95 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        <div className="mb-3 flex gap-1.5">
          {STEPS.map((_, i) => (
            <span key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-[var(--color-sky)]" : "bg-white/10"}`} />
          ))}
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-sky)]">
          Step {step + 1} of {STEPS.length}
        </p>
        <h3 className="mt-1 font-sans text-lg font-semibold text-white">{current.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60">{current.body}</p>

        <div className="mt-5 flex items-center justify-between">
          <button onClick={dismiss} className="text-xs text-white/50 transition-colors hover:text-white">
            Skip
          </button>
          <button
            onClick={() => (isLast ? dismiss() : setStep((s) => s + 1))}
            className="rounded-full bg-[var(--color-sky)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-night)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLast ? "Got it" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}