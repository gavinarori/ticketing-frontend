// app/(fan)/events/[eventId]/seatmap/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchEventById } from "@/lib/api/events";
import { fetchVenueLayout } from "@/lib/api/venues";
import { StadiumSeatMap } from "@/components/seatmap/StadiumSeatMap";

type PageProps = {
  params: Promise<{ eventId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = await fetchEventById(eventId);
  if (!event) return { title: "Fixture not found" };
  return { title: `Seat map \u00b7 ${event.homeTeam} vs ${event.awayTeam}` };
}

export default async function SeatMapPage({ params }: PageProps) {
  const { eventId } = await params;

  const event = await fetchEventById(eventId);
  if (!event || !event.hasSeatMap) notFound();

  const layout = await fetchVenueLayout(event.venue.id, event.id);
  if (!layout) notFound();

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-[var(--color-night)] p-3">
      <StadiumSeatMap layout={layout} eventId={event.id} requiresWaitingRoom={event.requiresWaitingRoom} />
    </div>
  );
}