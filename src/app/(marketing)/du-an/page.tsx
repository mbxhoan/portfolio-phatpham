import type { Metadata } from "next";
import { ProjectsHeader } from "@/components/projects/projects-header";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";

export const metadata: Metadata = {
  title: "Dự án",
  description:
    "Danh sách dự án tiêu biểu của Phạm Minh Phát: WMS, ERP, IoT và các giải pháp số hóa vận hành doanh nghiệp.",
};

export default function ProjectsPage() {
  return (
    <>
      <ProjectsHeader />

      <section className="py-[clamp(40px,6vw,72px)]">
        <div className="container-x">
          <ProjectsExplorer />
        </div>
      </section>
    </>
  );
}
