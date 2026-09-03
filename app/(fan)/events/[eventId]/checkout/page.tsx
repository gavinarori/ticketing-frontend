// app/(fan)/events/[eventId]/checkout/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchEventById } from "@/lib/api/events";
import { fetchVenueLayout } from "@/lib/api/venues";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = { title: "Checkout" };

type PageProps = { params: Promise<{ eventId: string }> };

export default async function CheckoutPage({ params }: PageProps) {
  const { eventId } = await params;

  const event = await fetchEventById(eventId);
  if (!event) notFound();

  const layout = await fetchVenueLayout(event.venue.id, event.id);
  if (!layout) notFound();

  return <CheckoutClient event={event} layout={layout} />;
}