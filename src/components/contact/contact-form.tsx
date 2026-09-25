"use client";

import { useState, type FormEvent } from "react";
import { usePortfolio } from "@/lib/store";

export function ContactForm() {
  const { data: pf } = usePortfolio();
  const [note, setNote] = useState<{ msg: string; err?: boolean } | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const data = new FormData(f);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    if (!name || !email) {
      setNote({ msg: "Vui lòng nhập họ tên và email.", err: true });
      return;
    }
    const subject = String(data.get("subject") || "Liên hệ từ website");
    const body = `Họ tên: ${name}\nEmail: ${email}\n\n${data.get("message") || ""}`;
    window.location.href = `mailto:${pf.person.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setNote({ msg: "Đang mở ứng dụng email của bạn..." });
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-xl4 border border-[#c3c6d7]/25 bg-white p-7 shadow-soft sm:p-12"
    >
      <div className="mb-[22px] grid gap-[18px] sm:grid-cols-2">
        <Field label="Họ và tên" required>
          <input name="name" required placeholder="Nguyễn Văn A" className={inputCls} />
        </Field>
        <Field label="Email" required>
          <input name="email" type="email" required placeholder="ban@congty.com" className={inputCls} />
        </Field>
      </div>
      <Field label="Nội dung">
        <input name="subject" placeholder="Mong muốn giải pháp cho ......" className={inputCls} />
      </Field>
      <Field label="Mô tả chi tiết">
        <textarea name="message" placeholder="Diện tích, quy trình hiện tại, điểm nghẽn..." className={`${inputCls} min-h-[130px] resize-y rounded-[26px] py-[18px] leading-relaxed`} />
      </Field>
      <button type="submit" className="btn btn-primary mt-2 w-full py-4 text-[16px]">
        Gửi
      </button>
      {note && (
        <p className={`mt-3.5 text-sm ${note.err ? "text-[#c0392b]" : "text-brand"}`}>{note.msg}</p>
      )}
    </form>
  );
}

const inputCls =
  "h-[55px] w-full rounded-pill border-[1.5px] border-transparent bg-[#E6E8EA] px-[22px] text-[16px] text-ink outline-none transition focus:border-brand focus:bg-white placeholder:text-[#6B7280]";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="mb-[22px] block">
      <span className="mb-2.5 block text-sm font-bold text-ink">
        {label} {required && <span className="text-brand">*</span>}
      </span>
      {children}
    </label>
  );
}
