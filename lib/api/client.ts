// lib/api/client.ts
import { ApiError } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined>;
  /** Forwarded to fetch's `cache` — most reads want "no-store" once inventory is live. */
  cache?: RequestCache;
  signal?: AbortSignal;
};

/**
 * Every module in lib/api/ (events.ts, inventory.ts, orders.ts, auth.ts...)
 * should call through this instead of raw fetch. Centralizes: base URL,
 * auth header injection, JSON parsing, and turning any non-2xx response
 * into a typed ApiError instead of letting callers branch on response.ok
 * everywhere.
 *
 * Auth token injection is stubbed until lib/auth/ exists — see the
 * `getAuthToken` TODO below.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(path, BASE_URL || "http://placeholder.local");
  if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const finalUrl = BASE_URL ? url.toString() : url.pathname + url.search;

  const res = await fetch(finalUrl, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: options.cache,
    signal: options.signal,
  });

  if (!res.ok) {
    const payload = await safeJson(res);
    throw new ApiError({
      status: res.status,
      code: (payload as { code?: string })?.code ?? "unknown_error",
      message: (payload as { message?: string })?.message ?? res.statusText,
      details: payload,
    });
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// TODO(auth phase): replace with a real token read (cookie/session) once
// lib/auth/ and providers/AuthProvider.tsx exist. Kept as an isolated async
// function now so nothing else in the API layer needs to change later.
async function authHeader(): Promise<Record<string, string>> {
  return {};
}
