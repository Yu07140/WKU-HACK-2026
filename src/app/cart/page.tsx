"use client";

import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { formatUSD, ph } from "@/lib/utils";

export default function CartPage() {
  const { items, remove, updateQty, subtotal, count } = useCart();
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 7.9;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-28 text-center">
        <ShoppingBag size={48} className="text-ink/25" />
        <h1 className="mt-5 text-2xl font-black">Your bag is empty</h1>
        <p className="mt-2 text-ink/55">爆款正在仓库等你，AI 导购也可以帮你挑。</p>
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
                  src={it.image}
                  prompt={`${it.imagePrompt}, product photo, cream background`}
                  alt={it.productName}
                  src={it.realImage}
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

        {/* 汇总 */}
        <div className="h-fit rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="text-lg font-black">Summary</h2>
          <div className="mt-4 space-y-2.5 text-sm">
            <Row label="Subtotal" value={formatUSD(subtotal)} />
            <Row
              label="Shipping"
              value={shipping === 0 ? "FREE" : formatUSD(shipping)}
              accent={shipping === 0}
            />
            <div className="border-t border-ink/10 pt-2.5">
              <Row label="Total" value={formatUSD(subtotal + shipping)} bold />
            </div>
          </div>
          <Link href="/checkout">
            <Button size="lg" className="mt-6 w-full">
              Checkout <ArrowRight size={17} />
            </Button>
          </Link>
          <p className="mt-3 text-center text-xs text-ink/45">
            🔒 Demo checkout · no real payment · 订单将实时进入增长看板
          </p>
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
