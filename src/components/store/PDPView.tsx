"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShoppingBag, Truck, RotateCcw, Ruler, Shield } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cart";
import { cn, ph, formatUSD, PLACEHOLDER_MODE, parseMaterial } from "@/lib/utils";

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
        <div className="text-xs font-bold tracking-[0.3em] text-ink/40">STRYDE</div>
        <h1 className="mt-3 text-4xl font-black">{ph(product.name)}</h1>
        <p className="mt-2 text-sm font-semibold tracking-wider text-ink/50">
          STAND UP. STAND OUT.
        </p>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-black">{formatUSD(product.price)}</span>
          {product.demoPricing && (
            <span className="rounded-full border border-ink/15 px-2.5 py-0.5 text-xs font-medium text-ink/50">
              Demo pricing
            </span>
          )}
          {!product.demoPricing && !PLACEHOLDER_MODE && product.compareAt && (
            <span className="text-lg text-ink/40 line-through">
              {formatUSD(product.compareAt)}
            </span>
          )}
        </div>

        <p className="mt-5 leading-relaxed text-ink/70">
          A clean black ankle boot with a restrained silhouette, rear-zip construction and
          subtle linear detailing.
        </p>

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
                  i === colorIdx ? "border-ink scale-110" : "border-ink/15"
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
            <Link href="/size-guide" className="font-normal text-ink/50 underline underline-offset-2">
              Size guide
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
            className="mt-3 inline-block text-sm font-bold text-ink underline underline-offset-2"
          >
            View bag &amp; checkout →
          </Link>
        )}

        {/* 服务：SIZE GUIDE / SHIPPING & DUTIES / RETURNS / CARE */}
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-4">
          <ServiceLink href="/size-guide" icon={Ruler} label="Size Guide" />
          <ServiceLink href="/faq#shipping-delivery" icon={Truck} label="Shipping &amp; Duties" />
          <ServiceLink href="/faq#returns-exchanges" icon={RotateCcw} label="Returns" />
          <ServiceLink href="/faq#sizing-fit" icon={Shield} label="Care" />
        </div>

        {/* 产品规格 —— 仅消费者相关的已验证信息 */}
        <div className="mt-8 border-t border-ink/10 pt-6 text-sm">
          <div className="mb-3 text-xs font-bold tracking-[0.2em] text-ink/40">
            PRODUCT DETAILS
          </div>
          <dl className="grid grid-cols-2 gap-y-2.5 text-ink/70">
            <Spec label="Size" value={sizeLabel === "EU" ? "EU 38–46" : sizeLabel} />
            <Spec label="Upper" value={parseMaterial(product.material, "upper")} />
            <Spec label="Lining" value={parseMaterial(product.material, "lining")} />
            <Spec label="Outsole" value={parseMaterial(product.material, "outsole")} />
            {product.sku && (
              <Spec label="Product code" value={product.sku} />
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}

function ServiceLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1.5 bg-white px-3 py-4 text-center text-xs font-semibold text-ink/70 transition hover:text-ink"
    >
      <Icon size={18} className="text-ink/50" />
      <span>{label}</span>
    </Link>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-20 shrink-0 text-ink/40">{label}</dt>
      <dd className="font-medium text-ink/80">{value}</dd>
    </div>
  );
}
