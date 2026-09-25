"use client";

import { Facebook, Instagram, Youtube } from "lucide-react";
import { usePortfolio } from "@/lib/store";

export function Footer() {
  const { data } = usePortfolio();
  const footerSocials = data.footerSocials || {
    facebook: { visible: true, url: "#" },
    instagram: { visible: true, url: "#" },
    youtube: { visible: true, url: "#" },
  };

  const socialsList = [
    { label: "Facebook", href: footerSocials.facebook?.url || "#", Icon: Facebook, visible: footerSocials.facebook?.visible !== false },
    { label: "Instagram", href: footerSocials.instagram?.url || "#", Icon: Instagram, visible: footerSocials.instagram?.visible !== false },
    { label: "YouTube", href: footerSocials.youtube?.url || "#", Icon: Youtube, visible: footerSocials.youtube?.visible !== false },
  ].filter((s) => s.visible);

  return (
    <footer className="border-t border-[#e2e8f0]/60 bg-[rgba(228,225,235,0.53)]">
      <div className="container-x flex flex-wrap items-center justify-between gap-6 py-9">
        <div>
          <p className="text-sm font-bold tracking-[0.04em] text-[#0F172A]">SECRECT TEAM</p>
          <p className="mt-1 text-xs tracking-[0.02em] text-[#64748B]">
            Powered by SECRECT TEAM · © {new Date().getFullYear()} {data.person.name}
          </p>
        </div>
        <div className="flex gap-3">
          {socialsList.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="grid h-[38px] w-[38px] place-items-center rounded-[11px] bg-white text-navy shadow-soft transition hover:-translate-y-0.5 hover:text-brand"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
