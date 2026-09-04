"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Truck, RotateCcw, Star, Factory, ShoppingBag, Warehouse } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { TrendBadge } from "@/components/ui/badge";
import { useCart } from "@/lib/store/cart";
import { cn, ph, formatUSD, PLACEHOLDER_MODE } from "@/lib/utils";
import { EU_SIZES, WAREHOUSE, findStockRow } from "@/lib/data/stock";

export function PDPView({ product }: { product: Product }) {
  const { add } = useCart();
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const color = product.colors[colorIdx];
  const realImage = color.realImage ?? product.heroImage;
  const imagePrompt = `${color.imagePrompt}, professional e-commerce product photography, soft cream studio background, soft lighting, centered`;
  // Upstream 分支保留：color.image 作为主图；model+color 查库存行
  const colorImage = color.image ?? product.image;
  const stockRow = findStockRow(product.model, color.name);
  // Stashed 分支保留：sizeLabel 独立变量
  const sizeLabel = product.sizeSystem ?? "US";

  function handleAdd() {
    if (!size) return;
    add({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      color: color.name,
      size,
      sizeSystem: product.sizeSystem,
      price: product.price,
      qty,
      imagePrompt: color.imagePrompt,
      // 两边并集保留：image（Upstream）+ realImage（Stashed）
      image: colorImage,
      realImage: realImage,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {/* 画廊 */}
      <div>
        <ProductImage
          src={colorImage ?? realImage}
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
                src={c.image ?? (c.realImage ?? product.heroImage)}
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
        <div className="flex items-center gap-3 flex-wrap">
          <TrendBadge trend={product.trend} />
          {/* Upstream: 无条件显示评分 + SKU；Stashed: 评分>0才显示 + SKU 另样式。两边并集：保留 SKU + 评分（总是显示） */}
          {product.sku && (
            <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-bold text-ink/60">
              SKU {product.sku}
            </span>
          )}
          <span className="flex items-center gap-1 text-sm text-ink/60">
            <Star size={14} className="text-amber-500" fill="currentColor" />
            {product.rating} · {product.reviews} reviews
          </span>
        </div>

        <h1 className="mt-3 text-4xl font-black">{ph(product.name)}</h1>
        <p className="mt-1 text-lg text-ink/55">{product.tagline}</p>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-black">{formatUSD(product.price)}</span>
          {product.demoPricing && (
            <span className="rounded-full bg-ink/80 px-2.5 py-0.5 text-xs font-bold text-white">
              Demo pricing · TBC
            </span>
          )}
          {!product.demoPricing && !PLACEHOLDER_MODE && product.compareAt && (
            <span className="text-lg text-ink/40 line-through">{formatUSD(product.compareAt)}</span>
          )}
          {!product.demoPricing && (
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent-dark">
              {PLACEHOLDER_MODE
                ? "工厂直供 · 价格待定"
                : `工厂直供 · 省 ${formatUSD(product.compareAt ? product.compareAt - product.price : Math.round(product.price * 0.5))}`}
            </span>
          )}
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
            <span>Size: {sizeLabel} {size ?? "—"}</span>
            <Link
              href="/size-guide"
              className="font-normal text-ink/50 hover:text-accent hover:underline"
            >
              Not sure? See size guide →
            </Link>
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
          <Button size="lg" className="flex-1" onClick={handleAdd} disabled={!size || product.stock === 0}>
            {product.stock === 0 ? (
              <>Sold Out</>
            ) : added ? (
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

        {/* 服务承诺（演示店铺政策） */}
        <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-ink/10 bg-white p-4 text-center text-xs font-semibold text-ink/70">
          <div className="flex flex-col items-center gap-1.5">
            <Truck size={18} className="text-accent" /> Free shipping over $75
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <RotateCcw size={18} className="text-accent" /> 30-day wear test
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Factory size={18} className="text-accent" /> Ships from factory
          </div>
        </div>

        {/* 卖点列表 */}
        <ul className="mt-8 space-y-2.5">
          {product.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-ink/75">
              <Check size={16} className="mt-0.5 shrink-0 text-sage" /> {f}
            </li>
          ))}
        </ul>

        {/* 材质与重量（消费者可理解的产品信息） */}
        {(product.material || product.weight) && (
          <div className="mt-8 rounded-2xl bg-cream p-5 text-sm">
            <div className="mb-3 font-bold">Product Details</div>
            <div className="space-y-1.5 text-ink/65">
              {product.material && (
                <div className="flex justify-between">
                  <span className="font-semibold text-ink/80">Material</span>
                  <span>{product.material}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between">
                  <span className="font-semibold text-ink/80">Weight</span>
                  <span>{product.weight}</span>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="mt-8 rounded-2xl bg-cream p-5 text-sm">
          <div className="mb-2 font-bold">货盘参数 · Lanhe Factory Specs</div>
          <div className="grid grid-cols-2 gap-y-2 text-ink/65">
            {/* Upstream：型号/工艺；两边都保留的 SKU 供应商 */}
            <span>型号 Model：{product.model ?? "—"}</span>
            {product.sku && <span>供应商 SKU：{product.sku}</span>}
            <span>工艺：{product.construction ?? "—"}</span>
            <span>材质：{product.material}</span>
            <span>重量：{product.weight}</span>
            <span>起订量 MOQ：{product.moq} 双</span>
            <span>打样周期：{product.leadTimeDays} 天</span>
            <span>尺码制式：{sizeLabel === "EU" ? "欧码 EU" : "美码 US"}</span>
          </div>

          {stockRow && (
            <div className="mt-4 border-t border-ink/10 pt-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <Warehouse size={15} className="text-accent" />
                  {WAREHOUSE.nameZh}现货 · {stockRow.total} 双
                </div>
                <Link
                  href="/stock"
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  完整库存表 →
                </Link>
              </div>
              <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-11">
                {stockRow.sizes.map((qty, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-lg px-1 py-1.5 text-center",
                      qty > 0 ? "bg-white" : "bg-white/40 text-ink/30"
                    )}
                    title={`EU ${EU_SIZES[i]}：${qty} 双`}
                  >
                    <div className="text-[10px] font-semibold text-ink/50">
                      {EU_SIZES[i]}
                    </div>
                    <div className="text-xs font-bold">{qty > 0 ? qty : "—"}</div>
                  </div>
                ))}
              </div>
              <div className="mt-1.5 text-[11px] text-ink/45">
                EU 35-45 分码数量（双），售完即止 · 48h 直发
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
