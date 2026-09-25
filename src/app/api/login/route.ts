/**
 * Admin session endpoint.
 *  POST   { password }  → set httpOnly session cookie when the password matches
 *  DELETE               → clear the session cookie (logout)
 *  GET                  → { authed: boolean } for the client to restore state
 */
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, checkPassword, isValidSession, sessionToken } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function GET(req: NextRequest) {
  const authed = isValidSession(req.cookies.get(SESSION_COOKIE)?.value);
  return NextResponse.json({ authed });
}

export async function POST(req: NextRequest) {
  let password = "";
  try {
    ({ password = "" } = await req.json());
  } catch {
    /* empty/invalid body → treated as wrong password */
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
