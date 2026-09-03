import { notFound } from "next/navigation";
import { getProduct, PRODUCTS } from "@/lib/data/catalog";
import { PDPView } from "@/components/store/PDPView";
import { ProductCard } from "@/components/store/ProductCard";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <PDPView product={product} />

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-2xl font-black">You might also like</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
