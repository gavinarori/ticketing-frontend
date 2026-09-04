// lib/api/waiting-room.ts
import type { QueueStatusResult, QueueTicket } from "@/types/waiting-room";

const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

/**
 * ⚠️ Mock state lives in browser memory (a Map, keyed by queueId) rather
 * than behind a route handler — unlike auth/orders, nothing here needs a
 * cookie or server-only secret, so the extra round-trip isn't buying
 * anything during this mock phase. It does mean a hard refresh loses your
 * place in the (fake) queue; that's a mock limitation, not something a
 * real backend would have (it'd track position server-side, keyed by a
 * ticket the client persists).
 */
const tickets = new Map<string, QueueTicket>();

const DRAIN_RATE_PER_SECOND = 1.4; // how fast the mock queue "processes" people

export async function joinQueue(eventId: string): Promise<QueueTicket> {
  if (!USE_MOCK) {
    // Real implementation would POST /waiting-room/join and return the
    // server-issued ticket — same shape, so nothing downstream changes.
  }

  await new Promise((r) => setTimeout(r, 200));
  const ticket: QueueTicket = {
    queueId: crypto.randomUUID(),
    eventId,
    startPosition: 40 + Math.floor(Math.random() * 90),
    joinedAt: Date.now(),
  };
  tickets.set(ticket.queueId, ticket);
  return ticket;
}

export async function checkQueueStatus(queueId: string): Promise<QueueStatusResult> {
  const ticket = tickets.get(queueId);
  if (!ticket) {
    // Ticket lost (e.g. page was refreshed) — treat as admitted rather
    // than stranding the fan in a queue that no longer exists.
    return { status: "admitted", position: 0, estimatedWaitSeconds: 0 };
  }

  const elapsedSeconds = (Date.now() - ticket.joinedAt) / 1000;
  const position = Math.max(0, Math.round(ticket.startPosition - elapsedSeconds * DRAIN_RATE_PER_SECOND));
  const estimatedWaitSeconds = Math.round(position / DRAIN_RATE_PER_SECOND);

  return {
    status: position <= 0 ? "admitted" : "waiting",
    position,
    estimatedWaitSeconds,
  };
}