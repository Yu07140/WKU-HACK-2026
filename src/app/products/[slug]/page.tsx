import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProduct, PRODUCTS } from "@/lib/data/catalog";
import { PDPView } from "@/components/store/PDPView";
import { ProductImage } from "@/components/ui/ProductImage";
import { ReviewsSection } from "@/components/store/ReviewsSection";
import { ph } from "@/lib/utils";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

const LOOKS = [
  {
    no: "01",
    title: "WORKDAY",
    img: "/products/14534-h/hero.jpg",
    prompt:
      "black minimalist men's ankle boot, rear zipper, microfiber upper, rubber outsole, worn with straight charcoal trousers and crisp white shirt, modern office, editorial fashion photography, soft natural light, no logos, no text",
  },
  {
    no: "02",
    title: "AFTER HOURS",
    img: "/products/14534-h/black.jpg",
    prompt:
      "black minimalist men's ankle boot, rear zipper, microfiber upper, rubber outsole, city nightlife setting, warm ambient lighting, sleek dark outfit, editorial campaign photography, no logos, no text",
  },
  {
    no: "03",
    title: "WEEKEND",
    img: "/products/14534-h/lifestyle-01.jpg",
    prompt:
      "black minimalist men's ankle boot, rear zipper, microfiber upper, rubber outsole, worn with dark denim, weekend city stroll, relaxed casual styling, natural daylight, editorial lifestyle photography, no logos, no text",
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

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* 面包屑 */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-ink/50">
        <Link href="/" className="hover:text-accent hover:underline">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-accent hover:underline">Shop All</Link>
        <ChevronRight size={14} />
        <span className="truncate text-ink/80">{ph(product.name)}</span>
      </nav>

      <PDPView product={product} />

      <ReviewsSection product={product} />

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
                    prompt={l.prompt}
                    alt={`14534-H — ${l.title} styling`}
                    size="portrait_4_3"
                    className="h-full w-full transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-black tracking-wider text-paper">
                    {l.no} · {l.title}
                  </div>
                </div>
                <div className="p-4 text-center text-[11px] font-medium text-ink/40">
                  AI Campaign Concept
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
