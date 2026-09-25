/**
 * Image upload endpoint. Accepts a (client-compressed) image file as multipart
 * form data and stores it as a public blob, returning its URL. The portfolio
 * JSON then references this URL instead of embedding base64. Admin-only.
 */
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { SESSION_COOKIE, isValidSession } from "@/lib/admin-auth";
import { isBlobConfigured } from "@/lib/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB — compressed images are far smaller

export async function POST(req: NextRequest) {
  if (!isValidSession(req.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let file: File | null = null;
  try {
    const form = await req.formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
  } catch {
    /* fall through to the missing-file error below */
  }

  if (!file) {
    return NextResponse.json({ ok: false, error: "no file" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ ok: false, error: "not an image" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "file too large" }, { status: 413 });
  }

  if (!isBlobConfigured()) {
    // Fallback for local dev when Vercel Blob is unconfigured: convert compressed file to Data URL
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const url = `data:${file.type};base64,${base64}`;
    return NextResponse.json({ ok: true, url });
  }

  const ext = file.type.split("/")[1]?.replace("+xml", "") || "bin";
  const { url } = await put(`portfolio/${Date.now()}.${ext}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });

  return NextResponse.json({ ok: true, url });
}
