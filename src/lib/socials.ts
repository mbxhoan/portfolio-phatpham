import { Facebook, Instagram, Youtube, Send, Mail, ShoppingBag, Video, Linkedin, Github } from "lucide-react";
import type { Portfolio } from "@/types/portfolio";

export const SOCIAL_PLATFORMS = [
  { id: "facebook", label: "Facebook", icon: Facebook, defaultUrl: "https://facebook.com", placeholder: "https://facebook.com/..." },
  { id: "zalo", label: "Zalo", icon: Send, defaultUrl: "https://zalo.me", placeholder: "https://zalo.me/... hoặc SĐT" },
  { id: "email", label: "Mail / Email", icon: Mail, defaultUrl: "mailto:email@example.com", placeholder: "mailto:email@example.com" },
  { id: "shopee", label: "Shopee", icon: ShoppingBag, defaultUrl: "", placeholder: "https://shopee.vn/..." },
  { id: "tiktok", label: "TikTok", icon: Video, defaultUrl: "", placeholder: "https://tiktok.com/@..." },
  { id: "instagram", label: "Instagram", icon: Instagram, defaultUrl: "", placeholder: "https://instagram.com/..." },
  { id: "youtube", label: "YouTube", icon: Youtube, defaultUrl: "", placeholder: "https://youtube.com/..." },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, defaultUrl: "", placeholder: "https://linkedin.com/in/..." },
  { id: "github", label: "GitHub", icon: Github, defaultUrl: "", placeholder: "https://github.com/..." },
] as const;

export type SocialPlatformId = typeof SOCIAL_PLATFORMS[number]["id"];

export function getVisibleSocials(data: Portfolio) {
  const footerSocials = data.footerSocials || {};

  return SOCIAL_PLATFORMS.map((platform) => {
    const item = footerSocials[platform.id as keyof typeof footerSocials];
    const visible = item ? item.visible : (platform.id === "facebook" || platform.id === "zalo" || platform.id === "email");
    const url = item?.url !== undefined ? item.url : platform.defaultUrl;
    return { ...platform, visible, url };
  }).filter((s) => s.visible && s.url && s.url.trim() !== "");
}
