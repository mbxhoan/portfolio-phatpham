"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, PhoneCall, Send } from "lucide-react";
import { usePortfolio } from "@/lib/store";
import type { Message } from "@/types/portfolio";

export function ContactForm() {
  const { data: pf, update } = usePortfolio();
  const [note, setNote] = useState<{ msg: string; err?: boolean } | null>(null);
  const [submittedData, setSubmittedData] = useState<{ name: string; email: string } | null>(null);

  const phone = pf.person.phone || "0987 654 321";

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const formData = new FormData(f);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phoneInput = String(formData.get("phone") || "").trim();
    const companyInput = String(formData.get("company") || "").trim();
    const subject = String(formData.get("subject") || "Liên hệ từ website").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email) {
      setNote({ msg: "Vui lòng nhập họ tên và email.", err: true });
      return;
    }

    const now = Date.now();
    const newMessage: Message = {
      id: now,
      name,
      email,
      phone: phoneInput,
      company: companyInput,
      subject: subject || "Liên hệ từ website",
      preview: message || subject || "Liên hệ từ website",
      time: "Vừa xong",
      createdAt: now,
      status: "new",
    };

    // Save message directly into CMS store
    update((prev) => ({
      ...prev,
      messages: [newMessage, ...prev.messages],
    }));

    setNote(null);
    setSubmittedData({ name, email });
    f.reset();
  }

  if (submittedData) {
    return (
      <div className="flex flex-col items-center text-center rounded-xl4 border border-blue-100 bg-white p-8 sm:p-12 shadow-card animate-fade-up">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600 mb-5 shadow-sm border border-blue-100">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">Gửi thông tin liên hệ thành công!</h3>
        <p className="max-w-[480px] text-[15px] leading-relaxed text-slate-600 mb-6">
          Cảm ơn <span className="font-bold text-slate-800">{submittedData.name}</span> đã gửi yêu cầu. Chúng tôi đã ghi nhận thông tin và sẽ có nhân sự liên hệ lại với bạn trong thời gian sớm nhất.
        </p>

        <div className="w-full max-w-[460px] flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-50/80 p-5 border border-blue-100/80 mb-7 shadow-sm">
          <div className="flex items-center gap-3.5 text-left">
            <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-blue-600 text-white shadow-sm">
              <PhoneCall size={20} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Hotline / Zalo hỗ trợ</p>
              <p className="text-lg font-extrabold text-blue-900">{phone}</p>
            </div>
          </div>
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="btn btn-primary btn-sm text-sm"
          >
            Gọi ngay
          </a>
        </div>

        <button
          type="button"
          onClick={() => setSubmittedData(null)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
        >
          <Send size={15} />
          Gửi thêm thông tin khác
        </button>
      </div>
    );
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

      <div className="mb-[22px] grid gap-[18px] sm:grid-cols-2">
        <Field label="Số điện thoại">
          <input name="phone" type="tel" placeholder="0987 654 321" className={inputCls} />
        </Field>
        <Field label="Tên công ty / Doanh nghiệp">
          <input name="company" placeholder="Công ty TNHH ..." className={inputCls} />
        </Field>
      </div>

      <Field label="Nội dung">
        <input name="subject" placeholder="Mong muốn giải pháp cho ......" className={inputCls} />
      </Field>
      <Field label="Mô tả chi tiết">
        <textarea name="message" placeholder="Diện tích, quy trình hiện tại, điểm nghẽn..." className={`${inputCls} min-h-[130px] resize-y rounded-[26px] py-[18px] leading-relaxed`} />
      </Field>
      <button type="submit" className="btn btn-primary mt-2 w-full py-4 text-[16px]">
        Gửi liên hệ
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
