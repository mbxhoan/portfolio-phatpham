import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types/portfolio";

export function ProjectCard({ project, showTag = false }: { project: Project; showTag?: boolean }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-transparent bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-[0_20px_45px_-12px_rgba(37,99,235,0.18)]">
      <Link href={`/du-an/${project.slug}`} className="grid aspect-[382/288] place-items-center overflow-hidden bg-slate-100/70">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.image} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <span className="grid aspect-square w-[46%] place-items-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 font-display text-[34px] font-extrabold text-white shadow-[0_14px_30px_-10px_rgba(37,99,235,0.4)]">
            {project.logo}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3.5 p-7">
        {showTag && <span className="tag w-fit">{project.category} · {project.year}</span>}
        <h3 className="text-xl font-bold leading-[1.32] text-slate-900 group-hover:text-blue-600 transition-colors duration-200">{project.title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{project.summary}</p>
        <Link
          href={`/du-an/${project.slug}`}
          className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 group-hover:text-indigo-600"
        >
          Xem chi tiết dự án
          <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
