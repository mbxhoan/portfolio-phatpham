"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Icon } from "@/lib/icon-map";
import { usePortfolio } from "@/lib/store";

export function Fields() {
  const { data } = usePortfolio();
  // Include all items except those explicitly marked visible === false
  const fields = data.fields.filter((f) => f.visible !== false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = fields.length;

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

  // Seamless reset after sliding past total items
  const handleTransitionEnd = () => {
    if (currentIndex >= total) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex % total);
    }
  };

  if (fields.length === 0) return null;

  // Render triplicated list for smooth continuous infinite loop
  const displayFields = total > 1 ? [...fields, ...fields, ...fields] : fields;

  return (
    <section className="relative bg-transparent py-[clamp(56px,7vw,96px)] overflow-hidden">
      <div className="container-x">
        <SectionHeading
          title={data.fieldsTitle || "Lĩnh vực hoạt động"}
          subtitle={data.fieldsSubtitle ?? "Những bài toán vận hành mà tôi đã đồng hành cùng doanh nghiệp giải quyết bằng phần mềm."}
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
            {displayFields.map((f, i) => (
              <div
                key={`${f.name}-${i}`}
                className="w-full sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] flex-none"
              >
                <div className="group flex h-full flex-col gap-4 rounded-3xl bg-white p-8 sm:p-10 border border-transparent shadow-[0_10px_30px_-10px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-[0_20px_45px_-12px_rgba(37,99,235,0.18)]">
                  <div className="grid h-16 w-16 flex-none place-items-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 border border-blue-100/80 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <Icon name={f.icon} className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">{f.name}</h3>
                  <p className="text-[15px] leading-relaxed text-slate-600">{f.body}</p>
                </div>
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
              {fields.map((_, idx) => (
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
                  aria-label={`Chuyển đến lĩnh vực ${idx + 1}`}
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
