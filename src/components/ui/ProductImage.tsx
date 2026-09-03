import { aiImageUrl, type ImageSize } from "@/lib/ai/image";
import { cn } from "@/lib/utils";

/**
 * 统一商品图组件：所有图片走 AIGC 文生图
 * 模块 A/B 换图床/换模型时只改这里
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
