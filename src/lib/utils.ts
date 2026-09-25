import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a timestamp (ms) into relative Vietnamese time (e.g. "Vừa xong", "5 phút trước", "2 giờ trước") */
export function formatRelativeTime(createdAt?: number, fallbackTime?: string): string {
  if (!createdAt) return fallbackTime || "Vừa xong";
  const now = Date.now();
  const diffMs = now - createdAt;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Vừa xong";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} ngày trước`;

  const d = new Date(createdAt);
  const dateStr = d.toLocaleDateString("vi-VN");
  const timeStr = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  return `${timeStr} - ${dateStr}`;
}

/** Formats a timestamp (ms) into exact Vietnamese datetime with relative suffix */
export function formatFullDateTime(createdAt?: number, fallbackTime?: string): string {
  if (!createdAt) return fallbackTime || "Vừa xong";
  const d = new Date(createdAt);
  const dateStr = d.toLocaleDateString("vi-VN");
  const timeStr = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const relative = formatRelativeTime(createdAt, fallbackTime);
  return `${timeStr} ngày ${dateStr} (${relative})`;
}

