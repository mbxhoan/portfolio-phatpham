"use client";

/**
 * Admin auth for the CMS, backed by a server session.
 *
 * The password is verified server-side (/api/login) against `ADMIN_PASSWORD`
 * and a valid session is stored in an httpOnly cookie — the password is no
 * longer shipped in the client bundle. The identity field (username/email) is
 * cosmetic; only the password gates access.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiLogin, apiLogout, apiSession } from "@/lib/api";

const VALID_IDENTITIES = ["admin", "admin@example.vn"];
const TOKEN_KEY = "phat_admin_token";

interface AuthContextValue {
  authed: boolean;
  ready: boolean;
  login: (identity: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Synchronously initialize authed state from localStorage if available
  const [authed, setAuthed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return Boolean(localStorage.getItem(TOKEN_KEY));
    } catch {
      return false;
    }
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const hasLocalToken = typeof window !== "undefined" && Boolean(localStorage.getItem(TOKEN_KEY));

    if (hasLocalToken) {
      setAuthed(true);
    }

    apiSession()
      .then((ok) => {
        if (alive) setAuthed(ok);
      })
      .catch(() => {
        if (alive && !hasLocalToken) setAuthed(false);
      })
      .finally(() => {
        if (alive) setReady(true);
      });

    return () => {
      alive = false;
    };
  }, []);

  const login = useCallback(async (identity: string, password: string) => {
    if (!VALID_IDENTITIES.includes(identity.trim().toLowerCase())) return false;
    const ok = await apiLogin(password);
    if (ok) setAuthed(true);
    return ok;
  }, []);

  const logout = useCallback(() => {
    setAuthed(false);
    void apiLogout();
  }, []);

  return (
    <AuthContext.Provider value={{ authed, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
