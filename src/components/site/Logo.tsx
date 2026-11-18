import logoColor from "@/assets/rmp-logo-color.png.asset.json";
import logoWhite from "@/assets/rmp-logo-white.png.asset.json";
import { cn } from "@/lib/utils";

export function Logo({ variant = "color", className }: { variant?: "color" | "white"; className?: string }) {
  const src = variant === "white" ? logoWhite.url : logoColor.url;
  return (
    <img
      src={src}
      alt="RMP Tech Solutions"
      width={688}
      height={748}
      className={cn("h-12 w-auto select-none", className)}
      draggable={false}
    />
  );
}
