import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { TrendBadge } from "@/components/ui/badge";
import { aiImageUrl } from "@/lib/ai/image";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block animate-fade-up"
    >
      <div className="relative overflow-hidden rounded-2xl bg-cream">
        <ProductImage
          prompt={product.imagePrompt + ", professional e-commerce product photography, soft cream studio background, soft lighting"}
          alt={product.name}
          className="aspect-square transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3">
          <TrendBadge trend={product.trend} />
        </div>
        {product.compareAt && (
          <div className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white">
            SAVE ${product.compareAt - product.price}
          </div>
        )}
        {/* 配色点 */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {product.colors.map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="h-3.5 w-3.5 rounded-full border border-black/15"
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold leading-tight">{product.name}</h3>
          <p className="mt-0.5 text-sm text-ink/55">{product.tagline}</p>
        </div>
        <div className="text-right">
          <div className="font-bold">${product.price}</div>
          {product.compareAt && (
            <div className="text-xs text-ink/40 line-through">${product.compareAt}</div>
          )}
        </div>
      </div>
    </Link>
  );
}

/** 供 Agent 聊天挂件复用的迷你商品卡（只依赖最小字段集） */
export function MiniProductCard({
  product,
}: {
  product: Pick<Product, "slug" | "name" | "price" | "rating" | "imagePrompt">;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="mt-2 flex items-center gap-3 rounded-xl border border-ink/10 bg-white p-2 transition hover:border-accent"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={aiImageUrl(product.imagePrompt, "square")}
        alt={product.name}
        className="h-14 w-14 rounded-lg object-cover"
      />
      <div className="min-w-0">
        <div className="truncate text-sm font-bold">{product.name}</div>
        <div className="text-xs text-ink/50">${product.price} · {product.rating}★</div>
      </div>
    </Link>
  );
}
