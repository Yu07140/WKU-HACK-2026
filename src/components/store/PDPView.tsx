"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ShoppingBag,
  Truck,
  RotateCcw,
  Star,
  Play,
  Volume2,
  Factory,
  Ruler,
  Shield,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cart";
import { cn, ph, PLACEHOLDER_MODE, parseMaterial } from "@/lib/utils";
import { useCurrency } from "@/lib/store/currency";
import {
  displayName,
  displayTagline,
  displayFeatures,
  displayWeight,
} from "@/lib/store/display";
import { TrendBadge } from "@/components/ui/badge";
import { STOCK_LIST, EU_SIZES } from "@/lib/data/stock";

// 主推款 14534-H 商品视频 —— 真实视频放入 public/products/14534-h/video.mp4
const HERO_VIDEO = "/products/14534-h/video.mp4";
const HERO_PRODUCT_ID = "boot-14534-h";

/** catalog model → 温州仓库存表 itemNo 映射（5910-5 货盘号实为 5919-5） */
const MODEL_TO_STOCK: Record<string, string> = {
  "5910-5": "5919-5",
};

/** 颜色名归一化用于匹配库存表 */
function normColor(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .replace("pattern", "")
    .replace("leather", "");
}

/** 标准 US→EU 男码转换（用于温州仓 EU 库存匹配） */
const US_TO_EU: Record<number, number> = {
  5: 37, 6: 39, 7: 40, 8: 41, 9: 42, 10: 43, 11: 44, 12: 45,
};

/** 取某商品某配色某尺码的温州仓现货双数；无匹配返回 null */
function getSizeStock(
  product: Product,
  colorName: string,
  displaySize: number
): number | null {
  if (!product.model) return null;
  const itemNo = MODEL_TO_STOCK[product.model] ?? product.model;
  const row = STOCK_LIST.find(
    (r) =>
      r.itemNo === itemNo && normColor(r.color) === normColor(colorName)
  );
  if (!row) return null;
  const euSize =
    product.sizeSystem === "EU" ? displaySize : US_TO_EU[displaySize];
  if (euSize == null) return null;
  const idx = EU_SIZES.indexOf(euSize as (typeof EU_SIZES)[number]);
  if (idx === -1) return null;
  return row.sizes[idx];
}

export function PDPView({ product, initialColorIdx = 0 }: { product: Product; initialColorIdx?: number }) {
  const { add } = useCart();
  const { formatPrice } = useCurrency();
  const [colorIdx, setColorIdx] = useState(initialColorIdx);
  const [media, setMedia] = useState<"image" | "video">("image");
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
  const name = displayName(product);
  const tagline = displayTagline(product);
  const features = displayFeatures(product);
  const sizeLabel = product.sizeSystem ?? "US";
  // 仅主推款展示视频位
  const isHero = product.id === HERO_PRODUCT_ID;

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
        {/* 主媒体区 */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-cream">
          {media === "image" ? (
            <ProductImage
              src={realImage}
              prompt={imagePrompt}
              alt={`${name} ${color.name}`}
              size="square_hd"
              className="h-full w-full"
            />
          ) : (
            <video
              key={HERO_VIDEO}
              className="h-full w-full object-cover"
              controls
              autoPlay
              muted
              loop
              playsInline
              poster={realImage}
            >
              <source src={HERO_VIDEO} type="video/mp4" />
            </video>
          )}

          {/* 视频模式下的静音切换 */}
          {media === "video" && (
            <button
              onClick={() => {
                const v = document.querySelector<HTMLVideoElement>("video");
                if (v) v.muted = !v.muted;
              }}
              className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
              aria-label="Toggle sound"
            >
              <Volume2 size={16} />
            </button>
          )}
        </div>

        {/* 缩略图条 */}
        <div className="mt-4 flex gap-3">
          {/* 各配色缩略图 */}
          {product.colors.map((c, i) => {
            const thumbSrc = c.realImage ?? c.image ?? product.heroImage ?? product.image;
            return (
              <button
                key={c.name}
                onClick={() => {
                  setColorIdx(i);
                  setMedia("image");
                }}
                className={cn(
                  "relative h-20 w-20 overflow-hidden rounded-xl border-2 transition",
                  media === "image" && i === colorIdx
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

          {/* 视频缩略图 —— 仅主推款展示 */}
          {isHero && (
            <button
              onClick={() => setMedia("video")}
              className={cn(
                "relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border-2 bg-ink/90 transition",
                media === "video" ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <ProductImage
                src={realImage}
                prompt={imagePrompt}
                alt={`${name} video`}
                size="square"
                className="h-full w-full opacity-50"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink">
                  <Play size={14} fill="currentColor" className="ml-0.5" />
                </span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 信息 */}
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          {isHero ? (
            <TrendBadge trend={product.trend} />
          ) : (
            <span className="rounded-full bg-ink/70 px-2.5 py-1 text-xs font-bold text-white">
              CONCEPT STUDY · NOT FOR ORDER
            </span>
          )}
          {isHero && product.reviews > 0 && (
            <span className="flex items-center gap-1 text-sm text-ink/60">
              <Star size={14} className="text-amber-500" fill="currentColor" />
              {product.rating} · {product.reviews} reviews
            </span>
          )}
          {product.stock === 0 && (
            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-accent-dark">
              Sold Out
            </span>
          )}
        </div>

        <h1 className="mt-3 text-4xl font-black">{ph(name)}</h1>
        <p className="mt-1 text-lg text-ink/55">{tagline}</p>

        {isHero && (
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-black">{formatPrice(product.price)}</span>
            {!product.demoPricing && !PLACEHOLDER_MODE && product.compareAt && (
              <span className="text-lg text-ink/40 line-through">{formatPrice(product.compareAt)}</span>
<<<<<<< HEAD
            )}
            {!product.demoPricing && (
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent-dark">
                Factory Direct · Save {formatPrice(product.compareAt ? product.compareAt - product.price : Math.round(product.price * 0.5))}
              </span>
=======
>>>>>>> 7336a67d6077df7f9329ec1026bb259907208716
            )}
            {product.demoPricing && (
              <span className="rounded-full bg-ink/10 px-2.5 py-0.5 text-xs font-bold text-ink/55">
                Demo pricing
              </span>
            )}
          </div>
        )}

        {isHero ? (
          <>
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
                <Link
                  href="/size-guide"
                  className="font-normal text-ink/50 hover:text-accent hover:underline"
                >
                  Not sure? See size guide →
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const stk = getSizeStock(product, color.name, s);
                  const soldOut = stk !== null && stk === 0;
                  return (
                    <button
                      key={s}
                      onClick={() => !soldOut && setSize(s)}
                      disabled={soldOut}
                      className={cn(
                        "relative flex h-11 w-14 flex-col items-center justify-center rounded-xl border text-sm font-bold transition",
                        soldOut
                          ? "cursor-not-allowed border-ink/10 bg-ink/5 text-ink/30"
                          : size === s
                            ? "border-ink bg-ink text-paper"
                            : "border-ink/20 bg-white hover:border-ink/60"
                      )}
                    >
                      <span>{s}</span>
                      {stk !== null && !soldOut && (
                        <span className="text-[9px] font-normal opacity-60">
                          {stk}
                        </span>
                      )}
                      {soldOut && (
                        <span className="text-[9px] font-normal">SOLD</span>
                      )}
                    </button>
                  );
                })}
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
          </>
        ) : (
          /* 赛题口径：非主推款仅为 Creative Lab 概念展示，不可下单，不形成第二转化路径 */
          <div className="mt-8 rounded-2xl border border-ink/15 bg-cream p-6">
            <div className="text-xs font-bold tracking-[0.25em] text-ink/50">
              CREATIVE LAB · CONCEPT STUDY
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              This style is a creative concept explored during the sprint. It is not part of the
              official 14534-H supply chain and is not available for order in this market test.
            </p>
            <Link
              href="/products/mono-boot"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-paper transition hover:bg-ink/85"
            >
              <ShoppingBag size={16} /> SHOP THE 14534-H
            </Link>
          </div>
        )}

        {isHero && (
          <>
            {/* 服务：SIZE GUIDE / SHIPPING & DUTIES / RETURNS / CARE */}
            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-4">
              <ServiceLink href="/size-guide" icon={Ruler} label="Size Guide" />
              <ServiceLink href="/shipping" icon={Truck} label="Shipping &amp; Duties" />
              <ServiceLink href="/returns" icon={RotateCcw} label="Returns" />
              <ServiceLink href="/faq" icon={Shield} label="Care" />
            </div>

            {/* 赛题第 8 节要求：详情页必须出现 交期拆分 / 尺码测量 / 试穿退货 / 关税口径 */}
            <div className="mt-4 rounded-2xl border border-ink/10 bg-white p-5 text-sm">
              <div className="mb-3 text-xs font-bold tracking-[0.2em] text-ink/40">
                SHIPPING &amp; RETURNS
              </div>
              <dl className="space-y-2 text-ink/70">
                <div className="flex gap-2">
                  <dt className="w-36 shrink-0 text-ink/50">Lead time</dt>
                  <dd>Production 3–5 business days + international transit 8–15 days (estimate, pending supplier confirmation)</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-36 shrink-0 text-ink/50">Duties</dt>
                  <dd>DDU — import duties / taxes not included, paid by customer on delivery</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-36 shrink-0 text-ink/50">Returns</dt>
                  <dd>30-day try-on guarantee — indoor try-on accepted, outdoor-worn not returnable</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-36 shrink-0 text-ink/50">Sizing</dt>
                  <dd>
                    EU {product.sizes[0]}–{product.sizes[product.sizes.length - 1]}. Measure your foot before ordering —{" "}
                    <Link href="/size-guide" className="font-bold text-accent-dark underline underline-offset-2">
                      size guide &amp; measuring method
                    </Link>
                  </dd>
                </div>
              </dl>
            </div>
          </>
        )}

        {/* 卖点列表 */}
        {features.length > 0 && (
          <ul className="mt-8 space-y-2.5">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-ink/75">
                <Check size={16} className="mt-0.5 shrink-0 text-sage" /> {f}
              </li>
            ))}
          </ul>
        )}

        {/* 产品规格 —— 供应链已验证信息：成本 / 交期 / 尺码 / 材质 / 产能 */}
        <div className="mt-8 border-t border-ink/10 pt-6 text-sm">
          <div className="mb-3 text-xs font-bold tracking-[0.2em] text-ink/40">
            PRODUCT DETAILS
          </div>
          <dl className="grid grid-cols-2 gap-y-2.5 text-ink/70">
            <Spec
              label="Size range"
              value={`${sizeLabel} ${product.sizes[0]}–${product.sizes[product.sizes.length - 1]}`}
            />
            {product.construction && (
              <Spec label="Construction" value={product.construction} />
            )}
            <Spec label="Upper" value={parseMaterial(product.material, "upper")} />
            <Spec label="Lining" value={parseMaterial(product.material, "lining")} />
            <Spec label="Outsole" value={parseMaterial(product.material, "outsole")} />
            {product.weight && <Spec label="Weight" value={displayWeight(product.weight)} />}
            {product.sku && <Spec label="Product code" value={product.sku} />}
          </dl>
        </div>
<<<<<<< HEAD

        {/* 服务承诺 — 4 项：免运费 + 30 天退货 + 真实交期 + 关税 */}
        <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-ink/10 bg-white p-4 text-center text-xs font-semibold text-ink/70 sm:grid-cols-4">
          <div className="flex flex-col items-center gap-1.5">
            <Truck size={18} className="text-accent" /> Free ship over $75
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <RotateCcw size={18} className="text-accent" /> 30-day returns
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Factory size={18} className="text-accent" />
            {product.leadTimeDays != null
              ? `${product.leadTimeDays}-day production`
              : "Production TBC"}
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <ShoppingBag size={18} className="text-accent" /> DDU — duties may apply
          </div>
        </div>
=======
>>>>>>> 7336a67d6077df7f9329ec1026bb259907208716
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
