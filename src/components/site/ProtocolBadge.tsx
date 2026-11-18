import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { systemLabel } from "@/lib/catalog";

const badge = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide",
  {
    variants: {
      system: {
        knx: "bg-proto-knx/10 text-proto-knx",
        zigbee: "bg-proto-zigbee/12 text-proto-zigbee",
        wifi: "bg-proto-wifi/12 text-proto-wifi",
        standalone: "bg-proto-standalone/12 text-proto-standalone",
      },
    },
    defaultVariants: { system: "standalone" },
  },
);

const dot = cva("size-1.5 rounded-full", {
  variants: {
    system: {
      knx: "bg-proto-knx",
      zigbee: "bg-proto-zigbee",
      wifi: "bg-proto-wifi",
      standalone: "bg-proto-standalone",
    },
  },
  defaultVariants: { system: "standalone" },
});

type Sys = "knx" | "zigbee" | "wifi" | "standalone";
export function ProtocolBadge({ system, className }: { system: string; className?: string }) {
  const s = (["knx", "zigbee", "wifi", "standalone"].includes(system) ? system : "standalone") as Sys;
  return (
    <span className={cn(badge({ system: s }), className)}>
      <span className={dot({ system: s })} />
      {systemLabel(s)}
    </span>
  );
}
