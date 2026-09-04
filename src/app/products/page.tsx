"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PRODUCTS } from "@/lib/data/catalog";
import { CATEGORY_LABELS, type Category } from "@/lib/types";
import { ProductCard } from "@/components/store/ProductCard";
import { cn } from "@/lib/utils";

/** 公共区 CATEGORY_LABELS 含中文后缀（"Boots 靴子"），这里去掉中文部分 */
const CN_REGEX = /[\u4e00-\u9fff]/;
function cleanLabel(label: string): string {
  return label.split(/\s/).filter((w) => !CN_REGEX.test(w)).join(" ").trim() || label;
}

/** 分类标签只展示货盘里实际存在的品类 */
const ACTIVE_TABS = ["all", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))] as const;

function ProductsBrowser() {
  const params = useSearchParams();
  const router = useRouter();
  const [cat, setCat] = useState<string>(params.get("cat") ?? "all");

  const list = useMemo(
    () => (cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)),
    [cat]
  );

  const tabs = ACTIVE_TABS;

  function selectCat(t: string) {
    setCat(t);
    router.replace(t === "all" ? "/products" : `/products?cat=${t}`, { scroll: false });
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-4xl font-black">Shop All</h1>
      <p className="mt-2 text-ink/55">
        {PRODUCTS.length} styles · the 14534-H is our flagship
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => selectCat(t)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              cat === t
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 bg-white text-ink/70 hover:border-ink/50"
            )}
          >
            {t === "all" ? "All" : cleanLabel(CATEGORY_LABELS[t as Category])}
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
