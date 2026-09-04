import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { PRODUCTS, getProductById } from "@/lib/data/catalog";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    no: "01",
    title: "WORKDAY",
    desc: "A clean black silhouette that fits easily into a sharper everyday wardrobe.",
  },
  {
    no: "02",
    title: "AFTER HOURS",
    desc: "Simple enough for dinner, dates and city nights without changing the whole look.",
  },
  {
    no: "03",
    title: "WEEKEND",
    desc: "Easy styling for short trips, walks and casual plans.",
  },
];

const ROUTINES = [
  {
    no: "01",
    title: "COMMUTE",
    img: "/products/14534-h/hero.jpg",
  },
  {
    no: "02",
    title: "AFTER HOURS",
    img: "/products/14534-h/black.jpg",
  },
  {
    no: "03",
    title: "WEEKEND",
    img: "/products/14534-h/lifestyle-01.jpg",
  },
];

export default function HomePage() {
  const hero = getProductById("boot-14534-h") ?? PRODUCTS[0];
  // 14534-H is the only hero SKU; other factory styles are secondary concepts
  const others = [...PRODUCTS]
    .filter((p) => p.id !== hero.id)
    .sort((a, b) => b.heatScore - a.heatScore)
    .slice(0, 3);

  return (
    <div>
      {/* ---------- HERO — 14534-H, product & brand first ---------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-12 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <div className="mb-6 text-xs font-bold tracking-[0.3em] text-ink/45">
              STRYDE
            </div>
            <h1 className="text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
              STAND UP.
              <br />
              <span className="text-ink/80">STAND OUT.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-ink/65">
              A clean black boot built for the way your day actually moves —
              from work hours to everything after.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href={`/products/${hero.slug}`}>
                <Button size="lg">
                  SHOP THE BOOT <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/about" className="text-sm font-bold text-ink/70 underline underline-offset-4 decoration-ink/30">
                EXPLORE STRYDE
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium tracking-wider text-ink/45">
              <span>EU 38–46</span>
              <span className="h-1 w-1 rounded-full bg-ink/30" />
              <span>Microfiber upper</span>
              <span className="h-1 w-1 rounded-full bg-ink/30" />
              <span>Rubber outsole</span>
            </div>
          </div>

          <div className="relative">
            <ProductImage
              src={hero.heroImage ?? hero.image}
              prompt={hero.imagePrompt}
              alt={`STRYDE 14534-H — black minimalist ankle boot`}
              size="portrait_4_3"
              className="aspect-[4/5] rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ---------- ONE PAIR. MORE PLANS. ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-12">
          <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
            THE DAILY ROUTE
          </div>
          <h2 className="text-4xl font-black leading-tight md:text-5xl">
            ONE PAIR.
            <br />
            MORE PLANS.
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.no} className="border-t border-ink/15 pt-6">
              <div className="text-xs font-black tracking-[0.25em] text-ink/40">{p.no}</div>
              <h3 className="mt-3 text-2xl font-black tracking-wide">{p.title}</h3>
              <p className="mt-3 text-ink/60 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- ONE BOOT. THREE ROUTINES. ---------- */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="mb-12">
            <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
              EDITORIAL
            </div>
            <h2 className="text-4xl font-black leading-tight md:text-5xl">
              ONE BOOT.
              <br />
              THREE ROUTINES.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {ROUTINES.map((r) => (
              <div key={r.no} className="group overflow-hidden rounded-3xl bg-white">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <ProductImage
                    src={r.img}
                    prompt="black minimalist ankle boot, clean editorial photography"
                    alt={r.title}
                    size="portrait_4_3"
                    className="h-full w-full transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-black tracking-wider text-paper">
                    {r.no} · {r.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-ink/40">
            AI Campaign Concept — the real 14534-H remains the product reference.
          </p>
        </div>
      </section>

      {/* ---------- CREATIVE LAB — secondary concepts (NOT same supply chain as 14534-H) ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-10">
          <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
            CREATIVE LAB
          </div>
          <h2 className="text-3xl font-black md:text-4xl">Other Concepts</h2>
          <p className="mt-2 max-w-xl text-ink/55">
            Additional creative concepts explored during the sprint. These are separate
            directions and are not part of the official 14534-H men's boot supply chain.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
          {others.map((p) => (
            <div key={p.id} className="relative">
              <ProductCard product={p} />
              <span className="absolute left-0 top-2 z-10 rounded-r bg-ink/70 px-2 py-0.5 text-[10px] font-bold tracking-wider text-paper">
                CONCEPT
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-3xl bg-ink p-10 text-center text-paper md:p-14">
          <h2 className="text-3xl font-black leading-tight md:text-4xl">
            STAND UP. STAND OUT.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-paper/60">
            The 14534-H — a clean black boot for the way your day moves.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={`/products/${hero.slug}`}>
              <Button size="lg">
                <ShoppingBag size={18} /> SHOP THE BOOT
              </Button>
            </Link>
            <Link href="/size-guide">
              <Button size="lg" variant="outline">
                FIND YOUR SIZE
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
