// lib/utils/format.ts

/** Prices throughout the API are minor units (pence/cents) — never format a raw number without this. */
export function formatMoney(minorUnits: number, currency = "GBP", locale = "en-GB"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: minorUnits % 100 === 0 ? 0 : 2,
  }).format(minorUnits / 100);
}

export function formatFixtureDate(iso: string, locale = "en-GB"): { day: string; date: string; time: string } {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString(locale, { weekday: "short" }),
    date: d.toLocaleDateString(locale, { day: "numeric", month: "short" }),
    time: d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
  };
}
