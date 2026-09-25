"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { PageHead, Panel, Badge, Table, Th, Td, IconAction, Modal, AdminButton } from "@/components/admin/ui";
import { Icon } from "@/lib/icon-map";
import { usePortfolio } from "@/lib/store";
import type { Message } from "@/types/portfolio";

export default function OverviewPage() {
  const { data, update } = usePortfolio();
  const messages = data.messages;
  const [active, setActive] = useState<Message | null>(null);

  function open(m: Message) {
    update((d) => ({ ...d, messages: d.messages.map((x) => (x.id === m.id ? { ...x, status: "read" } : x)) }));
    setActive({ ...m, status: "read" });
  }

  return (
    <div className="animate-fade-up">
      <PageHead title="Chào buổi sáng, Phát" subtitle="Dưới đây là thông tin cập nhật cho hệ thống của bạn hôm nay." />

      <div className="mb-7 grid gap-5 md:grid-cols-3">
        {data.stats.map((s) => (
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
                  <div className="font-bold text-adminink">{m.name}</div>
                  <div className="mt-0.5 truncate text-[13px] text-[#697086]">{m.subject} — {m.preview}</div>
                </div>
              </Td>
              <Td>{m.time}</Td>
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
        title="Chi tiết tin nhắn"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setActive(null)}>Đóng</AdminButton>
            {active && (
              <a className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-brand px-4 text-sm font-bold text-white" href={`mailto:${active.email}?subject=${encodeURIComponent("Re: " + active.subject)}`}>
                Trả lời qua email
              </a>
            )}
          </>
        }
      >
        {active && (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-[46px] w-[46px] place-items-center rounded-full bg-gradient-to-br from-navy to-brand font-display font-extrabold text-white">{active.name.charAt(0)}</span>
              <div>
                <div className="font-bold text-adminink">{active.name}</div>
                <div className="text-[13px] text-[#697086]">{active.email} · {active.time}</div>
              </div>
            </div>
            <p className="mb-1 text-[13px] font-bold text-adminink">Chủ đề</p>
            <p className="mb-4 font-bold text-adminink">{active.subject}</p>
            <p className="mb-1 text-[13px] font-bold text-adminink">Nội dung</p>
            <p className="leading-relaxed text-[#3a3c42]">{active.preview}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
