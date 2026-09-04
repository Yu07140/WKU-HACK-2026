import type { Product } from "@/lib/types";

/* ------------------------------------------------------------------
 * AI 文案生成
 * 当前为规则模板引擎（离线可演示，零 API Key 依赖）
 * 模块 B 接入真实 LLM 时：把 generateCopy 内部替换为大模型调用，
 * 返回结构保持 CopyResult 不变即可，前端无需改动
 *
 * v2（2026-09 集成）：
 * - 新平台 Instagram；新角度 style / versatility / detail
 * - CopyResult 扩展可选字段 hook / primaryCopy / ctaVariants（向后兼容）
 * - 真实供应商 SKU（11295-J / 14534-H / 53125-J）使用专属文案模板
 * - 通用模板措辞与 Lanhe 货盘（高帮靴）对齐
 * - 话术合规：不使用医疗舒适、防水、环保、真皮、实验室测试、
 *   48 小时发货等未经组委会/供应商验证的声明
 * ------------------------------------------------------------------ */

export interface CopyResult {
  headline: string;
  body: string;
  cta: string;
  hashtags: string[];
  /** v2 扩展：开场 hook（社媒投放用） */
  hook?: string;
  /** v2 扩展：正文主文案（与 body 等价，语义更清晰） */
  primaryCopy?: string;
  /** v2 扩展：3 个 CTA 变体 */
  ctaVariants?: string[];
}

export type Platform = "Meta" | "TikTok" | "Google" | "Instagram";
export type Angle =
  | "comfort"
  | "value"
  | "trend"
  | "performance"
  | "style"
  | "versatility"
  | "detail";

export const PLATFORM_LABELS: Record<Platform, string> = {
  Meta: "Meta Ads",
  TikTok: "TikTok",
  Instagram: "Instagram",
  Google: "Google Ads",
};

export const ANGLE_LABELS: Record<Angle, string> = {
  comfort: "Comfort 舒适脚感",
  value: "Value 性价比/工厂直供",
  trend: "Trend 潮流社交货币",
  performance: "Performance 性能硬核",
  style: "Style 风格穿搭",
  versatility: "Versatility 一鞋多穿",
  detail: "Detail 产品细节",
};

const HEADLINES: Record<Platform, Record<Angle, (p: Product) => string>> = {
  Meta: {
    comfort: (p) => `${p.name}: ${p.tagline}`,
    value: (p) => `Same factory, $${p.price} instead of $${Math.round(p.price * 2.4)}`,
    trend: (p) => `Everyone's asking about these. Meet ${p.name}.`,
    performance: (p) => `Engineered like $200 shoes. Priced at $${p.price}.`,
    style: (p) => `${p.name} — the piece that carries the outfit.`,
    versatility: (p) => `One pair. Every fit. ${p.name}.`,
    detail: (p) => `${p.name}: built on the details.`,
  },
  TikTok: {
    comfort: (p) => `POV: your feet finally stop hurting 😮‍💨 ${p.name}`,
    value: (p) => `Why pay $200 when the factory sells for $${p.price}?? 🤯`,
    trend: (p) => `The boots all over your FYP 👟 #STRYDE ${p.name}`,
    performance: (p) => `Runners don't gatekeep this one 🏃💨 ${p.name}`,
    style: (p) => `This boot IS the outfit 🔥 ${p.name}`,
    versatility: (p) => `One pair, three moods 👢 ${p.name}`,
    detail: (p) => `The details hit different 🔍 ${p.name}`,
  },
  Google: {
    comfort: (p) => `${p.name} — All-Day Comfort High-Top Boots`,
    value: (p) => `Buy ${p.name} Direct From Factory — $${p.price}`,
    trend: (p) => `${p.name} | Trending Street Boots 2026`,
    performance: (p) => `${p.name} — Factory-Direct Boots, $${p.price}`,
    style: (p) => `${p.name} — Street Style Boots`,
    versatility: (p) => `${p.name} — Versatile Everyday Footwear`,
    detail: (p) => `${p.name} — Craft & Detail Overview`,
  },
  Instagram: {
    comfort: (p) => `${p.name}: ${p.tagline}`,
    value: (p) => `Factory direct. $${p.price}. No middlemen.`,
    trend: (p) => `The pair everyone saves to their moodboard: ${p.name}.`,
    performance: (p) => `Engineered like $200 shoes. Priced at $${p.price}.`,
    style: (p) => `Make the boot the outfit. ${p.name}.`,
    versatility: (p) => `One pair, endless styling. ${p.name}.`,
    detail: (p) => `Zoom in. ${p.name} is all in the details.`,
  },
};

const BODY: Record<Angle, (p: Product) => string> = {
  comfort: (p) =>
    `${p.features[0]}. ${p.features[1] ?? ""}. Try them for 30 days — if they don't feel right, the return is on us. (Demo return policy)`,
  value: (p) =>
    `Made in the same factory that builds $200+ brands. We cut the middlemen, not the quality. ${p.material}. Factory direct: $${p.price}. (Demo pricing)`,
  trend: (p) =>
    `The silhouette everyone's pairing with baggy jeans this season. ${p.features[2] ?? p.features[0]}. Limited first drop.`,
  performance: (p) =>
    `${p.features[0]}. ${p.features[1] ?? ""}. ${p.weight} on your feet, cold-bonded construction.`,
  style: (p) =>
    `${p.tagline.replace(/\.$/, "")} — ${p.features[0]?.toLowerCase() ?? "a statement silhouette"} that turns a simple outfit into the whole look.`,
  versatility: (p) =>
    `Dress it up, dress it down. ${p.name} works with tailoring, denim and everything between — one pair, multiple moods.`,
  detail: (p) =>
    `${p.features.map((f) => f.replace(/ \(supplier spec\)/, "")).join(" · ")}. Supplier SKU: ${p.sku ?? p.model ?? p.id.toUpperCase()}.`,
};

const CTAS: Record<Platform, string> = {
  Meta: "Shop Now — Free Shipping",
  TikTok: "Tap to grab yours →",
  Google: "See Price & Sizes",
  Instagram: "Shop the drop →",
};

/** 3 个 CTA 变体（按平台微调，保持真实动作） */
const CTA_VARIANTS: Record<Platform, string[]> = {
  Meta: ["Shop Now", "Explore the Collection", "Find Your Size"],
  TikTok: ["Tap to grab yours →", "Check the drop →", "See it on foot →"],
  Google: ["See Price & Sizes", "View the Collection", "Compare Styles"],
  Instagram: ["Shop the drop →", "View lookbook →", "Find your size →"],
};

const TAGS: Record<Platform, string[]> = {
  Meta: ["#STRYDE", "#DTC", "#boots", "#streetwear"],
  TikTok: ["#STRYDE", "#boots", "#shoecollection", "#fyp", "#factorydirect"],
  Google: ["#STRYDE"],
  Instagram: ["#STRYDE", "#ootd", "#footweardaily", "#styleinspo"],
};

/* ------------------------------------------------------------------
 * 真实供应商 SKU 专属文案（源自组委会确认的 COPY EXAMPLES）
 * 键为供应商货号（Product.sku）——兼容按 sku 查找和按 product.id 查找
 * ------------------------------------------------------------------ */

interface BootCopyBase {
  hook: string;
  primary: string;
  headline: string;
  cta: string;
  hashtags: string[];
  versatilityPrimary?: string;
  versatilityHeadline?: string;
  versatilityCta?: string;
}

const BOOT_COPY: Record<string, BootCopyBase> = {
  // 按 sku 索引
  "11295-J": {
    hook: "Gloss after dark.",
    primary:
      "A chunky lace-up silhouette built to turn a simple outfit into the whole look.",
    headline: "Make the boot the outfit.",
    cta: "Explore the drop",
    hashtags: ["#STRYDE", "#BootStyle", "#Streetwear", "#AltFashion", "#OOTD"],
    versatilityPrimary:
      "From polished dark tones to sharper statement finishes, 11295-J gives the same chunky shape a completely different attitude.",
    versatilityHeadline: "Pick your mood.",
    versatilityCta: "See the colors",
  },
  "14534-H": {
    hook: "Quiet shape. Sharp detail.",
    primary:
      "A clean black ankle boot finished with a contrast stitch detail for a look that stays simple without disappearing.",
    headline: "Utility, refined.",
    cta: "View the boot",
    hashtags: ["#STRYDE", "#MinimalStyle", "#BlackBoots", "#MensStyle", "#EverydayUniform"],
  },
  "53125-J": {
    hook: "Not built to blend in.",
    primary:
      "A sculptural platform silhouette, glossy black finish, and graphic sole details made for the outfit that needs a focal point.",
    headline: "Step into the future.",
    cta: "See the statement boot",
    hashtags: ["#STRYDE", "#PlatformBoots", "#Y2KStyle", "#CyberFashion", "#StatementShoes"],
  },
  // 按 product.id 索引（兜底兼容）
  "boot-11295-j": {
    hook: "Gloss after dark.",
    primary:
      "A chunky lace-up silhouette built to turn a simple outfit into the whole look.",
    headline: "Make the boot the outfit.",
    cta: "Explore the drop",
    hashtags: ["#STRYDE", "#BootStyle", "#Streetwear", "#AltFashion", "#OOTD"],
    versatilityPrimary:
      "From polished dark tones to sharper statement finishes, 11295-J gives the same chunky shape a completely different attitude.",
    versatilityHeadline: "Pick your mood.",
    versatilityCta: "See the colors",
  },
  "boot-14534-h": {
    hook: "Quiet shape. Sharp detail.",
    primary:
      "A clean black ankle boot finished with a contrast stitch detail for a look that stays simple without disappearing.",
    headline: "Utility, refined.",
    cta: "View the boot",
    hashtags: ["#STRYDE", "#MinimalStyle", "#BlackBoots", "#MensStyle", "#EverydayUniform"],
  },
  "boot-53125-j": {
    hook: "Not built to blend in.",
    primary:
      "A sculptural platform silhouette, glossy black finish, and graphic sole details made for the outfit that needs a focal point.",
    headline: "Step into the future.",
    cta: "See the statement boot",
    hashtags: ["#STRYDE", "#PlatformBoots", "#Y2KStyle", "#CyberFashion", "#StatementShoes"],
  },
};

/** 平台化调整话题标签：Google 精简、TikTok 加 fyp、Instagram 去 fyp */
function tagsForPlatform(base: string[], platform: Platform): string[] {
  if (platform === "Google") return base.slice(0, 1);
  if (platform === "TikTok") return base.includes("#fyp") ? base : [...base, "#fyp"];
  if (platform === "Instagram") return base.filter((t) => t !== "#fyp");
  return base;
}

export function generateCopy(
  product: Product,
  platform: Platform,
  angle: Angle
): CopyResult {
  // 先按 sku 找专属文案，再按 product.id 兜底
  const boot = product.sku
    ? BOOT_COPY[product.sku] ?? BOOT_COPY[product.id]
    : BOOT_COPY[product.id];

  if (boot) {
    // ---- 真实供应商 SKU：使用确认过的专属文案 ----
    const isVersatility = angle === "versatility";
    const primary = isVersatility && boot.versatilityPrimary
      ? boot.versatilityPrimary
      : boot.primary;
    const headline = isVersatility && boot.versatilityHeadline
      ? boot.versatilityHeadline
      : boot.headline;
    const cta = isVersatility && boot.versatilityCta ? boot.versatilityCta : boot.cta;

    // Google 走搜索风格 headline；其余平台保留确认文案
    const finalHeadline =
      platform === "Google" ? `${product.name} — ${headline}` : headline;

    return {
      headline: finalHeadline,
      body: primary,
      cta,
      hashtags: tagsForPlatform(boot.hashtags, platform),
      hook: boot.hook,
      primaryCopy: primary,
      ctaVariants: [cta, "Shop the drop", "Find your size"],
    };
  }

  // ---- 通用模板（Lanhe 货盘 + 新角度兜底） ----
  return {
    headline: HEADLINES[platform][angle](product),
    body: BODY[angle](product),
    cta: CTAS[platform],
    hashtags: TAGS[platform],
    hook: HEADLINES[platform][angle](product),
    primaryCopy: BODY[angle](product),
    ctaVariants: CTA_VARIANTS[platform],
  };
}
