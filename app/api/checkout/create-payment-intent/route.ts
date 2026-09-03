// app/api/checkout/create-payment-intent/route.ts
import { NextResponse } from "next/server";
import { readSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  const user = await readSessionCookie();
  if (!user) {
    return NextResponse.json({ code: "unauthorized", message: "Sign in to check out." }, { status: 401 });
  }

  const { amount, currency } = (await request.json()) as { amount: number; currency: string };

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    // No Stripe configured — the client falls back to a test-mode form
    // that never calls this endpoint's clientSecret for anything real, so
    // this marker just needs to be a non-empty string.
    return NextResponse.json({ clientSecret: null, testMode: true });
  }

  // Dynamic import so the "stripe" package (a new dependency — see the
  // checkout README note) is only pulled in when a key is actually
  // configured, instead of bundled unconditionally.
  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(secretKey);

  const intent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata: { userId: user.id },
  });

  return NextResponse.json({ clientSecret: intent.client_secret, testMode: false });
}