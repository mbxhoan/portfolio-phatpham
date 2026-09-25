import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";

export const metadata: Metadata = {
  title: "Dự án",
  description:
    "Danh sách dự án tiêu biểu của Phạm Minh Phát: WMS, ERP, IoT và các giải pháp số hóa vận hành doanh nghiệp.",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="pb-2 pt-[calc(72px+56px)] text-center">
        <div className="container-x">
          <Reveal>
            <h1 className="text-[clamp(36px,5vw,60px)] font-extrabold tracking-[-0.045em] text-ink">
              Danh sách dự án
            </h1>
          </Reveal>
          <Reveal delay={1}>
            <p className="mx-auto mt-[18px] max-w-[760px] text-[19px] font-light leading-snug text-[#434655]">
              Tuyển tập các hệ thống tôi đã phân tích và triển khai — từ quản lý kho, ERP đến các giải pháp IoT.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-[clamp(40px,6vw,72px)]">
        <div className="container-x">
          <ProjectsExplorer />
        </div>
      </section>
    </>
  );
}
