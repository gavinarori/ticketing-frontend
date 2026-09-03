// components/checkout/StripePaymentForm.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe/client";
import { createOrder } from "@/lib/api/orders";
import { formatMoney } from "@/lib/utils";
import type { Order, OrderItem } from "@/types/order";

type StripePaymentFormProps = {
  eventId: string;
  items: OrderItem[];
  total: number;
  onSuccess: (order: Order) => void;
};

export function StripePaymentForm({ eventId, items, total, onSuccess }: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null | undefined>(undefined);
  const [setupError, setSetupError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/checkout/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total, currency: "gbp" }),
    })
      .then((res) => res.json())
      .then((data: { clientSecret: string | null }) => {
        if (!cancelled) setClientSecret(data.clientSecret);
      })
      .catch(() => {
        if (!cancelled) setSetupError("Couldn't set up payment. Refresh and try again.");
      });
    return () => {
      cancelled = true;
    };
  }, [total]);

  if (setupError) {
    return <p className="rounded-lg bg-[var(--color-flag)]/10 px-3 py-2 text-sm text-[var(--color-flag)]">{setupError}</p>;
  }

  // Still loading the payment-intent response.
  if (clientSecret === undefined) {
    return <PaymentFormSkeleton />;
  }

  // No Stripe key configured (dev/demo) or the server explicitly said test mode.
  if (!clientSecret || !getStripe()) {
    return <TestModePaymentForm eventId={eventId} items={items} total={total} onSuccess={onSuccess} />;
  }

  return (
    <Elements stripe={getStripe()} options={{ clientSecret, appearance: stripeAppearance }}>
      <RealPaymentForm eventId={eventId} items={items} onSuccess={onSuccess} />
    </Elements>
  );
}

function RealPaymentForm({
  eventId,
  items,
  onSuccess,
}: {
  eventId: string;
  items: OrderItem[];
  onSuccess: (order: Order) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setError(null);

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (confirmError || !paymentIntent) {
      setError(confirmError?.message ?? "Payment failed. Check your card details and try again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const order = await createOrder({ eventId, items, paymentReference: paymentIntent.id });
      onSuccess(order);
    } catch {
      setError("Payment succeeded but the order couldn't be saved. Contact support with reference " + paymentIntent.id);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      {error && <p className="text-sm text-[var(--color-flag)]">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        className="h-11 rounded-full bg-[var(--color-ink)] text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Processing\u2026" : "Pay now"}
      </button>
    </form>
  );
}

/**
 * Renders when NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY / STRIPE_SECRET_KEY
 * aren't set — lets the whole checkout flow (order creation, confirmation
 * page, order history) be exercised end-to-end without real payment
 * credentials. Clearly labeled so it's never mistaken for the real thing.
 */
function TestModePaymentForm({
  eventId,
  items,
  total,
  onSuccess,
}: {
  eventId: string;
  items: OrderItem[];
  total: number;
  onSuccess: (order: Order) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setIsSubmitting(true);
    setError(null);
    try {
      const order = await createOrder({
        eventId,
        items,
        paymentReference: `test_${crypto.randomUUID()}`,
      });
      onSuccess(order);
    } catch {
      setError("Couldn't complete the order. Try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-dashed border-[var(--color-sky)]/50 bg-[var(--color-sky)]/5 px-3 py-2 text-xs text-[var(--color-sky-deep)]">
        Test mode — no Stripe key configured. Payment is simulated; no card details are collected.
      </div>

      <div className="flex items-center justify-between rounded-xl border border-[var(--color-ink)]/12 bg-[var(--color-paper)] px-3.5 py-3 text-sm text-[var(--color-ink)]/50">
        <span>4242 4242 4242 4242</span>
        <span>12/34 &middot; 123</span>
      </div>

      {error && <p className="text-sm text-[var(--color-flag)]">{error}</p>}

      <button
        onClick={handlePay}
        disabled={isSubmitting}
        className="h-11 rounded-full bg-[var(--color-ink)] text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Processing\u2026" : `Pay ${formatMoney(total)} (test mode)`}
      </button>
    </div>
  );
}

function PaymentFormSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-11 animate-pulse rounded-xl bg-[var(--color-ink)]/8" />
      <div className="h-11 animate-pulse rounded-full bg-[var(--color-ink)]/8" />
    </div>
  );
}

const stripeAppearance = {
  variables: {
    colorPrimary: "#6CABDD",
    colorText: "#0D131C",
    borderRadius: "12px",
    fontFamily: "var(--font-sans)",
  },
};