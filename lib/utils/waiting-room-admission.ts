// lib/utils/waiting-room-admission.ts

/**
 * Single source of truth for the sessionStorage key format used to mark a
 * fan as admitted past the waiting room for a given event — imported by
 * both useWaitingRoom.ts (which sets it) and StadiumSeatMap.tsx (which
 * checks it), so the two can't drift out of sync on the key shape.
 */
export function admissionKey(eventId: string): string {
  return `waitingroom:admitted:${eventId}`;
}

export function hasWaitingRoomAdmission(eventId: string): boolean {
  try {
    return sessionStorage.getItem(admissionKey(eventId)) === "1";
  } catch {
    // sessionStorage unavailable (SSR, privacy mode) — fail open rather
    // than stranding a fan who genuinely was admitted.
    return true;
  }
}