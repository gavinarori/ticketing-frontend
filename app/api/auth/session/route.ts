// app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import { readSessionCookie } from "@/lib/auth/session";

export async function GET() {
  const user = await readSessionCookie();
  if (!user) {
    return NextResponse.json({ code: "no_session", message: "Not signed in." }, { status: 401 });
  }
  return NextResponse.json({ user });
}