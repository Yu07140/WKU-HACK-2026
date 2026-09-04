"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PRODUCTS } from "@/lib/data/catalog";
import { CATEGORY_LABELS, type Category } from "@/lib/types";
import { ProductCard } from "@/components/store/ProductCard";
import { cn } from "@/lib/utils";

/** 分类标签只展示货盘里实际存在的品类 */
const ACTIVE_TABS = ["all", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))] as const;

function ProductsBrowser() {
  const params = useSearchParams();
  const [cat, setCat] = useState<string>(params.get("cat") ?? "all");

  const list = useMemo(
    () => (cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)),
    [cat]
  );

  const tabs = ACTIVE_TABS;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-4xl font-black">Shop All</h1>
      <p className="mt-2 text-ink/55">
        {PRODUCTS.length} styles · factory direct · free shipping over $75
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setCat(t)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              cat === t
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 bg-white text-ink/70 hover:border-ink/50"
            )}
          >
            {t === "all" ? "All 全部" : CATEGORY_LABELS[t as Category]}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-ink/40">Loading...</div>}>
      <ProductsBrowser />
    </Suspense>
  );
}
