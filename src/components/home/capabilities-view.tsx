"use client";

import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/lib/icon-map";
import { usePortfolio } from "@/lib/store";
import type { Capability } from "@/types/portfolio";

function CapabilityGrid({ items }: { items: Capability[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((c, i) => (
        <Reveal as="article" delay={i % 3} key={c.name + i}>
          <div className="flex h-full flex-col gap-4 rounded-xl4 bg-white p-10 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_50px_-18px_rgba(19,27,46,.18)]">
            <div className="grid h-16 w-16 place-items-center rounded-[18px] bg-soft-2 text-brand overflow-hidden">
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt={c.name} className="h-9 w-9 object-contain" />
              ) : (
                <Icon name={c.icon} className="h-7 w-7" />
              )}
            </div>
            <h3 className="text-2xl font-bold">{c.name}</h3>
            <p className="text-[16px] leading-relaxed text-body-2">{c.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function CapabilitiesView() {
  const { data } = usePortfolio();
  return (
    <>
      <section className="bg-bg py-[clamp(56px,7vw,96px)]">
        <div className="container-x">
          <SectionHeading
            center={false}
            title={data.capabilitiesSectionTitle || "Năng lực chuyên môn"}
            subtitle={
              data.capabilitiesSectionSubtitle ||
              "Bộ kỹ năng cốt lõi giúp tôi phân tích, đặc tả và đồng hành cùng đội phát triển từ ý tưởng đến vận hành."
            }
          />
          <CapabilityGrid items={data.capabilities} />
        </div>
      </section>

      <section className="bg-surface pb-[clamp(56px,7vw,96px)]">
        <div className="container-x">
          <SectionHeading
            center={false}
            title={data.toolsSectionTitle || "Công cụ"}
            subtitle={
              data.toolsSectionSubtitle ||
              "Những công cụ tôi sử dụng hằng ngày để mô hình hóa, quản lý và bàn giao công việc."
            }
          />
          <CapabilityGrid items={data.tools} />
        </div>
      </section>
    </>
  );
}
