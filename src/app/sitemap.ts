import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import portfolio from "@/data/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticRoutes = ["", "/nang-luc", "/du-an", "/lien-he"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const projectRoutes = portfolio.projects.map((p) => ({
    url: `${base}/du-an/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...staticRoutes, ...projectRoutes];
}
