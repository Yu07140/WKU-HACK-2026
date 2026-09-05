"use client";

import Link from "next/link";
import { ShoppingBag, Sparkles, LayoutDashboard, Warehouse } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { useCurrency, CURRENCIES, type CurrencyCode } from "@/lib/store/currency";
import { BRAND } from "@/lib/data/brand";

const NAV = [
  { href: "/products", label: "Collection" },
  { href: "/stock", label: "Stock", icon: Warehouse },
  { href: "/studio", label: "Studio", icon: Sparkles },
];

export function SiteHeader() {
  const { count } = useCart();
  const { currency, setCurrency } = useCurrency();
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-black tracking-[0.18em]">
          {BRAND.name}
          <span className="text-accent">.</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-1.5 text-sm font-semibold text-ink/70 transition hover:text-ink"
            >
              {n.icon && <n.icon size={15} className="text-accent" />}
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* 币种切换 */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="cursor-pointer rounded-md border border-ink/10 bg-white px-2 py-1 text-xs font-semibold text-ink/70 transition hover:border-ink/30 focus:outline-none focus:ring-1 focus:ring-accent"
            aria-label="Select currency"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
          <Link
            href="/admin"
            title="Dashboard (internal)"
            className="rounded-full p-2 text-ink/60 transition hover:bg-ink/5 hover:text-ink"
          >
            <LayoutDashboard size={19} />
          </Link>
          <Link
            href="/cart"
            className="relative rounded-full p-2 text-ink transition hover:bg-ink/5"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
