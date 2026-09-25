import {
  Warehouse, Calendar, Cpu, Workflow, Database, Plug, Timer, FileText,
  Layout, Search, PenTool, Boxes, Ticket, Wallet, ScanLine, Code, GitBranch,
  Files, Presentation, Figma, Check, Eye, MessageSquare, TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/types/portfolio";

export const iconMap: Record<IconName, LucideIcon> = {
  warehouse: Warehouse,
  calendar: Calendar,
  cpu: Cpu,
  workflow: Workflow,
  database: Database,
  plug: Plug,
  timer: Timer,
  fileText: FileText,
  layout: Layout,
  search: Search,
  penTool: PenTool,
  boxes: Boxes,
  ticket: Ticket,
  wallet: Wallet,
  scan: ScanLine,
  code: Code,
  gitBranch: GitBranch,
  fileStack: Files,
  presentation: Presentation,
  figma: Figma,
  check: Check,
  eye: Eye,
  messageSquare: MessageSquare,
  trendingUp: TrendingUp,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Cmp = iconMap[name] ?? Workflow;
  return <Cmp className={className} />;
}
