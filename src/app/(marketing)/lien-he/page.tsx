import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { ContactHeader } from "@/components/contact/contact-header";
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
      <ContactHeader />

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
