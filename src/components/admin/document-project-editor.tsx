"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Eye,
  Edit3,
  Image as ImageIcon,
  Plus,
  X,
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Heading3,
  Heading,
  Info,
  CheckCircle2,
  Code,
  Layers,
  Calendar,
  UserCheck,
  Tag,
  Check,
  FolderKanban,
  Upload,
  Loader2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  FileCode,
  ArrowUp,
  ArrowDown,
  GripVertical
} from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichDocumentRenderer } from "@/components/common/rich-document-renderer";
import { fileToCompressedBlob } from "@/lib/image";
import { uploadImage } from "@/lib/api";
import type { Project } from "@/types/portfolio";

interface DocumentProjectEditorProps {
  project: Partial<Project>;
  onSave: (updated: Project) => void;
  onCancel: () => void;
}

export type BlockType =
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "image"
  | "callout"
  | "bullet";

export interface DocumentBlock {
  id: string;
  type: BlockType;
  text?: string;
  src?: string;
  alt?: string;
  align?: "left" | "center" | "right";
}

export function DocumentProjectEditor({ project, onSave, onCancel }: DocumentProjectEditorProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "markdown" | "preview">("visual");
  const [uploadingImage, setUploadingImage] = useState(false);
  const inlineImageInputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // State fields
  const [title, setTitle] = useState(project.title || "");
  const [slug, setSlug] = useState(project.slug || "");
  const [category, setCategory] = useState(project.category || "WMS / SCM");
  const [year, setYear] = useState(project.year || new Date().getFullYear().toString());
  const [role, setRole] = useState(project.role || "Lead Business Analyst");
  const [logo, setLogo] = useState(project.logo || "");
  const [summary, setSummary] = useState(project.summary || "");
  const [image, setImage] = useState<string | undefined>(project.image);
  const [featured, setFeatured] = useState<boolean>(project.featured ?? true);

  const [problem, setProblem] = useState(project.problem || "");
  const [solution, setSolution] = useState(project.solution || "");

  // Arrays
  const [impact, setImpact] = useState<string[]>(
    project.impact && project.impact.length > 0
      ? project.impact
      : ["Tối ưu hóa 35% quy trình vận hành", "Giảm 50% thời gian xử lý thủ công"]
  );
  const [tech, setTech] = useState<string[]>(
    project.tech && project.tech.length > 0 ? project.tech : ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"]
  );

  // Content state (Markdown string & Blocks array)
  const initialContent =
    project.content ||
    `## 1. Tổng quan dự án\nMô tả chi tiết bài toán, định hướng và các bên liên quan (Stakeholders).\n\n### 2. Quy trình nghiệp vụ & Wireframe\n- Khảo sát yêu cầu người dùng (User Requirements).\n- Dựng sơ đồ luồng dữ liệu (Data Flow Diagram - DFD) và sơ đồ Use Case.\n\n> 💡 **Ghi chú quan trọng**: Hệ thống được thiết kế theo tiêu chuẩn khả năng mở rộng cao (High Scalability).\n\n### 3. Đánh giá & Kết quả đạt được\nHệ thống đã đi vào vận hành thực tế đạt hiệu quả cao.`;

  const [markdownContent, setMarkdownContent] = useState(initialContent);
  const [blocks, setBlocks] = useState<DocumentBlock[]>([]);

  // Parse markdown content string into visual blocks
  function parseMarkdownToBlocks(md: string): DocumentBlock[] {
    const lines = md.split("\n");
    const result: DocumentBlock[] = [];
    let idCounter = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Image: ![alt|align](src) or ![alt](src)
      const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        const rawAlt = imgMatch[1] || "Ảnh minh họa";
        const src = imgMatch[2];
        let align: "left" | "center" | "right" = "center";
        let altText = rawAlt;

        if (rawAlt.includes("|")) {
          const parts = rawAlt.split("|");
          altText = parts[0] || "Ảnh minh họa";
          align = (parts[1] as "left" | "center" | "right") || "center";
        }

        result.push({
          id: `block-${idCounter++}`,
          type: "image",
          src,
          alt: altText,
          align,
        });
        continue;
      }

      // Heading 1 (#)
      if (trimmed.startsWith("# ")) {
        result.push({
          id: `block-${idCounter++}`,
          type: "heading1",
          text: trimmed.replace(/^#\s*/, ""),
        });
        continue;
      }

      // Heading 2 (##)
      if (trimmed.startsWith("## ")) {
        result.push({
          id: `block-${idCounter++}`,
          type: "heading2",
          text: trimmed.replace(/^##\s*/, ""),
        });
        continue;
      }

      // Heading 3 (###)
      if (trimmed.startsWith("### ")) {
        result.push({
          id: `block-${idCounter++}`,
          type: "heading3",
          text: trimmed.replace(/^###\s*/, ""),
        });
        continue;
      }

      // Heading 4 (####)
      if (trimmed.startsWith("#### ")) {
        result.push({
          id: `block-${idCounter++}`,
          type: "heading4",
          text: trimmed.replace(/^####\s*/, ""),
        });
        continue;
      }

      // Callout box: > ...
      if (trimmed.startsWith(">")) {
        result.push({
          id: `block-${idCounter++}`,
          type: "callout",
          text: trimmed.replace(/^>\s*/, ""),
        });
        continue;
      }

      // Bullet item: - ... or * ...
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        result.push({
          id: `block-${idCounter++}`,
          type: "bullet",
          text: trimmed.replace(/^[-*]\s*/, ""),
        });
        continue;
      }

      // Paragraph
      result.push({
        id: `block-${idCounter++}`,
        type: "paragraph",
        text: line,
      });
    }

    return result;
  }

  // Convert blocks array back to markdown content string
  function compileBlocksToMarkdown(blks: DocumentBlock[]): string {
    return blks
      .map((b) => {
        if (b.type === "image") {
          const alignTag = b.align || "center";
          const altTag = b.alt || "Ảnh minh họa";
          return `![${altTag}|${alignTag}](${b.src})`;
        }
        if (b.type === "heading1") return `# ${b.text || ""}`;
        if (b.type === "heading2") return `## ${b.text || ""}`;
        if (b.type === "heading3") return `### ${b.text || ""}`;
        if (b.type === "heading4") return `#### ${b.text || ""}`;
        if (b.type === "callout") return `> ${b.text || ""}`;
        if (b.type === "bullet") return `- ${b.text || ""}`;
        return b.text || "";
      })
      .join("\n\n");
  }

  // Initialize blocks on load
  useEffect(() => {
    setBlocks(parseMarkdownToBlocks(initialContent));
  }, []);

  // Update markdown string when blocks change
  function updateBlocks(newBlocks: DocumentBlock[]) {
    setBlocks(newBlocks);
    setMarkdownContent(compileBlocksToMarkdown(newBlocks));
  }

  function handleMarkdownChange(rawMd: string) {
    setMarkdownContent(rawMd);
    setBlocks(parseMarkdownToBlocks(rawMd));
  }

  // New tag/impact helper inputs
  const [newImpact, setNewImpact] = useState("");
  const [newTech, setNewTech] = useState("");

  function autoSlug(text: string) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!project.slug || project.slug === autoSlug(project.title || "")) {
      setSlug(autoSlug(val));
    }
  }

  function addImpactItem() {
    if (!newImpact.trim()) return;
    setImpact([...impact, newImpact.trim()]);
    setNewImpact("");
  }

  function removeImpactItem(idx: number) {
    setImpact(impact.filter((_, i) => i !== idx));
  }

  function addTechItem() {
    if (!newTech.trim()) return;
    setTech([...tech, newTech.trim()]);
    setNewTech("");
  }

  function removeTechItem(idx: number) {
    setTech(tech.filter((_, i) => i !== idx));
  }

  // Handle direct file upload for insertion into body as visual block
  async function handleInsertImageFile(file: File) {
    setUploadingImage(true);
    try {
      const blob = await fileToCompressedBlob(file, 1200);
      let imgUrl = "";
      try {
        imgUrl = await uploadImage(blob);
      } catch {
        // Fallback to Data URL if upload failed
        imgUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(blob);
        });
      }

      const newImageBlock: DocumentBlock = {
        id: `img-${Date.now()}`,
        type: "image",
        src: imgUrl,
        alt: file.name || "Ảnh minh họa",
        align: "center",
      };

      updateBlocks([...blocks, newImageBlock]);
    } catch (err) {
      console.error("Paste image error:", err);
      alert("Không thể tải/dán ảnh lên được. Vui lòng thử lại.");
    } finally {
      setUploadingImage(false);
    }
  }

  // Handle direct Clipboard Paste (Ctrl + V) of images
  async function handlePaste(e: React.ClipboardEvent) {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          await handleInsertImageFile(file);
        }
        break;
      }
    }
  }

  // Image Block Operations
  function updateImageAlignment(id: string, align: "left" | "center" | "right") {
    const updated = blocks.map((b) => (b.id === id ? { ...b, align } : b));
    updateBlocks(updated);
  }

  function updateImageAlt(id: string, alt: string) {
    const updated = blocks.map((b) => (b.id === id ? { ...b, alt } : b));
    updateBlocks(updated);
  }

  function changeBlockType(id: string, newType: BlockType) {
    const updated = blocks.map((b) => (b.id === id ? { ...b, type: newType } : b));
    updateBlocks(updated);
  }

  function removeBlock(id: string) {
    const updated = blocks.filter((b) => b.id !== id);
    updateBlocks(updated);
  }

  function updateBlockText(id: string, text: string) {
    const updated = blocks.map((b) => (b.id === id ? { ...b, text } : b));
    updateBlocks(updated);
  }

  function addTextBlock(type: BlockType) {
    const newBlock: DocumentBlock = {
      id: `block-${Date.now()}`,
      type,
      text:
        type === "heading1"
          ? "Tiêu đề 1..."
          : type === "heading2"
          ? "Tiêu đề 2..."
          : type === "heading3"
          ? "Tiêu đề 3..."
          : type === "heading4"
          ? "Tiêu đề 4..."
          : type === "callout"
          ? "💡 Ghi chú quan trọng..."
          : "Nội dung...",
    };
    updateBlocks([...blocks, newBlock]);
  }

  // Reordering functions
  function moveBlockUp(index: number) {
    if (index <= 0) return;
    const newBlks = [...blocks];
    const temp = newBlks[index - 1];
    newBlks[index - 1] = newBlks[index];
    newBlks[index] = temp;
    updateBlocks(newBlks);
  }

  function moveBlockDown(index: number) {
    if (index >= blocks.length - 1) return;
    const newBlks = [...blocks];
    const temp = newBlks[index + 1];
    newBlks[index + 1] = newBlks[index];
    newBlks[index] = temp;
    updateBlocks(newBlks);
  }

  // Drag & Drop handlers
  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newBlks = [...blocks];
    const item = newBlks.splice(draggedIndex, 1)[0];
    newBlks.splice(index, 0, item);
    setDraggedIndex(index);
    updateBlocks(newBlks);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
  }

  function handleSave() {
    if (!title.trim()) {
      alert("Vui lòng nhập tên dự án");
      return;
    }

    const finalSlug = slug.trim() || autoSlug(title) || "du-an";
    const finalLogo = logo.trim() || title.slice(0, 2).toUpperCase() || "PR";
    const finalContent = compileBlocksToMarkdown(blocks);

    const updatedProject: Project = {
      slug: finalSlug,
      title: title.trim(),
      category: category.trim(),
      year: year.trim(),
      role: role.trim(),
      logo: finalLogo,
      summary: summary.trim(),
      featured,
      image,
      problem: problem.trim(),
      solution: solution.trim(),
      impact: impact.filter((i) => i.trim().length > 0),
      tech: tech.filter((t) => t.trim().length > 0),
      content: finalContent,
    };

    onSave(updatedProject);
  }

  return (
    <div
      onPaste={handlePaste}
      className="min-h-screen bg-[#fafafa] text-[#172b4d] rounded-2xl border border-slate-200 shadow-xl overflow-hidden mb-10"
    >
      {/* Hidden file input for image insertion */}
      <input
        ref={inlineImageInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleInsertImageFile(file);
          if (inlineImageInputRef.current) inlineImageInputRef.current.value = "";
        }}
      />

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-[#dfe1e6] bg-white px-6 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-[#42526e] hover:bg-[#ebecf0] transition"
          >
            <ArrowLeft size={16} /> Quay lại
          </button>
          <div className="h-4 w-px bg-[#dfe1e6]" />
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-100 text-brand font-bold text-xs">
              DOC
            </span>
            <span className="text-xs font-semibold text-[#5e6c84] uppercase tracking-wider">
              Workspace / Dự án / {title || "Dự án mới"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center rounded-lg bg-[#f4f5f7] p-1 border border-[#dfe1e6]">
            <button
              onClick={() => setActiveTab("visual")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
                activeTab === "visual"
                  ? "bg-white text-brand shadow-sm"
                  : "text-[#5e6c84] hover:text-[#172b4d]"
              }`}
            >
              <Edit3 size={14} /> Soạn thảo Trực quan (Visual)
            </button>
            <button
              onClick={() => setActiveTab("markdown")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
                activeTab === "markdown"
                  ? "bg-white text-brand shadow-sm"
                  : "text-[#5e6c84] hover:text-[#172b4d]"
              }`}
            >
              <FileCode size={14} /> Mã nguồn Markdown
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
                activeTab === "preview"
                  ? "bg-white text-brand shadow-sm"
                  : "text-[#5e6c84] hover:text-[#172b4d]"
              }`}
            >
              <Eye size={14} /> Xem trước Trang
            </button>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2 text-sm font-bold text-white hover:bg-navy shadow-md transition"
          >
            <Save size={16} /> Lưu dự án
          </button>
        </div>
      </div>

      {activeTab !== "preview" ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] divide-y lg:divide-y-0 lg:divide-x divide-[#dfe1e6]">
          {/* Main Document Area */}
          <div className="bg-white p-8 md:p-12">
            {/* Header Banner Image */}
            <div className="mb-8">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#5e6c84]">
                Ảnh bìa dự án (Cover Banner)
              </label>
              <ImageUpload
                value={image}
                onChange={(url) => setImage(url)}
                placeholder={<ImageIcon size={32} className="text-[#8993a4]" />}
                aspect="aspect-[21/9]"
                widthClass="w-full"
                maxDim={1200}
              />
            </div>

            {/* Document Title Input */}
            <div className="mb-6">
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Tên dự án / Hệ thống..."
                className="w-full border-b border-transparent hover:border-[#dfe1e6] focus:border-brand focus:outline-none bg-transparent font-display text-3xl md:text-4xl font-extrabold text-[#172b4d] placeholder-[#a5adba] py-2 transition"
              />
            </div>

            {/* Summary / Subtitle */}
            <div className="mb-8">
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                placeholder="Tóm tắt ngắn gọn về phạm vi dự án, vai trò chính và mục tiêu cốt lõi..."
                className="w-full rounded-lg border border-[#dfe1e6] p-3.5 text-base text-[#344563] placeholder-[#a5adba] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 transition"
              />
            </div>

            {/* Structured Sections (Problem & Solution) */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-[#dfe1e6] bg-[#fafbfc] p-5">
                <div className="flex items-center gap-2 mb-3 text-sm font-bold text-red-600">
                  <Info size={16} /> 1. Bối cảnh & Vấn đề (Problem)
                </div>
                <textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  rows={4}
                  placeholder="Mô tả bối cảnh doanh nghiệp và các nút thắt cổ chai..."
                  className="w-full rounded-md border border-[#dfe1e6] bg-white p-3 text-sm text-[#172b4d] focus:border-brand focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-[#dfe1e6] bg-[#fafbfc] p-5">
                <div className="flex items-center gap-2 mb-3 text-sm font-bold text-emerald-600">
                  <CheckCircle2 size={16} /> 2. Giải pháp phân tích (Solution)
                </div>
                <textarea
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  rows={4}
                  placeholder="Mô tả giải pháp kiến trúc, quy trình nghiệp vụ đã đề xuất..."
                  className="w-full rounded-md border border-[#dfe1e6] bg-white p-3 text-sm text-[#172b4d] focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            {/* Visual Editor vs Markdown Raw Mode */}
            {activeTab === "visual" ? (
              <div className="mb-8 rounded-xl border border-[#dfe1e6] bg-white shadow-sm overflow-hidden">
                {/* Visual Editor Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dfe1e6] bg-[#f4f5f7] px-4 py-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="mr-2 text-xs font-bold text-[#5e6c84] uppercase tracking-wider">
                      Thêm Khối Nội Dung
                    </span>

                    <button
                      onClick={() => addTextBlock("heading1")}
                      className="flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-bold text-[#42526e] border border-[#dfe1e6] hover:bg-[#ebecf0]"
                    >
                      <Heading1 size={14} /> Tiêu đề 1
                    </button>
                    <button
                      onClick={() => addTextBlock("heading2")}
                      className="flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-bold text-[#42526e] border border-[#dfe1e6] hover:bg-[#ebecf0]"
                    >
                      <Heading2 size={14} /> Tiêu đề 2
                    </button>
                    <button
                      onClick={() => addTextBlock("heading3")}
                      className="flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-bold text-[#42526e] border border-[#dfe1e6] hover:bg-[#ebecf0]"
                    >
                      <Heading3 size={14} /> Tiêu đề 3
                    </button>
                    <button
                      onClick={() => addTextBlock("heading4")}
                      className="flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-bold text-[#42526e] border border-[#dfe1e6] hover:bg-[#ebecf0]"
                    >
                      <Heading size={14} /> Tiêu đề 4
                    </button>

                    <div className="mx-1 h-4 w-px bg-[#dfe1e6]" />

                    <button
                      onClick={() => addTextBlock("paragraph")}
                      className="flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-bold text-[#42526e] border border-[#dfe1e6] hover:bg-[#ebecf0]"
                    >
                      Đoạn văn
                    </button>
                    <button
                      onClick={() => addTextBlock("bullet")}
                      className="flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-bold text-[#42526e] border border-[#dfe1e6] hover:bg-[#ebecf0]"
                    >
                      <List size={14} /> Gạch đầu dòng
                    </button>
                    <button
                      onClick={() => addTextBlock("callout")}
                      className="flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-bold text-[#42526e] border border-[#dfe1e6] hover:bg-[#ebecf0]"
                    >
                      <Info size={14} /> Ghi chú
                    </button>

                    <div className="mx-1 h-4 w-px bg-[#dfe1e6]" />

                    {/* Button Insert Image */}
                    <button
                      onClick={() => inlineImageInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1 text-xs font-bold text-white hover:bg-navy shadow-sm transition"
                    >
                      {uploadingImage ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      <span>Chèn ảnh vào bài</span>
                    </button>
                  </div>

                  <span className="text-xs font-medium text-slate-500">
                    💡 <strong>Kéo thả / ⬆️⬇️:</strong> Thay đổi vị trí khối | Dán ảnh bằng <strong>Ctrl+V</strong>
                  </span>
                </div>

                {/* Visual Canvas Block List */}
                <div className="p-6 space-y-4 bg-[#fdfdfd] min-h-[400px]">
                  {blocks.length === 0 && (
                    <div className="text-center py-12 text-slate-400 text-sm">
                      Bài viết chưa có nội dung. Bấm nút phía trên hoặc nhấn Ctrl+V để chèn ảnh!
                    </div>
                  )}

                  {blocks.map((b, index) => {
                    return (
                      <div
                        key={b.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`group relative rounded-2xl border p-4 transition-all ${
                          draggedIndex === index
                            ? "border-brand bg-blue-50/50 shadow-lg opacity-60"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                        }`}
                      >
                        {/* Top Block Control Header (Type Selector + Reorder Buttons + Delete) */}
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            {/* Drag Handle Icon */}
                            <span className="cursor-grab text-slate-400 hover:text-slate-600" title="Kéo thả vị trí khối">
                              <GripVertical size={16} />
                            </span>

                            {/* Block Type Dropdown Switcher */}
                            {b.type !== "image" ? (
                              <select
                                value={b.type}
                                onChange={(e) => changeBlockType(b.id, e.target.value as BlockType)}
                                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 focus:border-brand focus:outline-none"
                              >
                                <option value="heading1">📌 Tiêu đề 1 (H1 - Lớn nhất)</option>
                                <option value="heading2">📌 Tiêu đề 2 (H2 - Lớn)</option>
                                <option value="heading3">📌 Tiêu đề 3 (H3 - Vừa)</option>
                                <option value="heading4">📌 Tiêu đề 4 (H4 - Phụ)</option>
                                <option value="paragraph">📝 Đoạn văn</option>
                                <option value="bullet">🟢 Gạch đầu dòng</option>
                                <option value="callout">💡 Khung ghi chú</option>
                              </select>
                            ) : (
                              <span className="flex items-center gap-1.5 text-xs font-bold text-brand bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                                <ImageIcon size={14} /> Khối Hình Ảnh
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Reorder Up / Down */}
                            <button
                              onClick={() => moveBlockUp(index)}
                              disabled={index === 0}
                              title="Di chuyển lên"
                              className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                            >
                              <ArrowUp size={15} />
                            </button>
                            <button
                              onClick={() => moveBlockDown(index)}
                              disabled={index === blocks.length - 1}
                              title="Di chuyển xuống"
                              className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                            >
                              <ArrowDown size={15} />
                            </button>

                            <div className="mx-1 h-3 w-px bg-slate-200" />

                            <button
                              onClick={() => removeBlock(b.id)}
                              title="Xóa khối này"
                              className="rounded p-1 text-slate-400 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Block Content Rendering & Input */}
                        {b.type === "image" ? (
                          <div>
                            {/* Image Alignment Control Bar */}
                            <div className="mb-3 flex items-center justify-between gap-2 rounded-xl bg-slate-50 p-2 border border-slate-200">
                              <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                                Căn lề hình ảnh:
                              </div>
                              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                                <button
                                  onClick={() => updateImageAlignment(b.id, "left")}
                                  className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-bold transition ${
                                    (b.align || "center") === "left"
                                      ? "bg-brand text-white shadow-sm"
                                      : "text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  <AlignLeft size={14} /> Trái
                                </button>
                                <button
                                  onClick={() => updateImageAlignment(b.id, "center")}
                                  className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-bold transition ${
                                    (b.align || "center") === "center"
                                      ? "bg-brand text-white shadow-sm"
                                      : "text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  <AlignCenter size={14} /> Giữa
                                </button>
                                <button
                                  onClick={() => updateImageAlignment(b.id, "right")}
                                  className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-bold transition ${
                                    (b.align || "center") === "right"
                                      ? "bg-brand text-white shadow-sm"
                                      : "text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  <AlignRight size={14} /> Phải
                                </button>
                              </div>
                            </div>

                            {/* Rendered Image Preview */}
                            <div
                              className={`flex ${
                                b.align === "left"
                                  ? "justify-start"
                                  : b.align === "right"
                                  ? "justify-end"
                                  : "justify-center"
                              }`}
                            >
                              <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm max-w-full bg-slate-50">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={b.src}
                                  alt={b.alt || "Ảnh minh họa"}
                                  className="max-h-[450px] w-auto object-contain"
                                />
                              </div>
                            </div>

                            {/* Caption Input */}
                            <div className="mt-2 text-center">
                              <input
                                type="text"
                                value={b.alt || ""}
                                onChange={(e) => updateImageAlt(b.id, e.target.value)}
                                placeholder="Chú thích ảnh..."
                                className="w-full max-w-md text-center text-xs italic text-slate-600 bg-transparent border-b border-slate-200 focus:border-brand focus:outline-none py-1"
                              />
                            </div>
                          </div>
                        ) : b.type === "heading1" ? (
                          <input
                            type="text"
                            value={b.text || ""}
                            onChange={(e) => updateBlockText(b.id, e.target.value)}
                            placeholder="Nhập Tiêu đề 1 (Lớn nhất)..."
                            className="w-full font-display text-3xl font-extrabold text-navy bg-transparent border-b border-transparent focus:border-brand focus:outline-none py-1.5"
                          />
                        ) : b.type === "heading2" ? (
                          <input
                            type="text"
                            value={b.text || ""}
                            onChange={(e) => updateBlockText(b.id, e.target.value)}
                            placeholder="Nhập Tiêu đề 2 (Lớn)..."
                            className="w-full font-display text-2xl font-bold text-navy bg-transparent border-b border-transparent focus:border-brand focus:outline-none py-1.5"
                          />
                        ) : b.type === "heading3" ? (
                          <input
                            type="text"
                            value={b.text || ""}
                            onChange={(e) => updateBlockText(b.id, e.target.value)}
                            placeholder="Nhập Tiêu đề 3 (Vừa)..."
                            className="w-full font-display text-xl font-bold text-navy bg-transparent border-b border-transparent focus:border-brand focus:outline-none py-1.5"
                          />
                        ) : b.type === "heading4" ? (
                          <input
                            type="text"
                            value={b.text || ""}
                            onChange={(e) => updateBlockText(b.id, e.target.value)}
                            placeholder="Nhập Tiêu đề 4 (Phụ)..."
                            className="w-full font-display text-lg font-bold text-slate-800 bg-transparent border-b border-transparent focus:border-brand focus:outline-none py-1.5"
                          />
                        ) : b.type === "callout" ? (
                          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3">
                            <Info size={18} className="mt-1 text-amber-600 flex-none" />
                            <textarea
                              value={b.text || ""}
                              onChange={(e) => updateBlockText(b.id, e.target.value)}
                              rows={2}
                              className="w-full bg-transparent text-sm font-medium text-amber-900 focus:outline-none resize-y"
                            />
                          </div>
                        ) : b.type === "bullet" ? (
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-brand flex-none" />
                            <input
                              type="text"
                              value={b.text || ""}
                              onChange={(e) => updateBlockText(b.id, e.target.value)}
                              placeholder="Nội dung gạch đầu dòng..."
                              className="w-full text-sm text-slate-800 bg-transparent border-b border-transparent focus:border-brand focus:outline-none py-1"
                            />
                          </div>
                        ) : (
                          <textarea
                            value={b.text || ""}
                            onChange={(e) => updateBlockText(b.id, e.target.value)}
                            rows={2}
                            placeholder="Viết nội dung đoạn văn..."
                            className="w-full text-sm leading-relaxed text-slate-800 bg-transparent border border-slate-200 rounded-lg p-3 focus:border-brand focus:outline-none transition resize-y"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Raw Markdown Code Tab */
              <div className="mb-8 rounded-xl border border-[#dfe1e6] overflow-hidden bg-white shadow-sm">
                <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 border-b border-slate-200">
                  Mã nguồn Markdown
                </div>
                <textarea
                  value={markdownContent}
                  onChange={(e) => handleMarkdownChange(e.target.value)}
                  rows={14}
                  className="w-full p-5 font-mono text-sm leading-relaxed text-[#172b4d] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Sidebar / Properties Panel */}
          <div className="bg-[#fafbfc] p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-[#dfe1e6] pb-3 text-sm font-bold text-[#172b4d]">
              <Layers size={18} className="text-brand" /> Thông tin dự án
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#5e6c84]">
                <FolderKanban size={14} /> Lĩnh vực / Phân loại
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="VD: WMS, SCM, ERP, IoT..."
                className="w-full rounded-md border border-[#dfe1e6] bg-white px-3 py-2 text-sm text-[#172b4d] focus:border-brand focus:outline-none"
              />
            </div>

            {/* Year & Role */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#5e6c84]">
                  <Calendar size={14} /> Năm
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-md border border-[#dfe1e6] bg-white px-3 py-2 text-sm text-[#172b4d] focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#5e6c84]">
                  <UserCheck size={14} /> Logo chữ
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="VD: WM"
                  className="w-full rounded-md border border-[#dfe1e6] bg-white px-3 py-2 text-sm text-[#172b4d] uppercase font-bold focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#5e6c84]">
                <UserCheck size={14} /> Vai trò dự án
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="VD: Senior Business Analyst..."
                className="w-full rounded-md border border-[#dfe1e6] bg-white px-3 py-2 text-sm text-[#172b4d] focus:border-brand focus:outline-none"
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#5e6c84]">
                <Tag size={14} /> Công nghệ & Công cụ (Tech Stack)
              </label>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {tech.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-brand border border-blue-200"
                  >
                    {t}
                    <button onClick={() => removeTechItem(idx)} className="hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTechItem())}
                  placeholder="Thêm tech (Figma, SQL...)"
                  className="w-full rounded-md border border-[#dfe1e6] bg-white px-3 py-1.5 text-xs focus:border-brand focus:outline-none"
                />
                <button
                  onClick={addTechItem}
                  className="rounded-md bg-[#ebecf0] px-3 py-1.5 text-xs font-bold text-[#42526e] hover:bg-[#dfe1e6]"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Impact points */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#5e6c84]">
                <Check size={14} /> Kết quả / Tác động (Key Impact)
              </label>
              <div className="mb-2 space-y-1.5">
                {impact.map((imp, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-2 rounded-md border border-[#dfe1e6] bg-white p-2 text-xs text-[#172b4d]"
                  >
                    <span>{imp}</span>
                    <button
                      onClick={() => removeImpactItem(idx)}
                      className="text-[#6b778c] hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newImpact}
                  onChange={(e) => setNewImpact(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImpactItem())}
                  placeholder="Thêm kết quả (VD: Giảm 40% sai sót...)"
                  className="w-full rounded-md border border-[#dfe1e6] bg-white px-3 py-1.5 text-xs focus:border-brand focus:outline-none"
                />
                <button
                  onClick={addImpactItem}
                  className="rounded-md bg-[#ebecf0] px-3 py-1.5 text-xs font-bold text-[#42526e] hover:bg-[#dfe1e6]"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Slug URL */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5e6c84]">
                Đường dẫn URL (Slug)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-md border border-[#dfe1e6] bg-white px-3 py-2 text-xs font-mono text-[#172b4d] focus:border-brand focus:outline-none"
              />
              <span className="mt-1 block text-[11px] text-[#6b778c]">
                URL: /du-an/{slug || "slug-du-an"}
              </span>
            </div>

            {/* Featured toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-[#172b4d]">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                />
                Hiển thị ở mục “Dự án tiêu biểu”
              </label>
            </div>
          </div>
        </div>
      ) : (
        /* Public Page Preview Mode */
        <div className="bg-white p-8 md:p-12 max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-brand">
                {category}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {year}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {role}
              </span>
            </div>
            <h1 className="font-display text-4xl font-extrabold text-[#172b4d]">{title}</h1>
            <p className="text-lg text-slate-600 leading-relaxed">{summary}</p>
          </div>

          {image && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md aspect-[21/9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={title} className="h-full w-full object-cover" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="font-bold text-slate-900 mb-2">Bối cảnh & Vấn đề</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{problem}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="font-bold text-slate-900 mb-2">Giải pháp</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{solution}</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-3">Kết quả đạt được</h3>
            <ul className="space-y-2">
              {impact.map((imp, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-slate-800">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-none" />
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="font-bold text-slate-900 text-lg mb-3">Chi tiết dự án</h3>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <RichDocumentRenderer content={compileBlocksToMarkdown(blocks)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
