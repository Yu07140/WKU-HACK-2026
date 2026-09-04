"use client";

import Link from "next/link";
import { useState } from "react";
import { Trash2, ArrowRight, ShoppingBag, Check, X } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { formatUSD, ph } from "@/lib/utils";

export default function CartPage() {
  const {
    items,
    remove,
    updateQty,
    subtotal,
    count,
    discount,
    promoCode,
    applyPromo,
    removePromo,
  } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // $75 免运费 —— 按优惠前 subtotal 判断（保持原有业务规则不变）
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 7.9;
  const total = Math.max(0, subtotal - discount + shipping);

  function handleApply() {
    const result = applyPromo(promoInput);
    setPromoMsg({ ok: result.ok, text: result.msg ?? "" });
    if (result.ok) setPromoInput("");
  }

  function handleRemove() {
    removePromo();
    setPromoInput("");
    setPromoMsg(null);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-28 text-center">
        <ShoppingBag size={48} className="text-ink/25" />
        <h1 className="mt-5 text-2xl font-black">Your bag is empty</h1>
        <p className="mt-2 text-ink/55">Nothing here yet. Go find your next favorite pair.</p>
        <Link href="/products" className="mt-7">
          <Button size="lg">
            Start shopping <ArrowRight size={17} />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-black">Your Bag ({count})</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* ---------- 商品列表 ---------- */}
        <div className="space-y-4">
          {items.map((it) => (
            <div
              key={`${it.productId}-${it.color}-${it.size}`}
              className="flex gap-4 rounded-2xl border border-ink/10 bg-white p-4"
            >
              <Link href={`/products/${it.slug}`}>
                <ProductImage
                  src={it.realImage ?? it.image}
                  prompt={`${it.imagePrompt}, product photo, cream background`}
                  alt={it.productName}
                  className="h-28 w-28 rounded-xl"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                  <div>
                    <Link href={`/products/${it.slug}`} className="font-bold hover:underline">
                      {ph(it.productName)}
                    </Link>
                    <div className="mt-0.5 text-sm text-ink/55">
                      {it.color} · {it.sizeSystem ?? "US"} {it.size}
                    </div>
                  </div>
                  <button
                    onClick={() => remove(it.productId, it.color, it.size)}
                    className="h-8 w-8 rounded-full text-ink/40 transition hover:bg-red-50 hover:text-accent"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-ink/15 text-sm">
                    <button
                      className="h-8 w-9 font-bold"
                      onClick={() => updateQty(it.productId, it.color, it.size, it.qty - 1)}
                    >
                      −
                    </button>
                    <span className="w-7 text-center font-semibold">{it.qty}</span>
                    <button
                      className="h-8 w-9 font-bold"
                      onClick={() => updateQty(it.productId, it.color, it.size, it.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="font-black">{formatUSD(it.price * it.qty)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- 汇总 ---------- */}
        <div className="h-fit rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="text-lg font-black">Summary</h2>

          {/* 免运费进度提示 */}
          {subtotal > 0 && subtotal < 75 && (
            <div className="mt-4 rounded-xl bg-sage/10 px-3 py-2.5 text-xs text-sage">
              Add <span className="font-bold">{formatUSD(75 - subtotal)}</span> more for free shipping!
            </div>
          )}
          {subtotal >= 75 && items.length > 0 && (
            <div className="mt-4 rounded-xl bg-sage/10 px-3 py-2.5 text-xs font-bold text-sage">
              ✓ You've unlocked free shipping
            </div>
          )}

          {/* Promo code */}
          <div className="mt-4 border-b border-ink/10 pb-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-ink/50">
              Promo code
            </div>
            {promoCode ? (
              <div className="flex items-center justify-between rounded-xl bg-sage/10 px-3 py-2 text-sm">
                <span className="flex items-center gap-1.5 font-bold text-sage">
                  <Check size={15} /> {promoCode} applied
                </span>
                <button
                  onClick={handleRemove}
                  className="text-ink/40 hover:text-accent"
                  aria-label="Remove promo code"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Enter code"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApply();
                    }
                  }}
                  className="h-10 flex-1 rounded-xl border border-ink/20 bg-white px-3 text-sm outline-none focus:border-accent"
                />
                <Button size="sm" onClick={handleApply}>
                  APPLY
                </Button>
              </div>
            )}
            {promoMsg && (
              <p
                className={`mt-2 text-xs ${
                  promoMsg.ok ? "text-sage" : "text-accent"
                }`}
              >
                {promoMsg.text}
              </p>
            )}
          </div>

          {/* 金额行 */}
          <div className="mt-4 space-y-2.5 text-sm">
            <Row label="Subtotal" value={formatUSD(subtotal)} />
            {discount > 0 && (
              <Row
                label={`Discount (${promoCode})`}
                value={`-${formatUSD(discount)}`}
                discount
              />
            )}
            <Row
              label="Shipping"
              value={shipping === 0 ? "FREE" : formatUSD(shipping)}
              accent={shipping === 0}
            />
            <div className="border-t border-ink/10 pt-2.5">
              <Row label="Total" value={formatUSD(total)} bold />
            </div>
          </div>
          <Link href="/checkout">
            <Button size="lg" className="mt-6 w-full">
              Checkout <ArrowRight size={17} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  accent,
  discount,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
  discount?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${
        bold ? "text-base font-black" : "text-ink/65"
      }`}
    >
      <span className={discount ? "text-accent" : ""}>{label}</span>
      <span
        className={
          accent
            ? "font-bold text-sage"
            : discount
            ? "font-bold text-accent"
            : ""
        }
      >
        {value}
      </span>
    </div>
  );
}
