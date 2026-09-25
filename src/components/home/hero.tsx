"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Portrait } from "@/components/site/portrait";
import { usePortfolio } from "@/lib/store";

interface HeroProps {
  primary?: { label: string; href: string };
}

export function Hero({ primary = { label: "Năng lực chuyên môn", href: "/nang-luc" } }: HeroProps) {
  const { data } = usePortfolio();
  const { person } = data;
  const ql = person.quickLinks || {};
  const buttons = [
    {
      id: "capability",
      href: "/nang-luc",
      label: ql.capability?.label || primary.label,
      visible: ql.capability ? ql.capability.visible : person.showCapabilityLink !== false,
      color: ql.capability?.color || "#004AC6",
    },
    {
      id: "projects",
      href: "/du-an",
      label: ql.projects?.label || "Dự án thực hiện",
      visible: ql.projects ? ql.projects.visible : person.showProjectsLink === true,
      color: ql.projects?.color || "#000B60",
    },
    {
      id: "contact",
      href: "/lien-he",
      label: ql.contact?.label || "Liên hệ ngay",
      visible: ql.contact ? ql.contact.visible : person.showContactLink !== false,
      color: ql.contact?.color || "#475569",
    },
  ].filter((b) => b.visible);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-100/70 via-slate-50 to-white pb-16 pt-[calc(72px+70px)]">
      {/* Tech ambient radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(37,99,235,0.12),transparent_70%)]" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.25fr_0.9fr]">
        <div>
          <Reveal>
            <span className="pill-badge">
              <Zap size={14} className="fill-blue-600 text-blue-600 animate-pulse" />
              <span className="bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent font-bold">
                {person.role}
              </span>
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="my-5 text-[clamp(40px,5.4vw,64px)] font-extrabold leading-[1.02] tracking-[-0.05em] text-gradient">
              {person.name}
            </h1>
          </Reveal>
          <Reveal delay={1}>
            <p className="max-w-[580px] text-[17px] leading-relaxed text-slate-600 font-normal">{person.tagline}</p>
          </Reveal>
          {buttons.length > 0 && (
            <Reveal delay={2}>
              <div className="mt-8 flex flex-wrap gap-4">
                {buttons.map((b) => (
                  <Link
                    key={b.id}
                    href={b.href}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-white shadow-[0_10px_20px_-5px_rgba(37,99,235,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_25px_-5px_rgba(37,99,235,0.45)] active:translate-y-0"
                    style={{ backgroundColor: b.color }}
                  >
                    <span>{b.label}</span>
                    <ArrowRight size={18} />
                  </Link>
                ))}
              </div>
            </Reveal>
          )}
        </div>
        <Reveal delay={2}>
          <Portrait />
        </Reveal>
      </div>
    </section>
  );
}
