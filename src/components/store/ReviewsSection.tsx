import { Star, Check } from "lucide-react";
import type { Product } from "@/lib/types";

/** 模拟评价（按产品名做一点点差异化词库，不至于每页完全一样） */
const VERBS = ["wore", "walked", "tested", "ran", "lived in", "commuted in"];
const TEMPLATES: Array<[name: string, body: string, stars: number]> = [
  ["{name}", "Broken in in two days. Already my go-to pair.", 5],
  ["Jordan M.", "For the price, there's nothing close. Leather feels $200+ easy.", 5],
  ["Priya S.", "Wide feet friendly. Sized up half a size, perfect roomy fit.", 4],
  ["Alex D.", "Wore them to {activity} last weekend. Zero blisters, zero issues.", 5],
  ["Sam R.", "Only brand I can actually trust online without trying on first.", 5],
  ["Casey K.", "Honestly shocked the box was so nice for the price. Gifted one to my dad.", 4],
  ["Mo T.", "The sole has way more bounce than I expected. Would buy again.", 5],
];
const ACTIVITIES_BY_CAT: Record<string, string[]> = {
  running: ["a 10K", "the gym", "track practice"],
  lifestyle: ["lunch with friends", "a day in the city", "the office"],
  canvas: ["classes", "a weekend trip", "my graduation"],
  sandals: ["beach day", "vacation", "the farmers market"],
};
const NAMES = ["Emma H.", "Ben L.", "Taylor W.", "Noah C.", "Mia B.", "Riley Q.", "Jess P."];
const TITLES = [
  "Fits exactly like I hoped",
  "Honestly better than expected",
  "No break-in needed",
  "My new daily pair",
  "Worth every dollar",
];
const MONTHS = ["Aug", "Jul", "Jun", "May"];

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length];
}
function num(id: string): number {
  // 把字符串 id 变成一个数字种子
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function ReviewsSection({ product }: { product: Product }) {
  const seed = num(product.id);
  const activities = ACTIVITIES_BY_CAT[product.category] ?? ["work", "errands", "a trip"];

  // 生成评价
  const reviews = Array.from({ length: 5 }).map((_, i) => {
    const tpl = TEMPLATES[(seed + i) % TEMPLATES.length];
    const tplName = tpl[0];
    const tplBody = tpl[1];
    const tplStars = tpl[2];
    const displayName = tplName === "{name}" ? NAMES[(seed + i) % NAMES.length] : tplName;
    const bodyFilled = tplBody.replace("{activity}", pick(activities, seed + i));
    const verb = pick(VERBS, seed + i * 3);
    const prefix = i % 2 === 0 ? `I've ${verb} these for two weeks now — ` : "";
    return {
      id: seed * 100 + i,
      name: displayName,
      date: `${pick(MONTHS, seed + i)} ${1 + ((seed * (i + 1)) % 27)}, 2026`,
      verified: true,
      stars: tplStars,
      title: TITLES[i % TITLES.length],
      body: prefix + bodyFilled,
    };
  });

  // 评分分布：以 5 星为主，降一点给真实感
  const distribution = [
    { stars: 5, pct: 0.72 },
    { stars: 4, pct: 0.18 },
    { stars: 3, pct: 0.06 },
    { stars: 2, pct: 0.03 },
    { stars: 1, pct: 0.01 },
  ];

  const rating = product.rating;
  const total = product.reviews;

  return (
    <section id="reviews" className="mt-24">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black">Customer Reviews</h2>
          <p className="mt-1 text-ink/55">
            Based on <span className="font-bold text-ink/80">{total.toLocaleString()}</span>{" "}
            real pairs we shipped.
          </p>
        </div>
        <a
          href="#write"
          className="hidden rounded-full border border-ink/20 bg-white px-4 py-2 text-sm font-bold transition hover:border-ink/60 sm:inline-block"
        >
          Write a review
        </a>
      </div>

      {/* ---------- 大评分 + 分布 ---------- */}
      <div className="grid gap-10 rounded-3xl border border-ink/10 bg-white p-8 md:grid-cols-[300px_1fr]">
        <div>
          <div className="flex items-baseline gap-2">
            <div className="text-6xl font-black leading-none">{rating}</div>
            <div className="text-lg font-bold text-ink/45">/ 5</div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                className={i < Math.round(rating) ? "text-amber-500" : "text-ink/15"}
                fill={i < Math.round(rating) ? "currentColor" : "none"}
              />
            ))}
            <span className="ml-2 text-sm text-ink/60">
              {total.toLocaleString()} reviews
            </span>
          </div>
          <div className="mt-5 space-y-1.5 text-xs text-ink/55">
            <div>✅ 83% recommend this pair</div>
            <div>✅ 92% say true to size</div>
            <div>✅ Average response within 48h</div>
          </div>
        </div>

        <div className="space-y-2">
          {distribution.map(({ stars, pct }) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="w-6 text-xs font-bold text-right">{stars}★</div>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${pct * 100}%` }}
                />
              </div>
              <div className="w-10 text-right text-xs font-bold text-ink/60">
                {Math.round(pct * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- 评论列表 ---------- */}
      <div className="mt-8 space-y-5">
        {reviews.map((r) => (
          <article
            key={r.id}
            className="rounded-3xl border border-ink/10 bg-white p-6 md:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="font-bold">{r.name}</div>
                  {r.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sage/10 px-2.5 py-0.5 text-[11px] font-bold text-sage">
                      <Check size={11} /> Verified buyer
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-ink/45">
                  {r.date}
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < r.stars ? "text-amber-500" : "text-ink/15"}
                    fill={i < r.stars ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </div>

            <h3 className="mt-4 text-lg font-bold">{r.title}</h3>
            <p className="mt-2 leading-relaxed text-ink/70">{r.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
