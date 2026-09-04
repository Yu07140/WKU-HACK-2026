import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { TrendBadge } from "@/components/ui/badge";
import { ph, formatUSD, PLACEHOLDER_MODE } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group block animate-fade-up ${product.stock === 0 ? "opacity-70" : ""}`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-cream">
        <ProductImage
          src={product.heroImage ?? product.colors.find((c) => c.realImage)?.realImage ?? product.image}
          prompt={product.imagePrompt + ", professional e-commerce product photography, soft cream studio background, soft lighting"}
          alt={product.name}
          className="aspect-square transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3">
          <TrendBadge trend={product.trend} />
        </div>
        {product.demoPricing && (
          <div className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-bold text-white">
            Demo pricing
          </div>
        )}
        {!product.demoPricing && !PLACEHOLDER_MODE && product.compareAt && (
          <div className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white">
            SAVE {formatUSD(product.compareAt - product.price)}
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
          <h3 className="font-bold leading-tight">{ph(product.name)}</h3>
          <p className="mt-0.5 text-sm text-ink/55">{product.tagline}</p>
        </div>
        <div className="text-right">
          <div className="font-bold">{formatUSD(product.price)}</div>
          {product.demoPricing && (
            <div className="text-[11px] text-ink/40">TBC</div>
          )}
          {!product.demoPricing && !PLACEHOLDER_MODE && product.compareAt && (
            <div className="text-xs text-ink/40 line-through">{formatUSD(product.compareAt)}</div>
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
  product: Pick<Product, "slug" | "name" | "price" | "rating" | "imagePrompt"> & { image?: string };
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="mt-2 flex items-center gap-3 rounded-xl border border-ink/10 bg-white p-2 transition hover:border-accent"
    >
      <ProductImage
        src={product.image}
        prompt={product.imagePrompt}
        alt={product.name}
        className="h-14 w-14 shrink-0 rounded-lg"
      />
      <div className="min-w-0">
        <div className="truncate text-sm font-bold">{ph(product.name)}</div>
        <div className="text-xs text-ink/50">{formatUSD(product.price)} · {product.rating}★</div>
      </div>
    </Link>
  );
}
