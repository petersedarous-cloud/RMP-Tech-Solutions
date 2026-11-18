import {
  Lightbulb,
  Blinds,
  Thermometer,
  Radar,
  Lock,
  Smartphone,
  ToggleRight,
  Router,
  BatteryCharging,
  MonitorSmartphone,
  Hotel,
  Cloud,
  DoorOpen,
  Droplets,
  Flame,
  type LucideIcon,
} from "lucide-react";

type Node = { x: number; y: number; icon: LucideIcon; label: string; tone?: "primary" | "green" | "ink" };

function NodeG({ n, r = 34 }: { n: Node; r?: number }) {
  const fill = n.tone === "green" ? "var(--brand-green)" : n.tone === "ink" ? "var(--ink)" : "var(--card)";
  const stroke = n.tone ? "transparent" : "var(--border)";
  const iconColor = n.tone ? "var(--primary-foreground)" : "var(--primary)";
  const Icon = n.icon;
  return (
    <g>
      <circle cx={n.x} cy={n.y} r={r + 8} fill="var(--brand-green)" opacity={0.12} className="animate-pulse-node" />
      <circle cx={n.x} cy={n.y} r={r} fill={fill} stroke={stroke} strokeWidth={2} />
      <Icon x={n.x - 14} y={n.y - 14} width={28} height={28} color={iconColor} strokeWidth={1.8} />
      <text x={n.x} y={n.y + r + 22} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--foreground)" fontFamily="Tajawal">
        {n.label}
      </text>
    </g>
  );
}

/** KNX: one shared twisted-pair bus; every device talks peer-to-peer on it. */
export function KnxBusDiagram() {
  const busY = 210;
  const top: Node[] = [
    { x: 90, y: 80, icon: BatteryCharging, label: "مزود الطاقة", tone: "ink" },
    { x: 250, y: 80, icon: ToggleRight, label: "لوحة مفاتيح" },
    { x: 410, y: 80, icon: Radar, label: "حساس حضور" },
    { x: 570, y: 80, icon: MonitorSmartphone, label: "شاشة لمس" },
    { x: 730, y: 80, icon: Router, label: "راوتر IP", tone: "green" },
  ];
  const bottom: Node[] = [
    { x: 170, y: 330, icon: Lightbulb, label: "مشغل إضاءة" },
    { x: 330, y: 330, icon: Blinds, label: "مشغل ستائر" },
    { x: 490, y: 330, icon: Thermometer, label: "تحكم التكييف" },
    { x: 650, y: 330, icon: Hotel, label: "وحدة الغرف الفندقية" },
  ];
  return (
    <svg viewBox="0 0 820 420" className="h-auto w-full" role="img" aria-label="مخطط ناقل KNX">
      <rect x={20} y={busY - 9} width={780} height={18} rx={9} fill="var(--secondary)" />
      <line x1={30} y1={busY} x2={790} y2={busY} stroke="var(--brand-green)" strokeWidth={4} className="animate-dash" />
      <text x={410} y={busY - 18} textAnchor="middle" fontSize={13} fontWeight={800} fill="var(--brand-green)" fontFamily="Tajawal">
        KNX BUS — كابل واحد لكل الأجهزة
      </text>
      {[...top, ...bottom].map((n) => (
        <line key={n.label} x1={n.x} y1={n.y} x2={n.x} y2={busY} stroke="var(--primary)" strokeOpacity={0.35} strokeWidth={2} />
      ))}
      {top.map((n) => <NodeG key={n.label} n={n} r={30} />)}
      {bottom.map((n) => <NodeG key={n.label} n={n} r={30} />)}
    </svg>
  );
}

/** Zigbee: gateway at the centre, routers relay for battery sensors (mesh). */
export function ZigbeeMeshDiagram() {
  const gw: Node = { x: 410, y: 210, icon: Router, label: "بوابة Zigbee", tone: "green" };
  const cloud: Node = { x: 410, y: 50, icon: Cloud, label: "", tone: "ink" };
  const ring: Node[] = [
    { x: 170, y: 120, icon: Lock, label: "قفل ذكي" },
    { x: 650, y: 120, icon: ToggleRight, label: "مفتاح لمس" },
    { x: 130, y: 300, icon: DoorOpen, label: "حساس باب" },
    { x: 690, y: 300, icon: Blinds, label: "موتور ستائر" },
    { x: 300, y: 360, icon: Droplets, label: "حساس تسرب" },
    { x: 520, y: 360, icon: Flame, label: "حساس دخان" },
  ];
  const mesh: [number, number][] = [[0, 2], [1, 3], [2, 4], [3, 5], [4, 5]];
  return (
    <svg viewBox="0 0 820 440" className="h-auto w-full" role="img" aria-label="مخطط شبكة Zigbee">
      <line x1={gw.x} y1={gw.y} x2={cloud.x} y2={cloud.y} stroke="var(--primary)" strokeWidth={2} strokeOpacity={0.4} className="animate-dash" />
      {ring.map((n) => (
        <line key={n.label} x1={gw.x} y1={gw.y} x2={n.x} y2={n.y} stroke="var(--brand-green)" strokeWidth={2.5} className="animate-dash" />
      ))}
      {mesh.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={ring[a].x} y1={ring[a].y} x2={ring[b].x} y2={ring[b].y} stroke="var(--brand-green)" strokeOpacity={0.35} strokeWidth={1.5} strokeDasharray="4 6" />
      ))}
      <g>
        <circle cx={cloud.x} cy={cloud.y} r={26} fill="var(--ink)" />
        <Smartphone x={cloud.x - 12} y={cloud.y - 12} width={24} height={24} color="var(--ink-foreground)" />
        <text x={cloud.x + 40} y={cloud.y + 5} fontSize={13} fontWeight={700} fill="var(--muted-foreground)" fontFamily="Tajawal">التطبيق والتحكم عن بُعد</text>
      </g>
      {ring.map((n) => <NodeG key={n.label} n={n} r={28} />)}
      <NodeG n={gw} r={40} />
    </svg>
  );
}
