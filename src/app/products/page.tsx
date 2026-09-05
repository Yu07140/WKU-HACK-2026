import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCTS, getProductById } from "@/lib/data/catalog";
import { ProductCard } from "@/components/store/ProductCard";
import { PromoBanner } from "@/components/store/PromoBanner";

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
<<<<<<< HEAD
=======
        <Suspense fallback={null}>
          <PromoBanner />
        </Suspense>
>>>>>>> 7336a67d6077df7f9329ec1026bb259907208716
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
