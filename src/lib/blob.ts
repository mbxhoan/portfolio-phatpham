/**
 * Server-only persistence for the portfolio override, backed by Vercel Blob.
 *
 * The whole edited portfolio is stored as a single public JSON blob
 * (`portfolio.json`). The public site reads it so every device sees the same
 * content; the admin writes it on save. Uploaded images are stored as separate
 * blobs (see /api/upload) and the JSON only references their URLs.
 *
 * Requires `BLOB_READ_WRITE_TOKEN` (auto-injected on Vercel when a Blob store is
 * linked, or pulled locally via `vercel env pull`). Without it, reads return
 * null (site falls back to the built-in defaults) and writes throw.
 */
import { list, put } from "@vercel/blob";
import type { Portfolio } from "@/types/portfolio";

const PORTFOLIO_KEY = "portfolio.json";

export class BlobNotConfiguredError extends Error {
  constructor() {
    super("BLOB_READ_WRITE_TOKEN is not set");
    this.name = "BlobNotConfiguredError";
  }
}

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Reads the saved portfolio override. Returns null when nothing is saved yet,
 * the store is unconfigured, or the blob is unreadable — callers fall back to
 * the built-in defaults in those cases.
 */
export async function readPortfolio(): Promise<Partial<Portfolio> | null> {
  if (!isBlobConfigured()) return null;
  try {
    const { blobs } = await list({ prefix: PORTFOLIO_KEY, limit: 1 });
    const hit = blobs.find((b) => b.pathname === PORTFOLIO_KEY);
    if (!hit) return null;
    // Bust the CDN cache so admins see their own latest save immediately.
    const res = await fetch(`${hit.url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Partial<Portfolio>;
  } catch {
    return null;
  }
}

/** Writes the portfolio override, overwriting any previous version. */
export async function writePortfolio(data: Partial<Portfolio>): Promise<void> {
  if (!isBlobConfigured()) throw new BlobNotConfiguredError();
  // addRandomSuffix:false keeps the pathname stable; this version of
  // @vercel/blob overwrites an existing blob at the same pathname.
  await put(PORTFOLIO_KEY, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    cacheControlMaxAge: 0,
  });
}
