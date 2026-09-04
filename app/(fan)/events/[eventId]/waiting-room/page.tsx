// app/(fan)/events/[eventId]/waiting-room/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PatternBackground } from "@/components/ui/pattern-background";
import { QueuePosition } from "@/components/waiting-room/QueuePosition";
import { AdmissionStatus } from "@/components/waiting-room/AdmissionStatus";
import { useWaitingRoom } from "@/hooks/useWaitingRoom";
import { ROUTES } from "@/lib/utils/constants";

export default function WaitingRoomPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();
  const { status, position, startPosition, estimatedWaitSeconds, isJoining } = useWaitingRoom(eventId);

  useEffect(() => {
    if (status !== "admitted") return;
    const id = setTimeout(() => router.replace(ROUTES.seatmap(eventId) as never), 1400);
    return () => clearTimeout(id);
  }, [status, eventId, router]);

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[var(--color-night)]">
      <PatternBackground tone="night" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,7,12,0.4)_0%,rgba(5,7,12,0.92)_65%,#05070C_100%)]" />

      <div className="relative">
        {isJoining ? (
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">Joining queue{"\u2026"}</p>
        ) : status === "admitted" ? (
          <AdmissionStatus />
        ) : (
          <QueuePosition position={position} startPosition={startPosition} estimatedWaitSeconds={estimatedWaitSeconds} />
        )}
      </div>
    </div>
  );
}