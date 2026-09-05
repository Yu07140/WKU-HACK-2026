import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProduct, PRODUCTS } from "@/lib/data/catalog";
import { PDPView } from "@/components/store/PDPView";
import { ProductImage } from "@/components/ui/ProductImage";
import { ReviewsSection } from "@/components/store/ReviewsSection";
import { ph } from "@/lib/utils";
import { displayName } from "@/lib/store/display";

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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const name = displayName(product);
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <nav className="mb-8 flex items-center gap-2 text-sm text-ink/50">
        <Link href="/" className="hover:text-accent hover:underline">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-accent hover:underline">Collection</Link>
        <ChevronRight size={14} />
        <span className="truncate text-ink/80">{ph(name)}</span>
      </nav>

      <PDPView product={product} />

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

      {product.sku === "14534-H" && <ReviewsSection product={product} />}
    </div>
  );
}
