import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { CTA } from "@/components/home/cta";
import { CapabilitiesView } from "@/components/home/capabilities-view";

export const metadata: Metadata = {
  title: "Năng lực",
  description:
    "Năng lực chuyên môn và bộ công cụ của Phạm Minh Phát: BPMN, SQL, API, Agile/Scrum, phân tích yêu cầu và các công cụ BA chuyên nghiệp.",
};

export default function CapabilitiesPage() {
  return (
    <>
      <Hero primary={{ label: "Dự án tiêu biểu", href: "/du-an" }} />

      <CapabilitiesView />

      <CTA
        title="Cùng xây dựng giải pháp tiếp theo của bạn"
        subtitle="Từ khảo sát nghiệp vụ đến bàn giao hệ thống — tôi sẵn sàng đồng hành."
      />
    </>
  );
}
