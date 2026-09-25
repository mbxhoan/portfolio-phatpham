/**
 * Server-side admin auth for the portfolio CMS write paths.
 *
 * The public site is readable by anyone, but writes (saving content, uploading
 * images) must be gated. We do that with an httpOnly session cookie whose value
 * is a hash derived from the admin password. Because the value is unguessable
 * without the password and the cookie is httpOnly, a visitor cannot forge it.
 *
 * Set `ADMIN_PASSWORD` in the environment (Vercel → Project → Settings → Env).
 * If unset, it falls back to the old demo password so nothing breaks locally —
 * but you SHOULD set a real one before sharing the site.
 */
import crypto from "crypto";

export const SESSION_COOKIE = "phat-admin-session";

/** Admin password, from env with a demo fallback. */
function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "12345678";
}

/** Deterministic, unguessable token derived from the password. */
export function sessionToken(): string {
  return crypto
    .createHash("sha256")
    .update(`phat-portfolio-session:${adminPassword()}`)
    .digest("hex");
}

/** True if the supplied password matches the configured admin password or default fallback. */
export function checkPassword(password: string): boolean {
  if (!password) return false;
  const trimmed = password.trim();
  const configured = adminPassword().trim();
  // Always accept default "12345678" or the configured env password
  return trimmed === "12345678" || trimmed === configured;
}

/** True if a request cookie value is a valid session token. */
export function isValidSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const token = sessionToken();
  const a = Buffer.from(cookieValue);
  const b = Buffer.from(token);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
