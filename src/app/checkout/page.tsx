"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Lock, Shield, RotateCcw, Truck } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ph } from "@/lib/utils";
import { displayNameString } from "@/lib/store/display";
import { useCurrency } from "@/lib/store/currency";
import { useLang } from "@/lib/store/lang";

export default function CheckoutPage() {
  const { items, subtotal, discount, promoCode, clear } = useCart();
  const { formatPrice } = useCurrency();
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [form, setForm] = useState({
    customer: "",
    email: "",
    country: "United States",
    address: "",
    card: "4242 4242 4242 4242",
  });

  // 运费 —— 与 /shipping 政策页一致：US 满 $75 免运费；UK/EU $12.50；CA/AU $14.90；其余 $14.90
  const c = form.country.toLowerCase();
  const isUS = c.includes("united states") || c.includes("usa");
  const isUkEu = /united kingdom|uk|germany|france|netherlands|italy|spain|europe|eu\b/.test(c);
  const zoneRate = isUS ? 7.9 : isUkEu ? 12.5 : 14.9;
  const shipping = subtotal >= 75 ? 0 : zoneRate;
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
          price: i.price * i.qty,
        })),
      }),
    }).then((r) => r.json());
    setLoading(false);
    setOrderId(order.id ?? "ST-DEMO");
    clear();
  }

  if (orderId) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-28 text-center">
        <CheckCircle2 size={64} className="text-sage" />
        <div className="mt-4 inline-flex rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700">
          {t("TEST ORDER · SANDBOX", "测试订单 · 沙盒环境")}
        </div>
        <h1 className="mt-5 text-3xl font-black">{t("Order placed! 🎉", "下单成功！🎉")}</h1>
        <p className="mt-3 text-ink/60">
          {t("Order number", "订单号")}{" "}
          <span className="font-bold text-ink">{orderId}</span>{" "}
          {t(
            "is a sandbox test order. Thanks for shopping with STRYDE.",
            "是沙盒测试订单。感谢你在 STRYDE 购物。"
          )}
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/products">
            <Button variant="outline">{t("Keep shopping", "继续购物")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-6 flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-3 py-2 text-xs text-ink/50">
        <Shield size={14} className="shrink-0" />
        <span>
          <span className="font-bold">{t("SANDBOX CHECKOUT", "沙盒结账")}</span>{" "}
          {t("— orders placed here are test orders, not real purchases.", "——此处提交的均为测试订单，非真实购买。")}
        </span>
      </div>
      <h1 className="text-3xl font-black">{t("Checkout", "结账")}</h1>
      <form onSubmit={submit} className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* 左：表单 */}
        <div className="space-y-8 rounded-2xl border border-ink/10 bg-white p-6">
          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-ink/50">
              {t("1 · Shipping", "1 · 收货信息")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>{t("Full name", "姓名")}</Label>
                <Input
                  required
                  value={form.customer}
                  onChange={(e) => setForm({ ...form, customer: e.target.value })}
                  placeholder="Alex Wang"
                />
              </div>
              <div>
                <Label>{t("Email", "邮箱")}</Label>
                <Input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="alex@email.com"
                />
              </div>
              <div>
                <Label>{t("Country", "国家/地区")}</Label>
                <Input
                  required
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("Address", "收货地址")}</Label>
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
              {t("2 · Payment", "2 · 支付方式")}
            </h2>
            <Label>{t("Card number (demo)", "卡号（演示）")}</Label>
            <Input
              required
              value={form.card}
              onChange={(e) => setForm({ ...form, card: e.target.value })}
            />
            <p className="mt-2 text-xs text-ink/45">
              {t("Demo mode — no real charge. Any card number works.", "演示模式——不会真实扣款，任意卡号均可。")}
            </p>
          </section>
        </div>

        {/* 右：订单摘要 */}
        <div className="h-fit rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="text-lg font-black">{t("Your order", "你的订单")}</h2>
          <div className="mt-4 space-y-3">
            {items.map((i) => (
              <div key={`${i.productId}-${i.size}`} className="flex justify-between text-sm">
                <span className="text-ink/70">
                  {ph(displayNameString(i.productName))} × {i.qty}
                  <span className="block text-xs text-ink/45">
                    {i.color} · {i.sizeSystem ?? "US"} {i.size}
                  </span>
                </span>
                <span className="font-semibold">{formatPrice(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between text-ink/65">
              <span>{t("Subtotal", "小计")}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && promoCode && (
              <div className="flex justify-between text-accent font-bold">
                <span>
                  {t("Discount", "折扣")} ({promoCode})
                </span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink/65">
              <span>{t("Shipping", "运费")}</span>
              <span>{shipping === 0 ? t("FREE", "免费") : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between pt-1 text-base font-black">
              <span>{t("Total", "合计")}</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Button size="lg" className="mt-6 w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={16} />}
            {loading
              ? t("Processing...", "处理中…")
              : `${t("Securely pay", "安全支付")} ${formatPrice(total)}`}
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
                <span>{t("Secure checkout", "安全结账")}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw size={16} className="text-sage" />
                <span>{t("30-Day Guarantee", "30 天质保")}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck size={16} className="text-sage" />
                <span>{t("Demo shipping", "演示运费")}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
