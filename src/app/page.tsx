import Link from "next/link";
import { ArrowRight, Factory, Layers, Zap, BarChart3, ShoppingCart } from "lucide-react";
import { PRODUCTS, getProductById } from "@/lib/data/catalog";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { PLACEHOLDER_MODE } from "@/lib/utils";

const FACT_STRIP = [
  { big: "14534-H", small: "FACTORY SKU" },
  { big: "Microfiber", small: "MATERIAL" },
  { big: "EU 38–46", small: "SIZE RANGE" },
  { big: "Rubber", small: "OUTSOLE" },
  { big: "24H", small: "AI-TO-MARKET SPRINT" },
];

const ROUTINES = [
  {
    no: "01",
    title: "COMMUTE",
    desc: "A clean black silhouette that carries you from morning train to evening desk without asking for attention.",
    img: "/products/14534-h/hero.jpg",
  },
  {
    no: "02",
    title: "BUSINESS CASUAL",
    desc: "Quiet shape. Sharp detail. Rear zipper and a restrained profile that reads as intentional, not loud.",
    img: "/products/14534-h/black.jpg",
  },
  {
    no: "03",
    title: "WEEKEND",
    desc: "One pair for short city trips and light outdoor — the same boot, no second suitcase required.",
    img: "/products/14534-h/lifestyle-01.jpg",
  },
];

const WORKFLOW = [
  { no: "01", label: "FACTORY PRODUCT", sub: "14534-H" },
  { no: "02", label: "AI POSITIONING", sub: "commute / business casual / weekend" },
  { no: "03", label: "AI CREATIVE", sub: "image + copy + video script" },
  { no: "04", label: "DTC STOREFRONT", sub: "product + size + checkout" },
  { no: "05", label: "MARKET TEST", sub: "campaign + visitor behavior" },
  { no: "06", label: "ORDER", sub: "sandbox / real order distinguished" },
];

const BUILD_STRIP = [
  "FACTORY SKU",
  "BRAND POSITION",
  "AI CREATIVE",
  "STORE",
  "AGENT",
  "CHECKOUT",
  "MARKET SIGNAL",
];

export default function HomePage() {
  const hero = getProductById("boot-14534-h") ?? PRODUCTS[0];
  // 14534-H 排第一，其余按热度降序
  const featured = [
    hero,
    ...[...PRODUCTS]
      .filter((p) => p.id !== hero.id)
      .sort((a, b) => b.heatScore - a.heatScore)
      .slice(0, 3),
  ];

  return (
    <div>
      {/* ---------- HERO — 14534-H 主转化品 ---------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 md:grid-cols-2 md:py-20">
          <div className="animate-fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-bold tracking-wider text-ink/70">
              <Factory size={13} className="text-accent" />
              FACTORY SKU · 14534-H
            </div>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
              THE QUIET
              <br />
              <span className="text-accent">WORKHORSE.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink/65">
              A black minimalist boot built from a real footwear supply chain —
              turned into a market-ready DTC product with AI.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href={`/products/${hero.slug}`}>
                <Button size="lg">
                  SHOP 14534-H <ArrowRight size={18} />
                </Button>
              </Link>
              <Link
                href="/studio"
                className="flex items-center gap-2 text-sm font-bold underline decoration-accent decoration-2 underline-offset-4"
              >
                SEE THE 24H AI WORKFLOW →
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-ink/60">
              <div className="flex items-center gap-2">
                <Factory size={17} className="text-accent" /> Factory SKU 14534-H
              </div>
              <div className="flex items-center gap-2">
                <Layers size={17} className="text-accent" /> Microfiber · Rubber
              </div>
              <div className="rounded-full bg-cream px-3 py-1 text-[11px] font-semibold text-ink/50">
                Sizes EU 38–46
              </div>
            </div>
          </div>

          <div className="relative">
            <ProductImage
              src={hero.heroImage ?? hero.image}
              prompt={hero.imagePrompt}
              alt={`${hero.name} — black minimalist ankle boot`}
              size="portrait_4_3"
              className="aspect-[4/5] rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-ink px-5 py-4 text-paper shadow-xl md:block">
              <div className="text-2xl font-black text-accent">
                {PLACEHOLDER_MODE ? "$???" : `$${hero.price}`}
              </div>
              <div className="text-xs text-paper/60">
                SKU 14534-H · factory cost RMB 98/pair
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 事实条（仅已验证数据） ---------- */}
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 md:grid-cols-5">
          {FACT_STRIP.map(({ big, small }) => (
            <div key={big}>
              <div className="text-3xl font-black text-accent">{big}</div>
              <div className="mt-1 text-[11px] font-bold tracking-wider text-ink/50">{small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- ONE BOOT. THREE ROUTINES. ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <div className="mb-3 text-xs font-bold tracking-[0.25em] text-accent">
            ONE REAL SKU. THREE CONTEXTS.
          </div>
          <h2 className="text-4xl font-black leading-tight md:text-5xl">
            ONE BOOT.
            <br />
            THREE ROUTINES.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/55">
            One real factory SKU, repositioned for three everyday contexts.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {ROUTINES.map((r) => (
            <div
              key={r.no}
              className="group overflow-hidden rounded-3xl border border-ink/10 bg-white"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <ProductImage
                  src={r.img}
                  prompt="black minimalist ankle boot, clean studio photography"
                  alt={r.title}
                  size="portrait_4_3"
                  className="h-full w-full transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-black text-paper">
                  {r.no}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black tracking-wide">{r.title}</h3>
                <p className="mt-2 text-sm text-ink/60 leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FROM FACTORY SKU TO MARKET SIGNAL. ---------- */}
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <div className="mb-3 text-xs font-bold tracking-[0.25em] text-accent">
              THE 24H AI WORKFLOW
            </div>
            <h2 className="text-4xl font-black leading-tight md:text-5xl">
              FROM FACTORY SKU
              <br />
              TO MARKET SIGNAL.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-paper/60">
              "AI does not replace the product.
              It compresses the path between factory data and market testing."
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
            {WORKFLOW.map((w, i) => (
              <div key={w.no} className="flex flex-1 items-stretch gap-4">
                <div className="flex-1 rounded-2xl border border-paper/10 bg-paper/5 p-5">
                  <div className="text-3xl font-black text-accent">{w.no}</div>
                  <div className="mt-2 text-sm font-bold">{w.label}</div>
                  <div className="mt-1 text-xs text-paper/50">{w.sub}</div>
                </div>
                {i < WORKFLOW.length - 1 && (
                  <div className="hidden items-center text-paper/30 md:flex">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- THE 24H BUILD evidence strip ---------- */}
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-5 text-center text-xs font-bold tracking-[0.25em] text-ink/50">
            THE 24H BUILD
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {BUILD_STRIP.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <span className="rounded-full border border-ink/15 bg-cream px-4 py-2 text-sm font-bold text-ink/70">
                  {step}
                </span>
                {i < BUILD_STRIP.length - 1 && (
                  <ArrowRight size={16} className="text-ink/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 主推广 + 其他款式 ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black">Primary: 14534-H + Other Factory Styles</h2>
            <p className="mt-1 text-ink/55">
              14534-H is our primary product. Other factory styles below are secondary
              options in the collection.
            </p>
          </div>
          <Link href="/products" className="hidden items-center gap-1 text-sm font-bold sm:flex">
            View all <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-3xl bg-ink p-10 text-center text-paper md:p-14">
          <Zap size={28} className="mx-auto text-accent" />
          <h2 className="mt-4 text-3xl font-black md:text-4xl">
            See how a factory SKU becomes a market test
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-paper/60">
            Real product. AI-accelerated workflow. Transparent proof at every step.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/proof">
              <Button size="lg" variant="primary">
                <BarChart3 size={18} /> Proof Mode
              </Button>
            </Link>
            <Link href="/studio">
              <Button size="lg" variant="outline">
                <Sparkles size={18} /> Open AI Studio
              </Button>
            </Link>
            <Link href={`/products/${hero.slug}`}>
              <Button size="lg">
                <ShoppingCart size={18} /> Shop 14534-H
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Sparkles({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.9 5.8L20 10.5l-5.8 1.9L12 18l-1.9-5.6L4 10.5l6.1-1.7z" />
    </svg>
  );
}
