"use client";

import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from "react";
import { X, Check, AlertTriangle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------- Toast ---------------- */
const ToastCtx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const toast = useCallback((m: string) => setMsg(m), []);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2400);
    return () => clearTimeout(t);
  }, [msg]);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div
        className={cn(
          "fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-2.5 rounded-xl bg-adminink px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_-10px_rgba(0,0,0,.5)] transition-all",
          msg ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        )}
      >
        <Check size={18} className="text-[#5fd38a]" />
        {msg}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------------- Page head ---------------- */
export function PageHead({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-7 animate-fade-up">
      <h1 className="font-display text-[32px] font-extrabold tracking-[-0.025em] text-adminink">{title}</h1>
      {subtitle && <p className="mt-1 text-[16px] text-[#45474C]">{subtitle}</p>}
    </div>
  );
}

/* ---------------- Panel ---------------- */
export function Panel({ title, eyebrow, action, children }: { title?: string; eyebrow?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-7 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(0,0,0,.04)]">
      {(title || eyebrow || action) && (
        <div className="flex items-center justify-between gap-4 border-b border-black/5 px-6 py-5">
          {eyebrow ? (
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#697086]">{eyebrow}</span>
          ) : (
            <h2 className="font-display text-xl font-bold text-adminink">{title}</h2>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

/* ---------------- Button ---------------- */
export function AdminButton({
  variant = "primary",
  className,
  children,
  ...props
}: { variant?: "primary" | "ghost" | "danger" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-[10px] px-4 text-sm font-bold transition disabled:opacity-50",
        variant === "primary" && "bg-brand text-white shadow-[0_6px_14px_-6px_rgba(0,74,198,.5)] hover:-translate-y-px",
        variant === "ghost" && "border border-[#e2e8f0] bg-white text-adminink hover:border-brand hover:text-brand",
        variant === "danger" && "bg-[#c0392b] text-white hover:-translate-y-px",
        className
      )}
    >
      {children}
    </button>
  );
}

export const AddButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <AdminButton {...props}>
    <Plus size={16} /> {props.children ?? "Thêm mới"}
  </AdminButton>
);

/* ---------------- Badge ---------------- */
export function Badge({ tone, children }: { tone: "new" | "read" | "ok"; children: ReactNode }) {
  const map = {
    new: "bg-[#e8f0ff] text-brand",
    read: "bg-[#eef0f2] text-[#697086]",
    ok: "bg-[#e6f6ec] text-[#1f8a4d]",
  };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold", map[tone])}>{children}</span>;
}

/* ---------------- Icon action button ---------------- */
export function IconAction({ tone, ...props }: { tone?: "default" | "danger" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "grid h-[34px] w-[34px] place-items-center rounded-[9px] border border-[#e2e8f0] bg-white text-[#697086] transition",
        tone === "danger" ? "hover:border-[#e3a59e] hover:text-[#c0392b]" : "hover:border-brand hover:text-brand"
      )}
    />
  );
}

/* ---------------- Modal ---------------- */
export function Modal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-adminink/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-[560px] animate-fade-up overflow-auto rounded-[20px] bg-white shadow-[0_40px_80px_-20px_rgba(9,20,38,.4)]">
        <div className="flex items-center justify-between border-b border-black/5 px-7 py-6">
          <h3 className="font-display text-xl font-extrabold text-adminink">{title}</h3>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#f1eef0] text-[#697086] hover:bg-[#e7e3e6]">
            <X size={18} />
          </button>
        </div>
        <div className="px-7 py-6">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-black/5 px-7 py-[18px]">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, label, onCancel, onConfirm }: { open: boolean; label: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Xác nhận xóa"
      footer={
        <>
          <AdminButton variant="ghost" onClick={onCancel}>Hủy</AdminButton>
          <AdminButton variant="danger" onClick={onConfirm}>Xóa</AdminButton>
        </>
      }
    >
      <div className="py-2 text-center">
        <div className="mx-auto mb-4 grid h-[60px] w-[60px] place-items-center rounded-full bg-[#fdecea] text-[#c0392b]">
          <AlertTriangle size={28} />
        </div>
        <p className="text-[15px] text-[#697086]">
          Bạn có chắc muốn xóa <b className="text-adminink">{label}</b>? Hành động này không thể hoàn tác.
        </p>
      </div>
    </Modal>
  );
}

/* ---------------- Form fields ---------------- */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mb-[18px] block">
      <span className="mb-1.5 block text-[13px] font-bold text-adminink">{label}</span>
      {children}
    </label>
  );
}

const baseInput = "w-full rounded-[11px] border-[1.5px] border-[#e4e2e6] bg-white px-3.5 py-2.5 text-[15px] text-adminink outline-none transition focus:border-brand";

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={cn(baseInput, props.className)} />
);
export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={cn(baseInput, "min-h-[110px] resize-y leading-relaxed", props.className)} />
);
export function Checkbox({ label, ...props }: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-adminink">
      <input type="checkbox" {...props} /> {label}
    </label>
  );
}

/* ---------------- Table shells ---------------- */
export function Table({ head, children }: { head: ReactNode; children: ReactNode }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>{head}</thead>
      <tbody>{children}</tbody>
    </table>
  );
}
export const Th = (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th {...props} className={cn("border-b border-black/5 bg-[#faf9fb] px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[0.04em] text-[#697086]", props.className)} />
);
export const Td = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td {...props} className={cn("border-b border-black/[0.04] px-6 py-4 align-middle text-[#3a3c42]", props.className)} />
);
