"use client";

import { usePortfolio } from "@/lib/store";
import { getVisibleSocials } from "@/lib/socials";

export function Footer() {
  const { data } = usePortfolio();
  const visibleSocials = getVisibleSocials(data);

  return (
    <footer className="border-t border-[#e2e8f0]/60 bg-[rgba(228,225,235,0.53)]">
      <div className="container-x flex flex-wrap items-center justify-between gap-6 py-9">
        <div>
          <p className="text-sm font-bold tracking-[0.04em] text-[#0F172A]">SECRECT TEAM</p>
          <p className="mt-1 text-xs tracking-[0.02em] text-[#64748B]">
            Powered by SECRECT TEAM · © {new Date().getFullYear()} {data.person.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {visibleSocials.map(({ id, label, icon: IconComponent, url }) => (
            <a
              key={id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="grid h-[38px] w-[38px] place-items-center rounded-[11px] bg-white text-navy shadow-soft transition hover:-translate-y-0.5 hover:text-brand"
            >
              <IconComponent size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
