"use client";

import { Reveal } from "@/components/motion/reveal";
import { usePortfolio } from "@/lib/store";

export function ProjectsHeader() {
  const { data } = usePortfolio();

  const title = data.projectsPageTitle || "Danh sách dự án";
  const subtitle =
    data.projectsPageSubtitle ||
    "Tuyển tập các hệ thống tôi đã phân tích và triển khai — từ quản lý kho, ERP đến các giải pháp IoT.";

  return (
    <section className="pb-2 pt-[calc(72px+56px)] text-center">
      <div className="container-x">
        <Reveal>
          <h1 className="text-[clamp(36px,5vw,60px)] font-extrabold tracking-[-0.045em] text-ink">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={1}>
          <p className="mx-auto mt-[18px] max-w-[760px] text-[19px] font-light leading-snug text-[#434655]">
            {subtitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
