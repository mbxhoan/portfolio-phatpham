"use client";

import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/shell";
import { LoginScreen } from "@/components/admin/login-screen";

function Gate({ children }: { children: ReactNode }) {
  const { authed, ready } = useAuth();
  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-adminbg text-sm font-semibold text-[#697086]">
        Đang xác thực quyền truy cập…
      </div>
    );
  }
  if (!authed) return <LoginScreen />;
  return <AdminShell>{children}</AdminShell>;
}

/** Wraps the admin area in auth state and shows the login screen until authed. */
export function AdminAuthGate({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Gate>{children}</Gate>
    </AuthProvider>
  );
}
