// lib/auth/session.ts
//
// ⚠️ MOCK ONLY. This base64-encodes a JSON payload into a cookie with no
// signature, expiry enforcement, or encryption — it exists purely so
// middleware.ts and the AuthProvider have something real to check against
// while there's no backend. Replace with a real session store (signed JWT,
// or a DB-backed session id) before this touches production traffic —
// nothing downstream (AuthProvider, middleware, the route handlers) should
// need to change shape when that happens, just what's inside these two
// functions.

import { cookies } from "next/headers";
import type { User } from "@/types/user";

const COOKIE_NAME = "etihad_session";

export async function setSessionCookie(user: User) {
  const store = await cookies();
  store.set(COOKIE_NAME, Buffer.from(JSON.stringify(user)).toString("base64"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function readSessionCookie(): Promise<User | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as User;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;