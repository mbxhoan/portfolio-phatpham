"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function LoginScreen() {
  const { login } = useAuth();
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    try {
      if (!(await login(identity, password))) setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-adminbg p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[400px] animate-fade-up rounded-[20px] border border-black/5 bg-white p-8 shadow-[0_40px_80px_-20px_rgba(9,20,38,.4)]"
      >
        <div className="mb-6 flex items-center gap-2.5 font-display text-[19px] font-extrabold tracking-[-0.04em] text-adminink">
          <span className="grid h-[34px] w-[34px] place-items-center rounded-[10px] bg-gradient-to-br from-navy to-navy-2 text-[15px] text-white">
            P
          </span>
          Profile manage
        </div>

        <h1 className="font-display text-2xl font-extrabold text-adminink">Đăng nhập</h1>
        <p className="mt-1 mb-6 text-sm text-[#697086]">
          Khu vực quản trị — vui lòng đăng nhập để tiếp tục.
        </p>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-[13px] font-bold text-adminink">Tài khoản hoặc email</span>
          <input
            value={identity}
            onChange={(e) => {
              setIdentity(e.target.value);
              setError(false);
            }}
            autoFocus
            autoComplete="username"
            placeholder="admin"
            className="w-full rounded-[11px] border-[1.5px] border-[#e4e2e6] bg-white px-3.5 py-2.5 text-[15px] text-adminink outline-none transition focus:border-brand"
          />
        </label>

        <label className="mb-2 block">
          <span className="mb-1.5 block text-[13px] font-bold text-adminink">Mật khẩu</span>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              type={show ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-[11px] border-[1.5px] border-[#e4e2e6] bg-white px-3.5 py-2.5 pr-11 text-[15px] text-adminink outline-none transition focus:border-brand"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-[#697086] hover:text-adminink"
            >
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </label>

        {error && (
          <p className="mb-2 text-sm font-semibold text-[#c0392b]">
            Tài khoản hoặc mật khẩu không đúng.
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-brand text-sm font-bold text-white shadow-[0_6px_14px_-6px_rgba(0,74,198,.5)] transition hover:-translate-y-px disabled:opacity-60"
        >
          <LogIn size={17} /> {busy ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>

        <p className="mt-4 text-center text-xs text-[#94a0b0]">
          Khu vực quản trị · tài khoản <b>admin</b>
        </p>
      </form>
    </div>
  );
}
