"use client";

import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { PageHead, Panel, Table, Th, Td, Badge, IconAction, AdminButton, Modal, ConfirmDialog, useToast } from "@/components/admin/ui";
import { usePortfolio } from "@/lib/store";
import type { Message } from "@/types/portfolio";

export default function MessagesAdmin() {
  const toast = useToast();
  const { data, update } = usePortfolio();
  const items = data.messages;
  const [active, setActive] = useState<Message | null>(null);
  const [confirm, setConfirm] = useState<number | null>(null);

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

      <Panel title={`Hộp thư đến (${items.length})`}>
        {items.length ? (
          <Table head={<tr><Th>Người gửi</Th><Th>Thời gian</Th><Th>Trạng thái</Th><Th className="text-right">Hành động</Th></tr>}>
            {items.map((m) => (
              <tr key={m.id} className="hover:bg-[#fcfbfd]">
                <Td>
                  <div className="max-w-[420px]">
                    <div className="font-bold text-adminink">{m.name} · <span className="font-medium text-[#697086]">{m.email}</span></div>
                    <div className="mt-0.5 truncate text-[13px] text-[#697086]">{m.subject} — {m.preview}</div>
                  </div>
                </Td>
                <Td>{m.time}</Td>
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

      <ConfirmDialog open={confirm !== null} label={confirm !== null ? items.find((m) => m.id === confirm)?.subject ?? "" : ""} onCancel={() => setConfirm(null)} onConfirm={remove} />
    </div>
  );
}
