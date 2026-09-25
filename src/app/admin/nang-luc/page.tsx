"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { PageHead, Panel, Table, Th, Td, IconAction, AddButton, AdminButton, Modal, ConfirmDialog, Field, Input, Textarea, useToast } from "@/components/admin/ui";
import { usePortfolio } from "@/lib/store";
import { ImageUpload } from "@/components/admin/image-upload";
import { iconMap } from "@/lib/icon-map";
import type { IconName } from "@/types/portfolio";

type Kind = "capabilities" | "tools";

export default function CapabilitiesAdmin() {
  const toast = useToast();
  const { data, update } = usePortfolio();
  const [edit, setEdit] = useState<{ kind: Kind; index: number } | null>(null); // index -1 = new
  const [draft, setDraft] = useState<{ name: string; body: string; icon: IconName; image?: string }>({ name: "", body: "", icon: "workflow", image: undefined });
  const [confirm, setConfirm] = useState<{ kind: Kind; index: number } | null>(null);

  function openNew(kind: Kind) { setDraft({ name: "", body: "", icon: "workflow", image: undefined }); setEdit({ kind, index: -1 }); }
  function openEdit(kind: Kind, index: number) { const it = data[kind][index]; setDraft({ name: it.name, body: it.body, icon: it.icon || "workflow", image: it.image }); setEdit({ kind, index }); }

  function save() {
    if (!edit || !draft.name.trim()) return;
    const { kind, index } = edit;
    update((d) => {
      const list = [...d[kind]];
      if (index === -1) list.push({ name: draft.name, body: draft.body, icon: draft.icon, image: draft.image });
      else list[index] = { ...list[index], name: draft.name, body: draft.body, icon: draft.icon, image: draft.image };
      return { ...d, [kind]: list };
    });
    toast(index === -1 ? "Đã thêm mới" : "Đã cập nhật");
    setEdit(null);
  }
  function remove() {
    if (!confirm) return;
    const { kind, index } = confirm;
    update((d) => ({ ...d, [kind]: d[kind].filter((_, i) => i !== index) }));
    setConfirm(null); toast("Đã xóa");
  }

  const section = (kind: Kind, label: string) => (
    <Panel title={label} action={<AddButton onClick={() => openNew(kind)} />}>
      <Table head={<tr><Th>Nội dung</Th><Th className="text-right">Hành động</Th></tr>}>
        {data[kind].map((it, i) => (
          <tr key={it.name + i} className="hover:bg-[#fcfbfd]">
            <Td>
              <div className="max-w-[560px]">
                <div className="font-bold text-adminink">{it.name}</div>
                <div className="mt-0.5 truncate text-[13px] text-[#697086]">{it.body}</div>
              </div>
            </Td>
            <Td>
              <div className="flex justify-end gap-2">
                <IconAction onClick={() => openEdit(kind, i)}><Pencil size={16} /></IconAction>
                <IconAction tone="danger" onClick={() => setConfirm({ kind, index: i })}><Trash2 size={16} /></IconAction>
              </div>
            </Td>
          </tr>
        ))}
      </Table>
    </Panel>
  );

  return (
    <div className="animate-fade-up">
      <PageHead title="Năng lực cá nhân" subtitle="Quản lý danh sách năng lực chuyên môn và công cụ sử dụng." />
      {section("capabilities", "Năng lực chuyên môn")}
      {section("tools", "Công cụ")}

      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.index === -1 ? "Thêm mới" : "Chỉnh sửa"}
        footer={<><AdminButton variant="ghost" onClick={() => setEdit(null)}>Hủy</AdminButton><AdminButton onClick={save}>{edit?.index === -1 ? "Thêm" : "Lưu"}</AdminButton></>}
      >
        <Field label="Tên"><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="VD: BPMN" /></Field>
        <Field label="Mô tả"><Textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} placeholder="Mô tả ngắn gọn..." /></Field>
        <Field label="Icon hệ thống (Lucide)">
          <select
            value={draft.icon}
            onChange={(e) => setDraft({ ...draft, icon: e.target.value as IconName })}
            className="w-full rounded-[11px] border-[1.5px] border-[#e4e2e6] bg-white px-3.5 py-2.5 text-[15px] text-adminink outline-none transition focus:border-brand"
          >
            {Object.keys(iconMap).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Hình ảnh tùy chỉnh (Ghi đè Icon hệ thống)">
          <ImageUpload
            value={draft.image}
            onChange={(v) => setDraft({ ...draft, image: v })}
            aspect="aspect-square"
            widthClass="w-16"
            rounded="rounded-xl"
            maxDim={510}
          />
        </Field>
      </Modal>

      <ConfirmDialog open={!!confirm} label={confirm ? data[confirm.kind][confirm.index]?.name ?? "" : ""} onCancel={() => setConfirm(null)} onConfirm={remove} />
    </div>
  );
}
