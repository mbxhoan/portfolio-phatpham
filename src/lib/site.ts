import portfolio from "@/data/portfolio";

/** Global site config used for SEO / metadata. Update the URL on deploy. */
export const siteConfig = {
  name: portfolio.person.name,
  title: `${portfolio.person.name} — ${portfolio.person.role}`,
  description: portfolio.person.tagline,
  // Set to your production domain (used by metadata, sitemap, robots, OG).
  url: "https://phamminhphat.vercel.app",
  locale: "vi_VN",
  ogImage: "/og.png",
};

export const nav = [
  { label: "Năng lực cá nhân", href: "/nang-luc" },
  { label: "Dự án", href: "/du-an" },
  { label: "Liên hệ", href: "/lien-he" },
];
