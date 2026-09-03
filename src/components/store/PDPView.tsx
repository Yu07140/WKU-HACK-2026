"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Truck, RotateCcw, Star, Factory, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { TrendBadge } from "@/components/ui/badge";
import { useCart } from "@/lib/store/cart";
import { cn, ph, formatUSD, PLACEHOLDER_MODE } from "@/lib/utils";

export function PDPView({ product }: { product: Product }) {
  const { add } = useCart();
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const color = product.colors[colorIdx];
  const imagePrompt = `${color.imagePrompt}, professional e-commerce product photography, soft cream studio background, soft lighting, centered`;

  function handleAdd() {
    if (!size) return;
    add({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      color: color.name,
      size,
      price: product.price,
      qty,
      imagePrompt: color.imagePrompt,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {/* 画廊 */}
      <div>
        <ProductImage
          prompt={imagePrompt}
          alt={`${product.name} ${color.name}`}
          size="square_hd"
          className="aspect-square rounded-3xl"
        />
        <div className="mt-4 flex gap-3">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setColorIdx(i)}
              className={cn(
                "h-20 w-20 overflow-hidden rounded-xl border-2 transition",
                i === colorIdx ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <ProductImage
                prompt={`${c.imagePrompt}, product photo, cream background`}
                alt={c.name}
                size="square"
                className="h-full w-full"
              />
            </button>
          ))}
        </div>
      </div>

      {/* 信息 */}
      <div>
        <div className="flex items-center gap-3">
          <TrendBadge trend={product.trend} />
          <span className="flex items-center gap-1 text-sm text-ink/60">
            <Star size={14} className="text-amber-500" fill="currentColor" />
            {product.rating} · {product.reviews} reviews
          </span>
        </div>

        <h1 className="mt-3 text-4xl font-black">{ph(product.name)}</h1>
        <p className="mt-1 text-lg text-ink/55">{product.tagline}</p>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-black">{formatUSD(product.price)}</span>
          {!PLACEHOLDER_MODE && product.compareAt && (
            <span className="text-lg text-ink/40 line-through">{formatUSD(product.compareAt)}</span>
          )}
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent-dark">
            {PLACEHOLDER_MODE
              ? "工厂直供 · 价格待定"
              : `工厂直供 · 省 ${formatUSD(product.compareAt ? product.compareAt - product.price : Math.round(product.price * 0.5))}`}
          </span>
        </div>

        <p className="mt-5 leading-relaxed text-ink/70">{product.description}</p>

        {/* 配色 */}
        <div className="mt-7">
          <div className="mb-2 text-sm font-bold">
            Color: <span className="font-normal text-ink/60">{color.name}</span>
          </div>
          <div className="flex gap-2.5">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setColorIdx(i)}
                className={cn(
                  "h-9 w-9 rounded-full border-2 transition",
                  i === colorIdx ? "border-accent scale-110" : "border-ink/15"
                )}
                style={{ background: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* 尺码 */}
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm font-bold">
            <span>Size: US {size ?? "—"}</span>
            <span className="font-normal text-ink/50">不确定尺码？问右下角 AI 导购</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  "h-11 w-14 rounded-xl border text-sm font-bold transition",
                  size === s
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/20 bg-white hover:border-ink/60"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 数量 + 加购 */}
        <div className="mt-8 flex gap-3">
          <div className="flex h-[52px] items-center rounded-full border border-ink/20 bg-white">
            <button
              className="h-full w-11 text-xl font-bold"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="w-8 text-center font-bold">{qty}</span>
            <button
              className="h-full w-11 text-xl font-bold"
              onClick={() => setQty((q) => q + 1)}
            >
              +
            </button>
          </div>
          <Button size="lg" className="flex-1" onClick={handleAdd} disabled={!size}>
            {added ? (
              <>
                <Check size={18} /> Added to bag
              </>
            ) : (
              <>
                <ShoppingBag size={18} /> {size ? "Add to bag" : "Select a size"}
              </>
            )}
          </Button>
        </div>
        {added && (
          <Link
            href="/cart"
            className="mt-3 inline-block text-sm font-bold text-accent-dark underline"
          >
            View bag & checkout →
          </Link>
        )}

        {/* 服务承诺 */}
        <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-ink/10 bg-white p-4 text-center text-xs font-semibold text-ink/70">
          <div className="flex flex-col items-center gap-1.5">
            <Truck size={18} className="text-accent" /> Free shipping over $75
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <RotateCcw size={18} className="text-accent" /> 30-day wear test
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Factory size={18} className="text-accent" /> Ships in 48h
          </div>
        </div>

        {/* 卖点 & 供应链参数 */}
        <ul className="mt-8 space-y-2.5">
          {product.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-ink/75">
              <Check size={16} className="mt-0.5 shrink-0 text-sage" /> {f}
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-2xl bg-cream p-5 text-sm">
          <div className="mb-2 font-bold">供应链直连参数 · Factory Specs</div>
          <div className="grid grid-cols-2 gap-y-2 text-ink/65">
            <span>材质：{product.material}</span>
            <span>重量：{product.weight}</span>
            <span>起订量 MOQ：{product.moq} 双</span>
            <span>打样周期：{product.leadTimeDays} 天</span>
          </div>
        </div>
      </div>
    </div>
  );
}
