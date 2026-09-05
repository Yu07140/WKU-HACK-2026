"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag, Check, X, Sparkles, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { ph } from "@/lib/utils";
import { displayNameString } from "@/lib/store/display";
import { useCurrency } from "@/lib/store/currency";

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
  const { formatPrice } = useCurrency();
  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // 邮件订阅引流：若 localStorage 有待应用的优惠码，自动应用
  useEffect(() => {
    const pending = localStorage.getItem("stryde-pending-promo");
    if (pending && !promoCode) {
      const res = applyPromo(pending);
      if (res.ok) {
        localStorage.removeItem("stryde-pending-promo");
        setPromoMsg({ ok: true, text: `${pending} applied — 15% off your order` });
        setTimeout(() => setPromoMsg(null), 3000);
      }
    }
  }, [promoCode, applyPromo]);

  // $75 免运费 —— 按优惠前 subtotal 判断（保持原有业务规则不变）
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 7.9;
  const total = subtotal - discount + shipping;

  function handleApply() {
    const res = applyPromo(promoInput);
    setPromoMsg({ ok: res.ok, text: res.msg ?? (res.ok ? "Applied" : "Invalid code") });
    if (res.ok) setPromoInput("");
    setTimeout(() => setPromoMsg(null), 3000);
  }

  function handleRemove() {
    removePromo();
    setPromoMsg(null);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-28 text-center">
        <ShoppingBag size={48} className="text-ink/25" />
        <h1 className="mt-5 text-2xl font-black">Your bag is empty</h1>
        <p className="mt-2 text-ink/55">The 14534-H is ready when you are — or ask the STRYDE Assistant for help.</p>
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
                      {ph(displayNameString(it.productName))}
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
                  <div className="font-black">{formatPrice(it.price * it.qty)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 汇总 */}
        <div className="h-fit rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="text-lg font-black">Summary</h2>

          {/* 免运费进度提示 */}
          {subtotal > 0 && subtotal < 75 && (
            <div className="mt-4 rounded-xl bg-sage/10 px-3 py-2.5 text-xs text-sage">
              Add <span className="font-bold">{formatPrice(75 - subtotal)}</span> more for free shipping!
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
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            {discount > 0 && (
              <Row
                label={`Discount (${promoCode})`}
                value={`-${formatPrice(discount)}`}
              />
            )}
            <Row
              label="Shipping"
              value={shipping === 0 ? "FREE" : formatPrice(shipping)}
              accent={shipping === 0}
            />
            <div className="border-t border-ink/10 pt-2.5">
              <Row label="Total" value={formatPrice(total)} bold />
            </div>
          </div>
          <Link href="/checkout">
            <Button size="lg" className="mt-6 w-full">
              Checkout <ArrowRight size={17} />
            </Button>
          </Link>
          <p className="mt-3 text-center text-xs text-ink/45">
            🔒 Demo checkout · no real payment · orders appear live in the internal dashboard
          </p>
        </div>
      </div>

      {/* ---------- BUILD YOUR ROTATION — cross-sell only the 14534-H ecosystem ---------- */}
      {items.some((it) => it.productId === "boot-14534-h") && (
        <section className="mt-14 rounded-3xl border border-ink/10 bg-white p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-bold tracking-[0.3em] text-ink/40">
                BUILD YOUR ROTATION
              </div>
              <h3 className="mt-2 text-2xl font-black">Add a second 14534-H.</h3>
              <p className="mt-1 text-sm text-ink/55">
                One for the workweek. One for everything after. Choose a second size with STRYDE DUO.
              </p>
            </div>
            <Link href="/duo">
              <Button size="lg">
                ADD SECOND PAIR <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          {/* Coming next — subtle, no Add to Cart */}
          <div className="mt-8 grid gap-4 border-t border-ink/10 pt-6 sm:grid-cols-2">
            <Link
              href="/clips"
              className="flex items-center gap-3 rounded-2xl bg-cream p-4 transition hover:bg-cream/70"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink/10 text-ink">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="text-[10px] font-black tracking-wider text-ink/40">COMING NEXT</div>
                <div className="text-sm font-bold">STRYDE CLIPS · MAKE IT YOURS.</div>
              </div>
            </Link>
            <Link
              href="/care"
              className="flex items-center gap-3 rounded-2xl bg-cream p-4 transition hover:bg-cream/70"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink/10 text-ink">
                <ShieldCheck size={16} />
              </div>
              <div>
                <div className="text-[10px] font-black tracking-wider text-ink/40">COMING NEXT</div>
                <div className="text-sm font-bold">STRYDE CARE 01 · KEEP THE ROUTE GOING.</div>
              </div>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-black" : "text-ink/65"}`}>
      <span>{label}</span>
      <span className={accent ? "font-bold text-sage" : ""}>{value}</span>
    </div>
  );
}
