"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { AdminButton } from "@/components/admin/ui";
import { fileToCompressedBlob } from "@/lib/image";
import { uploadImage } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  placeholder?: React.ReactNode;
  /** Tailwind aspect class for the preview, e.g. "aspect-square". */
  aspect?: string;
  /** Preview width class, e.g. "w-24". */
  widthClass?: string;
  rounded?: string;
  /** Longest-edge cap passed to the compressor. */
  maxDim?: number;
}

export function ImageUpload({
  value,
  onChange,
  placeholder,
  aspect = "aspect-square",
  widthClass = "w-24",
  rounded = "rounded-xl",
  maxDim,
}: ImageUploadProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const blob = await fileToCompressedBlob(file, maxDim);
      onChange(await uploadImage(blob));
    } catch (err) {
      const reason = err instanceof Error ? err.message : "";
      alert(
        reason
          ? `Không tải ảnh lên được (${reason}). Nếu vừa thêm biến môi trường trên Vercel, hãy Redeploy rồi đăng nhập lại.`
          : "Không tải ảnh lên được. Kiểm tra kết nối / đăng nhập rồi thử lại."
      );
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div
        className={cn(
          "relative flex-none overflow-hidden border border-[#e4e2e6] bg-soft-2",
          aspect,
          widthClass,
          rounded
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-[#9aa6e0]">
            {placeholder ?? <ImagePlus size={22} />}
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-2">
        <input ref={ref} type="file" accept="image/*" hidden onChange={pick} />
        <AdminButton variant="ghost" type="button" onClick={() => ref.current?.click()} disabled={busy}>
          <ImagePlus size={16} /> {busy ? "Đang xử lý…" : value ? "Đổi ảnh" : "Tải ảnh lên"}
        </AdminButton>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#b4453a] hover:underline"
          >
            <Trash2 size={14} /> Gỡ ảnh (dùng placeholder)
          </button>
        )}
      </div>
    </div>
  );
}
