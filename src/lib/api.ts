"use client";

import type { Portfolio } from "@/types/portfolio";

const TOKEN_KEY = "phat_admin_token";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) return { Authorization: `Bearer ${token}` };
  } catch {}
  return {};
}

/** Fetch the shared portfolio override (null when nothing is saved yet). */
export function fetchPortfolio(): Promise<Partial<Portfolio> | null> {
  return fetch(`/api/portfolio?t=${Date.now()}`, { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);
}

/** Persist the portfolio override. Returns true on success. */
export async function savePortfolio(data: Portfolio): Promise<boolean> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
  };
  const res = await fetch("/api/portfolio", {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  return res.ok;
}

/** Upload an image blob and return its public URL. Throws on failure. */
export async function uploadImage(blob: Blob): Promise<string> {
  const ext = blob.type.split("/")[1]?.replace("+xml", "") || "bin";
  const form = new FormData();
  form.append("file", new File([blob], `image.${ext}`, { type: blob.type }));

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: getAuthHeader(),
    body: form,
  });
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
  if (res.ok) {
    try {
      const data = await res.json();
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
      }
    } catch {}
  }
  return res.ok;
}

/** Clear the admin session. */
export async function apiLogout(): Promise<void> {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
  await fetch("/api/login", { method: "DELETE", headers: getAuthHeader() });
}

/** Whether the current browser has a valid admin session. */
export async function apiSession(): Promise<boolean> {
  try {
    const res = await fetch(`/api/login?t=${Date.now()}`, {
      cache: "no-store",
      headers: getAuthHeader(),
    });
    if (!res.ok) return false;
    const { authed } = (await res.json()) as { authed: boolean };
    if (!authed) {
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch {}
    }
    return Boolean(authed);
  } catch {
    return false;
  }
}
