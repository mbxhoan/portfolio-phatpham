"use client";

import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { usePortfolio } from "@/lib/store";

export function ProjectDetail({ slug }: { slug: string }) {
  const { data } = usePortfolio();
  const p = data.projects.find((x) => x.slug === slug);

  if (!p) {
    return (
      <section className="py-[clamp(40px,6vw,72px)] pt-[calc(72px+40px)]">
        <div className="container-x">
          <Link href="/du-an" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
            <ArrowLeft size={16} /> Quay lại danh sách
          </Link>
          <p className="py-16 text-center text-body-2">Dự án không còn tồn tại.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-[clamp(40px,6vw,72px)] pt-[calc(72px+40px)]">
      <div className="container-x">
        <Link href="/du-an" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>

        <Reveal>
          <div className="mb-9 flex flex-col gap-[18px]">
            <div className="flex flex-wrap gap-2.5">
              <span className="tag">{p.category}</span>
              <span className="tag">{p.year}</span>
              <span className="tag">{p.role}</span>
            </div>
            <h1 className="max-w-[18ch] font-display text-[clamp(30px,4.4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
              {p.title}
            </h1>
            <p className="max-w-[60ch] text-[19px] text-body">{p.summary}</p>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="relative mb-12 grid aspect-[16/7] place-items-center overflow-hidden rounded-xl3 bg-gradient-to-br from-[#0a1f6e] via-brand to-[#3f73ff]">
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(600px_240px_at_30%_0,rgba(255,255,255,.18),transparent_70%)]" />
                <span className="relative grid h-[120px] w-[120px] place-items-center rounded-[30px] border border-white/25 bg-white/10 font-display text-[42px] font-extrabold text-white backdrop-blur">
                  {p.logo}
                </span>
              </>
            )}
          </div>
        </Reveal>

        <div className="grid items-start gap-12 lg:grid-cols-[1.7fr_1fr]">
          <Reveal delay={1}>
            <div>
              <Block title="Bối cảnh & Vấn đề">{p.problem}</Block>
              <Block title="Giải pháp">{p.solution}</Block>
              <div className="mb-8">
                <h2 className="mb-3 font-display text-[22px] font-extrabold text-navy">Kết quả</h2>
                <ul className="flex flex-col gap-3">
                  {p.impact.map((it) => (
                    <li key={it} className="flex items-start gap-3 font-semibold text-ink">
                      <Check size={22} className="mt-0.5 flex-none text-brand" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <aside className="sticky top-24 rounded-[28px] border border-[#e2e8f0] bg-white p-7 shadow-soft">
              <h3 className="mb-4 text-[13px] font-bold uppercase tracking-[0.08em] text-body-2">Thông tin dự án</h3>
              <Row k="Lĩnh vực" v={p.category} />
              <Row k="Năm" v={p.year} />
              <Row k="Vai trò" v={p.role} />
              <h3 className="mb-3 mt-[22px] text-[13px] font-bold uppercase tracking-[0.08em] text-body-2">Công nghệ</h3>
              <div className="flex flex-wrap gap-2">
                {p.tech.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
              <Link href="/lien-he" className="btn btn-sm btn-primary mt-6 w-full">
                Trao đổi dự án tương tự
              </Link>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="mb-3 font-display text-[22px] font-extrabold text-navy">{title}</h2>
      <p className="text-[17px] leading-[1.7] text-body">{children}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-[#e2e8f0] py-2.5 text-sm last:border-0">
      <span className="text-body-2">{k}</span>
      <span className="text-right font-bold text-ink">{v}</span>
    </div>
  );
}
