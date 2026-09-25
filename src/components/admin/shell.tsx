"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  UserRound,
  Layers,
  FolderKanban,
  MessageSquare,
  LogOut,
  Menu,
  Globe,
  ExternalLink,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import { ToastProvider, Modal, AdminButton, Field, Input, useToast } from "@/components/admin/ui";
import { usePortfolio } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { apiLogin } from "@/lib/api";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Tổng quan", Icon: LayoutDashboard },
  { href: "/admin/gioi-thieu", label: "Giới thiệu", Icon: UserRound },
  { href: "/admin/nang-luc", label: "Năng lực", Icon: Layers },
  { href: "/admin/du-an", label: "Dự án", Icon: FolderKanban },
  { href: "/admin/tin-nhan", label: "Tin nhắn", Icon: MessageSquare },
];

const titles: Record<string, string> = {
  "/admin": "Tổng quan",
  "/admin/gioi-thieu": "Giới thiệu",
  "/admin/nang-luc": "Năng lực",
  "/admin/du-an": "Dự án",
  "/admin/tin-nhan": "Tin nhắn",
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminShellContent>{children}</AdminShellContent>
    </ToastProvider>
  );
}

function AdminShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data, update, reset } = usePortfolio();
  const { logout } = useAuth();
  const toast = useToast();

  const [passOpen, setPassOpen] = useState(false);
  const [passDraft, setPassDraft] = useState({ newPass: "", confirmPass: "" });
  const [resetOpen, setResetOpen] = useState(false);
  const [resetPassInput, setResetPassInput] = useState("");
  const [resetError, setResetError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const unread = data.messages.filter((m) => m.status === "new").length;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMenuOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setMenuOpen(false);
    }, 350);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  function savePass() {
    if (!passDraft.newPass.trim()) {
      toast("Vui lòng nhập mật khẩu mới");
      return;
    }
    if (passDraft.newPass !== passDraft.confirmPass) {
      toast("Mật khẩu xác nhận không khớp");
      return;
    }
    update((d) => ({ ...d, adminPassword: passDraft.newPass.trim() }));
    setPassOpen(false);
    setPassDraft({ newPass: "", confirmPass: "" });
    toast("Đã cập nhật mật khẩu Admin mới!");
  }

  async function handleReset() {
    if (!resetPassInput.trim()) {
      setResetError("Vui lòng nhập mật khẩu Admin để tiếp tục.");
      return;
    }

    setIsVerifying(true);
    setResetError("");

    try {
      const pass = resetPassInput.trim();
      const matchCustom = data.adminPassword ? pass === data.adminPassword.trim() : false;
      const matchApi = await apiLogin(pass);

      if (!matchCustom && !matchApi) {
        setResetError("Mật khẩu Admin không chính xác!");
        toast("Mật khẩu Admin không chính xác!");
        setIsVerifying(false);
        return;
      }

      reset();
      setResetOpen(false);
      setResetPassInput("");
      setResetError("");
      toast("Đã khôi phục bộ khung tính năng mặc định thành công!");
    } catch {
      setResetError("Có lỗi xảy ra khi xác thực mật khẩu.");
    } finally {
      setIsVerifying(false);
    }
  }

  return (
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

        <div className="mt-auto px-6 pb-5 text-xs text-[#94a0b0]">
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

          {/* Avatar Menu Container */}
          <div
            ref={menuRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-3 rounded-full border border-transparent p-1 transition hover:border-black/10 hover:bg-black/[0.04] focus:outline-none"
            >
              <b className="hidden text-[15px] font-bold text-adminink sm:inline">{data.person.name}</b>
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-navy to-brand font-display text-[15px] font-extrabold text-white shadow-sm ring-2 ring-white">
                {data.person.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.person.photo} alt="" className="h-full w-full object-cover" />
                ) : (
                  data.person.initials
                )}
              </span>
            </button>

            {/* Avatar Popup Menu */}
            {menuOpen && (
              <div className="absolute right-0 top-full z-50 pt-1.5">
                <div className="w-60 animate-fade-up rounded-2xl border border-black/10 bg-white p-2 shadow-[0_20px_40px_-15px_rgba(9,20,38,0.2)] backdrop-blur-xl">
                  <div className="border-b border-black/5 px-3 py-2.5 mb-1">
                    <p className="text-xs font-bold text-adminink">{data.person.name}</p>
                    <p className="text-[11px] text-[#697086] truncate">{data.person.role}</p>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <Link
                      href="/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-adminink transition hover:bg-brand/10 hover:text-brand"
                    >
                      <Globe size={16} className="text-brand" />
                      <span>Xem trang profile</span>
                      <ExternalLink size={13} className="ml-auto opacity-60" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setPassOpen(true);
                      }}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-adminink transition hover:bg-black/[0.05]"
                    >
                      <KeyRound size={16} className="text-[#697086]" />
                      <span>Đổi mật khẩu</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setResetOpen(true);
                      }}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-adminink transition hover:bg-black/[0.05]"
                    >
                      <RotateCcw size={16} className="text-[#697086]" />
                      <span>Khôi phục mặc định</span>
                    </button>

                    <div className="my-1 border-t border-black/5" />

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#b4453a] transition hover:bg-[#b4453a]/10"
                    >
                      <LogOut size={16} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 p-5 sm:p-8">{children}</div>
      </div>

      {/* change password modal */}
      <Modal
        open={passOpen}
        onClose={() => setPassOpen(false)}
        title="Đổi mật khẩu truy cập Admin CMS"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setPassOpen(false)}>Hủy</AdminButton>
            <AdminButton onClick={savePass}>Lưu mật khẩu mới</AdminButton>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Mật khẩu mới">
            <Input
              type="password"
              value={passDraft.newPass}
              onChange={(e) => setPassDraft({ ...passDraft, newPass: e.target.value })}
              placeholder="Nhập mật khẩu mới..."
            />
          </Field>
          <Field label="Xác nhận mật khẩu mới">
            <Input
              type="password"
              value={passDraft.confirmPass}
              onChange={(e) => setPassDraft({ ...passDraft, confirmPass: e.target.value })}
              placeholder="Nhập lại mật khẩu mới..."
            />
          </Field>
        </div>
      </Modal>

      {/* reset default confirm modal */}
      <Modal
        open={resetOpen}
        onClose={() => {
          setResetOpen(false);
          setResetPassInput("");
          setResetError("");
        }}
        title="Khôi phục mặc định"
        footer={
          <>
            <AdminButton
              variant="ghost"
              onClick={() => {
                setResetOpen(false);
                setResetPassInput("");
                setResetError("");
              }}
              disabled={isVerifying}
            >
              Hủy
            </AdminButton>
            <AdminButton variant="danger" onClick={handleReset} disabled={isVerifying}>
              {isVerifying ? "Đang xác thực..." : "Xác nhận khôi phục"}
            </AdminButton>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-[14px] leading-relaxed text-[#697086]">
            Hành động này sẽ reset tất cả dữ liệu (dự án, quy trình, lĩnh vực, tin nhắn, năng lực, lượt xem, lượt tương tác) và chỉ chừa lại bộ khung tính năng ban đầu để người dùng nhập lại từ đầu.
          </p>

          <Field label="Nhập mật khẩu Admin để xác nhận">
            <Input
              type="password"
              value={resetPassInput}
              onChange={(e) => {
                setResetPassInput(e.target.value);
                if (resetError) setResetError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleReset();
                }
              }}
              placeholder="Nhập mật khẩu admin..."
            />
          </Field>

          {resetError && (
            <p className="text-xs font-semibold text-[#b4453a]">{resetError}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}

