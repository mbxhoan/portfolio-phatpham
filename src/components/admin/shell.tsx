"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, UserRound, Layers, FolderKanban, MessageSquare, LogOut, Menu, Globe, ExternalLink } from "lucide-react";
import { ToastProvider } from "@/components/admin/ui";
import { usePortfolio } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Tổng quan", Icon: LayoutDashboard },
  { href: "/admin/gioi-thieu", label: "Giới thiệu", Icon: UserRound },
  { href: "/admin/nang-luc", label: "Năng lực cá nhân", Icon: Layers },
  { href: "/admin/du-an", label: "Dự án", Icon: FolderKanban },
  { href: "/admin/tin-nhan", label: "Tin nhắn", Icon: MessageSquare },
];

const titles: Record<string, string> = {
  "/admin": "Tổng quan",
  "/admin/gioi-thieu": "Giới thiệu",
  "/admin/nang-luc": "Năng lực cá nhân",
  "/admin/du-an": "Dự án",
  "/admin/tin-nhan": "Tin nhắn",
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data } = usePortfolio();
  const { logout } = useAuth();
  const unread = data.messages.filter((m) => m.status === "new").length;

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-adminbg text-[#45474C]">
        {/* sidebar */}
        <aside
          className={cn(
            "fixed z-[70] flex h-screen w-[272px] flex-none flex-col border-r border-black/5 bg-adminside transition-[left] duration-250 lg:sticky lg:top-0 lg:left-0",
            open ? "left-0 shadow-2xl" : "-left-[280px] lg:left-0"
          )}
        >
          <div className="flex items-center gap-2.5 px-7 pb-4 pt-7 font-display text-[19px] font-extrabold tracking-[-0.04em] text-adminink">
            <span className="grid h-[30px] w-[30px] place-items-center rounded-[9px] bg-gradient-to-br from-navy to-navy-2 text-[13px] text-white">
              {data.person.initials}
            </span>
            Profile manage
          </div>
          <nav className="flex flex-col gap-1 px-3.5 py-2">
            {links.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-[9px] px-4 py-3 text-[15px] font-semibold transition",
                    active ? "bg-white text-adminink shadow-soft" : "text-[#45474C] hover:bg-black/[0.035] hover:text-adminink"
                  )}
                >
                  <Icon size={19} className={active ? "text-brand" : "opacity-80"} />
                  {label}
                  {href === "/admin/tin-nhan" && unread > 0 && (
                    <span className="ml-auto rounded-full bg-[#e8f0ff] px-2 py-0.5 text-xs font-bold text-brand">
                      {unread}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-auto px-3.5 pb-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-[9px] bg-brand/10 px-4 py-2.5 text-sm font-bold text-brand transition hover:bg-brand/15"
            >
              <Globe size={18} />
              <span>Xem trang Profile</span>
              <ExternalLink size={14} className="ml-auto opacity-70" />
            </Link>
          </div>

          <button
            onClick={logout}
            className="mx-3.5 mb-4 flex items-center gap-2.5 rounded-[9px] px-4 py-2.5 text-sm font-semibold text-[#b4453a] hover:bg-[#b4453a]/[0.08]"
          >
            <LogOut size={18} /> Đăng xuất
          </button>
          <div className="px-6 pb-5 text-xs text-[#94a0b0]">
            SECRECT TEAM
            <br />
            Powered by SECRECT TEAM
          </div>
        </aside>

        {open && <div className="fixed inset-0 z-[60] bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}

        {/* main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-4 bg-[rgba(251,248,250,0.72)] px-5 shadow-[0_10px_42px_0_rgba(9,20,38,.05)] backdrop-blur-xl sm:px-8">
            <button className="grid h-10 w-10 place-items-center rounded-[10px] border border-[#e2e8f0] bg-white lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">
              <Menu size={20} />
            </button>
            <div className="font-display text-[15px] font-bold tracking-[-0.01em] text-adminink">
              {titles[pathname] ?? "Bảng điều khiển"}
            </div>
            <div className="flex items-center gap-3.5">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[10px] border border-black/10 bg-white px-3.5 py-2 text-xs font-bold text-adminink shadow-sm transition hover:border-brand hover:text-brand"
                title="Xem giao diện Profile thực tế"
              >
                <Globe size={15} className="text-brand" />
                <span className="hidden sm:inline">Xem trang Profile</span>
                <ExternalLink size={13} className="text-[#697086]" />
              </Link>
              <div className="flex items-center gap-3.5 border-l border-[#c5c6cd]/45 pl-4 sm:pl-5">
                <b className="hidden text-[15px] text-adminink sm:inline">{data.person.name}</b>
                <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-navy to-brand font-display text-[15px] font-extrabold text-white">
                  {data.person.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={data.person.photo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    data.person.initials
                  )}
                </span>
              </div>
            </div>
          </header>
          <div className="flex-1 p-5 sm:p-8">{children}</div>
        </div>
      </div>
    </ToastProvider>
  );
}
