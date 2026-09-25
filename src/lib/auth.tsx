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

// Cosmetic — accepted identities for the login form. The real gate is the
// server-side password check.
const VALID_IDENTITIES = ["admin", "admin@example.vn"];

interface AuthContextValue {
  authed: boolean;
  ready: boolean;
  login: (identity: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    apiSession()
      .then((ok) => {
        if (alive) setAuthed(ok);
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
