import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";

export function CTA({
  title = "Sẵn sàng để bắt đầu dự án của bạn?",
  subtitle = "Hãy để chúng tôi đồng hành cùng bạn trong hành trình chuyển đổi số và tối ưu hóa quy trình doanh nghiệp.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="pb-[clamp(56px,7vw,96px)]">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-[clamp(40px,5vw,64px)] text-center text-white shadow-2xl border border-indigo-900/50">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.45),transparent_70%)]" />
            <h2 className="relative text-[clamp(26px,3.2vw,36px)] font-extrabold text-white tracking-tight">{title}</h2>
            <p className="relative mx-auto mt-4 max-w-[540px] text-[16px] text-slate-300 leading-relaxed">{subtitle}</p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/nang-luc" className="btn btn-lg btn-primary shadow-lg">
                Năng lực chuyên môn
              </Link>
              <Link href="/du-an" className="btn btn-lg bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white hover:text-slate-900 transition-all">
                Dự án tiêu biểu
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
