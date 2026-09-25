/**
 * Portfolio content endpoint (the shared source of truth across devices).
 *  GET → the saved override JSON (or null when nothing is saved yet). Public.
 *  PUT → overwrite the saved override. Requires a valid admin session.
 */
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, isValidSession } from "@/lib/admin-auth";
import { BlobNotConfiguredError, readPortfolio, writePortfolio } from "@/lib/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await readPortfolio();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function PUT(req: NextRequest) {
  if (!isValidSession(req.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  try {
    await writePortfolio(data as Record<string, unknown>);
  } catch (e) {
    if (e instanceof BlobNotConfiguredError) {
      return NextResponse.json({ ok: false, error: "storage not configured" }, { status: 503 });
    }
    return NextResponse.json({ ok: false, error: "write failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
