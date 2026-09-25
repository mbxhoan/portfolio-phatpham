"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { usePortfolio } from "@/lib/store";
import { getVisibleSocials } from "@/lib/socials";

export function ContactInfo() {
  const { data } = usePortfolio();
  const { person } = data;
  const visibleSocials = getVisibleSocials(data);

  return (
    <aside className="flex flex-col gap-7 rounded-xl4 border border-brand/10 bg-brand/[0.08] p-8">
      <h3 className="text-2xl font-bold text-brand">Nodal Points</h3>
      <div className="flex flex-col gap-[18px]">
        {person.phone && (
          <InfoRow icon={<Phone size={18} />} k="Hotline / Phone" v={person.phone} href={`tel:${person.phone.replace(/\s+/g, "")}`} />
        )}
        <InfoRow icon={<Mail size={18} />} k="Địa chỉ mail" v={person.email} href={`mailto:${person.email}`} />
        <InfoRow icon={<MapPin size={18} />} k="Địa chỉ" v={person.address} />
      </div>

      {visibleSocials.length > 0 && (
        <>
          <div className="h-px bg-brand/10" />
          <div>
            <p className="mb-3.5 text-[13px] font-bold uppercase tracking-[0.07em] text-body-2">Mạng xã hội & Kênh liên kết</p>
            <div className="flex flex-col gap-2.5">
              {visibleSocials.map(({ id, label, icon: IconComponent, url }) => (
                <a
                  key={id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-[14px] bg-white/60 px-3.5 py-2.5 font-semibold text-navy transition hover:translate-x-0.5 hover:bg-white hover:text-brand shadow-sm"
                >
                  <span className="grid h-[34px] w-[34px] place-items-center rounded-[10px] bg-soft-2 text-brand flex-none">
                    <IconComponent size={17} />
                  </span>
                  <span className="text-sm font-bold">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

function InfoRow({ icon, k, v, href }: { icon: React.ReactNode; k: string; v: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-4 group">
      <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-brand-bright text-[#EEEFFF] transition group-hover:scale-105">
        {icon}
      </span>
      <div>
        <div className="text-[13px] font-bold uppercase tracking-[0.06em] text-body-2">{k}</div>
        <div className="break-words font-display text-[18px] font-bold text-ink transition group-hover:text-brand">{v}</div>
      </div>
    </div>
  );

  if (href) {
    return <a href={href} className="block transition">{content}</a>;
  }
  return content;
}
