import { AlertTriangle } from "lucide-react";
import { aiImageUrl, type ImageSize } from "@/lib/ai/image";
import { cn, PLACEHOLDER_MODE } from "@/lib/utils";

/**
 * 统一商品图组件
 * - 占位模式（PLACEHOLDER_MODE=true）：灰色块 + 感叹号，不请求任何图片
 * - 接入真实货盘后改为 false：所有图片走 AIGC 文生图
 * 模块 A/B 换图床/换模型时只改 lib/ai/image.ts
 */
export function ProductImage({
  prompt,
  alt,
  size = "square",
  className,
  imgClassName,
}: {
  prompt: string;
  alt: string;
  size?: ImageSize;
  className?: string;
  imgClassName?: string;
}) {
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

  return (
    <div className={cn("relative overflow-hidden bg-cream", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={aiImageUrl(prompt, size)}
        alt={alt}
        loading="lazy"
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}
