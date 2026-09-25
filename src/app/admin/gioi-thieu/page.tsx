"use client";

import { useState } from "react";
import { Pencil, Trash2, UserRound, ImagePlus, Zap, GripVertical } from "lucide-react";
import { PageHead, Panel, Table, Th, Td, Badge, IconAction, AddButton, AdminButton, Modal, ConfirmDialog, Field, Input, Textarea, Checkbox, useToast } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { usePortfolio } from "@/lib/store";
import { SOCIAL_PLATFORMS } from "@/lib/socials";
import { iconMap, Icon } from "@/lib/icon-map";
import type { IconName } from "@/types/portfolio";

const COLOR_PRESETS = [
  { label: "Xanh dương", hex: "#004AC6" },
  { label: "Xanh Navy", hex: "#000B60" },
  { label: "Xanh lá", hex: "#059669" },
  { label: "Tím", hex: "#7C3AED" },
  { label: "Đỏ hồng", hex: "#E11D48" },
  { label: "Cam", hex: "#D97706" },
  { label: "Xám Slate", hex: "#334155" },
];

export default function AboutAdmin() {
  const toast = useToast();
  const { data, update } = usePortfolio();
  const p = data.person;

  const [infoOpen, setInfoOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"info" | "cta">("info");
  const [infoDraft, setInfoDraft] = useState({
    name: p.name,
    role: p.role,
    tagline: p.tagline,
    email: p.email || "",
    address: p.address || "",
    phone: p.phone || "",
    photo: p.photo,
    yearsValue: p.yearsBadge?.value || "",
    yearsLabel: p.yearsBadge?.label || "",
    quickLinks: {
      capability: {
        visible: p.quickLinks?.capability?.visible ?? (p.showCapabilityLink !== false),
        label: p.quickLinks?.capability?.label || "Năng lực chuyên môn",
        color: p.quickLinks?.capability?.color || "#004AC6",
      },
      projects: {
        visible: p.quickLinks?.projects?.visible ?? (p.showProjectsLink === true),
        label: p.quickLinks?.projects?.label || "Dự án thực hiện",
        color: p.quickLinks?.projects?.color || "#000B60",
      },
      contact: {
        visible: p.quickLinks?.contact?.visible ?? (p.showContactLink !== false),
        label: p.quickLinks?.contact?.label || "Liên hệ ngay",
        color: p.quickLinks?.contact?.color || "#475569",
      },
    },
  });

  const [fieldEdit, setFieldEdit] = useState<number | null>(null); // -1 new
  const [fieldDraft, setFieldDraft] = useState<{ name: string; body: string; visible: boolean }>({ name: "", body: "", visible: true });
  const [confirmField, setConfirmField] = useState<number | null>(null);

  const [fieldsHeaderOpen, setFieldsHeaderOpen] = useState(false);
  const [fieldsHeaderDraft, setFieldsHeaderDraft] = useState({
    title: data.fieldsTitle || "Lĩnh vực hoạt động",
    subtitle: data.fieldsSubtitle || "Những bài toán vận hành mà tôi đã đồng hành cùng doanh nghiệp giải quyết bằng phần mềm.",
  });

  function openFieldsHeader() {
    setFieldsHeaderDraft({
      title: data.fieldsTitle || "Lĩnh vực hoạt động",
      subtitle: data.fieldsSubtitle || "Những bài toán vận hành mà tôi đã đồng hành cùng doanh nghiệp giải quyết bằng phần mềm.",
    });
    setFieldsHeaderOpen(true);
  }

  function saveFieldsHeader() {
    update((d) => ({
      ...d,
      fieldsTitle: fieldsHeaderDraft.title,
      fieldsSubtitle: fieldsHeaderDraft.subtitle,
    }));
    setFieldsHeaderOpen(false);
    toast("Đã cập nhật tiêu đề & mô tả Lĩnh vực hoạt động");
  }

  const [projectsHeaderOpen, setProjectsHeaderOpen] = useState(false);
  const [projectsHeaderDraft, setProjectsHeaderDraft] = useState({
    title: data.projectsTitle || "Dự án tiêu biểu",
    subtitle: data.projectsSubtitle || "Các sản phẩm & hệ thống thực tế tôi đã tham gia phân tích, thiết kế và triển khai cho doanh nghiệp.",
  });

  function openProjectsHeader() {
    setProjectsHeaderDraft({
      title: data.projectsTitle || "Dự án tiêu biểu",
      subtitle: data.projectsSubtitle || "Các sản phẩm & hệ thống thực tế tôi đã tham gia phân tích, thiết kế và triển khai cho doanh nghiệp.",
    });
    setProjectsHeaderOpen(true);
  }

  function saveProjectsHeader() {
    update((d) => ({
      ...d,
      projectsTitle: projectsHeaderDraft.title,
      projectsSubtitle: projectsHeaderDraft.subtitle,
    }));
    setProjectsHeaderOpen(false);
    toast("Đã cập nhật tiêu đề & mô tả Dự án tiêu biểu");
  }

  function toggleProjectFeatured(slug: string, featured: boolean) {
    update((d) => ({
      ...d,
      projects: d.projects.map((p) => (p.slug === slug ? { ...p, featured } : p)),
    }));
    toast(featured ? "Đã bật hiển thị ở mục Dự án tiêu biểu" : "Đã bỏ khỏi mục Dự án tiêu biểu");
  }

  const [selectProjectsOpen, setSelectProjectsOpen] = useState(false);
  const [selectedSlugsDraft, setSelectedSlugsDraft] = useState<string[]>([]);

  function openSelectProjects() {
    setSelectedSlugsDraft(data.projects.filter((p) => p.featured).map((p) => p.slug));
    setSelectProjectsOpen(true);
  }

  function saveSelectProjects() {
    update((d) => ({
      ...d,
      projects: d.projects.map((p) => ({
        ...p,
        featured: selectedSlugsDraft.includes(p.slug),
      })),
    }));
    setSelectProjectsOpen(false);
    toast("Đã cập nhật danh sách dự án tiêu biểu");
  }

  function toggleSlugInDraft(slug: string, checked: boolean) {
    if (checked) {
      setSelectedSlugsDraft((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
    } else {
      setSelectedSlugsDraft((prev) => prev.filter((s) => s !== slug));
    }
  }

  const [processHeaderOpen, setProcessHeaderOpen] = useState(false);
  const [processHeaderDraft, setProcessHeaderDraft] = useState({
    title: data.processTitle || "Quy trình Hợp tác",
    subtitle: data.processSubtitle || "Chúng tôi áp dụng mô hình vận hành chuyên nghiệp, đảm bảo tính minh bạch và hiệu quả cao nhất cho mọi sản phẩm công nghệ.",
  });

  function openProcessHeader() {
    setProcessHeaderDraft({
      title: data.processTitle || "Quy trình Hợp tác",
      subtitle: data.processSubtitle || "Chúng tôi áp dụng mô hình vận hành chuyên nghiệp, đảm bảo tính minh bạch và hiệu quả cao nhất cho mọi sản phẩm công nghệ.",
    });
    setProcessHeaderOpen(true);
  }

  function saveProcessHeader() {
    update((d) => ({
      ...d,
      processTitle: processHeaderDraft.title,
      processSubtitle: processHeaderDraft.subtitle,
    }));
    setProcessHeaderOpen(false);
    toast("Đã cập nhật tiêu đề & mô tả Quy trình hợp tác");
  }

  const [processEdit, setProcessEdit] = useState<number | null>(null); // -1 new
  const [processDraft, setProcessDraft] = useState<{ title: string; body: string; icon: IconName; image?: string }>({ title: "", body: "", icon: "search", image: "" });
  const [confirmProcess, setConfirmProcess] = useState<number | null>(null);
  const [draggedProcessIndex, setDraggedProcessIndex] = useState<number | null>(null);

  function openNewProcess() {
    setProcessDraft({ title: "", body: "", icon: "search", image: "" });
    setProcessEdit(-1);
  }
  function openEditProcess(i: number) {
    const p = data.process[i];
    setProcessDraft({ title: p.title, body: p.body, icon: p.icon || "search", image: p.image || "" });
    setProcessEdit(i);
  }
  function saveProcess() {
    if (!processDraft.title.trim()) return;
    const idx = processEdit;
    update((d) => {
      const list = [...d.process];
      const item = { title: processDraft.title, body: processDraft.body, icon: processDraft.icon, image: processDraft.image || undefined };
      if (idx === -1) list.push(item);
      else if (idx !== null) list[idx] = item;
      return { ...d, process: list };
    });
    toast(idx === -1 ? "Đã thêm bước quy trình" : "Đã cập nhật bước quy trình");
    setProcessEdit(null);
  }
  function removeProcess() {
    if (confirmProcess === null) return;
    const i = confirmProcess;
    update((d) => ({ ...d, process: d.process.filter((_, idx) => idx !== i) }));
    setConfirmProcess(null);
    toast("Đã xóa bước quy trình");
  }
  function moveProcess(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= data.process.length) return;
    update((d) => {
      const list = [...d.process];
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      return { ...d, process: list };
    });
    toast("Đã cập nhật thứ tự bước quy trình");
  }

  function openInfo() {
    const ql = p.quickLinks || {};
    setInfoDraft({
      name: p.name,
      role: p.role,
      tagline: p.tagline,
      email: p.email || "",
      address: p.address || "",
      phone: p.phone || "",
      photo: p.photo,
      yearsValue: p.yearsBadge?.value || "",
      yearsLabel: p.yearsBadge?.label || "",
      quickLinks: {
        capability: {
          visible: ql.capability?.visible ?? (p.showCapabilityLink !== false),
          label: ql.capability?.label || "Năng lực chuyên môn",
          color: ql.capability?.color || "#004AC6",
        },
        projects: {
          visible: ql.projects?.visible ?? (p.showProjectsLink === true),
          label: ql.projects?.label || "Dự án thực hiện",
          color: ql.projects?.color || "#000B60",
        },
        contact: {
          visible: ql.contact?.visible ?? (p.showContactLink !== false),
          label: ql.contact?.label || "Liên hệ ngay",
          color: ql.contact?.color || "#475569",
        },
      },
    });
    setInfoOpen(true);
  }
  function saveInfo() {
    update((d) => ({
      ...d,
      person: {
        ...d.person,
        name: infoDraft.name,
        role: infoDraft.role,
        tagline: infoDraft.tagline,
        email: infoDraft.email,
        address: infoDraft.address,
        phone: infoDraft.phone,
        photo: infoDraft.photo,
        yearsBadge: { value: infoDraft.yearsValue, label: infoDraft.yearsLabel },
        showCapabilityLink: infoDraft.quickLinks.capability.visible,
        showProjectsLink: infoDraft.quickLinks.projects.visible,
        showContactLink: infoDraft.quickLinks.contact.visible,
        quickLinks: infoDraft.quickLinks,
      },
    }));
    setInfoOpen(false);
    toast("Đã lưu thông tin cá nhân");
  }

  function openNewField() { setFieldDraft({ name: "", body: "", visible: true }); setFieldEdit(-1); }
  function openEditField(i: number) { setFieldDraft({ name: data.fields[i].name, body: data.fields[i].body || "", visible: data.fields[i].visible }); setFieldEdit(i); }
  function saveField() {
    if (!fieldDraft.name.trim()) return;
    const idx = fieldEdit;
    update((d) => {
      const fields = [...d.fields];
      if (idx === -1) fields.push({ name: fieldDraft.name, body: fieldDraft.body, icon: "workflow", visible: fieldDraft.visible });
      else if (idx !== null) fields[idx] = { ...fields[idx], name: fieldDraft.name, body: fieldDraft.body, visible: fieldDraft.visible };
      return { ...d, fields };
    });
    toast(idx === -1 ? "Đã thêm lĩnh vực" : "Đã cập nhật lĩnh vực");
    setFieldEdit(null);
  }
  function removeField() {
    if (confirmField === null) return;
    const i = confirmField;
    update((d) => ({ ...d, fields: d.fields.filter((_, idx) => idx !== i) }));
    setConfirmField(null);
    toast("Đã xóa lĩnh vực");
  }

  function setPhoto(photo: string | undefined) {
    update((d) => ({ ...d, person: { ...d.person, photo } }));
    toast(photo ? "Đã cập nhật ảnh đại diện" : "Đã gỡ ảnh đại diện");
  }
  function setSite(key: "ogImage" | "favicon", value: string | undefined) {
    update((d) => ({ ...d, site: { ...d.site, [key]: value } }));
    toast(value ? "Đã cập nhật ảnh" : "Đã gỡ ảnh");
  }

  const infoRows: [string, string][] = [
    ["Họ tên", p.name],
    ["Chức danh", p.role],
    ["Hotline / Số điện thoại", p.phone || "Chưa cập nhật"],
    ["Email liên hệ", p.email],
    ["Địa chỉ", p.address],
    ["Tự giới thiệu", p.tagline],
    ["Huy hiệu kinh nghiệm", `${p.yearsBadge.value} · ${p.yearsBadge.label}`],
    ["Truy cập nhanh năng lực", p.showCapabilityLink !== false ? "Bật" : "Tắt"],
    ["Truy cập nhanh liên hệ", p.showContactLink !== false ? "Bật" : "Tắt"],
  ];

  const ql = p.quickLinks || {};
  const activeQuickLinks = [
    { id: "capability", label: ql.capability?.label || "Năng lực chuyên môn", visible: ql.capability ? ql.capability.visible : p.showCapabilityLink !== false, color: ql.capability?.color || "#004AC6" },
    { id: "projects", label: ql.projects?.label || "Dự án thực hiện", visible: ql.projects ? ql.projects.visible : p.showProjectsLink === true, color: ql.projects?.color || "#000B60" },
    { id: "contact", label: ql.contact?.label || "Liên hệ ngay", visible: ql.contact ? ql.contact.visible : p.showContactLink !== false, color: ql.contact?.color || "#475569" },
  ].filter((b) => b.visible);

  return (
    <div className="animate-fade-up">
      <PageHead title="Cài đặt trang giới thiệu" subtitle="Quản lý thông tin cá nhân, ảnh và lĩnh vực hoạt động hiển thị trên trang chủ." />

      <Panel eyebrow="Ảnh chia sẻ (OG) & Favicon">
        <div className="grid gap-8 px-6 py-6 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-[13px] font-bold text-adminink">Ảnh chia sẻ mạng xã hội (OG)</p>
            <p className="mb-3 text-[12px] text-[#697086]">Hiển thị khi chia sẻ liên kết. Khuyến nghị 1200×630.</p>
            <ImageUpload value={data.site?.ogImage} onChange={(v) => setSite("ogImage", v)} aspect="aspect-[191/100]" widthClass="w-44" rounded="rounded-[10px]" maxDim={1200} />
          </div>
          <div>
            <p className="mb-1.5 text-[13px] font-bold text-adminink">Favicon</p>
            <p className="mb-3 text-[12px] text-[#697086]">Biểu tượng trên tab trình duyệt. Ảnh vuông.</p>
            <ImageUpload value={data.site?.favicon} onChange={(v) => setSite("favicon", v)} placeholder={<ImagePlus size={18} />} aspect="aspect-square" widthClass="w-16" rounded="rounded-[10px]" maxDim={128} />
          </div>
        </div>
      </Panel>

      <Panel eyebrow="Liên kết mạng xã hội & Kênh bán hàng (Footer & Thẻ Liên hệ)">
        <div className="grid gap-5 px-6 py-6 sm:grid-cols-3">
          {SOCIAL_PLATFORMS.map((platform) => {
            const item = data.footerSocials?.[platform.id as keyof typeof data.footerSocials];
            const isVisible = item ? item.visible !== false : (platform.id === "facebook" || platform.id === "zalo" || platform.id === "email");
            const currentUrl = item?.url !== undefined ? item.url : platform.defaultUrl;
            const IconCmp = platform.icon;

            return (
              <div key={platform.id} className="rounded-xl border border-black/5 bg-slate-50/60 p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[13px] font-bold text-adminink flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-soft-2 text-brand">
                      <IconCmp size={15} />
                    </span>
                    {platform.label}
                  </span>
                  <Checkbox
                    label="Hiển thị"
                    checked={isVisible}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      update((d) => ({
                        ...d,
                        footerSocials: {
                          ...d.footerSocials,
                          [platform.id]: {
                            url: d.footerSocials?.[platform.id as keyof typeof d.footerSocials]?.url || currentUrl,
                            visible: checked,
                          },
                        },
                      }));
                      toast(`Đã ${checked ? "bật" : "tắt"} hiển thị ${platform.label}`);
                    }}
                  />
                </div>
                <Input
                  value={currentUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    update((d) => ({
                      ...d,
                      footerSocials: {
                        ...d.footerSocials,
                        [platform.id]: {
                          visible: d.footerSocials?.[platform.id as keyof typeof d.footerSocials]?.visible !== false,
                          url: val,
                        },
                      },
                    }));
                  }}
                  placeholder={platform.placeholder}
                />
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel
        eyebrow="Thông tin cá nhân & Hero"
        action={
          <AdminButton variant="ghost" onClick={openInfo}>
            <Pencil size={16} /> Chỉnh sửa thông tin
          </AdminButton>
        }
      >
        <div className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Main Profile Info Card */}
            <div className="flex flex-1 items-start gap-5">
              <div className="relative flex-none">
                <div className="h-24 w-24 overflow-hidden rounded-2xl border-2 border-white bg-soft-2 shadow-md">
                  {p.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.photo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-[#9aa6e0]">
                      <UserRound size={36} />
                    </div>
                  )}
                </div>
                <button
                  onClick={openInfo}
                  className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-brand text-white shadow-sm transition hover:scale-110"
                  title="Thay đổi ảnh đại diện"
                >
                  <Pencil size={12} />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="font-display text-2xl font-extrabold text-adminink">{p.name}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-3 py-0.5 text-xs font-bold text-brand">
                    <Zap size={12} className="fill-current" />
                    {p.role}
                  </span>
                </div>
                <p className="mt-2 max-w-[640px] text-sm text-[#5f6472] line-clamp-2">{p.tagline}</p>

                {p.yearsBadge && (p.yearsBadge.value || p.yearsBadge.label) && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-black/[0.02] px-3 py-1 text-xs font-semibold text-adminink">
                    <span className="font-bold text-brand">{p.yearsBadge.value}</span>
                    <span className="text-[#94a0b0]">·</span>
                    <span>{p.yearsBadge.label}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Access Buttons Summary */}
          <div className="mt-6 border-t border-black/5 pt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#697086]">Nút truy cập nhanh ở trang chủ:</p>
            <div className="flex flex-wrap items-center gap-2.5">
              {activeQuickLinks.length > 0 ? (
                activeQuickLinks.map((b) => (
                  <div
                    key={b.id}
                    className="inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: b.color }}
                  >
                    <span>{b.label}</span>
                  </div>
                ))
              ) : (
                <span className="text-xs italic text-[#94a0b0]">Đang ẩn tất cả nút truy cập nhanh</span>
              )}
            </div>
          </div>
        </div>
      </Panel>

      <Panel
        eyebrow="Lĩnh vực hoạt động"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <AdminButton variant="ghost" onClick={openFieldsHeader}>
              <Pencil size={15} /> Sửa tiêu đề phần
            </AdminButton>
            <AddButton onClick={openNewField}>Thêm lĩnh vực</AddButton>
          </div>
        }
      >
        <div className="border-b border-black/5 bg-slate-50/70 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#697086]">Tiêu đề phần ở trang chủ:</span>
              <h4 className="mt-0.5 text-base font-bold text-adminink">{data.fieldsTitle || "Lĩnh vực hoạt động"}</h4>
              <p className="mt-0.5 max-w-[650px] text-xs text-[#5f6472]">{data.fieldsSubtitle || "Những bài toán vận hành mà tôi đã đồng hành cùng doanh nghiệp giải quyết bằng phần mềm."}</p>
            </div>
          </div>
        </div>
        <Table head={<tr><Th>Tên lĩnh vực</Th><Th>Hiển thị</Th><Th className="text-right">Hành động</Th></tr>}>
          {data.fields.map((f, i) => (
            <tr key={f.name + i} className="hover:bg-[#fcfbfd]">
              <Td className="font-bold text-adminink">{f.name}</Td>
              <Td><Badge tone={f.visible ? "ok" : "read"}>{f.visible ? "Hiển thị" : "Ẩn"}</Badge></Td>
              <Td>
                <div className="flex justify-end gap-2">
                  <IconAction onClick={() => openEditField(i)} title="Chỉnh sửa"><Pencil size={16} /></IconAction>
                  <IconAction tone="danger" onClick={() => setConfirmField(i)} title="Xóa"><Trash2 size={16} /></IconAction>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Panel>

      <Panel
        eyebrow="Dự án tiêu biểu (Hiển thị trang chủ)"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <AdminButton variant="ghost" onClick={openProjectsHeader}>
              <Pencil size={15} /> Sửa tiêu đề phần
            </AdminButton>
            <AddButton onClick={openSelectProjects}>Chọn thêm dự án</AddButton>
          </div>
        }
      >
        <div className="border-b border-black/5 bg-slate-50/70 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#697086]">Tiêu đề phần ở trang chủ:</span>
              <h4 className="mt-0.5 text-base font-bold text-adminink">{data.projectsTitle || "Dự án tiêu biểu"}</h4>
              <p className="mt-0.5 max-w-[650px] text-xs text-[#5f6472]">{data.projectsSubtitle || "Các sản phẩm & hệ thống thực tế tôi đã tham gia phân tích, thiết kế và triển khai cho doanh nghiệp."}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 bg-blue-50/60 px-6 py-3.5 text-xs text-[#5f6472]">
          <span>Danh sách bên dưới là các dự án đang được chọn hiển thị trên slider thanh cuộn ở trang chủ.</span>
          <span className="font-bold text-brand">
            Đang hiển thị: {data.projects.filter((p) => p.featured).length} / {data.projects.length} dự án
          </span>
        </div>

        {data.projects.filter((p) => p.featured).length > 0 ? (
          <Table head={<tr><Th>Dự án tiêu biểu</Th><Th>Lĩnh vực</Th><Th>Năm</Th><Th className="text-right">Hành động</Th></tr>}>
            {data.projects.filter((p) => p.featured).map((p) => (
              <tr key={p.slug} className="hover:bg-[#fcfbfd]">
                <Td>
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 flex-none place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-navy to-brand text-xs font-extrabold text-white">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        p.logo
                      )}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-adminink">{p.title}</div>
                      <div className="line-clamp-1 text-xs text-[#697086]">{p.summary}</div>
                    </div>
                  </div>
                </Td>
                <Td><Badge tone="read">{p.category}</Badge></Td>
                <Td>{p.year}</Td>
                <Td className="text-right">
                  <AdminButton
                    variant="ghost"
                    onClick={() => toggleProjectFeatured(p.slug, false)}
                    className="border-rose-200 !px-3 !py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Gỡ khỏi tiêu biểu
                  </AdminButton>
                </Td>
              </tr>
            ))}
          </Table>
        ) : (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-semibold text-adminink">Chưa có dự án nào được chọn hiển thị ở mục Tiêu biểu</p>
            <p className="mt-1 text-xs text-[#697086]">Nhấn nút &quot;Chọn thêm dự án&quot; bên trên để chọn các dự án từ menu Dự án.</p>
            <div className="mt-4">
              <AddButton onClick={openSelectProjects}>Chọn thêm dự án</AddButton>
            </div>
          </div>
        )}
      </Panel>

      <Panel
        eyebrow="Quy trình Hợp tác"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <AdminButton variant="ghost" onClick={openProcessHeader}>
              <Pencil size={15} /> Sửa tiêu đề phần
            </AdminButton>
            <AddButton onClick={openNewProcess}>Thêm bước quy trình</AddButton>
          </div>
        }
      >
        <div className="border-b border-black/5 bg-slate-50/70 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#697086]">Tiêu đề phần ở trang chủ:</span>
              <h4 className="mt-0.5 text-base font-bold text-adminink">{data.processTitle || "Quy trình Hợp tác"}</h4>
              <p className="mt-0.5 max-w-[650px] text-xs text-[#5f6472]">{data.processSubtitle || "Chúng tôi áp dụng mô hình vận hành chuyên nghiệp, đảm bảo tính minh bạch và hiệu quả cao nhất cho mọi sản phẩm công nghệ."}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-b border-black/5 bg-blue-50/60 px-6 py-2.5 text-xs text-[#5f6472]">
          <span>Mẹo: Bạn có thể nhấn giữ biểu tượng <GripVertical size={14} className="mx-0.5 inline text-slate-500" /> ở cột Hành động và kéo thả để thay đổi thứ tự các bước.</span>
          <span className="font-bold text-brand">{data.process.length} bước</span>
        </div>
        <Table head={<tr><Th className="whitespace-nowrap">Icon / Ảnh</Th><Th>Bước / Tên công việc</Th><Th>Mô tả chi tiết</Th><Th className="text-right">Hành động</Th></tr>}>
          {data.process.map((step, i) => (
            <tr
              key={step.title + i}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", i.toString());
                setDraggedProcessIndex(i);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const from = draggedProcessIndex ?? parseInt(e.dataTransfer.getData("text/plain"), 10);
                if (!isNaN(from) && from !== i) {
                  moveProcess(from, i);
                }
                setDraggedProcessIndex(null);
              }}
              className={`hover:bg-[#fcfbfd] transition ${draggedProcessIndex === i ? "bg-blue-50/50 opacity-40" : ""}`}
            >
              <Td className="whitespace-nowrap">
                <div className="flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-slate-50">
                  {step.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={step.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Icon name={step.icon || "search"} className="h-5 w-5 text-brand" />
                  )}
                </div>
              </Td>
              <Td className="max-w-[200px] font-bold text-adminink">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">#{i + 1}</span>
                  <span>{step.title}</span>
                </div>
              </Td>
              <Td className="max-w-[380px] text-xs text-[#5f6472]">{step.body}</Td>
              <Td>
                <div className="flex items-center justify-end gap-1.5">
                  <IconAction onClick={() => openEditProcess(i)} title="Chỉnh sửa"><Pencil size={16} /></IconAction>
                  <IconAction tone="danger" onClick={() => setConfirmProcess(i)} title="Xóa"><Trash2 size={16} /></IconAction>
                  <div
                    className="grid h-[34px] w-[34px] cursor-grab active:cursor-grabbing place-items-center rounded-[9px] border border-[#e2e8f0] bg-white text-slate-400 transition hover:border-brand hover:text-adminink"
                    title="Nhấn giữ và kéo thả để sắp xếp thứ tự"
                  >
                    <GripVertical size={16} />
                  </div>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Panel>



      {/* edit info modal */}
      <Modal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        title="Chỉnh sửa thông tin cá nhân"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setInfoOpen(false)}>Hủy</AdminButton>
            <AdminButton onClick={saveInfo}>Lưu thay đổi</AdminButton>
          </>
        }
      >
        {/* Navigation Tabs */}
        <div className="mb-6 flex border-b border-black/5">
          <button
            type="button"
            onClick={() => setModalTab("info")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-bold transition ${
              modalTab === "info" ? "border-brand text-brand" : "border-transparent text-[#697086] hover:text-adminink"
            }`}
          >
            <UserRound size={16} /> Thông tin cơ bản
          </button>
          <button
            type="button"
            onClick={() => setModalTab("cta")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-bold transition ${
              modalTab === "cta" ? "border-brand text-brand" : "border-transparent text-[#697086] hover:text-adminink"
            }`}
          >
            <Zap size={16} /> Nút truy cập nhanh (Hero)
          </button>
        </div>

        {modalTab === "info" ? (
          <div className="flex flex-col gap-4">
            <Field label="Ảnh đại diện (Hero)">
              <ImageUpload
                value={infoDraft.photo}
                onChange={(photo) => setInfoDraft((prev) => ({ ...prev, photo }))}
                placeholder={<UserRound size={24} />}
                aspect="aspect-[1/1.04]"
                widthClass="w-20"
                rounded="rounded-xl"
                maxDim={1000}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3.5">
              <Field label="Họ tên"><Input value={infoDraft.name} onChange={(e) => setInfoDraft({ ...infoDraft, name: e.target.value })} /></Field>
              <Field label="Chức danh"><Input value={infoDraft.role} onChange={(e) => setInfoDraft({ ...infoDraft, role: e.target.value })} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <Field label="Hotline / Số điện thoại"><Input value={infoDraft.phone} onChange={(e) => setInfoDraft({ ...infoDraft, phone: e.target.value })} placeholder="VD: 0987 654 321" /></Field>
              <Field label="Email liên hệ"><Input value={infoDraft.email} onChange={(e) => setInfoDraft({ ...infoDraft, email: e.target.value })} placeholder="VD: phamphat343@gmail.com" /></Field>
            </div>
            <Field label="Địa chỉ"><Input value={infoDraft.address} onChange={(e) => setInfoDraft({ ...infoDraft, address: e.target.value })} placeholder="VD: District 1, Ho Chi Minh City, VN" /></Field>
            <Field label="Tự giới thiệu"><Textarea value={infoDraft.tagline} onChange={(e) => setInfoDraft({ ...infoDraft, tagline: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3.5">
              <Field label="Huy hiệu — số năm"><Input value={infoDraft.yearsValue} onChange={(e) => setInfoDraft({ ...infoDraft, yearsValue: e.target.value })} placeholder="VD: 2+ năm" /></Field>
              <Field label="Huy hiệu — nhãn"><Input value={infoDraft.yearsLabel} onChange={(e) => setInfoDraft({ ...infoDraft, yearsLabel: e.target.value })} placeholder="VD: BA · WMS · ERP" /></Field>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            <p className="text-xs text-[#697086]">Bật/tắt, đặt tên hiển thị và chọn màu sắc cho các nút kêu gọi hành động ở phần Hero trang chủ.</p>

            {(["capability", "projects", "contact"] as const).map((key) => {
              const itemNames = {
                capability: "Nút Năng lực chuyên môn (/nang-luc)",
                projects: "Nút Dự án thực hiện (/du-an)",
                contact: "Nút Liên hệ ngay (/lien-he)",
              };
              const item = infoDraft.quickLinks[key];
              return (
                <div key={key} className="rounded-xl border border-black/5 bg-black/[0.02] p-3.5 flex flex-col gap-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Checkbox
                      label={itemNames[key]}
                      checked={item.visible}
                      onChange={(e) =>
                        setInfoDraft((prev) => ({
                          ...prev,
                          quickLinks: {
                            ...prev.quickLinks,
                            [key]: { ...prev.quickLinks[key], visible: e.target.checked },
                          },
                        }))
                      }
                    />
                    {item.visible && (
                      <div className="flex items-center gap-1.5 pl-6 sm:pl-0">
                        <span className="text-xs font-semibold text-[#697086] mr-0.5">Màu:</span>
                        {COLOR_PRESETS.map((c) => (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() =>
                              setInfoDraft((prev) => ({
                                ...prev,
                                quickLinks: {
                                  ...prev.quickLinks,
                                  [key]: { ...prev.quickLinks[key], color: c.hex },
                                },
                              }))
                            }
                            className={`h-5 w-5 rounded-full border border-black/15 transition ${
                              item.color === c.hex ? "scale-125 ring-2 ring-brand ring-offset-1" : "hover:scale-110 opacity-90"
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.label}
                          />
                        ))}
                        <input
                          type="color"
                          value={item.color}
                          onChange={(e) =>
                            setInfoDraft((prev) => ({
                              ...prev,
                              quickLinks: {
                                ...prev.quickLinks,
                                [key]: { ...prev.quickLinks[key], color: e.target.value },
                              },
                            }))
                          }
                          className="ml-1 h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
                          title="Tùy chỉnh màu khác"
                        />
                      </div>
                    )}
                  </div>
                  {item.visible && (
                    <Input
                      value={item.label}
                      onChange={(e) =>
                        setInfoDraft((prev) => ({
                          ...prev,
                          quickLinks: {
                            ...prev.quickLinks,
                            [key]: { ...prev.quickLinks[key], label: e.target.value },
                          },
                        }))
                      }
                      placeholder="Tên nút hiển thị"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      {/* fields header modal */}
      <Modal
        open={fieldsHeaderOpen}
        onClose={() => setFieldsHeaderOpen(false)}
        title="Sửa tiêu đề & mô tả Lĩnh vực hoạt động"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setFieldsHeaderOpen(false)}>Hủy</AdminButton>
            <AdminButton onClick={saveFieldsHeader}>Lưu thay đổi</AdminButton>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Tiêu đề phần">
            <Input
              value={fieldsHeaderDraft.title}
              onChange={(e) => setFieldsHeaderDraft({ ...fieldsHeaderDraft, title: e.target.value })}
              placeholder="VD: Lĩnh vực hoạt động"
            />
          </Field>
          <Field label="Mô tả ngắn (Phụ đề phần)">
            <Textarea
              value={fieldsHeaderDraft.subtitle}
              onChange={(e) => setFieldsHeaderDraft({ ...fieldsHeaderDraft, subtitle: e.target.value })}
              placeholder="Mô tả ngắn hiển thị bên dưới tiêu đề..."
            />
          </Field>
        </div>
      </Modal>

      {/* projects header modal */}
      <Modal
        open={projectsHeaderOpen}
        onClose={() => setProjectsHeaderOpen(false)}
        title="Sửa tiêu đề & mô tả Dự án tiêu biểu"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setProjectsHeaderOpen(false)}>Hủy</AdminButton>
            <AdminButton onClick={saveProjectsHeader}>Lưu thay đổi</AdminButton>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Tiêu đề phần">
            <Input
              value={projectsHeaderDraft.title}
              onChange={(e) => setProjectsHeaderDraft({ ...projectsHeaderDraft, title: e.target.value })}
              placeholder="VD: Dự án tiêu biểu"
            />
          </Field>
          <Field label="Mô tả ngắn (Phụ đề phần)">
            <Textarea
              value={projectsHeaderDraft.subtitle}
              onChange={(e) => setProjectsHeaderDraft({ ...projectsHeaderDraft, subtitle: e.target.value })}
              placeholder="Mô tả ngắn hiển thị bên dưới tiêu đề..."
            />
          </Field>
        </div>
      </Modal>

      {/* select featured projects modal */}
      <Modal
        open={selectProjectsOpen}
        onClose={() => setSelectProjectsOpen(false)}
        title="Chọn dự án hiển thị ở mục Dự án tiêu biểu"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setSelectProjectsOpen(false)}>Hủy</AdminButton>
            <AdminButton onClick={saveSelectProjects}>Lưu lựa chọn</AdminButton>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <p className="text-xs text-[#697086]">
            Tích chọn các dự án bạn muốn hiển thị trên slider thanh cuộn ở trang chủ (danh sách khai báo ở menu <b>Dự án</b>).
          </p>

          <div className="max-h-[360px] overflow-y-auto rounded-xl border border-black/10 bg-black/[0.01] p-3 flex flex-col gap-2">
            {data.projects.map((p) => {
              const isChecked = selectedSlugsDraft.includes(p.slug);
              return (
                <div
                  key={p.slug}
                  onClick={() => toggleSlugInDraft(p.slug, !isChecked)}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 transition ${
                    isChecked
                      ? "border-brand bg-brand/5 shadow-sm"
                      : "border-black/5 bg-white hover:border-black/15"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isChecked}
                      onChange={(e) => toggleSlugInDraft(p.slug, e.target.checked)}
                    />
                    <div>
                      <div className="font-bold text-sm text-adminink">{p.title}</div>
                      <div className="text-xs text-[#697086]">{p.category} · {p.year}</div>
                    </div>
                  </div>
                  <Badge tone={isChecked ? "ok" : "read"}>
                    {isChecked ? "Đã chọn" : "Bỏ chọn"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      {/* process header modal */}
      <Modal
        open={processHeaderOpen}
        onClose={() => setProcessHeaderOpen(false)}
        title="Sửa tiêu đề & mô tả Quy trình Hợp tác"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setProcessHeaderOpen(false)}>Hủy</AdminButton>
            <AdminButton onClick={saveProcessHeader}>Lưu thay đổi</AdminButton>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Tiêu đề phần">
            <Input
              value={processHeaderDraft.title}
              onChange={(e) => setProcessHeaderDraft({ ...processHeaderDraft, title: e.target.value })}
              placeholder="VD: Quy trình Hợp tác"
            />
          </Field>
          <Field label="Mô tả ngắn (Phụ đề phần)">
            <Textarea
              value={processHeaderDraft.subtitle}
              onChange={(e) => setProcessHeaderDraft({ ...processHeaderDraft, subtitle: e.target.value })}
              placeholder="Mô tả ngắn hiển thị bên dưới tiêu đề..."
            />
          </Field>
        </div>
      </Modal>

      {/* process step modal */}
      <Modal
        open={processEdit !== null}
        onClose={() => setProcessEdit(null)}
        title={processEdit === -1 ? "Thêm bước quy trình" : "Chỉnh sửa bước quy trình"}
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setProcessEdit(null)}>Hủy</AdminButton>
            <AdminButton onClick={saveProcess}>{processEdit === -1 ? "Thêm" : "Lưu"}</AdminButton>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Tên bước quy trình">
            <Input
              value={processDraft.title}
              onChange={(e) => setProcessDraft({ ...processDraft, title: e.target.value })}
              placeholder="VD: 01. Tiếp nhận & Phân tích Nhu cầu"
            />
          </Field>
          <Field label="Mô tả công việc">
            <Textarea
              value={processDraft.body}
              onChange={(e) => setProcessDraft({ ...processDraft, body: e.target.value })}
              placeholder="Chi tiết công việc ở bước này..."
            />
          </Field>
          <Field label="Hình ảnh / Icon đại diện tùy chỉnh (Tùy chọn)">
            <p className="mb-2 text-xs text-[#697086]">Tải lên hình ảnh tùy chỉnh để thay thế icon mặc định.</p>
            <ImageUpload
              value={processDraft.image}
              onChange={(v) => setProcessDraft((prev) => ({ ...prev, image: v }))}
              placeholder={<ImagePlus size={20} />}
              aspect="aspect-[3/1]"
              widthClass="w-36"
              rounded="rounded-xl"
              maxDim={800}
            />
          </Field>
          {!processDraft.image && (
            <Field label="Icon hệ thống (Dùng khi chưa tải ảnh)">
              <select
                value={processDraft.icon}
                onChange={(e) => setProcessDraft({ ...processDraft, icon: e.target.value as IconName })}
                className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-adminink shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                {Object.keys(iconMap).map((iconKey) => (
                  <option key={iconKey} value={iconKey}>
                    {iconKey}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmProcess !== null}
        label={confirmProcess !== null ? data.process[confirmProcess]?.title ?? "" : ""}
        onCancel={() => setConfirmProcess(null)}
        onConfirm={removeProcess}
      />

      {/* field modal */}
      <Modal open={fieldEdit !== null} onClose={() => setFieldEdit(null)} title={fieldEdit === -1 ? "Thêm lĩnh vực hoạt động" : "Chỉnh sửa lĩnh vực"}
        footer={<><AdminButton variant="ghost" onClick={() => setFieldEdit(null)}>Hủy</AdminButton><AdminButton onClick={saveField}>{fieldEdit === -1 ? "Thêm" : "Lưu"}</AdminButton></>}>
        <Field label="Tên lĩnh vực"><Input value={fieldDraft.name} onChange={(e) => setFieldDraft({ ...fieldDraft, name: e.target.value })} placeholder="VD: Tích hợp ERP" /></Field>
        <Field label="Mô tả"><Textarea value={fieldDraft.body} onChange={(e) => setFieldDraft({ ...fieldDraft, body: e.target.value })} placeholder="Mô tả ngắn gọn..." /></Field>
        <Checkbox label="Hiển thị trên trang chủ" checked={fieldDraft.visible} onChange={(e) => setFieldDraft({ ...fieldDraft, visible: e.target.checked })} />
      </Modal>

      <ConfirmDialog open={confirmField !== null} label={confirmField !== null ? data.fields[confirmField]?.name ?? "" : ""} onCancel={() => setConfirmField(null)} onConfirm={removeField} />
    </div>
  );
}
