"use client";

import { Mail, MapPin, MessageSquare, Youtube, Send } from "lucide-react";
import { usePortfolio } from "@/lib/store";

const socialIcon: Record<string, typeof Mail> = {
  Facebook: MessageSquare,
  Zalo: Send,
  YouTube: Youtube,
  Mail: Mail,
};

export function ContactInfo() {
  const { data } = usePortfolio();
  const { person, socials } = data;
  return (
    <aside className="flex flex-col gap-7 rounded-xl4 border border-brand/10 bg-brand/[0.08] p-8">
      <h3 className="text-2xl font-bold text-brand">Nodal Points</h3>
      <div className="flex flex-col gap-[18px]">
        <InfoRow icon={<Mail size={18} />} k="Địa chỉ mail" v={person.email} />
        <InfoRow icon={<MapPin size={18} />} k="Địa chỉ" v={person.address} />
      </div>
      <div className="h-px bg-brand/10" />
      <div>
        <p className="mb-3.5 text-[13px] font-bold uppercase tracking-[0.07em] text-body-2">Mạng xã hội</p>
        <div className="flex flex-col gap-3">
          {socials.map((s) => {
            const I = socialIcon[s.label] ?? MessageSquare;
            return (
              <a
                key={s.label}
                href={s.href}
                className="flex items-center gap-3 rounded-[14px] bg-white/55 px-3.5 py-2.5 font-semibold text-navy transition hover:translate-x-0.5 hover:bg-white"
              >
                <span className="grid h-[34px] w-[34px] place-items-center rounded-[10px] bg-soft-2 text-brand">
                  <I size={17} />
                </span>
                {s.label}
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function InfoRow({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-brand-bright text-[#EEEFFF]">
        {icon}
      </span>
      <div>
        <div className="text-[13px] font-bold uppercase tracking-[0.06em] text-body-2">{k}</div>
        <div className="break-words font-display text-[18px] font-bold text-ink">{v}</div>
      </div>
    </div>
  );
}
