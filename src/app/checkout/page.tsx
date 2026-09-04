"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Lock, Shield, RotateCcw, Truck } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { formatUSD, ph } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, subtotal, discount, promoCode, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [form, setForm] = useState({
    customer: "",
    email: "",
    country: "United States",
    address: "",
    card: "4242 4242 4242 4242",
  });

  // $75 免运费 —— 按优惠前 subtotal 判断（保持原有业务规则不变）
  const shipping = subtotal >= 75 ? 0 : 7.9;
  const total = Math.max(0, subtotal - discount + shipping);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // 交易闭环：订单写入后端 → 实时出现在 /admin/orders 看板
    const order = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: form.customer,
        email: form.email,
        country: form.country,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          color: i.color,
          size: i.size,
          qty: i.qty,
          amount: i.price * i.qty,
        })),
      }),
    }).then((r) => r.json());

    setTimeout(() => {
      setLoading(false);
      setOrderId(order.id ?? "ST-DEMO");
      clear();
    }, 900);
  }

  if (orderId) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-28 text-center">
        <CheckCircle2 size={64} className="text-sage" />
        <div className="mt-4 inline-flex rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700">
          TEST ORDER · SANDBOX
        </div>
        <h1 className="mt-5 text-3xl font-black">Order placed! 🎉</h1>
        <p className="mt-3 text-ink/60">
          Order number <span className="font-bold text-ink">{orderId}</span> is a sandbox test order.
          Thanks for shopping with STRYDE.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/products">
            <Button variant="outline">Keep shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-6 flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-3 py-2 text-xs text-ink/50">
        <Shield size={14} className="shrink-0" />
        <span><span className="font-bold">SANDBOX CHECKOUT</span> — orders placed here are test orders, not real purchases.</span>
      </div>
      <h1 className="text-3xl font-black">Checkout</h1>
      <form onSubmit={submit} className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* 左：表单 */}
        <div className="space-y-8 rounded-2xl border border-ink/10 bg-white p-6">
          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-ink/50">
              1 · Shipping
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Full name</Label>
                <Input
                  required
                  value={form.customer}
                  onChange={(e) => setForm({ ...form, customer: e.target.value })}
                  placeholder="Alex Wang"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="alex@email.com"
                />
              </div>
              <div>
                <Label>Country</Label>
                <Input
                  required
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="123 Market St"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-ink/50">
              2 · Payment
            </h2>
            <Label>Card number (demo)</Label>
            <Input
              required
              value={form.card}
              onChange={(e) => setForm({ ...form, card: e.target.value })}
            />
            <p className="mt-2 text-xs text-ink/45">
              Demo mode — no real charge. Any card number works.
            </p>
          </section>
        </div>

        {/* 右：订单摘要 */}
        <div className="h-fit rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="text-lg font-black">Your order</h2>
          <div className="mt-4 space-y-3">
            {items.map((i) => (
              <div key={`${i.productId}-${i.size}`} className="flex justify-between text-sm">
                <span className="text-ink/70">
                  {ph(i.productName)} × {i.qty}
                  <span className="block text-xs text-ink/45">
                    {i.color} · {i.sizeSystem ?? "US"} {i.size}
                  </span>
                </span>
                <span className="font-semibold">{formatUSD(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between text-ink/65">
              <span>Subtotal</span>
              <span>{formatUSD(subtotal)}</span>
            </div>
            {discount > 0 && promoCode && (
              <div className="flex justify-between text-accent font-bold">
                <span>Discount ({promoCode})</span>
                <span>-{formatUSD(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink/65">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : formatUSD(shipping)}</span>
            </div>
            <div className="flex justify-between pt-1 text-base font-black">
              <span>Total</span>
              <span>{formatUSD(total)}</span>
            </div>
          </div>
          <Button size="lg" className="mt-6 w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={16} />}
            {loading ? "Processing..." : `Securely pay ${formatUSD(total)}`}
          </Button>

          {/* 信任元素 */}
          <div className="mt-5 space-y-3">
            {/* 支付方式 */}
            <div className="flex items-center justify-center gap-2">
              {["VISA", "MC", "AMEX", "PayPal"].map((p) => (
                <span
                  key={p}
                  className="rounded-md border border-ink/15 bg-white px-2.5 py-1 text-[10px] font-black tracking-wider text-ink/60"
                >
                  {p}
                </span>
              ))}
            </div>
            {/* 信任 badge */}
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-ink/55">
              <div className="flex flex-col items-center gap-1">
                <Shield size={16} className="text-sage" />
                <span>Secure checkout</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw size={16} className="text-sage" />
                <span>Returns TBC</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck size={16} className="text-sage" />
                <span>Demo shipping</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
