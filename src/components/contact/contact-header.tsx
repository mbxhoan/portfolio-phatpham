"use client";

import { Reveal } from "@/components/motion/reveal";
import { usePortfolio } from "@/lib/store";

export function ContactHeader() {
  const { data } = usePortfolio();

  const title = data.contactTitle || "Liên hệ";
  const subtitle =
    data.contactSubtitle ||
    "Bạn đã sẵn sàng thiết kế kiến trúc hạ tầng kỹ thuật số tiếp theo của mình chưa? Hãy cùng nhau thu hẹp khoảng cách giữa logic phức tạp và trải nghiệm người dùng liền mạch.";

  return (
    <section className="pb-2 pt-[calc(72px+56px)] text-center">
      <div className="container-x">
        <Reveal>
          <h1 className="text-[clamp(36px,5vw,60px)] font-extrabold tracking-[-0.045em] text-ink">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={1}>
          <p className="mx-auto mt-[18px] max-w-[760px] text-[19px] font-light leading-snug text-[#434655]">
            {subtitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
