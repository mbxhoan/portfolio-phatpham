import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/project-detail";
import portfolio from "@/data/portfolio";

export function generateStaticParams() {
  return portfolio.projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = portfolio.projects.find((x) => x.slug === params.slug);
  if (!p) return { title: "Dự án" };
  return { title: p.title, description: p.summary };
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  // Validate against the base data for SSR/SEO + static params; the client
  // component renders the live (possibly edited) content from the store.
  const exists = portfolio.projects.some((x) => x.slug === params.slug);
  if (!exists) notFound();

  return <ProjectDetail slug={params.slug} />;
}
