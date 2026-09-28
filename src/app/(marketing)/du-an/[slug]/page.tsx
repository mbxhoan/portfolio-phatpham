import type { Metadata } from "next";
import { ProjectDetail } from "@/components/projects/project-detail";
import portfolio from "@/data/portfolio";

export const dynamicParams = true;

export function generateStaticParams() {
  return portfolio.projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = portfolio.projects.find((x) => x.slug === params.slug);
  return {
    title: p?.title ? `${p.title} | Dự án` : "Chi tiết dự án",
    description: p?.summary || "Thông tin chi tiết dự án",
  };
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  return <ProjectDetail slug={params.slug} />;
}
