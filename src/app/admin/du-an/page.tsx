"use client";

import { useState } from "react";
import { Pencil, Trash2, FolderKanban } from "lucide-react";
import { PageHead, Panel, Table, Th, Td, Badge, IconAction, AddButton, AdminButton, Modal, ConfirmDialog, Field, Input, Textarea, Checkbox, useToast } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { usePortfolio } from "@/lib/store";
import type { Project } from "@/types/portfolio";

type Draft = Pick<Project, "title" | "category" | "year" | "role" | "logo" | "summary" | "featured" | "image">;
const empty: Draft = { title: "", category: "WMS", year: "2025", role: "Business Analyst", logo: "", summary: "", featured: true, image: undefined };

export default function ProjectsAdmin() {
  const toast = useToast();
  const { data, update } = usePortfolio();
  const items = data.projects;
  const [editing, setEditing] = useState<number | null>(null); // index or -1 for new
  const [draft, setDraft] = useState<Draft>(empty);
  const [confirm, setConfirm] = useState<number | null>(null);

  const [headerOpen, setHeaderOpen] = useState(false);
  const [headerDraft, setHeaderDraft] = useState({
    title: data.projectsPageTitle || "Danh sách dự án",
    subtitle: data.projectsPageSubtitle || "Tuyển tập các hệ thống tôi đã phân tích và triển khai — từ quản lý kho, ERP đến các giải pháp IoT.",
  });

  function openHeader() {
    setHeaderDraft({
      title: data.projectsPageTitle || "Danh sách dự án",
      subtitle: data.projectsPageSubtitle || "Tuyển tập các hệ thống tôi đã phân tích và triển khai — từ quản lý kho, ERP đến các giải pháp IoT.",
    });
    setHeaderOpen(true);
  }

  function saveHeader() {
    update((d) => ({
      ...d,
      projectsPageTitle: headerDraft.title.trim() || "Danh sách dự án",
      projectsPageSubtitle: headerDraft.subtitle.trim(),
    }));
    setHeaderOpen(false);
    toast("Đã cập nhật tiêu đề & mô tả trang Dự án");
  }

  function openNew() { setDraft(empty); setEditing(-1); }
  function openEdit(i: number) { const p = items[i]; setDraft({ title: p.title, category: p.category, year: p.year, role: p.role, logo: p.logo, summary: p.summary, featured: p.featured, image: p.image }); setEditing(i); }

  function save() {
    if (!draft.title.trim()) return;
    const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (editing === -1) {
      const np: Project = { ...draft, logo: draft.logo || draft.title.slice(0, 2).toUpperCase(), slug: slugify(draft.title) || "du-an", problem: "", solution: "", impact: [], tech: [] };
      update((d) => ({ ...d, projects: [np, ...d.projects] }));
      toast("Đã thêm dự án mới");
    } else if (editing !== null) {
      const i = editing;
      update((d) => ({ ...d, projects: d.projects.map((it, idx) => (idx === i ? { ...it, ...draft, logo: draft.logo || it.logo } : it)) }));
      toast("Đã cập nhật dự án");
    }
    setEditing(null);
  }

  function remove(i: number) {
    update((d) => ({ ...d, projects: d.projects.filter((_, idx) => idx !== i) }));
    setConfirm(null); toast("Đã xóa dự án");
  }

  return (
    <div className="animate-fade-up">
      <PageHead title="Dự án" subtitle="Thêm, chỉnh sửa và quản lý các dự án hiển thị trên website." />

      <Panel
        title={`Danh sách dự án (${items.length})`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <AdminButton variant="ghost" onClick={openHeader}>
              <Pencil size={15} /> Sửa tiêu đề phần
            </AdminButton>
            <AddButton onClick={openNew}>Thêm dự án</AddButton>
          </div>
        }
      >
        <div className="border-b border-black/5 bg-slate-50/70 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#697086]">Tiêu đề & mô tả trên trang Dự án:</span>
              <h4 className="font-bold text-adminink text-base mt-0.5">{data.projectsPageTitle || "Danh sách dự án"}</h4>
              <p className="text-xs text-[#5f6472] mt-0.5 max-w-[650px]">{data.projectsPageSubtitle || "Tuyển tập các hệ thống tôi đã phân tích và triển khai..."}</p>
            </div>
          </div>
        </div>
        <Table head={<tr><Th>Dự án</Th><Th>Lĩnh vực</Th><Th>Năm</Th><Th>Trạng thái</Th><Th className="text-right">Hành động</Th></tr>}>
          {items.map((p, i) => (
            <tr key={p.slug + i} className="hover:bg-[#fcfbfd]">
              <Td>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 flex-none place-items-center overflow-hidden rounded-[10px] bg-gradient-to-br from-navy to-brand text-xs font-extrabold text-white">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      p.logo
                    )}
                  </span>
                  <div className="max-w-[380px]">
                    <div className="font-bold text-adminink">{p.title}</div>
                    <div className="mt-0.5 truncate text-[13px] text-[#697086]">{p.summary}</div>
                  </div>
                </div>
              </Td>
              <Td><Badge tone="read">{p.category}</Badge></Td>
              <Td>{p.year}</Td>
              <Td><Badge tone={p.featured ? "ok" : "read"}>{p.featured ? "Tiêu biểu" : "Ẩn"}</Badge></Td>
              <Td>
                <div className="flex justify-end gap-2">
                  <IconAction onClick={() => openEdit(i)}><Pencil size={16} /></IconAction>
                  <IconAction tone="danger" onClick={() => setConfirm(i)}><Trash2 size={16} /></IconAction>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Panel>

      {/* section header modal */}
      <Modal
        open={headerOpen}
        onClose={() => setHeaderOpen(false)}
        title="Sửa tiêu đề & mô tả trang Dự án"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setHeaderOpen(false)}>Hủy</AdminButton>
            <AdminButton onClick={saveHeader}>Lưu thay đổi</AdminButton>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Tiêu đề trang Dự án">
            <Input
              value={headerDraft.title}
              onChange={(e) => setHeaderDraft({ ...headerDraft, title: e.target.value })}
              placeholder="VD: Danh sách dự án"
            />
          </Field>
          <Field label="Mô tả ngắn (Phụ đề trang Dự án)">
            <Textarea
              value={headerDraft.subtitle}
              onChange={(e) => setHeaderDraft({ ...headerDraft, subtitle: e.target.value })}
              placeholder="Mô tả ngắn hiển thị bên dưới tiêu đề..."
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === -1 ? "Thêm dự án" : "Chỉnh sửa dự án"}
        footer={<><AdminButton variant="ghost" onClick={() => setEditing(null)}>Hủy</AdminButton><AdminButton onClick={save}>{editing === -1 ? "Thêm" : "Lưu"}</AdminButton></>}
      >
        <Field label="Tên dự án"><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Lĩnh vực"><Input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></Field>
          <Field label="Năm"><Input value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Logo (chữ viết tắt)"><Input maxLength={4} value={draft.logo} onChange={(e) => setDraft({ ...draft, logo: e.target.value })} /></Field>
          <Field label="Vai trò"><Input value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} /></Field>
        </div>
        <Field label="Tóm tắt"><Textarea value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} /></Field>
        <Field label="Ảnh dự án (thay cho logo chữ)">
          <ImageUpload
            value={draft.image}
            onChange={(image) => setDraft({ ...draft, image })}
            placeholder={<FolderKanban size={20} />}
            aspect="aspect-[4/3]"
            widthClass="w-32"
            maxDim={900}
          />
        </Field>
        <Checkbox label="Hiển thị ở mục “Dự án tiêu biểu”" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} />
      </Modal>

      <ConfirmDialog open={confirm !== null} label={confirm !== null ? items[confirm]?.title ?? "" : ""} onCancel={() => setConfirm(null)} onConfirm={() => confirm !== null && remove(confirm)} />
    </div>
  );
}
