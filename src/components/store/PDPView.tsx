"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Truck, RotateCcw, Factory, ShoppingBag, Warehouse } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { TrendBadge } from "@/components/ui/badge";
import { useCart } from "@/lib/store/cart";
import { cn, ph, formatUSD, PLACEHOLDER_MODE, parseMaterial } from "@/lib/utils";
import { EU_SIZES, WAREHOUSE, findStockRow } from "@/lib/data/stock";

export function PDPView({ product }: { product: Product }) {
  const { add } = useCart();
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const color = product.colors[colorIdx];
  // 真实商品图：优先颜色 realImage → color.image → product.heroImage → product.image
  const realImage =
    color.realImage ??
    color.image ??
    product.heroImage ??
    product.image;
  const imagePrompt = `${color.imagePrompt}, professional e-commerce product photography, soft cream studio background, soft lighting, centered`;
  const stockRow = findStockRow(product.model, color.name);
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
      image: realImage,
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
          src={realImage}
          prompt={imagePrompt}
          alt={`${product.name} ${color.name}`}
          size="square_hd"
          className="aspect-square rounded-3xl"
        />
        <div className="mt-4 flex gap-3">
          {product.colors.map((c, i) => {
            const thumbSrc =
              c.realImage ?? c.image ?? product.heroImage ?? product.image;
            return (
              <button
                key={c.name}
                onClick={() => setColorIdx(i)}
                className={cn(
                  "h-20 w-20 overflow-hidden rounded-xl border-2 transition",
                  i === colorIdx
                    ? "border-accent"
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <ProductImage
                  src={thumbSrc}
                  prompt={`${c.imagePrompt}, product photo, cream background`}
                  alt={c.name}
                  size="square"
                  className="h-full w-full"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 信息 */}
      <div>
        <div className="flex items-center gap-3">
          <TrendBadge trend={product.trend} />
          {product.sku && (
            <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-bold text-ink/60">
              SKU {product.sku}
            </span>
          )}
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
            <span className="text-lg text-ink/40 line-through">
              {formatUSD(product.compareAt)}
            </span>
          )}
          {!product.demoPricing && (
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent-dark">
              {PLACEHOLDER_MODE
                ? "工厂直供 · 价格待定"
                : `工厂直供 · 省 ${formatUSD(
                    product.compareAt
                      ? product.compareAt - product.price
                      : Math.round(product.price * 0.5)
                  )}`}
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
            <span>
              Size: {sizeLabel} {size ?? "—"}
            </span>
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

        {/* 服务说明（Demo 政策，链接到 FAQ） */}
        <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-ink/10 bg-white p-4 text-xs font-semibold text-ink/70 sm:grid-cols-3">
          <Link href="/size-guide" className="flex flex-col items-center gap-1.5 text-center hover:text-accent">
            <Truck size={18} className="text-accent" /> Size Guide
            <span className="text-[10px] font-normal text-ink/40">EU/US/UK/CM</span>
          </Link>
          <Link href="/faq#shipping-delivery" className="flex flex-col items-center gap-1.5 text-center hover:text-accent">
            <Truck size={18} className="text-accent" /> Shipping
            <span className="text-[10px] font-normal text-ink/40">Demo</span>
          </Link>
          <Link href="/faq#returns-exchanges" className="flex flex-col items-center gap-1.5 text-center hover:text-accent">
            <RotateCcw size={18} className="text-accent" /> Returns
            <span className="text-[10px] font-normal text-ink/40">Demo</span>
          </Link>
          <Link href="/faq#duties-taxes-customs" className="flex flex-col items-center gap-1.5 text-center hover:text-accent">
            <Factory size={18} className="text-accent" /> Customs
            <span className="text-[10px] font-normal text-ink/40">Demo</span>
          </Link>
          <Link href="/faq#sizing-fit" className="flex flex-col items-center gap-1.5 text-center hover:text-accent">
            <Factory size={18} className="text-accent" /> Care
            <span className="text-[10px] font-normal text-ink/40">Spot clean</span>
          </Link>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Factory size={18} className="text-accent" /> Factory SKU
            <span className="text-[10px] font-normal text-ink/40">{product.sku ?? "—"}</span>
          </div>
        </div>

        {/* 卖点 */}
        <ul className="mt-8 space-y-2.5">
          {product.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-ink/75">
              <Check size={16} className="mt-0.5 shrink-0 text-sage" /> {f}
            </li>
          ))}
        </ul>

        {/* 材质 & 供应链参数 —— 对 14534-H 等供应商 SKU 拆分展示 Upper/Lining/Outsole */}
        <div className="mt-8 rounded-2xl bg-cream p-5 text-sm">
          <div className="mb-3 font-bold">Verified Product Specs</div>
          <div className="grid grid-cols-2 gap-y-2 text-ink/65">
            {product.sku && <span><b>Factory SKU：</b>{product.sku}</span>}
            {product.model && <span><b>Model：</b>{product.model}</span>}
            {product.construction && <span><b>Construction：</b>{product.construction}</span>}
            <span><b>Upper：</b>{parseMaterial(product.material, "upper")}</span>
            <span><b>Lining：</b>{parseMaterial(product.material, "lining")}</span>
            <span><b>Outsole：</b>{parseMaterial(product.material, "outsole")}</span>
            <span><b>Sizes：</b>{sizeLabel === "EU" ? "EU 38–46" : "US"}</span>
            <span><b>Weight：</b>{product.weight}</span>
            <span><b>MOQ：</b>{product.moq != null ? `${product.moq} pairs` : "TBC — supplier confirmation required"}</span>
            <span><b>Lead time：</b>{product.leadTimeDays != null ? `${product.leadTimeDays} days` : "TBC — organizer/supplier confirmation required"}</span>
          </div>
          <p className="mt-3 text-[11px] text-ink/45">
            Material fields marked "supplier spec" are verified by the supplier.
          </p>

          {/* 定价分层：工厂价 / 演示结账价 / 最终零售价 */}
          <div className="mt-4 border-t border-ink/10 pt-4">
            <div className="mb-2 font-bold">Pricing Breakdown</div>
            <div className="space-y-1.5 text-sm text-ink/65">
              <div className="flex justify-between">
                <span>Factory Price：</span>
                <span className="font-bold text-ink/80">RMB {product.factoryCost} / pair</span>
              </div>
              <div className="flex justify-between">
                <span>Demo Checkout Price：</span>
                <span className="font-bold text-accent-dark">${product.price} — Sandbox Only</span>
              </div>
              <div className="flex justify-between">
                <span>Final Overseas Retail：</span>
                <span className="font-bold text-ink/40">TBC</span>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-ink/40">
              RMB {product.factoryCost} is the verified factory cost. ${product.price} is the
              sandbox demo checkout price, not a verified launch retail price. Final retail
              will be set after logistics / payment / return reserve calculation.
            </p>
          </div>

          {stockRow && (
            <div className="mt-4 border-t border-ink/10 pt-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <Warehouse size={15} className="text-accent" />
                  {WAREHOUSE.nameZh} In stock · {stockRow.total} pairs
                </div>
                <Link
                  href="/stock"
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  Full stock table →
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
                    title={`EU ${EU_SIZES[i]}：${qty} pairs`}
                  >
                    <div className="text-[10px] font-semibold text-ink/50">
                      {EU_SIZES[i]}
                    </div>
                    <div className="text-xs font-bold">{qty > 0 ? qty : "—"}</div>
                  </div>
                ))}
              </div>
              <div className="mt-1.5 text-[11px] text-ink/45">
                EU 35-45 per-size stock (pairs) · (Demo stock data)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
