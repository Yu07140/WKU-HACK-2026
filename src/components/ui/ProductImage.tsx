import { AlertTriangle } from "lucide-react";
import { aiImageUrl, type ImageSize } from "@/lib/ai/image";
import { cn, PLACEHOLDER_MODE } from "@/lib/utils";

/**
<<<<<<< HEAD
 * 统一商品图组件（两边版本并集，优先级从高到低）：
 * 1. src：真实货盘/供应商实拍图（本地路径或图床 URL）→ 直接渲染
 * 2. 占位模式（PLACEHOLDER_MODE 且没有 src）：灰色块 + 感叹号，不请求任何图片
 * 3. 否则走 prompt → AIGC 文生图（素材工坊/营销物料）
 * 换图床/换模型时只改 lib/ai/image.ts
=======
 * 统一商品图组件（优先级）
 * 1. src：真实货盘照片（public 目录路径）—— 当前 Lanhe 货盘已接入
 * 2. 占位模式（PLACEHOLDER_MODE=true 且无 src）：灰色块 + 感叹号
 * 3. prompt：AIGC 文生图（素材工坊/营销物料）
>>>>>>> b9de0bfad5ffa5d8acbf9d490a21771c14b14810
 */
export function ProductImage({
  src,
  prompt,
  alt,
  size = "square",
  className,
  imgClassName,
}: {
  /** 真实图片地址（/catalog/... 本地图或图床 URL）；存在时优先级最高 */
  src?: string;
  /** AIGC 文生图 prompt（作为 fallback 用） */
  prompt?: string;
  alt: string;
  size?: ImageSize;
  className?: string;
  imgClassName?: string;
}) {
<<<<<<< HEAD
  // 1) 有真实图 → 直接渲染
=======
>>>>>>> b9de0bfad5ffa5d8acbf9d490a21771c14b14810
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

  // 2) 无真实图 + 占位模式 → 占位
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

  // 3) 非占位 → AIGC 文生图
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
