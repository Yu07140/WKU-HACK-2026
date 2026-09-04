import { PRODUCTS } from "@/lib/data/catalog";
import type { Product } from "@/lib/types";
import { ph, formatUSD } from "@/lib/utils";

/* ------------------------------------------------------------------
 * AI 导购 Agent —— 人设集中配置（英文版）
 * 所有面向消费者的展示文案（名字/欢迎语/快捷问题/占位符）集中管理。
 * 双语回复：跟随用户输入语言（detectLang），不是根据这里的语言常量。
 * ------------------------------------------------------------------ */

export const AGENT_PERSONA = {
  name: "Mia",
  headerTitle: "Mia · STRYDE AI Buddy",
  headerStatus: "Online · replies in seconds",
  welcome:
    "Hey! I'm Mia 👋 From sneakers that match your jeans to budget-friendly picks — tell me what you're after and I'll do the rest.",
  inputPlaceholder: "Ask me anything… e.g. running shoes under $100",
  suggestions: [
    "Help me pick running shoes",
    "Show me casual everyday shoes",
    "How should I choose my size?",
    "Do you have any discounts?",
  ] as const,
  fallbackHelp:
    "I can help you with 👟\n• Sneaker recs (running / casual / outdoor)\n• Size, shipping & return info\n• Deals & student discounts\n\nTry: \"What goes with jeans?\" or \"I need a gift.\"",
  /** 30 秒无响应主动搭话（按用户要求保持简短自然的英文） */
  proactive: "Hi! Need help picking the right pair? 😊",
};

/* =================================================================
 * 语言检测 —— 极简 CJK 判定（中/日文汉字 → 返回 zh，否则 en）
<<<<<<< Updated upstream
=======
 * 为了保持 day-2 目标的简单语言切换，不做 NLP。
>>>>>>> Stashed changes
 * ================================================================= */

export type Lang = "en" | "zh";

export function detectLang(text: string): Lang {
  return /[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(text) ? "zh" : "en";
}

<<<<<<< Updated upstream
/** 按语言挑文案，所有场景双语统一用这个缩写函数 */
=======
/** 按语言挑文案，所有场景双语统一用这个缩写函数，避免散写 if/else */
>>>>>>> Stashed changes
function L<T>(lang: Lang, en: T, zh: T): T {
  return lang === "zh" ? zh : en;
}

/* =================================================================
 * 多轮上下文（客户端传入）
<<<<<<< Updated upstream
=======
 * AgentWidget 把「上一轮 AI 回复的商品卡 slugs」解析后传进来，
 * agentReply 据此解析 which one / 那双 等指代问句。
>>>>>>> Stashed changes
 * ================================================================= */

export interface AgentContext {
  /** 上一轮 AI 推荐的商品（客户端从 products SSE 事件里拿到、用 getProduct(slug) 还原） */
  lastProducts?: Product[];
<<<<<<< Updated upstream
  /** 上一轮用户输入（未来扩展预留） */
=======
  /** 上一轮用户输入（未来扩展用，预留，非必填） */
>>>>>>> Stashed changes
  lastUserMessage?: string;
}

/* ------------------------------------------------------------------
 * AgentReply 类型保持 100% 不变
 * ------------------------------------------------------------------ */

export interface AgentReply {
  text: string;
  products?: Product[];
}

/* =================================================================
 * 原工具函数（签名 100% 保留，兼容旧调用）
<<<<<<< Updated upstream
 *   searchProducts / pickByMaxPrice / pickByAttr / describeProductEn / productList
=======
 *   searchProducts / pickByMaxPrice / pickByAttr / productList
>>>>>>> Stashed changes
 *   getSizingAdvice / getShippingInfo / getReturnInfo
 * ================================================================= */

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  const kw: Record<string, string[]> = {
    running: ["run", "running", "jog", "marathon", "跑鞋", "跑步", "碳板", "carbon"],
    lifestyle: ["chunky", "dad", "retro", "leather", "court", "潮流", "休闲", "老爹", "复古"],
    canvas: ["canvas", "white shoe", "classic", "帆布", "小白鞋"],
    sandals: ["sandal", "summer", "beach", "凉鞋", "夏天", "沙滩"],
    slipon: ["slip", "laceless", "一脚蹬", "懒人"],
    trail: ["trail", "hiking", "hike", "mountain", "越野", "户外", "登山"],
  };
  const matched = Object.entries(kw)
    .filter(([, words]) => words.some((w) => q.includes(w)))
    .map(([cat]) => cat);

  let hits = PRODUCTS.filter((p) => {
    const hay = `${p.name} ${p.tagline} ${p.description} ${p.category} ${p.features.join(" ")}`.toLowerCase();
    return q.split(/\s+/).some((t) => t.length > 2 && hay.includes(t));
  });
  if (hits.length === 0 && matched.length) {
    hits = PRODUCTS.filter(
      (p) =>
        matched.includes(p.category) ||
        (matched.includes("slipon") && p.slug.includes("slip")) ||
        (matched.includes("trail") && p.slug.includes("trail"))
    );
  }
  return hits.sort((a, b) => b.heatScore - a.heatScore).slice(0, 3);
}

<<<<<<< HEAD
function pickByMaxPrice(maxPrice: number): Product[] {
  return [...PRODUCTS]
    .filter((p) => p.price <= maxPrice)
    .sort((a, b) => b.heatScore - a.heatScore)
    .slice(0, 3);
}

function pickByAttr(keywords: string[], max = 3): Product[] {
  const kw = keywords.map((k) => k.toLowerCase());
  return [...PRODUCTS]
    .filter((p) => {
      const hay = `${p.features.join(" ")} ${p.description} ${p.material}`.toLowerCase();
      return kw.some((k) => hay.includes(k));
    })
    .sort((a, b) => b.heatScore - a.heatScore)
    .slice(0, max);
}

<<<<<<< Updated upstream
function pickFromPool(pool: Product[], keywords: string[]): Product[] {
  const kw = keywords.map((k) => k.toLowerCase());
  return pool
    .filter((p) => {
      const hay = `${p.features.join(" ")} ${p.description} ${p.material}`.toLowerCase();
      return kw.some((k) => hay.includes(k));
    })
    .sort((a, b) => b.heatScore - a.heatScore);
}

/**
 * 根据 Product 的**结构化字段**（category/材质/features 关键词/trend/slug 等）
 * 生成一句自然的英文商品属性描述，绝不碰 catalog 里的中文 tagline/description 整句原文。
 * 不硬编码任何具体商品名，只按属性分类做句式分支。
=======
/**
 * 根据 Product 的**结构化字段**（category/材质/features 关键词/trend/slug 等）
 * 生成一句自然的英文商品属性描述，绝不碰 catalog 里的中文 tagline/description/features 原文。
 * 用于英文回复里替换 `p.tagline`，保证英文输入时整条回复 0 个中文字符。
 * 不硬编码任何具体商品名，只根据属性分类做句式分支。
>>>>>>> Stashed changes
 */
function describeProductEn(p: Product): string {
  const parts: string[] = [];
  const hay = `${p.features.join(" ")} ${p.material} ${p.description} ${p.slug} ${p.category}`.toLowerCase();

<<<<<<< Updated upstream
=======
  /* ---------- 结构属性判断（按 category + 关键词分支） ---------- */
  // —— 跑鞋类细分 ——
>>>>>>> Stashed changes
  if (p.category === "running") {
    if (/carbon|碳板/.test(hay)) parts.push("carbon-plated · max energy return");
    else if (/knit|飞织/.test(hay)) parts.push("breathable one-piece knit · featherlight");
    if (/trail|越野|齿花|rock|登山|防泼/.test(hay) || p.slug.includes("trail")) {
      parts.push("built for trails · deep-lug grip");
      if (/防泼|waterproof|water-resistant/.test(hay)) parts.push("water-repellent mesh");
    }
    if (!parts.length) parts.push("cushioned daily trainer");
<<<<<<< Updated upstream
  } else if (p.category === "lifestyle") {
    if (/chunky|厚底|老爹|90s/.test(hay) || p.slug.includes("chunk")) {
      parts.push("retro 90s chunky sole · street-style");
    } else if (
      /leather|头层牛皮|生胶|court|皮面/.test(hay) ||
      p.slug.includes("leather") ||
      p.slug.includes("court")
    ) {
=======
  }
  // —— 休闲类细分 ——
  else if (p.category === "lifestyle") {
    if (/chunky|厚底|老爹|90s/.test(hay) || p.slug.includes("chunk")) {
      parts.push("retro 90s chunky sole · street-style");
    } else if (/leather|头层牛皮|生胶|court|皮面/.test(hay) || p.slug.includes("leather") || p.slug.includes("court")) {
>>>>>>> Stashed changes
      parts.push("premium leather upper · retro court silhouette");
    } else if (/slip|elastic|弹力|一脚蹬|穆勒|laceless/.test(hay) || p.slug.includes("slip")) {
      parts.push("stretchy laceless knit · slip-on ease");
    } else {
      parts.push("clean everyday casual · versatile layering piece");
    }
<<<<<<< Updated upstream
  } else if (p.category === "canvas") {
    if (/有机帆布|gots|organic/.test(hay)) parts.push("GOTS organic cotton canvas");
    else parts.push("timeless low-top canvas");
    parts.push("natural rubber sole · quiet grip");
  } else if (p.category === "sandals") {
=======
  }
  // —— 帆布鞋 ——
  else if (p.category === "canvas") {
    if (/有机帆布|gots|organic/.test(hay)) parts.push("GOTS organic cotton canvas");
    else parts.push("timeless low-top canvas");
    parts.push("natural rubber sole · quiet grip");
  }
  // —— 凉鞋 ——
  else if (p.category === "sandals") {
>>>>>>> Stashed changes
    parts.push("quick-dry webbing · arch-support footbed");
    parts.push("summer-ready sport sandal");
  }

<<<<<<< Updated upstream
=======
  /* --------— trend 标签补一个短标签（可选，信息丰富点） -------- */
>>>>>>> Stashed changes
  const trendTag: Record<string, string> = {
    hot: "🔥 top-seller",
    rising: "📈 trending fast",
    new: "✨ new drop",
    steady: "⭐ customer favorite",
  };
  if (trendTag[p.trend]) parts.push(trendTag[p.trend]);

<<<<<<< Updated upstream
=======
  /* --------— 通用属性标签（基于 features 关键词，不碰中文整句） -------- */
>>>>>>> Stashed changes
  if (/机洗|machine\s*wash/.test(hay)) parts.push("machine-washable");
  if (/防泼|waterproof|water-resistant/.test(hay)) parts.push("water-resistant");
  if (p.stock != null && p.stock < 500) parts.push("low stock");

  return parts.filter(Boolean).slice(0, 3).join(" · ");
=======
export function getSizingAdvice(): string {
  return "尺码建议：STRYDE 全部为标准美码（US size）。高帮靴建议按日常运动鞋尺码选；脚宽或想塞厚袜子、介于两码之间，选大半码更舒服。侧拉链款（No. 5970 / No. 8058）穿脱很方便。供应商 SKU（11295-J / 14534-H / 53125-J）为欧码 EU 38-46，详情页有标注。下单后 30 天内免费换码，运费我们承担 👟";
>>>>>>> b9de0bfad5ffa5d8acbf9d490a21771c14b14810
}

function productList(products: Product[], lang: Lang): string {
  const sep = "  ·  ";
  const rev = L(lang, "reviews", "条评价");
  return products
    .map((p) => {
      // 关键：英文绝不插入 catalog 里的中文 tagline / description 原文；
<<<<<<< Updated upstream
      // 中文保留 catalog 原生中文 tagline。
=======
      // 中文保留原有中文 tagline（catalog 原生中文）。
>>>>>>> Stashed changes
      const descriptor = lang === "en" ? describeProductEn(p) : p.tagline;
      return `• ${ph(p.name)} — ${formatUSD(p.price)}${sep}${descriptor}  (${p.rating}★ / ${p.reviews} ${rev})`;
    })
    .join("\n");
}

/* ---- 4 个公开 info 函数：签名不变，永远返回英文（兼容旧代码） ----
 * 双语版在内部用 xxxBilingual(lang) 调用，agentReply 统一走双语版。 */

export function getSizingAdvice(): string {
  return sizingBilingual("en");
}
export function getShippingInfo(): string {
  return shippingBilingual("en");
}
export function getReturnInfo(): string {
  return returnBilingual("en");
}

function sizingBilingual(lang: Lang): string {
  return L(
    lang,
    "We run in standard US sizes. If your feet are wide or you're between sizes, go up by half a size ✨ Our stretch-knit or one-piece woven pairs wrap snugly, so your regular size works best for those. Free size exchanges within 30 days, on us!",
    "咱们是标准美码哈 ✨ 脚比较宽、或者在两码之间的话，建议选大半码；飞织弹力或一体化编织款包裹性强，按平时码数买就行。30 天内免费换码，运费我们包～"
  );
}
function shippingBilingual(lang: Lang): string {
  return L(
    lang,
    "Ships from our US warehouse in 48 hours 🚚 Most orders arrive in 3–5 business days, and shipping is free over $75. Canada / EU takes 7–10 days. You'll get a tracking email the moment it ships!",
    "美国本土仓库 48 小时内出库 🚚 一般 3–5 个工作日送到，满 $75 免运费；加拿大/欧洲 7–10 天。一出库就会给你发追踪邮件哒～"
  );
}
function returnBilingual(lang: Lang): string {
  return L(
    lang,
    "30-day trial, zero stress 🧡 If they don't fit or you change your mind, send them back in original condition for a full refund. We also cover the shipping cost for one free size exchange per order.",
    "30 天无忧试穿 🧡 不合脚或者改变主意，保持原状态寄回就能全额退款。每单还包一次免费换码的运费哦。"
  );
}

/* =================================================================
 * 上下文代词判定 —— 用户问"Which one is better for X?" / "那双适合 X 吗？"
<<<<<<< Updated upstream
 * ================================================================= */

function isReferenceQuery(q: string): boolean {
  const en = /\b(which one|which ones|which (of )?(these|those|them)|the (ones|pairs|shoes) (you|you'?ve) (recommend|suggest|showed)|from those|from the recs|from your recs)\b/i;
=======
 * 这类问题必须从 context.lastProducts 里选，而不是全 catalog 乱搜。
 *
 * 返回 null 表示"这个问题不像是指代问句"，走正常场景分支。
 * 返回 AgentReply 表示"已经基于上轮推荐给出了定向解答"。
 * ================================================================= */

/** 判断当前问句是否是指代型（which one / 那双 / 刚才 / 推荐的） */
function isReferenceQuery(q: string): boolean {
  // 英文：which one / which ones / these / those / you recommend / the ones
  const en = /\b(which one|which ones|which (of )?(these|those|them)|the (ones|pairs|shoes) (you|you'?ve) (recommend|suggest|showed)|from those|from the recs|from your recs)\b/i;
  // 中文：那(双|些|几双|个)|这(双|几双)|刚才|刚刚|推荐|你说|选中|挑的
>>>>>>> Stashed changes
  const zh = /(那(双|些|几双|个|三双)|这(双|几双|些)|刚才|刚刚|之前|你(推荐|说|挑)|选的|挑出来|你给的)/;
  return en.test(q) || zh.test(q);
}

<<<<<<< Updated upstream
=======
/**
 * 在"指代问句"前提下提取判定条件过滤上轮推荐。
 * 返回类型：
 *   {filtered: Product[], criterionApplied: boolean}
 *   - criterionApplied = true  → 用户问句里有具体过滤条件（宽脚/防水/预算…），filtered 是过滤结果（可能为空数组）
 *   - criterionApplied = false → 用户没说具体条件（"那双更好？"/"which one is better"），此时 caller 按默认热度展示
 */
>>>>>>> Stashed changes
function filterProductsByCriterion(
  pool: Product[],
  q: string
): { filtered: Product[]; criterionApplied: boolean } {
  const low = q.toLowerCase();
<<<<<<< Updated upstream
  const WIDE = /wide\s*feet?|宽脚|肥脚|脚.{0,3}(宽|胖|肥)|(宽|胖|肥).{0,3}脚|脚掌宽|脚背宽|脚面宽|脚型宽/;
  const NARROW = /narrow\s*feet?|thin\s*feet?|瘦脚|脚.{0,3}瘦|窄脚|脚型瘦|脚窄|偏瘦|小脚/;
  let matched: Product[] | null = null;
=======
  // 更宽松的宽脚 regex：支持「脚比较宽」「脚有点胖」「宽脚」「脚宽」等插入语
  const WIDE = /wide\s*feet?|宽脚|肥脚|脚.{0,3}(宽|胖|肥)|(宽|胖|肥).{0,3}脚|脚掌宽|脚背宽|脚面宽|脚型宽/;
  const NARROW = /narrow\s*feet?|thin\s*feet?|瘦脚|脚.{0,3}瘦|窄脚|脚型瘦|脚窄|偏瘦|小脚/;
  let matched: Product[] | null = null;
  // 宽脚
>>>>>>> Stashed changes
  if (WIDE.test(low)) {
    matched = pickFromPool(pool, [
      "帆布",
      "有机帆布",
      "头层牛皮",
      "leather",
      "canvas",
      "牛剖层革",
      "生胶",
    ]).slice(0, 3);
<<<<<<< Updated upstream
  } else if (NARROW.test(low)) {
    matched = pickFromPool(pool, ["飞织", "flyknit", "弹力", "knit", "slip"]).slice(0, 3);
  } else if (/waterproof|防水|防雨|防泼/.test(low)) {
    matched = pickFromPool(pool, ["防泼水", "防水", "rock plate", "齿花"]).slice(0, 3);
  } else if (/wash|clean|清洗|洗|机洗/.test(low)) {
    matched = pickFromPool(pool, ["可机洗", "机洗", "快干"]).slice(0, 3);
  } else if (/running|run|跑鞋|跑步|碳板|jog/.test(low)) {
    const r = pickFromPool(pool, ["跑步", "碳板", "中底", "飞织鞋面"]).filter(
      (p) => p.category === "running"
    );
    matched = (r.length ? r : pool).slice(0, 3);
  } else if (/casual|everyday|休闲|日常|通勤/.test(low)) {
    matched = pool
      .filter((p) => p.category === "lifestyle" || p.category === "canvas")
      .slice(0, 3);
  } else if (/outdoor|hik(e|ing)|trail|户外|登山|越野|徒步/.test(low)) {
    matched = pickFromPool(pool, ["防泼", "齿花", "rock plate", "登山"])
      .filter((p) => p.slug.includes("trail"))
      .slice(0, 3);
  } else {
    const m = low.match(/\$?\s*(\d{2,3})\b/);
    if (m && /(under|below|less|budget|cheap|低于|预算|以内|以下|不超过)/.test(low)) {
      const b = parseInt(m[1], 10);
      matched = pool
        .filter((p) => p.price <= b)
        .sort((a, b) => b.heatScore - a.heatScore)
        .slice(0, 3);
    }
  }
  if (matched !== null) return { filtered: matched, criterionApplied: true };
  return {
    filtered: [...pool].sort((a, b) => b.heatScore - a.heatScore).slice(0, 3),
    criterionApplied: false,
  };
}

function tryContextReply(
  q: string,
  lang: Lang,
  ctx: AgentContext
): AgentReply | null {
  if (!ctx.lastProducts?.length || !isReferenceQuery(q)) return null;

  let ordered: Product[] = [];
  let criterionWasEmpty = false;

  const sortTest = q.toLowerCase();
  if (/cheapest|least expensive|便宜|最便宜|最划算/.test(sortTest)) {
    ordered = [...ctx.lastProducts].sort((a, b) => a.price - b.price).slice(0, 3);
  } else if (/most expensive|priciest|最贵/.test(sortTest)) {
    ordered = [...ctx.lastProducts].sort((a, b) => b.price - a.price).slice(0, 3);
  } else if (
    /best rated|top rated|highest rated|most reviews|好评|评分|评价最高/.test(sortTest)
  ) {
    ordered = [...ctx.lastProducts]
      .sort(
        (a, b) =>
          b.rating * Math.log10(b.reviews + 1) - a.rating * Math.log10(a.reviews + 1)
      )
      .slice(0, 3);
  } else {
    const result = filterProductsByCriterion([...ctx.lastProducts], q);
    const criterionApplied = result.criterionApplied;
    ordered = result.filtered;
    if (criterionApplied && ordered.length === 0) criterionWasEmpty = true;
  }

=======
  }
  // 瘦脚
  else if (NARROW.test(low)) {
    matched = pickFromPool(pool, ["飞织", "flyknit", "弹力", "knit", "slip"]).slice(0, 3);
  }
  // 防水
  else if (/waterproof|防水|防雨|防泼/.test(low)) {
    matched = pickFromPool(pool, ["防泼水", "防水", "rock plate", "齿花"]).slice(0, 3);
  }
  // 可洗
  else if (/wash|clean|清洗|洗|机洗/.test(low)) {
    matched = pickFromPool(pool, ["可机洗", "机洗", "快干"]).slice(0, 3);
  }
  // 跑步（上轮推荐全都不是 running 才返回空）
  else if (/running|run|跑鞋|跑步|碳板|jog/.test(low)) {
    const r =
      pickFromPool(pool, ["跑步", "碳板", "中底", "飞织鞋面"]).filter(
        (p) => p.category === "running"
      ) || pool;
    matched = r.slice(0, 3);
  }
  // 休闲
  else if (/casual|everyday|休闲|日常|通勤/.test(low)) {
    matched = pool
      .filter((p) => p.category === "lifestyle" || p.category === "canvas")
      .slice(0, 3);
  }
  // 户外
  else if (/outdoor|hik(e|ing)|trail|户外|登山|越野|徒步/.test(low)) {
    matched = pickFromPool(pool, ["防泼", "齿花", "rock plate", "登山"])
      .filter((p) => p.slug.includes("trail"))
      .slice(0, 3);
  }
  // 预算
  else {
    const m = low.match(/\$?\s*(\d{2,3})\b/);
    if (m && /(under|below|less|budget|cheap|低于|预算|以内|以下|不超过)/.test(low)) {
      const b = parseInt(m[1], 10);
      matched = pool
        .filter((p) => p.price <= b)
        .sort((a, b) => b.heatScore - a.heatScore)
        .slice(0, 3);
    }
  }

  if (matched !== null) {
    return { filtered: matched, criterionApplied: true };
  }
  // 没有识别到明确判定条件 → caller 用默认 Top 3（标记 criterionApplied=false）
  return {
    filtered: [...pool].sort((a, b) => b.heatScore - a.heatScore).slice(0, 3),
    criterionApplied: false,
  };
}

/** 仅在指定候选池里按关键词挑 */
function pickFromPool(pool: Product[], keywords: string[]): Product[] {
  const kw = keywords.map(k => k.toLowerCase());
  return pool
    .filter((p) => {
      const hay = `${p.features.join(" ")} ${p.description} ${p.material}`.toLowerCase();
      return kw.some(k => hay.includes(k));
    })
    .sort((a, b) => b.heatScore - a.heatScore);
}

/** 尝试解析"指代问句"。命中则返回 AgentReply，否则返回 null。 */
function tryContextReply(
  q: string,
  lang: Lang,
  ctx: AgentContext
): AgentReply | null {
  if (!ctx.lastProducts?.length || !isReferenceQuery(q)) return null;

  let ordered: Product[] = [];
  let criterionApplied = false;
  let criterionWasEmpty = false;

  // 先看有没有"最贵/最便宜/好评最多"这类排序请求
  const sortTest = q.toLowerCase();
  if (/cheapest|least expensive|便宜|最便宜|最划算/.test(sortTest)) {
    ordered = [...ctx.lastProducts].sort((a, b) => a.price - b.price).slice(0, 3);
  } else if (/most expensive|priciest|最贵/.test(sortTest)) {
    ordered = [...ctx.lastProducts].sort((a, b) => b.price - a.price).slice(0, 3);
  } else if (/best rated|top rated|highest rated|most reviews|好评|评分|评价最高/.test(sortTest)) {
    ordered = [...ctx.lastProducts]
      .sort((a, b) => b.rating * Math.log10(b.reviews + 1) - a.rating * Math.log10(a.reviews + 1))
      .slice(0, 3);
  } else {
    // 普通判定条件过滤
    const result = filterProductsByCriterion([...ctx.lastProducts], q);
    criterionApplied = result.criterionApplied;
    ordered = result.filtered;
    if (criterionApplied && ordered.length === 0) criterionWasEmpty = true;
  }

  // 当用户明确提了过滤条件，但是上轮推荐里没有合适的 → 诚实告知，不假装都合适
>>>>>>> Stashed changes
  if (criterionWasEmpty) {
    return {
      text: L(
        lang,
        "To be totally honest — none of the 3 pairs I just recommended are specifically built for that requirement (they're mostly knit performance runners 🧵). If you go with any of them, pick half a size up. Otherwise wanna restart with a fresh search for something roomier? 🤍",
        "实话实说哦 🤍 刚才推荐的 3 双（大多是飞织竞速款）没有一双是专门针对这个版型要求的。如果一定要在里面挑，建议选大半码。要不我们重新搜一双版型更宽松的？"
      ),
    };
  }
  if (ordered.length === 0) {
    return {
      text: L(
        lang,
        "Hmm, none of the pairs I just recommended quite match that filter. Wanna restart with a fresh search? 🔎",
        "嗯……刚才推荐的里好像没有完全符合这个条件的哦。要不我们换个条件重新搜一下？🔎"
      ),
    };
  }
  const intro = L(
    lang,
    `Out of the pairs I just showed you, these ${ordered.length} fit best 👇`,
    `我刚刚推荐的那几双里，这 ${ordered.length} 双最符合你的要求 👇`
  );
  const outro = L(
    lang,
    "Want more details, or should I compare two of them side by side?",
    "想先看其中一双的详情，还是我帮你并排比对比对呀？"
  );
  return {
    text: `${intro}\n${productList(ordered, lang)}\n\n${outro}`,
    products: ordered,
  };
}

/* =================================================================
 * 场景回复工厂（双语）
 * ================================================================= */

function sceneRunning(lang: Lang): AgentReply {
  const hits = searchProducts("running jog marathon carbon trail 跑步 碳板");
  if (!hits.length) return { text: L(lang, "No running pairs right now, sorry!", "暂时没找到跑鞋哦～") };
  return {
    text: L(
      lang,
      `Ready to log those miles? 🏃‍♂️ I picked the 3 best-reviewed pairs for comfort and performance:\n${productList(hits, lang)}\n\nWant more cushion, or a speed-focused carbon plate?`,
      `准备好开跑了吗？🏃‍♂️ 我从高评价里挑了 3 双脚感和性能都稳的：\n${productList(hits, lang)}\n\n想要更软的缓震，还是碳板竞速款呀？`
    ),
    products: hits,
  };
}

function sceneCasual(lang: Lang): AgentReply {
  const hits = searchProducts("lifestyle casual everyday chunky retro leather canvas 休闲 复古 老爹");
  return {
    text: L(
      lang,
      `Everyday comfort with a clean look ✌️ Here are my top versatile picks:\n${productList(hits, lang)}`,
      `日常通勤、逛街都百搭 ✌️ 给你挑了最不挑穿搭的几款：\n${productList(hits, lang)}`
    ),
    products: hits.length ? hits : undefined,
  };
}

function sceneOutdoor(lang: Lang): AgentReply {
  const hits = searchProducts("trail hiking outdoor mountain waterproof 越野 户外 登山");
  return {
    text: L(
      lang,
      `Heading outdoors? 🥾 Sticky grip, toe protection and water resistance matter most. Check these:\n${productList(hits, lang)}`,
      `进山徒步的话，抓地力、鞋头防护和防泼水都很重要 🥾 来看看这几双：\n${productList(hits, lang)}`
    ),
    products: hits.length ? hits : undefined,
  };
}

function sceneWideFeet(lang: Lang): AgentReply {
  const picks = pickByAttr(["帆布", "有机帆布", "头层牛皮", "leather", "canvas", "牛剖层革", "生胶"], 3);
  const list = picks.length
    ? L(lang, "\nRoomier picks for wide feet:\n", "\n宽脚更友好的款：\n") + productList(picks, lang) + "\n"
    : "\n";
  return {
    text: L(
      lang,
      `For wide feet, go half a size up and choose styles with a roomy toe box — canvas or leather (not tight knit) work best.${list}Still unsure? Hit me with your exact US size and I'll narrow it down.`,
      `脚宽的话建议选大半码，鞋头尽量挑宽松的版型——帆布或者皮面的会更友好，别买太紧的飞织款。${list}拿不准的话告诉我你平时穿 US 几码，我帮你再筛筛～`
    ),
    products: picks.length ? picks : undefined,
  };
}

function sceneNarrowFeet(lang: Lang): AgentReply {
  const picks = pickByAttr(["飞织", "flyknit", "弹力", "knit", "一体飞织", "slip"], 3);
  const list = picks.length
    ? L(lang, "\nSnug-fitting picks for narrow feet:\n", "\n瘦脚包裹感更好的款：\n") + productList(picks, lang) + "\n"
    : "\n";
  return {
    text: L(
      lang,
      `Narrow feet usually fit true-to-size, and stretch-knit or heel-locking styles work great — no slipping while you walk.${list}Pick one and you can always size-exchange for free later.`,
      `瘦脚按平时码数买就行，飞织或者带后跟锁位的版型最贴合，走路不掉跟。${list}挑中的话不合适也可以免费换码，放心～`
    ),
    products: picks.length ? picks : undefined,
  };
}

function sceneWaterproof(lang: Lang): AgentReply {
  const picks = pickByAttr(["防泼水", "waterproof", "rock plate", "grip gtx", "齿花"], 3);
  return {
    text: L(
      lang,
      `Most of our everyday pairs handle light drizzle just fine ☔ For serious wet trails, look for our trail-specific pairs with a water-repellent mesh upper, puncture-resistant rock plate, and deep-lug rubber sole for grip.`,
      `咱们大部分日常款都防点小雨 ☔；但如果要去湿润的山路，推荐选我们的户外越野款——带防泼水面料、防穿刺中底和大齿花防滑橡胶底，冲山更稳。`
    ),
    products: picks.length ? picks : undefined,
  };
}

function sceneWashable(lang: Lang): AgentReply {
  const picks = pickByAttr(["可机洗", "机洗", "快干", "洗"], 3);
  if (picks.length === 0) {
    return {
      text: L(
        lang,
        "Great question! 💡 Knit pairs generally go in the wash (cold cycle, air dry only). Leather or suede just need a quick wipe with a damp cloth + mild soap.",
        "好问题！💡 针织飞织款一般都可以机洗（冷水档，平铺阴干）；皮面/麂皮的话，湿布沾点温和肥皂擦擦就干净啦～"
      ),
    };
  }
  const haystackOf = (p: Product) => `${p.features.join(" ")} ${p.description} ${p.material}`;
  const machineWashables = picks.filter((p) => /机洗/.test(haystackOf(p)));
  const quickDrys = picks.filter((p) => !/机洗/.test(haystackOf(p)) && /快干/.test(haystackOf(p)));
  const joinNames = (arr: Product[]) =>
    arr.map((p) => ph(p.name)).join(arr.length === 2 ? " & " : arr.length > 2 ? ", and " : "");
  const parts: string[] = [];
  if (machineWashables.length) {
    const n = joinNames(machineWashables);
    parts.push(
      L(
        lang,
        `${n} ${machineWashables.length > 1 ? "are" : "is"} machine-washable 🧼 — cold cycle only, skip the tumble dryer, and let ${machineWashables.length > 1 ? "them" : "it"} air dry flat.`,
        `${n}${machineWashables.length > 1 ? "都" : ""}可以直接机洗 🧼，记得用冷水档、别烘干，平铺阴干就好。`
      )
    );
  }
  if (quickDrys.length) {
    const n = joinNames(quickDrys);
    parts.push(
      L(
        lang,
        `${n} ${quickDrys.length > 1 ? "have" : "has"} quick-dry material — just give ${quickDrys.length > 1 ? "them" : "it"} a rinse and leave ${quickDrys.length > 1 ? "them" : "it"} in the shade.`,
        `${n}${quickDrys.length > 1 ? "都是" : "是"}快干材质的，冲一冲放在阴凉处很快就干啦～`
      )
    );
  }
  parts.push(
    L(
      lang,
      "For leather or suede pairs in general, spot clean with a damp cloth and mild soap.",
      "所有皮面/麂皮鞋款，都用湿布加温和肥皂轻轻擦局部就行。"
    )
  );
  return { text: parts.join(" "), products: picks };
}

function sceneGift(lang: Lang): AgentReply {
  const picks = [...PRODUCTS]
    .filter((p) => p.trend === "hot" || p.reviews >= 500)
    .sort((a, b) => b.rating * Math.log10(b.reviews + 1) - a.rating * Math.log10(a.reviews + 1))
    .slice(0, 3);
  return {
    text: L(
      lang,
      `Gift shopping? I got you 🎁 These are the 3 most-loved pairs by reviewers — basically guaranteed wins:\n${productList(picks, lang)}\n\nGift receipts are available, and 30-day returns mean zero risk!`,
      `挑礼物对不对？🎁 这 3 双是评论里大家最喜欢的盲入款，几乎不会踩雷：\n${productList(picks, lang)}\n\n可以开礼物收据，30 天还能退，完全没风险～`
    ),
    products: picks,
  };
}

function sceneUnder100(q: string, lang: Lang): AgentReply {
  const m = q.match(/\$?\s*(\d{2,3})\b/);
  const budget = m ? parseInt(m[1], 10) : 100;
  const picks = pickByMaxPrice(budget);
  return {
    text: L(
      lang,
      `All of these are under ${formatUSD(budget)} — no compromise on quality 💰\n${productList(picks, lang)}\n\nWant something more specific, like running or casual?`,
      `这几双都在 ${formatUSD(budget)} 以内，品质完全不打折 💰\n${productList(picks, lang)}\n\n要不要再限定一下？比如跑鞋还是休闲款？`
    ),
    products: picks.length ? picks : undefined,
  };
}

function sceneJeans(lang: Lang): AgentReply {
  const hits = searchProducts("lifestyle chunky dad retro leather canvas court casual 老爹 皮面 帆布");
  return {
    text: L(
      lang,
      `Baggy, straight or skinny — jeans love a clean, low-profile sneaker or a bold chunky dad shoe 👖\n${hits.length ? "These 3 pair perfectly:\n" + productList(hits, lang) : "Canvas low-tops or white leather courts are my go-to."}`,
      `不管是阔腿、直筒还是紧身牛仔裤 👖 配干净低帮帆布鞋或者夸张厚底老爹鞋都绝了。\n${hits.length ? "这 3 双最搭：\n" + productList(hits, lang) : "我最推荐帆布小白鞋和白皮面复古板鞋。"}`
    ),
    products: hits.length ? hits : undefined,
  };
}

function sceneDress(lang: Lang): AgentReply {
  const hits = searchProducts("court leather canvas white slip classic cream 皮面 小白鞋");
  return {
    text: L(
      lang,
      `With a dress, go minimal and polished ✨ Clean white leather courts or sleek slip-ons — no busy details stealing the show.\n${hits.length ? "My curated picks:\n" + productList(hits, lang) : ""}`,
      `配连衣裙的话，干净精致是关键 ✨ 白皮面复古板鞋或者纯色一脚蹬都很赞，别选太花哨的就行。\n${hits.length ? "挑好了这几双：\n" + productList(hits, lang) : ""}`
    ),
    products: hits.length ? hits : undefined,
  };
}

function sceneShorts(lang: Lang): AgentReply {
  const hits = searchProducts("canvas sandals slip summer breeze casual classic 帆布 凉鞋 夏天");
  return {
    text: L(
      lang,
      `Shorts weather = keep it breezy ☀️ Low-top canvas, sport sandals, or slip-ons — all super easy, no outfit stress.\n${hits.length ? "Top picks:\n" + productList(hits, lang) : ""}`,
      `短裤就是要清爽不闷脚 ☀️ 低帮帆布鞋、运动凉鞋，或者一脚蹬，随便搭都好看。\n${hits.length ? "给你挑了这些：\n" + productList(hits, lang) : ""}`
    ),
    products: hits.length ? hits : undefined,
  };
}

function sceneStudentDiscount(lang: Lang): AgentReply {
  const hot = [...PRODUCTS].filter((p) => p.trend === "hot").slice(0, 2);
  return {
    text: L(
      lang,
      `Student perks 🎓 Use code STUDENT10 for 10% off your first order — just verify with your .edu email at checkout. Free shipping kicks in at $75, too!`,
      `学生党专属福利 🎓 结账时用 STUDENT10 立减 10%，用 .edu 邮箱验证一下就行～满 $75 还免运费！`
    ),
    products: hot.length ? hot : undefined,
  };
}

function sceneGenericDiscount(lang: Lang): AgentReply {
  const hot = [...PRODUCTS].filter((p) => p.trend === "hot").slice(0, 2);
  return {
    text: L(
      lang,
      `Welcome deal just for you 🎁 Use code STRYDE15 at checkout for 15% OFF your first order. Spend $75+ and US shipping is on the house. Here are two fan faves to start:`,
      `新客首单优惠来啦 🎁 结账输码 STRYDE15，立减 15%！满 $75 美国境内包邮。先给你推荐 2 双人气款：`
    ),
    products: hot.length ? hot : undefined,
  };
}

/* =================================================================
 * 统一入口 agentReply(userMessage, context?) — 兼容旧单参调用
 * ================================================================= */

export function agentReply(userMessage: string, context: AgentContext = {}): AgentReply {
  const q = userMessage.toLowerCase();
  const lang = detectLang(userMessage);

  /* 指代问句（基于上轮推荐过滤/排序）优先 */
  const contextual = tryContextReply(q, lang, context);
  if (contextual) return contextual;

  if (/student|校园|学生/.test(q)) return sceneStudentDiscount(lang);

  if (
    /(under|below|less\s*than|cheap|budget|低于|预算|以内|以下|不超过).*\$?\s*\d{2,3}|\$\s*\d{2,3}\s*(or\s*less|max|and\s*under|以下|以内)/.test(
      q
    ) ||
    /不超过?\s*\d{2,3}\s*(美?元|刀)/.test(q)
  )
    return sceneUnder100(q, lang);

  if (/wide\s*feet?|宽脚|肥脚|脚.{0,3}(宽|胖|肥)|(宽|胖|肥).{0,3}脚|脚掌宽|脚背宽|脚面宽|脚型宽/.test(q))
    return sceneWideFeet(lang);
  if (/narrow\s*feet?|thin\s*feet?|瘦脚|脚.{0,3}瘦|窄脚|脚型瘦|脚窄|偏瘦|小脚/.test(q))
    return sceneNarrowFeet(lang);
  if (/waterproof|water\s*proof|water\s*resistant|防水|防雨|防泼/.test(q))
    return sceneWaterproof(lang);
  if (/wash|clean|清洗|洗|cleanable|machine\s*wash/.test(q)) return sceneWashable(lang);
  if (/\bgift\b|present|birthday|送礼|礼物|礼物推|圣诞|valentine|anniversary/.test(q))
    return sceneGift(lang);
  if (/\bjeans?\b|denim|牛仔裤/.test(q)) return sceneJeans(lang);
  if (/\bdress\b|裙子|连衣裙|skirt/.test(q)) return sceneDress(lang);
  if (/\bshorts?\b|短裤/.test(q)) return sceneShorts(lang);
  if (/running|run\s*shoes?|跑鞋|跑步鞋|马拉松|碳板|jogging/.test(q)) return sceneRunning(lang);
  if (/casual|everyday|日常|休闲鞋|通勤/.test(q)) return sceneCasual(lang);
  if (/outdoor|hik(e|ing)|trail|户外|登山|越野|徒步/.test(q)) return sceneOutdoor(lang);

  /* 保留原有 4 个逻辑（未删除，regex 已扩中文关键词） */
  if (/size|尺码|码数|fit|large|small|多大码|选码/.test(q)) return { text: sizingBilingual(lang) };
  if (/ship|delivery|deliver|shipping|物流|快递|运费|多久|when\s*.*(arrive|ship|deliver)|到哪/.test(q))
    return { text: shippingBilingual(lang) };
  if (/return|refund|exchange|退|换|退货|换货/.test(q)) return { text: returnBilingual(lang) };
  if (/deal|discount|sale|便宜|优惠|code|coupon|promo|省钱|首单/.test(q))
    return sceneGenericDiscount(lang);

  if (ordered.length === 0) {
    return {
      text: L(
        lang,
        "Hmm, none of the pairs I just recommended quite match that filter. Wanna restart with a fresh search? 🔎",
        "嗯……刚才推荐的里好像没有完全符合这个条件的哦。要不我们换个条件重新搜一下？🔎"
      ),
    };
  }

  const intro = L(
    lang,
    `Out of the pairs I just showed you, these ${ordered.length} fit best 👇`,
    `我刚刚推荐的那几双里，这 ${ordered.length} 双最符合你的要求 👇`
  );
  const outro = L(
    lang,
    "Want more details, or should I compare two of them side by side?",
    "想先看其中一双的详情，还是我帮你并排比对比对呀？"
  );
  return {
    text: `${intro}\n${productList(ordered, lang)}\n\n${outro}`,
    products: ordered,
  };
}

/* =================================================================
 * 场景回复工厂（双语）—— 每个场景接收 lang，输出英文或中文文案
 * 每个 reply: 1–3 句 + ≤3 张商品卡。全部用 ph/formatUSD，不硬编码商品名。
 * ================================================================= */

function sceneRunning(lang: Lang): AgentReply {
  const hits = searchProducts("running jog marathon carbon trail 跑步 碳板");
  if (!hits.length) {
    return { text: L(lang, "No running pairs right now, sorry!", "暂时没找到跑鞋哦～") };
  }
  return {
    text: L(
      lang,
      `Ready to log those miles? 🏃‍♂️ I picked the 3 best-reviewed pairs for comfort and performance:\n${productList(hits, lang)}\n\nWant more cushion, or a speed-focused carbon plate?`,
      `准备好开跑了吗？🏃‍♂️ 我从高评价里挑了 3 双脚感和性能都稳的：\n${productList(hits, lang)}\n\n想要更软的缓震，还是碳板竞速款呀？`
    ),
    products: hits,
  };
}

function sceneCasual(lang: Lang): AgentReply {
  const hits = searchProducts("lifestyle casual everyday chunky retro leather canvas 休闲 复古 老爹");
  return {
    text: L(
      lang,
      `Everyday comfort with a clean look ✌️ Here are my top versatile picks:\n${productList(hits, lang)}`,
      `日常通勤、逛街都百搭 ✌️ 给你挑了最不挑穿搭的几款：\n${productList(hits, lang)}`
    ),
    products: hits.length ? hits : undefined,
  };
}

function sceneOutdoor(lang: Lang): AgentReply {
  const hits = searchProducts("trail hiking outdoor mountain waterproof 越野 户外 登山");
  return {
    text: L(
      lang,
      `Heading outdoors? 🥾 Sticky grip, toe protection and water resistance matter most. Check these:\n${productList(hits, lang)}`,
      `进山徒步的话，抓地力、鞋头防护和防泼水都很重要 🥾 来看看这几双：\n${productList(hits, lang)}`
    ),
    products: hits.length ? hits : undefined,
  };
}

function sceneWideFeet(lang: Lang): AgentReply {
  const picks = pickByAttr(["帆布", "有机帆布", "头层牛皮", "leather", "canvas", "牛剖层革"], 3);
  const list = picks.length ? L(lang, "\nRoomier picks for wide feet:\n", "\n宽脚更友好的款：\n") + productList(picks, lang) + "\n" : "\n";
  return {
    text: L(
      lang,
      `For wide feet, go half a size up and choose styles with a roomy toe box — canvas or leather (not tight knit) work best.${list}Still unsure? Hit me with your exact US size and I'll narrow it down.`,
      `脚宽的话建议选大半码，鞋头尽量挑宽松的版型——帆布或者皮面的会更友好，别买太紧的飞织款。${list}拿不准的话告诉我你平时穿 US 几码，我帮你再筛筛～`
    ),
    products: picks.length ? picks : undefined,
  };
}

function sceneNarrowFeet(lang: Lang): AgentReply {
  const picks = pickByAttr(["飞织", "flyknit", "弹力", "knit", "一体飞织", "slip"], 3);
  const list = picks.length ? L(lang, "\nSnug-fitting picks for narrow feet:\n", "\n瘦脚包裹感更好的款：\n") + productList(picks, lang) + "\n" : "\n";
  return {
    text: L(
      lang,
      `Narrow feet usually fit true-to-size, and stretch-knit or heel-locking styles work great — no slipping while you walk.${list}Pick one and you can always size-exchange for free later.`,
      `瘦脚按平时码数买就行，飞织或者带后跟锁位的版型最贴合，走路不掉跟。${list}挑中的话不合适也可以免费换码，放心～`
    ),
    products: picks.length ? picks : undefined,
  };
}

function sceneWaterproof(lang: Lang): AgentReply {
  const picks = pickByAttr(["防泼水", "waterproof", "rock plate", "grip gtx", "齿花"], 3);
  return {
    text: L(
      lang,
      `Most of our everyday pairs handle light drizzle just fine ☔ For serious wet trails, look for our trail-specific pairs with a water-repellent mesh upper, puncture-resistant rock plate, and deep-lug rubber sole for grip.`,
      `咱们大部分日常款都防点小雨 ☔；但如果要去湿润的山路，推荐选我们的户外越野款——带防泼水面料、防穿刺中底和大齿花防滑橡胶底，冲山更稳。`
    ),
    products: picks.length ? picks : undefined,
  };
}

function sceneWashable(lang: Lang): AgentReply {
  const picks = pickByAttr(["可机洗", "机洗", "快干", "洗"], 3);
  if (picks.length === 0) {
    return {
      text: L(
        lang,
        "Great question! 💡 Knit pairs generally go in the wash (cold cycle, air dry only). Leather or suede just need a quick wipe with a damp cloth + mild soap.",
        "好问题！💡 针织飞织款一般都可以机洗（冷水档，平铺阴干）；皮面/麂皮的话，湿布沾点温和肥皂擦擦就干净啦～"
      ),
    };
  }
  const haystackOf = (p: Product) => `${p.features.join(" ")} ${p.description} ${p.material}`;
  const machineWashables = picks.filter((p) => /机洗/.test(haystackOf(p)));
  const quickDrys = picks.filter((p) => !/机洗/.test(haystackOf(p)) && /快干/.test(haystackOf(p)));
  const joinNames = (arr: Product[]) =>
    arr.map((p) => ph(p.name)).join(arr.length === 2 ? " & " : arr.length > 2 ? ", and " : "");
  const parts: string[] = [];
  if (machineWashables.length) {
    const n = joinNames(machineWashables);
    parts.push(
      L(
        lang,
        `${n} ${machineWashables.length > 1 ? "are" : "is"} machine-washable 🧼 — cold cycle only, skip the tumble dryer, and let ${machineWashables.length > 1 ? "them" : "it"} air dry flat.`,
        `${n}${machineWashables.length > 1 ? "都" : ""}可以直接机洗 🧼，记得用冷水档、别烘干，平铺阴干就好。`
      )
    );
  }
  if (quickDrys.length) {
    const n = joinNames(quickDrys);
    parts.push(
      L(
        lang,
        `${n} ${quickDrys.length > 1 ? "have" : "has"} quick-dry material — just give ${quickDrys.length > 1 ? "them" : "it"} a rinse and leave ${quickDrys.length > 1 ? "them" : "it"} in the shade.`,
        `${n}${quickDrys.length > 1 ? "都是" : "是"}快干材质的，冲一冲放在阴凉处很快就干啦～`
      )
    );
  }
  parts.push(
    L(
      lang,
      "For leather or suede pairs in general, spot clean with a damp cloth and mild soap.",
      "所有皮面/麂皮鞋款，都用湿布加温和肥皂轻轻擦局部就行。"
    )
  );
  return { text: parts.join(" "), products: picks };
}

function sceneGift(lang: Lang): AgentReply {
  const picks = [...PRODUCTS]
    .filter((p) => p.trend === "hot" || p.reviews >= 500)
    .sort((a, b) => b.rating * Math.log10(b.reviews + 1) - a.rating * Math.log10(a.reviews + 1))
    .slice(0, 3);
  return {
    text: L(
      lang,
      `Gift shopping? I got you 🎁 These are the 3 most-loved pairs by reviewers — basically guaranteed wins:\n${productList(picks, lang)}\n\nGift receipts are available, and 30-day returns mean zero risk!`,
      `挑礼物对不对？🎁 这 3 双是评论里大家最喜欢的盲入款，几乎不会踩雷：\n${productList(picks, lang)}\n\n可以开礼物收据，30 天还能退，完全没风险～`
    ),
    products: picks,
  };
}

function sceneUnder100(q: string, lang: Lang): AgentReply {
  const m = q.match(/\$?\s*(\d{2,3})\b/);
  const budget = m ? parseInt(m[1], 10) : 100;
  const picks = pickByMaxPrice(budget);
  return {
    text: L(
      lang,
      `All of these are under ${formatUSD(budget)} — no compromise on quality 💰\n${productList(picks, lang)}\n\nWant something more specific, like running or casual?`,
      `这几双都在 ${formatUSD(budget)} 以内，品质完全不打折 💰\n${productList(picks, lang)}\n\n要不要再限定一下？比如跑鞋还是休闲款？`
    ),
    products: picks.length ? picks : undefined,
  };
}

function sceneJeans(lang: Lang): AgentReply {
  const hits = searchProducts("lifestyle chunky dad retro leather canvas court casual 老爹 皮面 帆布");
  return {
    text: L(
      lang,
      `Baggy, straight or skinny — jeans love a clean, low-profile sneaker or a bold chunky dad shoe 👖\n${hits.length ? "These 3 pair perfectly:\n" + productList(hits, lang) : "Canvas low-tops or white leather courts are my go-to."}`,
      `不管是阔腿、直筒还是紧身牛仔裤 👖 配干净低帮帆布鞋或者夸张厚底老爹鞋都绝了。\n${hits.length ? "这 3 双最搭：\n" + productList(hits, lang) : "我最推荐帆布小白鞋和白皮面复古板鞋。"}`
    ),
    products: hits.length ? hits : undefined,
  };
}

function sceneDress(lang: Lang): AgentReply {
  const hits = searchProducts("court leather canvas white slip classic cream 皮面 小白鞋");
  return {
    text: L(
      lang,
      `With a dress, go minimal and polished ✨ Clean white leather courts or sleek slip-ons — no busy details stealing the show.\n${hits.length ? "My curated picks:\n" + productList(hits, lang) : ""}`,
      `配连衣裙的话，干净精致是关键 ✨ 白皮面复古板鞋或者纯色一脚蹬都很赞，别选太花哨的就行。\n${hits.length ? "挑好了这几双：\n" + productList(hits, lang) : ""}`
    ),
    products: hits.length ? hits : undefined,
  };
}

function sceneShorts(lang: Lang): AgentReply {
  const hits = searchProducts("canvas sandals slip summer breeze casual classic 帆布 凉鞋 夏天");
  return {
    text: L(
      lang,
      `Shorts weather = keep it breezy ☀️ Low-top canvas, sport sandals, or slip-ons — all super easy, no outfit stress.\n${hits.length ? "Top picks:\n" + productList(hits, lang) : ""}`,
      `短裤就是要清爽不闷脚 ☀️ 低帮帆布鞋、运动凉鞋，或者一脚蹬，随便搭都好看。\n${hits.length ? "给你挑了这些：\n" + productList(hits, lang) : ""}`
    ),
    products: hits.length ? hits : undefined,
  };
}

function sceneStudentDiscount(lang: Lang): AgentReply {
  const hot = [...PRODUCTS].filter((p) => p.trend === "hot").slice(0, 2);
  return {
    text: L(
      lang,
      `Student perks 🎓 Use code STUDENT10 for 10% off your first order — just verify with your .edu email at checkout. Free shipping kicks in at $75, too!`,
      `学生党专属福利 🎓 结账时用 STUDENT10 立减 10%，用 .edu 邮箱验证一下就行～满 $75 还免运费！`
    ),
    products: hot.length ? hot : undefined,
  };
}

function sceneGenericDiscount(lang: Lang): AgentReply {
  const hot = [...PRODUCTS].filter((p) => p.trend === "hot").slice(0, 2);
  return {
    text: L(
      lang,
      `Welcome deal just for you 🎁 Use code STRYDE15 at checkout for 15% OFF your first order. Spend $75+ and US shipping is on the house. Here are two fan faves to start:`,
      `新客首单优惠来啦 🎁 结账输码 STRYDE15，立减 15%！满 $75 美国境内包邮。先给你推荐 2 双人气款：`
    ),
    products: hot.length ? hot : undefined,
  };
}

/* =================================================================
 * 统一入口 —— 完全兼容旧签名：
 *   旧代码：agentReply(msg)             ✅ 正常工作（context 默认空对象）
 *   新代码：agentReply(msg, context)     ✅ 支持指代问句解析 + 双语
 * 不改变：函数返回类型 AgentReply、原 4 个场景逻辑分支保留、searchProducts 兜底保留
 * ================================================================= */

export function agentReply(userMessage: string, context: AgentContext = {}): AgentReply {
  const q = userMessage.toLowerCase();
  const lang = detectLang(userMessage);

  /* ---------- 【高优先级】指代问句解析：基于上轮推荐过滤 ---------- */
  const contextual = tryContextReply(q, lang, context);
  if (contextual) return contextual;

  /* ---------- 场景 13：学生折扣（必须在通用 discount 之前判断） ---------- */
  if (/student|校园|学生/.test(q)) return sceneStudentDiscount(lang);

  /* ---------- 场景 9：预算 under $100 ---------- */
  if (
    /(under|below|less\s*than|cheap|budget|低于|预算|以内|以下|不超过).*\$?\s*\d{2,3}|\$\s*\d{2,3}\s*(or\s*less|max|and\s*under|以下|以内)/.test(
      q
    ) ||
    /不超过?\s*\d{2,3}\s*(美?元|刀)/.test(q)
  )
    return sceneUnder100(q, lang);

  /* ---------- 场景 4：宽脚（支持「我的脚比较宽」「脚有点胖」这类带插入语写法） ---------- */
  if (/wide\s*feet?|宽脚|肥脚|脚.{0,3}(宽|胖|肥)|(宽|胖|肥).{0,3}脚|脚掌宽|脚背宽|脚面宽|脚型宽/.test(q))
    return sceneWideFeet(lang);

  /* ---------- 场景 5：瘦脚 ---------- */
  if (/narrow\s*feet?|thin\s*feet?|瘦脚|脚.{0,3}瘦|窄脚|脚型瘦|脚窄|偏瘦|小脚/.test(q))
    return sceneNarrowFeet(lang);

  /* ---------- 场景 6：防水 ---------- */
  if (/waterproof|water\s*proof|water\s*resistant|防水|防雨|防泼/.test(q)) return sceneWaterproof(lang);

  /* ---------- 场景 7：能不能洗 ---------- */
  if (/wash|clean|清洗|洗|cleanable|machine\s*wash/.test(q)) return sceneWashable(lang);

  /* ---------- 场景 8：送礼 ---------- */
  if (/\bgift\b|present|birthday|送礼|礼物|礼物推|圣诞|valentine|anniversary/.test(q)) return sceneGift(lang);

  /* ---------- 场景 10：牛仔裤 ---------- */
  if (/\bjeans?\b|denim|牛仔裤/.test(q)) return sceneJeans(lang);

  /* ---------- 场景 11：连衣裙 ---------- */
  if (/\bdress\b|裙子|连衣裙|skirt/.test(q)) return sceneDress(lang);

  /* ---------- 场景 12：短裤 ---------- */
  if (/\bshorts?\b|短裤/.test(q)) return sceneShorts(lang);

  /* ---------- 场景 1：跑鞋 ---------- */
  if (/running|run\s*shoes?|跑鞋|跑步鞋|马拉松|碳板|jogging/.test(q)) return sceneRunning(lang);

  /* ---------- 场景 2：休闲鞋 ---------- */
  if (/casual|everyday|日常|休闲鞋|通勤/.test(q)) return sceneCasual(lang);

  /* ---------- 场景 3：户外 ---------- */
  if (/outdoor|hik(e|ing)|trail|户外|登山|越野|徒步/.test(q)) return sceneOutdoor(lang);

  /* ---------- 保留原有 4 个逻辑（功能不删除，regex 扩展） ---------- */
  // 场景 16：尺码
  if (/size|尺码|码数|fit|large|small|多大码|选码/.test(q)) return { text: sizingBilingual(lang) };
  // 场景 14：物流
  if (/ship|delivery|deliver|shipping|物流|快递|运费|多久|when\s*.*(arrive|ship|deliver)|到哪/.test(q))
    return { text: shippingBilingual(lang) };
  // 场景 15：退货
  if (/return|refund|exchange|退|换|退货|换货/.test(q)) return { text: returnBilingual(lang) };
  // 场景 17：优惠（通用首单，学生优惠已在前）
  if (/deal|discount|sale|便宜|优惠|code|coupon|promo|省钱|首单/.test(q)) return sceneGenericDiscount(lang);

  /* ---------- 兜底 1：searchProducts 自由检索 ---------- */
  const hits = searchProducts(q);
  if (hits.length > 0) {
    return {
      text: L(
        lang,
        `Based on what you said, these are my top ${hits.length} picks 🤙\n${productList(hits, lang)}\n\nTap the card for full details — need me to narrow by price or size?`,
        `根据你说的，我挑了这 ${hits.length} 双最合适的 🤙\n${productList(hits, lang)}\n\n点卡片可以看详情，要不要我再按价格或者尺码帮你缩一下？`
      ),
      products: hits,
    };
  }
<<<<<<< Updated upstream
=======

  /* ---------- 兜底 2：帮助文案（双语） ---------- */
>>>>>>> Stashed changes
  return {
    text:
      lang === "zh"
        ? "我可以帮你做这些 👟\n• 挑鞋：跑步/休闲/户外\n• 尺码、物流、退换货咨询\n• 优惠码和学生折扣\n\n试试问：\"配牛仔裤的鞋\" 或者 \"想送人，预算 100 美元\""
        : AGENT_PERSONA.fallbackHelp,
  };
}
