import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCTS, getProductById } from "@/lib/data/catalog";
import { ProductCard } from "@/components/store/ProductCard";

<<<<<<< Updated upstream
export default function ProductsPage() {
  const hero = getProductById("boot-14534-h");
  const concepts = PRODUCTS.filter((p) => p.id !== hero?.id);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      {/* Collection hero */}
      <div className="mb-14 border-b border-ink/10 pb-10">
        <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
          THE STRYDE COLLECTION
        </div>
        <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
          STAND UP.
          <br />
          STAND OUT.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink/60">
          One real hero product. One focused market test.
        </p>
=======
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

  // 邮件订阅引流：?discount=STRYDE15 → 存入 localStorage 供购物车自动应用，并显示横幅
  const discountCode = params.get("discount");
  const showPromoBanner = discountCode === "STRYDE15";
  if (showPromoBanner && typeof window !== "undefined") {
    localStorage.setItem("stryde-pending-promo", discountCode);
  }

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

      {showPromoBanner && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl bg-accent/10 px-4 py-3 text-sm font-semibold text-accent">
          <span className="text-base">🎉</span>
          15% off your order — code <span className="font-black">STRYDE15</span> will apply automatically at checkout.
        </div>
      )}

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
>>>>>>> Stashed changes
      </div>

      {/* PRIMARY PRODUCT — 14534-H */}
      <section className="mb-20">
        <div className="mb-6 text-xs font-bold tracking-[0.3em] text-ink/40">
          PRIMARY PRODUCT
        </div>
        {hero && (
          <div className="grid gap-8 rounded-3xl border border-ink/10 bg-white p-6 md:grid-cols-2 md:p-10">
            <div className="overflow-hidden rounded-2xl bg-cream">
              <ProductCard product={hero} />
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-xs font-bold tracking-[0.2em] text-accent">
                SKU {hero.sku}
              </div>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                {hero.name}
              </h2>
              <p className="mt-3 text-ink/60">
                A clean black ankle boot built for workdays, evenings and everyday city
                routines.
              </p>
              <dl className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-cream p-3">
                  <dt className="text-[11px] text-ink/50">Sizes</dt>
                  <dd className="mt-0.5 text-sm font-bold">EU 38–46</dd>
                </div>
                <div className="rounded-xl bg-cream p-3">
                  <dt className="text-[11px] text-ink/50">Upper</dt>
                  <dd className="mt-0.5 text-sm font-bold">Microfiber</dd>
                </div>
                <div className="rounded-xl bg-cream p-3">
                  <dt className="text-[11px] text-ink/50">Outsole</dt>
                  <dd className="mt-0.5 text-sm font-bold">Rubber</dd>
                </div>
              </dl>
              <Link
                href={`/products/${hero.slug}`}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-paper transition hover:bg-ink/85"
              >
                SHOP 14534-H <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* CREATIVE LAB — secondary concepts */}
      <section>
        <div className="mb-6">
          <div className="text-xs font-bold tracking-[0.3em] text-ink/40">
            CREATIVE LAB
          </div>
          <p className="mt-2 max-w-xl text-ink/55">
            Secondary footwear concepts explored during the sprint.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {concepts.map((p) => (
            <ProductCard key={p.id} product={p} concept />
          ))}
        </div>
      </section>
    </div>
  );
}
