// lib/stripe/client.ts
import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Returns null when no publishable key is configured, rather than
 * throwing — StripePaymentForm.tsx checks this and falls back to a
 * clearly-labeled test-mode form so checkout is still fully testable
 * without real Stripe credentials.
 */
export function getStripe(): Promise<Stripe | null> | null {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) return null;
  if (!stripePromise) stripePromise = loadStripe(key);
  return stripePromise;
}