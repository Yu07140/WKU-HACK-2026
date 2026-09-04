"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { formatUSD, ph } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [form, setForm] = useState({
    customer: "",
    email: "",
    country: "United States",
    address: "",
    card: "4242 4242 4242 4242",
  });

  const shipping = subtotal >= 75 ? 0 : 7.9;
  const total = subtotal + shipping;

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
        <h1 className="mt-5 text-3xl font-black">Order placed! 🎉</h1>
        <p className="mt-3 text-ink/60">
          订单号 <span className="font-bold text-ink">{orderId}</span> 已进入履约流程，
          AI 客服将通过邮件同步物流。去增长看板可以看到这笔交易实时计入漏斗。
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/products">
            <Button variant="outline">继续逛</Button>
          </Link>
          <Link href="/admin/orders">
            <Button>查看交易看板 <Lock size={15} /></Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-black">Checkout</h1>
      <form onSubmit={submit} className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
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
              Demo 环境不会真实扣款，任意卡号均可提交。
            </p>
          </section>
        </div>

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
            <div className="flex justify-between text-ink/65">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : formatUSD(shipping)}</span>
            </div>
            <div className="flex justify-between pt-1 text-base font-black">
              <span>Total</span>
              <span>{formatUSD(total)}</span>
            </div>
          </div>
          <Button size="lg" className="mt-6 w-full" disabled={loading || items.length === 0}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={16} />}
            {loading ? "Processing..." : `Pay ${formatUSD(total)}`}
          </Button>
        </div>
      </form>
    </div>
  );
}
