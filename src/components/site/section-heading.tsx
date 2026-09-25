import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  subtitle,
  center = true,
  className,
  inter = false,
}: {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
  inter?: boolean;
}) {
  return (
    <div className={cn("mb-11 flex flex-col gap-3.5", center && "items-center text-center", className)}>
      <Reveal>
        <h2
          className={cn(
            "text-[clamp(30px,3.8vw,48px)] font-extrabold tracking-[-0.025em] text-ink",
            inter && "font-sans font-semibold tracking-[-0.02em] text-navy"
          )}
        >
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={1}>
          <p className="max-w-[660px] text-[17px] text-body">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}
