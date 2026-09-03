// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validators/auth";
import { createUser } from "@/lib/auth/mock-users";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { code: "invalid_input", message: firstIssue?.message ?? "Check the form and try again." },
      { status: 400 }
    );
  }

  try {
    const user = createUser(parsed.data);
    await setSessionCookie(user);
    return NextResponse.json({ user });
  } catch (err) {
    if (err instanceof Error && err.message === "email_taken") {
      return NextResponse.json(
        { code: "email_taken", message: "An account with that email already exists." },
        { status: 409 }
      );
    }
    throw err;
  }
}