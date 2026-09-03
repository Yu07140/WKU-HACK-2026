import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ink/10 bg-white shadow-[0_2px_12px_rgba(22,19,15,0.05)]",
        className
      )}
      {...rest}
    />
  );
}
