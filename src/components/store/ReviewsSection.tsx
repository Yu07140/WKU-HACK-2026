"use client";

import { Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { useLang } from "@/lib/store/lang";

/**
 * 评价区（演示阶段）：
 * - 全站暂无真实客户评价，顶部展示 4 条明确标注 DEMO REVIEW 的示例评论，
 *   用于比赛演示页面完整性，不得让用户误以为是真实购买评价。
 * - 不展示任何伪造的汇总评分、评论数量、Verified Buyer、姓名、日期或订单号。
 * - 底部为真实评论预留区，接入真实订单评价后再展示。
 */

interface DemoReview {
  stars: number;
  title: string;
  body: string;
}

const DEMO_REVIEWS: DemoReview[] = [
  {
    stars: 5,
    title: "Easy to style",
    body: "The silhouette is clean enough for everyday wear, but the front loop detail gives it more personality than a basic black boot. I'd pair it with straight-leg denim or wide trousers.",
  },
  {
    stars: 5,
    title: "Looks sharper in person",
    body: "The black upper and minimal shape make it easy to dress up or down. The contrast loop detail keeps it from feeling too plain.",
  },
  {
    stars: 4,
    title: "A strong everyday boot",
    body: "The shape feels modern without being too trend-driven. It works well for commuting, dinner, or a casual weekend look.",
  },
  {
    stars: 5,
    title: "The detail makes the difference",
    body: "I like that the boot stays mostly minimal, but the front detailing gives it a recognizable STRYDE look. It feels easy to build an outfit around.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars (sample rating)`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= count ? "fill-ink text-ink" : "text-ink/25"}
        />
      ))}
    </span>
  );
}

export function ReviewsSection({ product }: { product: Product }) {
  void product;
  const { t } = useLang();
  return (
    <section id="reviews" className="mt-24">
<<<<<<< Updated upstream
      <h2 className="text-3xl font-black">Customer Reviews</h2>
=======
      <h2 className="text-3xl font-black">{t("Customer Reviews", "顾客评价")}</h2>
>>>>>>> Stashed changes

      {/* ---------- PRE-LAUNCH REVIEW PREVIEW (demo content) ---------- */}
      <div className="mt-6 rounded-3xl border border-ink/10 bg-cream/60 p-6 md:p-8">
        <div className="mb-6 border-b border-ink/10 pb-5">
          <p className="text-xs font-black tracking-[0.3em] text-ink/50">
            PRE-LAUNCH REVIEW PREVIEW
          </p>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-ink/45">
            These sample comments show how verified customer reviews will appear
            after launch. They are demonstration content only and are not
            customer-submitted reviews.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {DEMO_REVIEWS.map((r) => (
            <article
              key={r.title}
              className="rounded-2xl border border-ink/10 bg-white p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <Stars count={r.stars} />
                <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-amber-700">
                  DEMO REVIEW
                </span>
              </div>
              <h3 className="mt-3 text-sm font-black text-ink">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                &ldquo;{r.body}&rdquo;
              </p>
            </article>
          ))}
        </div>
      </div>

      {/* ---------- REAL CUSTOMER REVIEWS — reserved for verified reviews ---------- */}
      <div className="mt-5 rounded-3xl border border-dashed border-ink/20 bg-white p-8 text-center">
        <p className="text-xs font-black tracking-[0.3em] text-ink/40">
          REAL CUSTOMER REVIEWS
        </p>
        <p className="mt-2 text-sm font-bold text-ink/60">
          No verified reviews yet.
        </p>
        <p className="mt-1 text-xs text-ink/45">
          Verified purchase reviews will appear here after launch.
        </p>
      </div>
    </section>
  );
}
