"use client";

import type { Product } from "@/lib/types";
import { useLang } from "@/lib/store/lang";

/**
 * 评价区：全站暂无真实客户评价，统一展示「No verified customer reviews yet.」
 * 不展示任何模拟姓名、星级分布、推荐比例或评价正文。
 */
export function ReviewsSection({ product }: { product: Product }) {
  void product;
  const { t } = useLang();
  return (
    <section id="reviews" className="mt-24">
      <h2 className="text-3xl font-black">{t("Customer Reviews", "顾客评价")}</h2>
      <div className="mt-6 rounded-3xl border border-dashed border-ink/20 bg-white p-10 text-center">
        <p className="text-lg font-bold text-ink/70">
          {t("No verified customer reviews yet.", "暂无经验证的顾客评价。")}
        </p>
        <p className="mt-2 text-sm text-ink/45">
          {t(
            "Be the first to review",
            "成为第一个评价"
          )}{" "}
          {product.name}.{" "}
          {t(
            "Reviews will appear here once verified purchases are confirmed.",
            "经确认的真实购买评价将显示在这里。"
          )}
        </p>
      </div>
    </section>
  );
}
