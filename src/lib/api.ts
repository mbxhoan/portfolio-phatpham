"use client";

/**
 * Client helpers for the CMS API routes. All requests are same-origin so the
 * httpOnly admin session cookie is sent automatically on writes.
 */
import type { Portfolio } from "@/types/portfolio";

/** Fetch the shared portfolio override (null when nothing is saved yet). */
export async function fetchPortfolio(): Promise<Partial<Portfolio> | null> {
  const res = await fetch("/api/portfolio", { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as Partial<Portfolio> | null;
}

/** Persist the portfolio override. Returns true on success. */
export async function savePortfolio(data: Portfolio): Promise<boolean> {
  const res = await fetch("/api/portfolio", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.ok;
}

/** Upload an image blob and return its public URL. Throws on failure. */
export async function uploadImage(blob: Blob): Promise<string> {
  const ext = blob.type.split("/")[1]?.replace("+xml", "") || "bin";
  const form = new FormData();
  form.append("file", new File([blob], `image.${ext}`, { type: blob.type }));

  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) {
    const reason = await res.json().catch(() => null);
    throw new Error(reason?.error || `upload failed (${res.status})`);
  }
  const { url } = (await res.json()) as { url: string };
  return url;
}

/** Attempt admin login. Returns true on success. */
export async function apiLogin(password: string): Promise<boolean> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.ok;
}

/** Clear the admin session. */
export async function apiLogout(): Promise<void> {
  await fetch("/api/login", { method: "DELETE" });
}

/** Whether the current browser has a valid admin session. */
export async function apiSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/login", { cache: "no-store" });
    if (!res.ok) return false;
    const { authed } = (await res.json()) as { authed: boolean };
    return Boolean(authed);
  } catch {
    return false;
  }
}
