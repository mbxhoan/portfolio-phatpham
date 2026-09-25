import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ với Phạm Minh Phát để trao đổi về giải pháp phần mềm, WMS, ERP và tích hợp hệ thống cho doanh nghiệp.",
};

export default function ContactPage() {
  return (
    <>
      <section className="pb-2 pt-[calc(72px+56px)] text-center">
        <div className="container-x">
          <Reveal>
            <h1 className="text-[clamp(36px,5vw,60px)] font-extrabold tracking-[-0.045em] text-ink">Liên hệ</h1>
          </Reveal>
          <Reveal delay={1}>
            <p className="mx-auto mt-[18px] max-w-[760px] text-[19px] font-light leading-snug text-[#434655]">
              Bạn đã sẵn sàng thiết kế kiến trúc hạ tầng kỹ thuật số tiếp theo của mình chưa? Hãy cùng nhau thu hẹp
              khoảng cách giữa logic phức tạp và trải nghiệm người dùng liền mạch.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-[clamp(40px,6vw,72px)]">
        <div className="container-x grid items-start gap-8 lg:grid-cols-[1.45fr_1fr]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={1}>
            <ContactInfo />
          </Reveal>
        </div>
      </section>
    </>
  );
}
