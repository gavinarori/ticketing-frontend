// hooks/useWaitingRoom.ts
"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { joinQueue, checkQueueStatus } from "@/lib/api/waiting-room";
import { admissionKey } from "@/lib/utils/waiting-room-admission";

const POLL_INTERVAL_MS = 1500;

export function useWaitingRoom(eventId: string) {
  const [queueId, setQueueId] = useState<string | null>(null);
  const [startPosition, setStartPosition] = useState(0);

  useEffect(() => {
    let cancelled = false;
    joinQueue(eventId).then((ticket) => {
      if (cancelled) return;
      setQueueId(ticket.queueId);
      setStartPosition(ticket.startPosition);
    });
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const statusQuery = useQuery({
    queryKey: ["waiting-room", queueId],
    queryFn: () => checkQueueStatus(queueId!),
    enabled: !!queueId,
    refetchInterval: (query) => (query.state.data?.status === "admitted" ? false : POLL_INTERVAL_MS),
  });

  const status = statusQuery.data?.status ?? "waiting";
  const position = statusQuery.data?.position ?? startPosition;
  const estimatedWaitSeconds = statusQuery.data?.estimatedWaitSeconds ?? 0;

  useEffect(() => {
    if (status === "admitted") {
      try {
        sessionStorage.setItem(admissionKey(eventId), "1");
      } catch {
        /* sessionStorage unavailable — the seat map's check will just fail open */
      }
    }
  }, [status, eventId]);

  return {
    status,
    position,
    startPosition,
    estimatedWaitSeconds,
    isJoining: !queueId,
  };
}