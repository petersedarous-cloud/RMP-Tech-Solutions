import {
  Lock,
  ToggleRight,
  Network,
  Radar,
  Cpu,
  MonitorSmartphone,
  Router,
  Hotel,
  Blinds,
  Zap,
  ScanLine,
  Package,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  "smart-locks": Lock,
  switches: ToggleRight,
  knx: Network,
  sensors: Radar,
  modules: Cpu,
  panels: MonitorSmartphone,
  gateways: Router,
  hotel: Hotel,
  curtains: Blinds,
  breakers: Zap,
  access: ScanLine,
  accessories: Package,
};

export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = MAP[slug] ?? Package;
  return <Icon className={className} />;
}
