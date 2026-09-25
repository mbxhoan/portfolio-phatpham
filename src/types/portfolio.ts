/**
 * Shared content types for the portfolio.
 * Icons are referenced by name (see src/lib/icon-map.ts) so the data file
 * stays free of JSX and is safe to edit by non-developers.
 */
export type IconName =
  | "warehouse" | "calendar" | "cpu" | "workflow" | "database" | "plug"
  | "timer" | "fileText" | "layout" | "search" | "penTool" | "boxes"
  | "ticket" | "wallet" | "scan" | "code" | "gitBranch" | "fileStack"
  | "presentation" | "figma" | "check" | "eye" | "messageSquare" | "trendingUp";

export interface QuickLinkConfig {
  visible: boolean;
  label: string;
  color: string;
}

export interface Person {
  name: string;
  role: string;
  initials: string;
  tagline: string;
  email: string;
  address: string;
  yearsBadge: { value: string; label: string };
  /** Optional hero portrait image (data URL or path). When set, replaces the SVG placeholder. */
  photo?: string;
  /** Show the "năng lực" quick-link CTA in the hero (default: shown). */
  showCapabilityLink?: boolean;
  /** Show the "liên hệ" quick-link CTA in the hero (default: shown). */
  showContactLink?: boolean;
  /** Show the "dự án" quick-link CTA in the hero (default: shown). */
  showProjectsLink?: boolean;
  /** Custom hero quick access buttons configuration */
  quickLinks?: {
    capability?: QuickLinkConfig;
    projects?: QuickLinkConfig;
    contact?: QuickLinkConfig;
  };
}

export interface Capability {
  name: string;
  body: string;
  icon: IconName;
  image?: string;
}

export interface Field {
  name: string;
  body: string;
  icon: IconName;
  visible: boolean;
}

export interface ProcessStep {
  title: string;
  body: string;
  icon?: IconName;
  image?: string;
}

export interface Project {
  slug: string;
  logo: string;
  title: string;
  category: string;
  year: string;
  role: string;
  featured: boolean;
  summary: string;
  problem: string;
  solution: string;
  impact: string[];
  tech: string[];
  /** Optional cover image (data URL or path). When set, replaces the initials logo block. */
  image?: string;
}

/** Editable site assets (data URLs or paths). */
export interface SiteAssets {
  ogImage?: string;
  favicon?: string;
}

export interface Social {
  label: string;
  href: string;
  icon: IconName;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  preview: string;
  time: string;
  status: "new" | "read";
}

export interface Stat {
  label: string;
  value: string;
  sub: string;
  icon: IconName;
}

export interface Portfolio {
  person: Person;
  fieldsTitle?: string;
  fieldsSubtitle?: string;
  fields: Field[];
  capabilities: Capability[];
  tools: Capability[];
  processTitle?: string;
  processSubtitle?: string;
  process: ProcessStep[];
  projectsTitle?: string;
  projectsSubtitle?: string;
  projects: Project[];
  categories: string[];
  socials: Social[];
  messages: Message[];
  stats: Stat[];
  /** Optional editable site assets (OG image, favicon). */
  site?: SiteAssets;
  footerSocials?: {
    facebook?: { visible: boolean; url: string };
    instagram?: { visible: boolean; url: string };
    youtube?: { visible: boolean; url: string };
  };
  adminPassword?: string;
}
