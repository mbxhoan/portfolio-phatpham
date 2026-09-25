import { Hero } from "@/components/home/hero";
import { Fields } from "@/components/home/fields";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { ProcessTimeline } from "@/components/home/process-timeline";
import { CTA } from "@/components/home/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Fields />
      <FeaturedProjects />
      <ProcessTimeline />
      <CTA />
    </>
  );
}
