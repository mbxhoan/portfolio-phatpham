/**
 * Admin session endpoint.
 *  POST   { password }  → set httpOnly session cookie when the password matches
 *  DELETE               → clear the session cookie (logout)
 *  GET                  → { authed: boolean } for the client to restore state
 */
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, checkPassword, isValidSession, sessionToken } from "@/lib/admin-auth";
import { readPortfolio } from "@/lib/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function GET(req: NextRequest) {
  const cookieVal = req.cookies.get(SESSION_COOKIE)?.value;
  const headerVal = req.headers.get("authorization");
  const authed = isValidSession(cookieVal) || isValidSession(headerVal);
  return NextResponse.json(
    { authed },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  let password = "";
  try {
    ({ password = "" } = await req.json());
  } catch {
    /* empty/invalid body → treated as wrong password */
  }

  const override = await readPortfolio();
  const customPass = override?.adminPassword;

  if (!checkPassword(password, customPass)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = sessionToken();
  const res = NextResponse.json({ ok: true, token });
  res.cookies.set(SESSION_COOKIE, token, {
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
