"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav } from "@/lib/site";
import { usePortfolio } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-[72px] border-b border-white/50 backdrop-blur-2xl transition-shadow",
        "bg-white/85 backdrop-blur-xl border-b border-slate-200/70",
        scrolled ? "shadow-[0_15px_30px_-10px_rgba(15,23,42,0.12)]" : "shadow-none"
      )}
    >
      <div className="container-x flex h-full items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-[34px] w-[34px] place-items-center overflow-hidden rounded-[11px] bg-gradient-to-br from-navy to-navy-2 text-[15px] font-extrabold text-white shadow-[0_6px_14px_-4px_rgba(0,11,96,.5)]">
            {data.person.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.person.photo} alt="" className="h-full w-full object-cover" />
            ) : (
              data.person.initials
            )}
          </span>
          <span className="font-display text-[19px] font-extrabold tracking-[-0.03em] text-navy">
            {data.person.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative py-1.5 text-[14.5px] font-medium text-body transition-colors hover:text-navy"
            >
              {item.label}
              <span className="absolute inset-x-0 bottom-0 h-0.5 w-0 bg-brand transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <Link
            href="/admin"
            className="inline-flex h-9 items-center rounded-[11px] bg-gradient-to-b from-navy to-navy-2 px-5 text-sm font-semibold text-white shadow-[0_8px_18px_-6px_rgba(0,11,96,.55)] transition-transform hover:-translate-y-0.5"
          >
            Login
          </Link>
        </nav>

        <button
          className="grid h-10 w-10 place-items-center rounded-[10px] text-navy md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-[72px] flex flex-col gap-1 border-t border-white/60 bg-[rgba(250,248,255,0.98)] p-4 shadow-xl backdrop-blur-2xl md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 font-medium text-body hover:bg-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-xl bg-navy px-4 py-3 text-center font-semibold text-white"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
}
