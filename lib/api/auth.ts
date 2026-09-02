// lib/api/auth.ts
import { apiFetch } from "./client";
import type { LoginInput, RegisterInput } from "@/lib/validators/auth";
import type { User } from "@/types/user";

/**
 * Unlike lib/api/events.ts, this always calls the local /api/auth/* route
 * handlers rather than branching on NEXT_PUBLIC_API_URL — auth needs a real
 * server response to set an httpOnly cookie, which a client-side mock
 * function can't do. When a real backend exists, these route handlers
 * become a thin proxy to it (or get removed in favor of the backend
 * setting the cookie directly) — this module's exported functions and
 * their signatures don't need to change either way.
 */

export async function login(input: LoginInput): Promise<User> {
  const { user } = await apiFetch<{ user: User }>("/api/auth/login", {
    method: "POST",
    body: input,
  });
  return user;
}

export async function register(input: RegisterInput): Promise<User> {
  const { user } = await apiFetch<{ user: User }>("/api/auth/register", {
    method: "POST",
    body: input,
  });
  return user;
}

export async function logout(): Promise<void> {
  await apiFetch<void>("/api/auth/logout", { method: "POST" });
}

export async function getSession(): Promise<User | null> {
  try {
    const { user } = await apiFetch<{ user: User }>("/api/auth/session", { cache: "no-store" });
    return user;
  } catch {
    return null;
  }
}