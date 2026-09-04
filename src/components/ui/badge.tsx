import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        className
      )}
    >
      {children}
    </span>
  );
}

const TREND_STYLE: Record<string, { label: string; cls: string }> = {
  hot: { label: "Hot", cls: "bg-accent/10 text-accent-dark" },
  rising: { label: "Rising", cls: "bg-amber-100 text-amber-700" },
  new: { label: "New", cls: "bg-sage/15 text-sage" },
  steady: { label: "Steady", cls: "bg-stone-200 text-stone-600" },
};

export function TrendBadge({ trend }: { trend: string }) {
  const t = TREND_STYLE[trend] ?? TREND_STYLE.steady;
  return <Badge className={t.cls}>{t.label}</Badge>;
}
