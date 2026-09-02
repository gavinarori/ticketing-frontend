// lib/auth/mock-users.ts
//
// ⚠️ MOCK ONLY — an in-memory Map standing in for a real users table.
// Resets on every server restart and isn't shared across serverless
// instances. Seeded with one demo account so the login form is testable
// without registering first. Swap for real DB calls (via lib/api/auth.ts
// hitting a real backend) once one exists — the route handlers that use
// this only call three functions, so that's a small, contained change.

import type { User } from "@/types/user";

type StoredUser = User & { password: string };

const users = new Map<string, StoredUser>();

users.set("fan@example.com", {
  id: "demo-user-1",
  email: "fan@example.com",
  firstName: "Demo",
  lastName: "Fan",
  password: "password1",
});

export function findUserByEmail(email: string): StoredUser | undefined {
  return users.get(email.toLowerCase());
}

export function createUser(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): User {
  const email = input.email.toLowerCase();
  if (users.has(email)) {
    throw new Error("email_taken");
  }
  const user: StoredUser = {
    id: crypto.randomUUID(),
    email,
    firstName: input.firstName,
    lastName: input.lastName,
    password: input.password,
  };
  users.set(email, user);
  return toPublicUser(user);
}

export function toPublicUser(user: StoredUser): User {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}