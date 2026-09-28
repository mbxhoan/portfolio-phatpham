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

/** Admin password, from env with default fallback. */
export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "12345678";
}

/** Deterministic, unguessable token derived from the admin password environment/key. */
export function sessionToken(): string {
  return crypto
    .createHash("sha256")
    .update(`phat-portfolio-session:${adminPassword()}`)
    .digest("hex");
}

/** True if the supplied password matches the configured environment password or custom admin password. */
export function checkPassword(password: string, customPass?: string): boolean {
  if (!password) return false;
  const passBuf = Buffer.from(password);

  const envPass = adminPassword();
  const envBuf = Buffer.from(envPass);
  const matchEnv =
    passBuf.length === envBuf.length &&
    crypto.timingSafeEqual(new Uint8Array(passBuf), new Uint8Array(envBuf));

  if (matchEnv) return true;

  if (customPass) {
    const customBuf = Buffer.from(customPass);
    const matchCustom =
      passBuf.length === customBuf.length &&
      crypto.timingSafeEqual(new Uint8Array(passBuf), new Uint8Array(customBuf));
    if (matchCustom) return true;
  }

  return false;
}

/** Extract session token from cookie value or Authorization header string. */
export function extractToken(input: string | undefined | null): string | null {
  if (!input) return null;
  let raw = input.trim();
  if (raw.toLowerCase().startsWith("bearer ")) {
    raw = raw.substring(7).trim();
  }
  try {
    raw = decodeURIComponent(raw);
  } catch {}
  raw = raw.replace(/^"|"$/g, "").trim();
  return raw || null;
}

/** True if a request cookie value or Authorization header is a valid session token. */
export function isValidSession(tokenInput: string | undefined | null): boolean {
  const token = extractToken(tokenInput);
  if (!token) return false;
  const expected = sessionToken();
  const a = new Uint8Array(Buffer.from(token));
  const b = new Uint8Array(Buffer.from(expected));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
