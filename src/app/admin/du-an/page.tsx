"use client";

import { useState } from "react";
import { Pencil, Trash2, FileText } from "lucide-react";
import { PageHead, Panel, Table, Th, Td, Badge, IconAction, AddButton, AdminButton, Modal, ConfirmDialog, Field, Input, Textarea, useToast } from "@/components/admin/ui";
import { DocumentProjectEditor } from "@/components/admin/document-project-editor";
import { usePortfolio } from "@/lib/store";
import type { Project } from "@/types/portfolio";

export default function ProjectsAdmin() {
  const toast = useToast();
  const { data, update } = usePortfolio();
  const items = data.projects;

  // Editing state: null (list mode), -1 (new project), or index (editing existing project)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

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

  function handleSaveProject(saved: Project) {
    if (editingIndex === -1) {
      update((d) => ({ ...d, projects: [saved, ...d.projects] }));
      toast("Đã tạo và đăng dự án mới");
    } else if (editingIndex !== null) {
      const idx = editingIndex;
      update((d) => ({
        ...d,
        projects: d.projects.map((item, i) => (i === idx ? saved : item)),
      }));
      toast("Đã lưu các thay đổi của dự án");
    }
    setEditingIndex(null);
  }

  function remove(i: number) {
    update((d) => ({ ...d, projects: d.projects.filter((_, idx) => idx !== i) }));
    setConfirmDelete(null);
    toast("Đã xóa dự án");
  }

  // If in Document Editor mode, render full-page workspace editor
  if (editingIndex !== null) {
    const currentProject = editingIndex >= 0 ? items[editingIndex] : {};
    return (
      <DocumentProjectEditor
        project={currentProject}
        onSave={handleSaveProject}
        onCancel={() => setEditingIndex(null)}
      />
    );
  }

  return (
    <div className="animate-fade-up space-y-6">
      <PageHead
        title="Quản lý & Soạn thảo Dự án"
        subtitle="Hệ thống Workspace Editor — Viết, biên tập và xuất bản bài viết tài liệu dự án trực tiếp trên Web."
      />

      <Panel
        title={`Danh sách dự án (${items.length})`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <AdminButton variant="ghost" onClick={openHeader}>
              <Pencil size={15} /> Sửa tiêu đề phần
            </AdminButton>
            <AddButton onClick={() => setEditingIndex(-1)}>
              <FileText size={16} className="mr-1" /> Thêm dự án mới
            </AddButton>
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

        <Table head={<tr><Th>Dự án & Tài liệu</Th><Th>Lĩnh vực</Th><Th>Năm</Th><Th>Trạng thái</Th><Th className="text-right">Thao tác</Th></tr>}>
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
                  <AdminButton variant="ghost" onClick={() => setEditingIndex(i)} className="!py-1.5 !px-3 text-xs">
                    <Pencil size={14} className="mr-1" /> Soạn thảo
                  </AdminButton>
                  <IconAction tone="danger" onClick={() => setConfirmDelete(i)}><Trash2 size={16} /></IconAction>
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

      <ConfirmDialog
        open={confirmDelete !== null}
        label={confirmDelete !== null ? items[confirmDelete]?.title ?? "" : ""}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete !== null && remove(confirmDelete)}
      />
    </div>
  );
}
