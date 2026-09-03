// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validators/auth";
import { findUserByEmail, toPublicUser } from "@/lib/auth/mock-users";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { code: "invalid_input", message: "Check your email and password." },
      { status: 400 }
    );
  }

  const user = findUserByEmail(parsed.data.email);
  if (!user || user.password !== parsed.data.password) {
    return NextResponse.json(
      { code: "invalid_credentials", message: "That email and password don't match." },
      { status: 401 }
    );
  }

  const publicUser = toPublicUser(user);
  await setSessionCookie(publicUser);
  return NextResponse.json({ user: publicUser });
}