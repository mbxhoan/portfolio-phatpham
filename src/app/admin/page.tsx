"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Building2, Clock, User, Mail, Phone, MessageSquare } from "lucide-react";
import { PageHead, Panel, Badge, Table, Th, Td, IconAction, Modal, AdminButton } from "@/components/admin/ui";
import { Icon } from "@/lib/icon-map";
import { usePortfolio } from "@/lib/store";
import { formatRelativeTime, formatFullDateTime } from "@/lib/utils";
import type { Message, IconName } from "@/types/portfolio";

export default function OverviewPage() {
  const { data, update } = usePortfolio();
  const messages = data.messages;
  const [active, setActive] = useState<Message | null>(null);

  const [viewsCount, setViewsCount] = useState(0);
  const [interactionsCount, setInteractionsCount] = useState(0);

  useEffect(() => {
    const updateRealCounts = () => {
      try {
        // Reset legacy high numbers in browser storage to 0
        if (!localStorage.getItem("phat_stats_reset_zero")) {
          localStorage.setItem("phat_profile_views", "1");
          localStorage.setItem("phat_profile_interactions", "0");
          localStorage.setItem("phat_stats_reset_zero", "true");
        }

        const v = localStorage.getItem("phat_profile_views");
        setViewsCount(v ? parseInt(v, 10) : 0);

        const i = localStorage.getItem("phat_profile_interactions");
        setInteractionsCount(i ? parseInt(i, 10) : 0);
      } catch {}
    };

    updateRealCounts();
    const interval = setInterval(updateRealCounts, 500);
    return () => clearInterval(interval);
  }, []);

  const totalMessages = messages.length;
  const unreadMessages = messages.filter((m) => m.status === "new").length;

  const stats: { label: string; value: string; sub: string; icon: IconName }[] = [
    {
      label: "Lượt xem hồ sơ",
      value: viewsCount.toLocaleString("vi-VN"),
      sub: "Lượt ghé thăm thực tế",
      icon: "eye",
    },
    {
      label: "Tin nhắn",
      value: `${totalMessages}`,
      sub: `${unreadMessages} Chưa đọc · cần phản hồi`,
      icon: "messageSquare",
    },
    {
      label: "Lượt tương tác",
      value: interactionsCount.toLocaleString("vi-VN"),
      sub: `${data.projects.length} dự án · ${data.fields.length} lĩnh vực`,
      icon: "trendingUp",
    },
  ];

  function open(m: Message) {
    update((d) => ({ ...d, messages: d.messages.map((x) => (x.id === m.id ? { ...x, status: "read" } : x)) }));
    setActive({ ...m, status: "read" });
  }

  return (
    <div className="animate-fade-up">
      <PageHead title="Chào buổi sáng, Phát" subtitle="Dưới đây là thông tin cập nhật cho hệ thống của bạn hôm nay." />

      <div className="mb-7 grid gap-5 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,.04)]">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-soft-2 text-brand">
              <Icon name={s.icon} className="h-[22px] w-[22px]" />
            </div>
            <div className="text-[13px] font-semibold tracking-[0.02em] text-[#697086]">{s.label}</div>
            <div className="my-1.5 font-display text-[34px] font-extrabold leading-tight text-adminink">{s.value}</div>
            <div className="text-[13px] text-[#697086]">{s.sub}</div>
          </div>
        ))}
      </div>

      <Panel
        title="Tin nhắn chưa đọc"
        action={<Link href="/admin/tin-nhan" className="text-sm font-bold text-brand">Xem tất cả →</Link>}
      >
        <Table head={<tr><Th>Nội dung</Th><Th>Thời gian</Th><Th>Trạng thái</Th><Th /></tr>}>
          {messages.slice(0, 4).map((m) => (
            <tr key={m.id} className="hover:bg-[#fcfbfd]">
              <Td>
                <div className="max-w-[420px]">
                  <div className="font-bold text-adminink">
                    {m.name}
                    {m.company && <span className="ml-1.5 rounded bg-blue-50 px-1.5 py-0.5 text-xs font-semibold text-brand">({m.company})</span>}
                  </div>
                  <div className="mt-0.5 truncate text-[13px] text-[#697086]">{m.subject} — {m.preview}</div>
                </div>
              </Td>
              <Td><span className="whitespace-nowrap font-medium text-adminink">{formatRelativeTime(m.createdAt, m.time)}</span></Td>
              <Td><Badge tone={m.status === "new" ? "new" : "read"}>{m.status === "new" ? "Chưa đọc" : "Đã đọc"}</Badge></Td>
              <Td>
                <div className="flex justify-end">
                  <IconAction onClick={() => open(m)} title="Xem"><Eye size={16} /></IconAction>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
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
    </div>
  );
}
