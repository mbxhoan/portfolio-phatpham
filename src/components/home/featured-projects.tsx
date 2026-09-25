"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { ProjectCard } from "@/components/projects/project-card";
import { usePortfolio } from "@/lib/store";

export function FeaturedProjects() {
  const { data } = usePortfolio();
  const featured = data.projects.filter((p) => p.featured);
  const displayProjectsList = featured.length > 0 ? featured : data.projects;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = displayProjectsList.length;

  // Auto-slide every 1.5s
  useEffect(() => {
    if (total <= 1 || isHovered) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 1500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isHovered, currentIndex]);

  const nextSlide = () => {
    if (total <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (total <= 1) return;
    setIsTransitioning(true);
    if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(total);
      setTimeout(() => {
        setIsTransitioning(true);
        setCurrentIndex(total - 1);
      }, 20);
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= total) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex % total);
    }
  };

  if (total === 0) return null;

  // Triplicated array for smooth infinite continuous loop
  const displayList = total > 1 ? [...displayProjectsList, ...displayProjectsList, ...displayProjectsList] : displayProjectsList;

  return (
    <section className="relative bg-transparent py-[clamp(56px,7vw,96px)] overflow-hidden">
      <div className="container-x">
        <SectionHeading
          title={data.projectsTitle || "Dự án tiêu biểu"}
          subtitle={data.projectsSubtitle ?? "Các sản phẩm & hệ thống thực tế tôi đã tham gia phân tích, thiết kế và triển khai cho doanh nghiệp."}
        />

        {/* Carousel Viewport */}
        <div
          className="overflow-hidden py-3"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            onTransitionEnd={handleTransitionEnd}
            className={`flex gap-6 ${isTransitioning ? "transition-transform duration-500 ease-in-out" : "transition-none"}`}
            style={{
              transform: `translateX(calc(-${currentIndex} * (100% + 24px) / 3))`,
            }}
          >
            {displayList.map((p, i) => (
              <div
                key={`${p.slug}-${i}`}
                className="w-full sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] flex-none"
              >
                <ProjectCard project={p} showTag />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Control Bar: Left Arrow + Dots Indicator + Right Arrow */}
        {total > 1 && (
          <div className="mt-9 flex items-center justify-center gap-5">
            <button
              onClick={prevSlide}
              className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-md active:scale-95"
              aria-label="Lướt sang trái"
              title="Lướt sang trái"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {displayProjectsList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsTransitioning(true);
                    setCurrentIndex(idx);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex % total === idx
                      ? "w-8 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Chuyển đến dự án ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-md active:scale-95"
              aria-label="Lướt sang phải"
              title="Lướt sang phải"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
