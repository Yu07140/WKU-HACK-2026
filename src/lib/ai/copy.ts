import type { Product } from "@/lib/types";

/* ------------------------------------------------------------------
 * AI 文案生成
 * 当前为规则模板引擎（离线可演示，零 API Key 依赖）
 * 模块 B 接入真实 LLM 时：把 generateCopy 内部替换为大模型调用，
 * 返回结构保持 CopyResult 不变即可，前端无需改动
 * ------------------------------------------------------------------ */

export interface CopyResult {
  headline: string;
  body: string;
  cta: string;
  hashtags: string[];
}

export type Platform = "Meta" | "TikTok" | "Google";
export type Angle = "comfort" | "value" | "trend" | "performance";

export const ANGLE_LABELS: Record<Angle, string> = {
  comfort: "舒适脚感",
  value: "性价比/工厂直供",
  trend: "潮流社交货币",
  performance: "性能硬核",
};

const HEADLINES: Record<Platform, Record<Angle, (p: Product) => string>> = {
  Meta: {
    comfort: (p) => `${p.name}: ${p.tagline}`,
    value: (p) => `Same factory, $${p.price} instead of $${Math.round(p.price * 2.4)}`,
    trend: (p) => `Everyone's asking about these. Meet ${p.name}.`,
    performance: (p) => `Engineered like $200 shoes. Priced at $${p.price}.`,
  },
  TikTok: {
    comfort: (p) => `POV: your feet finally stop hurting 😮‍💨 ${p.name}`,
    value: (p) => `Why pay $200 when the factory sells for $${p.price}?? 🤯`,
    trend: (p) => `The shoes all over your FYP 👟 #STRYDE ${p.name}`,
    performance: (p) => `Runners don't gatekeep this one 🏃💨 ${p.name}`,
  },
  Google: {
    comfort: (p) => `${p.name} — All-Day Comfort High-Top Boots`,
    value: (p) => `Buy ${p.name} Direct From Factory — $${p.price}`,
    trend: (p) => `${p.name} | Trending Street Boots 2026`,
    performance: (p) => `${p.name} — PU Leather Boots, Factory Direct, $${p.price}`,
  },
};

const BODY: Record<Angle, (p: Product) => string> = {
  comfort: (p) =>
    `${p.features[0]}. ${p.features[1]}. Free shipping + 30-day wear test: if they don't feel amazing, send them back.`,
  value: (p) =>
    `Made in the same factory that builds $200+ brands. We cut the middlemen, not the quality. ${p.material}. Factory direct: $${p.price}.`,
  trend: (p) =>
    `The silhouette everyone's pairing with baggy jeans this season. ${p.features[2] ?? p.features[0]}. Limited first drop — restock sells out in 9 days.`,
  performance: (p) =>
    `${p.features[0]}. ${p.features[1]}. ${p.weight} on your feet, cold-bonded construction. 4.8★ from 1,000+ happy buyers. Ships in 48 hours.`,
};

const CTAS: Record<Platform, string> = {
  Meta: "Shop Now — Free Shipping",
  TikTok: "Tap to grab yours →",
  Google: "See Price & Sizes",
};

export function generateCopy(
  product: Product,
  platform: Platform,
  angle: Angle
): CopyResult {
  return {
    headline: HEADLINES[platform][angle](product),
    body: BODY[angle](product),
    cta: CTAS[platform],
    hashtags:
      platform === "TikTok"
        ? ["#STRYDE", "#boots", "#shoecollection", "#fyp", "#factorydirect"]
        : ["#STRYDE", "#DTC", "#boots", "#streetwear"],
  };
}
