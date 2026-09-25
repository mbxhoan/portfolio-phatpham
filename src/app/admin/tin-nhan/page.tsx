"use client";

import { useState } from "react";
import { Eye, Trash2, Building2, Clock, User, Mail, Phone, MessageSquare, Pencil } from "lucide-react";
import { PageHead, Panel, Table, Th, Td, Badge, IconAction, AdminButton, Modal, ConfirmDialog, Field, Input, Textarea, useToast } from "@/components/admin/ui";
import { usePortfolio } from "@/lib/store";
import { formatRelativeTime, formatFullDateTime } from "@/lib/utils";
import type { Message } from "@/types/portfolio";

export default function MessagesAdmin() {
  const toast = useToast();
  const { data, update } = usePortfolio();
  const items = data.messages;
  const [active, setActive] = useState<Message | null>(null);
  const [confirm, setConfirm] = useState<number | null>(null);

  const [headerOpen, setHeaderOpen] = useState(false);
  const [headerDraft, setHeaderDraft] = useState({
    title: data.contactTitle || "Liên hệ",
    subtitle:
      data.contactSubtitle ||
      "Bạn đã sẵn sàng thiết kế kiến trúc hạ tầng kỹ thuật số tiếp theo của mình chưa? Hãy cùng nhau thu hẹp khoảng cách giữa logic phức tạp và trải nghiệm người dùng liền mạch.",
  });

  function openHeader() {
    setHeaderDraft({
      title: data.contactTitle || "Liên hệ",
      subtitle:
        data.contactSubtitle ||
        "Bạn đã sẵn sàng thiết kế kiến trúc hạ tầng kỹ thuật số tiếp theo của mình chưa? Hãy cùng nhau thu hẹp khoảng cách giữa logic phức tạp và trải nghiệm người dùng liền mạch.",
    });
    setHeaderOpen(true);
  }

  function saveHeader() {
    update((d) => ({
      ...d,
      contactTitle: headerDraft.title.trim() || "Liên hệ",
      contactSubtitle: headerDraft.subtitle.trim(),
    }));
    setHeaderOpen(false);
    toast("Đã cập nhật tiêu đề & mô tả trang Liên hệ");
  }

  function open(m: Message) {
    update((d) => ({ ...d, messages: d.messages.map((x) => (x.id === m.id ? { ...x, status: "read" } : x)) }));
    setActive({ ...m, status: "read" });
  }
  function remove() {
    if (confirm === null) return;
    const id = confirm;
    update((d) => ({ ...d, messages: d.messages.filter((m) => m.id !== id) }));
    setConfirm(null); toast("Đã xóa tin nhắn");
  }

  return (
    <div className="animate-fade-up">
      <PageHead title="Tin nhắn" subtitle="Tin nhắn liên hệ gửi từ form trên trang Liên hệ." />

      <Panel
        title={`Hộp thư đến (${items.length})`}
        action={
          <AdminButton variant="ghost" onClick={openHeader}>
            <Pencil size={15} /> Sửa tiêu đề phần
          </AdminButton>
        }
      >
        <div className="border-b border-black/5 bg-slate-50/70 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#697086]">Tiêu đề & mô tả trên trang Liên hệ:</span>
              <h4 className="font-bold text-adminink text-base mt-0.5">{data.contactTitle || "Liên hệ"}</h4>
              <p className="text-xs text-[#5f6472] mt-0.5 max-w-[650px]">
                {data.contactSubtitle || "Bạn đã sẵn sàng thiết kế kiến trúc hạ tầng kỹ thuật số tiếp theo của mình chưa?..."}
              </p>
            </div>
          </div>
        </div>

        {items.length ? (
          <Table head={<tr><Th>Người gửi</Th><Th>Thời gian</Th><Th>Trạng thái</Th><Th className="text-right">Hành động</Th></tr>}>
            {items.map((m) => (
              <tr key={m.id} className="hover:bg-[#fcfbfd]">
                <Td>
                  <div className="max-w-[440px]">
                    <div className="font-bold text-adminink">
                      {m.name}
                      {m.company && <span className="ml-1.5 rounded bg-blue-50 px-1.5 py-0.5 text-xs font-semibold text-brand">({m.company})</span>}
                      <span className="font-medium text-[#697086]"> · {m.email}</span>
                      {m.phone && <span className="font-medium text-[#697086]"> · SĐT: {m.phone}</span>}
                    </div>
                    <div className="mt-0.5 truncate text-[13px] text-[#697086]">{m.subject} — {m.preview}</div>
                  </div>
                </Td>
                <Td><span className="whitespace-nowrap font-medium text-adminink">{formatRelativeTime(m.createdAt, m.time)}</span></Td>
                <Td><Badge tone={m.status === "new" ? "new" : "read"}>{m.status === "new" ? "Chưa đọc" : "Đã đọc"}</Badge></Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    <IconAction onClick={() => open(m)}><Eye size={16} /></IconAction>
                    <IconAction tone="danger" onClick={() => setConfirm(m.id)}><Trash2 size={16} /></IconAction>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        ) : (
          <p className="p-12 text-center text-[#94a0b0]">Chưa có tin nhắn nào.</p>
        )}
      </Panel>

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title="Chi tiết tin nhắn liên hệ"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setActive(null)}>Đóng</AdminButton>
            {active && (
              <div className="flex items-center gap-2">
                {active.phone && (
                  <a
                    className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-700 transition shadow-sm"
                    href={`tel:${active.phone.replace(/\s+/g, "")}`}
                  >
                    <Phone size={15} /> Gọi điện ({active.phone})
                  </a>
                )}
                <a
                  className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-brand px-4 text-sm font-bold text-white hover:bg-brand-dark transition shadow-sm"
                  href={`mailto:${active.email}?subject=${encodeURIComponent("Re: " + active.subject)}`}
                >
                  <Mail size={15} /> Trả lời qua email
                </a>
              </div>
            )}
          </>
        }
      >
        {active && (
          <div className="flex flex-col gap-4">
            {/* Header info banner */}
            <div className="flex items-center gap-4 rounded-xl border border-black/5 bg-slate-50 p-4">
              <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-gradient-to-br from-navy to-brand font-display text-lg font-extrabold text-white shadow-sm">
                {active.name.charAt(0).toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-adminink text-base truncate">{active.name}</h4>
                  <Badge tone={active.status === "new" ? "new" : "read"}>
                    {active.status === "new" ? "Chưa đọc" : "Đã đọc"}
                  </Badge>
                </div>
                <p className="text-xs text-[#697086] mt-1 flex items-center gap-1.5">
                  <Clock size={13} className="text-[#94a0b0]" />
                  <span>Thời gian gửi: <strong className="text-adminink">{formatFullDateTime(active.createdAt, active.time)}</strong></span>
                </p>
              </div>
            </div>

            {/* Information Grid: All Contact Form Fields */}
            <div className="rounded-xl border border-black/5 bg-white p-4">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-[#697086] mb-3 flex items-center gap-1.5 border-b border-black/5 pb-2">
                <User size={14} /> Thông tin người liên hệ (Form liên hệ)
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-lg bg-blue-50 text-brand">
                    <User size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#697086] block">Họ và tên</span>
                    <span className="font-bold text-adminink">{active.name}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-lg bg-blue-50 text-brand">
                    <Mail size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#697086] block">Địa chỉ Email</span>
                    <a href={`mailto:${active.email}`} className="font-bold text-brand hover:underline">{active.email}</a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Phone size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#697086] block">Số điện thoại</span>
                    {active.phone ? (
                      <a href={`tel:${active.phone.replace(/\s+/g, "")}`} className="font-bold text-emerald-700 hover:underline">{active.phone}</a>
                    ) : (
                      <span className="text-[#94a0b0] italic font-normal">Chưa cung cấp</span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Building2 size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#697086] block">Tên công ty / Doanh nghiệp</span>
                    <span className="font-bold text-adminink">{active.company || <span className="text-[#94a0b0] italic font-normal">Chưa cung cấp</span>}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="rounded-xl border border-black/5 bg-white p-4">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-[#697086] mb-3 flex items-center gap-1.5 border-b border-black/5 pb-2">
                <MessageSquare size={14} /> Nội dung yêu cầu liên hệ
              </h5>

              <div className="mb-3">
                <span className="text-xs font-semibold text-[#697086] block mb-1">Nội dung / Chủ đề</span>
                <p className="font-bold text-adminink text-base rounded-lg bg-slate-50 px-3.5 py-2.5 border border-black/5">
                  {active.subject}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#697086] block mb-1">Mô tả chi tiết</span>
                <p className="whitespace-pre-wrap leading-relaxed text-[#3a3c42] text-[15px] rounded-lg bg-slate-50 p-3.5 border border-black/5">
                  {active.preview}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Section header modal */}
      <Modal
        open={headerOpen}
        onClose={() => setHeaderOpen(false)}
        title="Sửa tiêu đề & mô tả trang Liên hệ"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setHeaderOpen(false)}>
              Hủy
            </AdminButton>
            <AdminButton onClick={saveHeader}>Lưu thay đổi</AdminButton>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Tiêu đề trang Liên hệ">
            <Input
              value={headerDraft.title}
              onChange={(e) => setHeaderDraft({ ...headerDraft, title: e.target.value })}
              placeholder="VD: Liên hệ"
            />
          </Field>
          <Field label="Mô tả ngắn (Phụ đề trang Liên hệ)">
            <Textarea
              value={headerDraft.subtitle}
              onChange={(e) => setHeaderDraft({ ...headerDraft, subtitle: e.target.value })}
              placeholder="Mô tả ngắn hiển thị bên dưới tiêu đề..."
            />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog open={confirm !== null} label={confirm !== null ? items.find((m) => m.id === confirm)?.subject ?? "" : ""} onCancel={() => setConfirm(null)} onConfirm={remove} />
    </div>
  );
}
