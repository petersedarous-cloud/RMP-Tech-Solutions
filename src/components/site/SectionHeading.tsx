import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "start" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("flex max-w-2xl flex-col gap-3", align === "center" && "mx-auto items-center text-center", className)}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-green">
          <span className="h-px w-8 bg-brand-green" />
          {eyebrow}
        </span>
      )}
      <h2 className={cn("text-3xl font-extrabold leading-tight md:text-4xl text-balance", tone === "dark" ? "text-ink-foreground" : "text-foreground")}>
        {title}
      </h2>
      {description && (
        <p className={cn("text-base leading-relaxed md:text-lg", tone === "dark" ? "text-ink-muted" : "text-muted-foreground")}>
          {description}
        </p>
      )}
    </div>
  );
}
