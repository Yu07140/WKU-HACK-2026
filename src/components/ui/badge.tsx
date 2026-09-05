"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useLang } from "@/lib/store/lang";

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

const TREND_STYLE: Record<string, { en: string; cn: string; cls: string }> = {
  hot: { en: "Hot", cn: "热卖", cls: "bg-accent/10 text-accent-dark" },
  rising: { en: "Rising", cn: "人气飙升", cls: "bg-amber-100 text-amber-700" },
  new: { en: "New", cn: "新品", cls: "bg-sage/15 text-sage" },
  steady: { en: "Steady", cn: "经典常驻", cls: "bg-stone-200 text-stone-600" },
};

export function TrendBadge({ trend }: { trend: string }) {
  const { t } = useLang();
  const s = TREND_STYLE[trend] ?? TREND_STYLE.steady;
  return <Badge className={s.cls}>{t(s.en, s.cn)}</Badge>;
}
