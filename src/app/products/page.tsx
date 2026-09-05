import Link from "next/link";
import { ArrowRight, ShoppingBag, Layers, Sparkles, ShieldCheck } from "lucide-react";
import { Suspense } from "react";
import { getProductById } from "@/lib/data/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { PromoBanner } from "@/components/store/PromoBanner";
import { ECOSYSTEM, STATUS } from "@/lib/data/brand";

export default function ProductsPage() {
  const hero = getProductById("boot-14534-h");

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      {/* ---------- HEADER ---------- */}
      <div className="mb-14 border-b border-ink/10 pb-10">
        <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
          THE STRYDE SYSTEM
        </div>
        <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
          ONE BOOT.
          <br />
          MORE WAYS TO MAKE IT YOURS.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink/60">
          One real boot. One focused system. Built around the 14534-H.
        </p>
        <Suspense fallback={null}>
          <PromoBanner />
        </Suspense>
      </div>

      {/* ---------- 01 — STRYDE MONO BOOT (AVAILABLE) ---------- */}
      <section className="mb-16">
        <div className="mb-6 flex items-center gap-3">
          <div className="text-xs font-black tracking-[0.25em] text-ink/40">01</div>
          <span className="rounded-full bg-green-600 px-3 py-1 text-[11px] font-black tracking-wider text-white">
            {STATUS.available}
          </span>
        </div>
        {hero && (
          <div className="grid gap-8 rounded-3xl border border-ink/10 bg-white p-6 md:grid-cols-2 md:p-10">
            <div className="overflow-hidden rounded-2xl bg-cream">
              <ProductImage
                src={hero.heroImage ?? hero.image}
                prompt={hero.imagePrompt}
                alt="STRYDE 14534-H"
                size="portrait_4_3"
                className="aspect-[4/5] w-full"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-xs font-bold tracking-[0.2em] text-accent">
                SKU {hero.sku}
              </div>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">STRYDE MONO BOOT</h2>
              <p className="mt-3 text-ink/60">
                A clean black ankle boot built for workdays, evenings and everyday city routines.
                The only transaction-ready footwear in the STRYDE launch.
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
                <ShoppingBag size={16} /> SHOP THE BOOT
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ---------- 02 — STRYDE DUO ---------- */}
      <section className="mb-16">
        <div className="mb-6 flex items-center gap-3">
          <div className="text-xs font-black tracking-[0.25em] text-ink/40">02</div>
          <span className="rounded-full bg-ink/90 px-3 py-1 text-[11px] font-black tracking-wider text-paper">
            BUNDLE
          </span>
        </div>
        <Link
          href="/duo"
          className="group grid gap-8 rounded-3xl border border-ink/10 bg-white p-6 transition hover:border-ink/30 md:grid-cols-[auto_1fr] md:p-10"
        >
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((n) => (
              <div key={n} className="relative aspect-[3/4] w-28 overflow-hidden rounded-xl bg-cream sm:w-32">
                {hero && (
                  <ProductImage
                    src={hero.heroImage ?? hero.image}
                    prompt={hero.imagePrompt}
                    alt={`Pair ${n}`}
                    size="portrait_4_3"
                    className="h-full w-full"
                  />
                )}
                <div className="absolute left-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-black text-paper">
                  {n}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-accent">
              <Layers size={14} /> STRYDE DUO
            </div>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              {ECOSYSTEM.duo.split("\n").map((l, i) => (
                <span key={i}>
                  {l}
                  {i === 0 && <br />}
                </span>
              ))}
            </h2>
            <p className="mt-3 text-ink/60">
              Two units of the same real 14534-H. Choose each EU size separately and build a
              rotation for work and everything after.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ink">
              BUILD YOUR DUO <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>

      {/* ---------- 03 — STRYDE CLIPS ---------- */}
      <section className="mb-16">
        <div className="mb-6 flex items-center gap-3">
          <div className="text-xs font-black tracking-[0.25em] text-ink/40">03</div>
          <span className="rounded-full bg-ink/90 px-3 py-1 text-[11px] font-black tracking-wider text-paper">
            {STATUS.comingSoon}
          </span>
        </div>
        <Link
          href="/clips"
          className="group grid gap-8 rounded-3xl border border-ink/10 bg-white p-6 transition hover:border-ink/30 md:grid-cols-[auto_1fr] md:p-10"
        >
          <div className="relative aspect-[3/4] w-28 overflow-hidden rounded-xl bg-cream sm:w-32">
            {hero && (
              <ProductImage
                src={hero.heroImage ?? hero.image}
                prompt={hero.imagePrompt}
                alt="STRYDE CLIPS base"
                size="portrait_4_3"
                className="h-full w-full"
              />
            )}
            <div className="absolute left-1/2 top-[38%] -translate-x-1/2 rounded-full border-2 border-accent bg-paper/90 px-2 py-0.5 text-[9px] font-black text-accent-dark">
              CLIP
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-accent">
              <Sparkles size={14} /> STRYDE CLIPS
            </div>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">{ECOSYSTEM.clips}</h2>
            <p className="mt-3 text-ink/60">
              Removable decorative clip-on accessories designed around the existing detailing of
              the 14534-H. Personalize without changing the boot.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ink">
              EXPLORE THE CONCEPT <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>

      {/* ---------- 04 — STRYDE CARE 01 ---------- */}
      <section className="mb-16">
        <div className="mb-6 flex items-center gap-3">
          <div className="text-xs font-black tracking-[0.25em] text-ink/40">04</div>
          <span className="rounded-full bg-ink/90 px-3 py-1 text-[11px] font-black tracking-wider text-paper">
            {STATUS.comingSoon}
          </span>
        </div>
        <Link
          href="/care"
          className="group grid gap-8 rounded-3xl border border-ink/10 bg-white p-6 transition hover:border-ink/30 md:grid-cols-[auto_1fr] md:p-10"
        >
          <div className="relative aspect-[3/4] w-28 overflow-hidden rounded-xl bg-cream sm:w-32">
            {hero && (
              <ProductImage
                src={hero.heroImage ?? hero.image}
                prompt={hero.imagePrompt}
                alt="STRYDE CARE 01 base"
                size="portrait_4_3"
                className="h-full w-full"
              />
            )}
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-accent">
              <ShieldCheck size={14} /> STRYDE CARE 01
            </div>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">{ECOSYSTEM.care}</h2>
            <p className="mt-3 text-ink/60">
              A future care extension designed around the STRYDE footwear system. Currently under
              supplier and sourcing validation.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ink">
              EXPLORE THE CONCEPT <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>

      {/* ---------- CREATIVE LAB LINK ---------- */}
      <section className="mt-12 border-t border-ink/10 pt-10 text-center">
        <p className="text-sm text-ink/50">
          Looking for sprint exploration?
        </p>
        <Link
          href="/creative-lab"
          className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-ink/70 underline underline-offset-4 hover:text-ink"
        >
          EXPLORE THE CREATIVE LAB <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  );
}
