import type { Product } from "@/lib/types";

/**
 * 评价区：全站暂无真实客户评价，统一展示「No verified customer reviews yet.」
 * 不展示任何模拟姓名、星级分布、推荐比例或评价正文。
 */
export function ReviewsSection({ product }: { product: Product }) {
  void product;
  return (
    <section id="reviews" className="mt-24">
      <h2 className="text-3xl font-black">Customer Reviews</h2>
      <div className="mt-6 rounded-3xl border border-dashed border-ink/20 bg-white p-10 text-center">
        <p className="text-lg font-bold text-ink/70">No verified customer reviews yet.</p>
        <p className="mt-2 text-sm text-ink/45">
          Be the first to review {product.name}. Reviews will appear here once verified
          purchases are confirmed.
        </p>
      </div>
    </section>
  );
}
