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

  const [headerModal, setHeaderModal] = useState<"capabilities" | "tools" | null>(null);
  const [headerDraft, setHeaderDraft] = useState({ title: "", subtitle: "" });

  function openHeaderModal(type: "capabilities" | "tools") {
    if (type === "capabilities") {
      setHeaderDraft({
        title: data.capabilitiesSectionTitle || "Năng lực chuyên môn",
        subtitle: data.capabilitiesSectionSubtitle || "Bộ kỹ năng cốt lõi giúp tôi phân tích, đặc tả và đồng hành cùng đội phát triển từ ý tưởng đến vận hành.",
      });
    } else {
      setHeaderDraft({
        title: data.toolsSectionTitle || "Công cụ",
        subtitle: data.toolsSectionSubtitle || "Những công cụ tôi sử dụng hằng ngày để mô hình hóa, quản lý và bàn giao công việc.",
      });
    }
    setHeaderModal(type);
  }

  function saveHeader() {
    if (!headerModal) return;
    update((d) => {
      if (headerModal === "capabilities") {
        return {
          ...d,
          capabilitiesSectionTitle: headerDraft.title.trim() || "Năng lực chuyên môn",
          capabilitiesSectionSubtitle: headerDraft.subtitle.trim(),
        };
      } else {
        return {
          ...d,
          toolsSectionTitle: headerDraft.title.trim() || "Công cụ",
          toolsSectionSubtitle: headerDraft.subtitle.trim(),
        };
      }
    });
    toast("Đã cập nhật tiêu đề & mô tả");
    setHeaderModal(null);
  }

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

  const section = (kind: Kind, defaultLabel: string) => {
    const isCap = kind === "capabilities";
    const title = isCap ? (data.capabilitiesSectionTitle || "Năng lực chuyên môn") : (data.toolsSectionTitle || "Công cụ");
    const sub = isCap ? (data.capabilitiesSectionSubtitle || "Bộ kỹ năng cốt lõi giúp tôi...") : (data.toolsSectionSubtitle || "Những công cụ tôi sử dụng...");

    return (
      <Panel
        title={`${title} (${data[kind].length})`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <AdminButton variant="ghost" onClick={() => openHeaderModal(kind)}>
              <Pencil size={15} /> Sửa tiêu đề mục
            </AdminButton>
            <AddButton onClick={() => openNew(kind)}>Thêm {defaultLabel.toLowerCase()}</AddButton>
          </div>
        }
      >
        <div className="border-b border-black/5 bg-slate-50/70 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#697086]">Tiêu đề & mô tả mục {defaultLabel}:</span>
              <h4 className="font-bold text-adminink text-base mt-0.5">{title}</h4>
              <p className="text-xs text-[#5f6472] mt-0.5 max-w-[650px]">{sub}</p>
            </div>
          </div>
        </div>

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
  };

  return (
    <div className="animate-fade-up">
      <PageHead title="Năng lực" subtitle="Quản lý danh sách năng lực chuyên môn và công cụ sử dụng." />

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

      <Modal
        open={headerModal !== null}
        onClose={() => setHeaderModal(null)}
        title={
          headerModal === "capabilities"
            ? "Sửa tiêu đề & mô tả mục Năng lực chuyên môn"
            : "Sửa tiêu đề & mô tả mục Công cụ"
        }
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setHeaderModal(null)}>
              Hủy
            </AdminButton>
            <AdminButton onClick={saveHeader}>Lưu thay đổi</AdminButton>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Tiêu đề">
            <Input
              value={headerDraft.title}
              onChange={(e) => setHeaderDraft({ ...headerDraft, title: e.target.value })}
              placeholder="VD: Năng lực cá nhân"
            />
          </Field>
          <Field label="Mô tả ngắn">
            <Textarea
              value={headerDraft.subtitle}
              onChange={(e) => setHeaderDraft({ ...headerDraft, subtitle: e.target.value })}
              placeholder="Mô tả ngắn hiển thị bên dưới tiêu đề..."
            />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirm} label={confirm ? data[confirm.kind][confirm.index]?.name ?? "" : ""} onCancel={() => setConfirm(null)} onConfirm={remove} />
    </div>
  );
}
