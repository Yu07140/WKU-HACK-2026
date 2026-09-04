import { AlertTriangle } from "lucide-react";
import { aiImageUrl, type ImageSize } from "@/lib/ai/image";
import { cn, PLACEHOLDER_MODE } from "@/lib/utils";

/**
 * 统一商品图组件（优先级由高到低）
 * 1. src：真实货盘/供应商实拍图（public 目录路径）—— 真实 SKU 优先展示
 * 2. 占位模式（PLACEHOLDER_MODE=true 且无 src）：灰色块 + 感叹号
 * 3. prompt：AIGC 文生图（素材工坊/营销物料/Lanhe 旧货盘兜底）
 * 模块 A/B 换图床/换模型时只改 lib/ai/image.ts
 */
export function ProductImage({
  src,
  prompt,
  alt,
  size = "square",
  className,
  imgClassName,
}: {
  /** 真实图片地址（/catalog/... 或 /products/... 本地图，或图床 URL） */
  src?: string;
  prompt?: string;
  alt: string;
  size?: ImageSize;
  className?: string;
  imgClassName?: string;
}) {
  // 1) 真实实拍图：直接展示，优先级最高
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-white", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={cn("h-full w-full object-contain", imgClassName)}
        />
      </div>
    );
  }

  // 2) 占位模式 + 无 src：显示灰块占位
  if (PLACEHOLDER_MODE) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-neutral-200 text-neutral-400",
          className
        )}
        aria-label="图片占位，待接入真实货盘"
      >
        <AlertTriangle className="h-8 w-8" strokeWidth={1.5} />
      </div>
    );
  }

  // 3) AIGC 兜底
  return (
    <div className={cn("relative overflow-hidden bg-cream", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={aiImageUrl(prompt ?? "", size)}
        alt={alt}
        loading="lazy"
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}
