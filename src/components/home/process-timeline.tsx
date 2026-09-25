"use client";

import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/lib/icon-map";
import { usePortfolio } from "@/lib/store";
import { cn } from "@/lib/utils";

function StepCard({ icon, image }: { icon?: Parameters<typeof Icon>[0]["name"]; image?: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-[0_10px_25px_-10px_rgba(15,23,42,0.06)]">
      <div className="grid aspect-[576/192] place-items-center rounded-xl bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-cyan-50/80 text-blue-600 border border-blue-100/60 overflow-hidden relative">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <Icon name={icon || "search"} className="h-12 w-12 text-blue-600 opacity-90" />
        )}
      </div>
    </div>
  );
}

export function ProcessTimeline() {
  const { data } = usePortfolio();
  const { process } = data;
  return (
    <section id="process" className="relative py-[clamp(56px,7vw,96px)] bg-white/50">
      <div className="container-x">
        <SectionHeading
          title={data.processTitle || "Quy trình Hợp tác"}
          inter
          subtitle={data.processSubtitle ?? "Chúng tôi áp dụng mô hình vận hành chuyên nghiệp, đảm bảo tính minh bạch và hiệu quả cao nhất cho mọi sản phẩm công nghệ."}
        />

        <div className="relative flex flex-col gap-14">
          {/* center / left rail */}
          <span className="absolute bottom-2 top-2 w-0.5 bg-gradient-to-b from-blue-600 via-indigo-500 to-cyan-500 left-[25px] lg:left-1/2 lg:-translate-x-1/2 opacity-70" />

          {process.map((step, i) => {
            const left = i % 2 === 0;
            return (
              <Reveal key={step.title}>
                <div className="relative grid grid-cols-1 items-center gap-3.5 pl-14 lg:grid-cols-[1fr_50px_1fr] lg:gap-0 lg:pl-0">
                  {/* text */}
                  <div
                    className={cn(
                      "flex flex-col gap-3 lg:order-none",
                      left ? "lg:pr-12 lg:text-right" : "lg:order-3 lg:pl-12"
                    )}
                  >
                    <h3 className="font-sans text-2xl font-semibold text-navy">
                      {i + 1}. {step.title}
                    </h3>
                    <p className="text-[16px] leading-relaxed text-body">{step.body}</p>
                  </div>

                  {/* node */}
                  <div className="absolute left-0 top-0 lg:relative lg:order-2 lg:justify-self-center">
                    <div className="grid h-12 w-[50px] place-items-center rounded-[14px] border-4 border-bg bg-navy-2 text-[16px] font-bold text-white shadow-[0_14px_22px_-8px_rgba(0,0,0,.4)]">
                      {i + 1}
                    </div>
                  </div>

                  {/* media */}
                  <div className={cn(left ? "lg:order-3 lg:pl-12" : "lg:order-1 lg:pr-12")}>
                    <StepCard icon={step.icon} image={step.image} />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
