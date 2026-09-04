// types/waiting-room.ts

export type QueueStatus = "waiting" | "admitted";

export type QueueTicket = {
  queueId: string;
  eventId: string;
  startPosition: number;
  joinedAt: number; // epoch ms
};

export type QueueStatusResult = {
  status: QueueStatus;
  position: number;
  estimatedWaitSeconds: number;
};