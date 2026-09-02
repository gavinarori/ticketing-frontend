// components/ui/pattern-background.tsx
"use client";

/**
 * Full-bleed tiled geometric line pattern (zigzags, step motifs, waves,
 * rings) as a single repeating SVG <pattern> so it scales to any container
 * without a raster asset. "cream" for light auth/marketing surfaces,
 * "night" for dark stadium-branded surfaces.
 */
export function PatternBackground({
  tone = "cream",
  className = "",
}: {
  tone?: "cream" | "night";
  className?: string;
}) {
  const bg = tone === "cream" ? "#F7F4EE" : "#05070C";
  const line = tone === "cream" ? "#1A1A1A" : "#6CABDD";
  const opacity = tone === "cream" ? 0.09 : 0.14;

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={`motif-${tone}`} width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M4 20 L14 10 L24 20 L34 10" fill="none" stroke={line} strokeWidth="1.6" opacity={opacity} />
          <rect x="52" y="6" width="18" height="18" fill="none" stroke={line} strokeWidth="1.6" opacity={opacity} />
          <rect x="57" y="11" width="8" height="8" fill="none" stroke={line} strokeWidth="1.2" opacity={opacity} />
          <line x1="90" y1="4" x2="90" y2="26" stroke={line} strokeWidth="1.6" opacity={opacity} />
          <line x1="95" y1="4" x2="95" y2="26" stroke={line} strokeWidth="1.6" opacity={opacity} />
          <line x1="100" y1="4" x2="100" y2="26" stroke={line} strokeWidth="1.6" opacity={opacity} />
          <path d="M2 55 Q10 48 18 55 T34 55" fill="none" stroke={line} strokeWidth="1.6" opacity={opacity} />
          <path d="M52 48 L60 55 L52 62" fill="none" stroke={line} strokeWidth="1.6" opacity={opacity} />
          <path d="M66 48 L58 55 L66 62" fill="none" stroke={line} strokeWidth="1.6" opacity={opacity} />
          <circle cx="95" cy="55" r="9" fill="none" stroke={line} strokeWidth="1.6" opacity={opacity} />
          <circle cx="95" cy="55" r="2" fill={line} opacity={opacity} />
          <line x1="4" y1="90" x2="30" y2="90" stroke={line} strokeWidth="1.6" opacity={opacity} strokeDasharray="4 3" />
          <rect x="55" y="82" width="12" height="12" fill="none" stroke={line} strokeWidth="1.6" opacity={opacity} transform="rotate(45 61 88)" />
          <path d="M92 82 L86 90 L92 98" fill="none" stroke={line} strokeWidth="1.6" opacity={opacity} />
          <path d="M104 82 L110 90 L104 98" fill="none" stroke={line} strokeWidth="1.6" opacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={bg} />
      <rect width="100%" height="100%" fill={`url(#motif-${tone})`} />
    </svg>
  );
}