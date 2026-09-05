import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowRight, Sparkles, Layers, ShieldCheck } from "lucide-react";
import { getProduct, PRODUCTS } from "@/lib/data/catalog";
import { PDPView } from "@/components/store/PDPView";
import { ProductImage } from "@/components/ui/ProductImage";
import { ReviewsSection } from "@/components/store/ReviewsSection";
import { ph } from "@/lib/utils";
import { displayName } from "@/lib/store/display";
import { ECOSYSTEM, STATUS } from "@/lib/data/brand";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

const LOOKS = [
  {
    no: "01",
    title: "WORKDAY",
    copy: "Straight trousers, a simple knit, and the 14534-H for a sharper weekday look.",
    img: "/products/14534-h/hero.jpg",
  },
  {
    no: "02",
    title: "AFTER HOURS",
    copy: "Dark trousers or denim keep the same boot working after the office.",
    img: "/products/14534-h/black.jpg",
  },
  {
    no: "03",
    title: "WEEKEND",
    copy: "Pair it with relaxed denim or utility trousers for a simpler off-duty rotation.",
    img: "/products/14534-h/lifestyle-01.jpg",
  },
];

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ color?: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  // 支持 ?color=ColorName 预选配色（来自 Style Quiz 等入口）
  const { color } = await searchParams;
  const initialColorIdx = color
    ? Math.max(0, product.colors.findIndex((c) => c.name.toLowerCase() === color.toLowerCase()))
    : 0;

  const name = displayName(product);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <nav className="mb-8 flex items-center gap-2 text-sm text-ink/50">
        <Link href="/" className="hover:text-accent hover:underline">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-accent hover:underline">Collection</Link>
        <ChevronRight size={14} />
        <span className="truncate text-ink/80">{ph(name)}</span>
      </nav>

      <PDPView product={product} initialColorIdx={initialColorIdx} />

      {/* COMPLETE THE LOOK — styling inspiration using 14534-H only (14534-H PDP only) */}
      {product.sku === "14534-H" && (
        <section className="mt-20">
          <h2 className="mb-2 text-2xl font-black">Complete the Look</h2>
          <p className="mb-8 text-sm text-ink/50">
            Styling inspiration for the 14534-H — concept visuals, not separate products.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {LOOKS.map((l) => (
            <div key={l.no} className="group overflow-hidden rounded-3xl border border-ink/10 bg-white">
              <div className="relative aspect-[4/5] overflow-hidden">
                <ProductImage
                  src={l.img}
                  alt={`14534-H — ${l.title} styling`}
                  size="portrait_4_3"
                  className="h-full w-full transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-black tracking-wider text-paper">
                  {l.no} · {l.title}
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-relaxed text-ink/70">{l.copy}</p>
                <div className="mt-3 text-[11px] font-medium text-ink/40">
                  AI Campaign Concept
                </div>
              </div>
            </div>
          ))}
          </div>
        </section>
      )}

      {/* MAKE IT YOURS. — STRYDE ecosystem extensions (14534-H PDP only) */}
      {product.sku === "14534-H" && (
        <section className="mt-20">
          <div className="mb-8">
            <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
              THE STRYDE SYSTEM
            </div>
            <h2 className="text-3xl font-black md:text-4xl">{ECOSYSTEM.clips}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {/* STRYDE CLIPS */}
            <Link
              href="/clips"
              className="group rounded-3xl border border-ink/10 bg-white p-6 transition hover:border-ink/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink/5 text-ink">
                  <Sparkles size={18} />
                </div>
                <span className="rounded-full bg-ink/90 px-3 py-1 text-[10px] font-black tracking-wider text-paper">
                  {STATUS.comingSoon}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-black">STRYDE CLIPS</h3>
              <p className="mt-1 text-sm text-ink/55">
                Personalization concepts built around the detailing of the 14534-H.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-ink">
                EXPLORE CONCEPT <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </span>
            </Link>

            {/* STRYDE DUO */}
            <Link
              href="/duo"
              className="group rounded-3xl border border-ink/10 bg-white p-6 transition hover:border-ink/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink/5 text-ink">
                  <Layers size={18} />
                </div>
                <span className="rounded-full bg-ink/10 px-3 py-1 text-[10px] font-black tracking-wider text-ink/60">
                  BUNDLE
                </span>
              </div>
              <h3 className="mt-4 text-lg font-black">STRYDE DUO</h3>
              <p className="mt-1 text-sm text-ink/55">
                Two pairs. One rotation. Same real 14534-H, two size choices.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-ink">
                BUILD YOUR DUO <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </span>
            </Link>

            {/* STRYDE CARE 01 */}
            <Link
              href="/care"
              className="group rounded-3xl border border-ink/10 bg-white p-6 transition hover:border-ink/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink/5 text-ink">
                  <ShieldCheck size={18} />
                </div>
                <span className="rounded-full bg-ink/90 px-3 py-1 text-[10px] font-black tracking-wider text-paper">
                  {STATUS.comingSoon}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-black">STRYDE CARE 01</h3>
              <p className="mt-1 text-sm text-ink/55">
                A future care extension for the STRYDE footwear system.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-ink">
                EXPLORE CONCEPT <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </section>
      )}

      {product.sku === "14534-H" && <ReviewsSection product={product} />}
    </div>
  );
}
