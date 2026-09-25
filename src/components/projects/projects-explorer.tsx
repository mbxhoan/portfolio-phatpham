"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { usePortfolio } from "@/lib/store";
import { cn } from "@/lib/utils";

const PER_PAGE = 6;

export function ProjectsExplorer() {
  const { data } = usePortfolio();
  const [cat, setCat] = useState("Tất cả");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return data.projects.filter((p) => {
      const okCat = cat === "Tất cả" || p.category === cat;
      const hay = (p.title + " " + p.summary + " " + p.tech.join(" ")).toLowerCase();
      return okCat && (!q || hay.includes(q.toLowerCase()));
    });
  }, [data.projects, cat, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <>
      {/* toolbar */}
      <div className="mb-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
        <button className="grid h-[55px] w-[55px] flex-none place-items-center rounded-pill bg-[#ECEEF0] text-ink transition hover:bg-[#dde0e3]" aria-label="Bộ lọc">
          <SlidersHorizontal size={20} />
        </button>
        <div className="relative flex-1">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-body-2" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Tìm kiếm dự án..."
            className="h-[55px] w-full rounded-pill border-[1.5px] border-transparent bg-[#ECEEF0] pl-12 pr-5 text-[16px] outline-none focus:border-brand focus:bg-white"
          />
        </div>
      </div>

      {/* chips */}
      <div className="mb-9 flex flex-wrap gap-2.5">
        {data.categories.map((c) => (
          <button
            key={c}
            onClick={() => { setCat(c); setPage(1); }}
            className={cn(
              "h-9 rounded-pill border px-[18px] text-sm font-semibold transition",
              cat === c
                ? "border-navy bg-navy text-white"
                : "border-[#e2e8f0] bg-white text-body hover:border-brand"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* grid */}
      {slice.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {slice.map((p) => (
            <ProjectCard key={p.slug} project={p} showTag />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-body-2">Không tìm thấy dự án phù hợp.</p>
      )}

      {/* pager */}
      {pages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          <PagerBtn onClick={() => setPage(Math.max(1, current - 1))}>‹</PagerBtn>
          {Array.from({ length: pages }).map((_, i) => (
            <PagerBtn key={i} active={current === i + 1} onClick={() => setPage(i + 1)}>
              {i + 1}
            </PagerBtn>
          ))}
          <PagerBtn onClick={() => setPage(Math.min(pages, current + 1))}>›</PagerBtn>
        </div>
      )}
    </>
  );
}

function PagerBtn({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-[42px] min-w-[42px] rounded-[11px] border text-sm font-semibold transition",
        active ? "border-navy bg-navy text-white" : "border-[#e2e8f0] bg-white text-body hover:border-brand hover:text-navy"
      )}
    >
      {children}
    </button>
  );
}
