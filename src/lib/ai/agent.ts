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
  headerStatusZh: "在线 · 秒级响应",
  welcome:
    "Hey! I'm Mia 👋 From commute-ready boots to weekend pairs that won't break the bank — tell me what you're after and I'll do the rest.",
  welcomeZh:
    "嘿！我是 Mia 👢 从通勤能穿的靴子到高性价比周末款——告诉我你想找什么，剩下的交给我。",
  inputPlaceholder: "Ask me anything… e.g. boots for commuting",
  inputPlaceholderZh: "想问点什么…比如：通勤穿的靴子",
  /** 4 个快捷气泡（选款 / 尺码 / 物流 / 优惠；货盘 D 为男靴，选款气泡对齐通勤场景） */
  suggestions: [
    "Help me pick everyday boots",
    "How should I choose my size?",
    "How long does shipping take?",
    "Do you have any discounts?",
  ] as const,
  suggestionsZh: [
    "帮我挑一双通勤靴",
    "尺码怎么选？",
    "多久能到货？",
    "有什么优惠？",
  ] as const,
  fallbackHelp:
    "I can help you with 👢\n• Boot picks (commute / date night / travel / light outdoor)\n• Size, shipping & return info\n• Deals & student discounts\n\nTry: \"What goes with jeans?\" or \"I need a gift for him.\"",
  /** 30 秒无响应主动搭话（按用户要求保持简短自然的英文） */
  proactive: "Hi! Need help picking the right pair? 😊",
  proactiveZh: "嗨！需要帮你挑一双合适的鞋吗？😊",
};

/* =================================================================
 * 语言检测 —— 极简 CJK 判定（中/日文汉字 → 返回 zh，否则 en）
 * ================================================================= */

export type Lang = "en" | "zh";

export function detectLang(text: string): Lang {
  return /[一-鿿぀-ヿ가-힯]/.test(text) ? "zh" : "en";
}

/** 按语言挑文案，所有场景双语统一用这个缩写函数 */
function L<T>(lang: Lang, en: T, zh: T): T {
  return lang === "zh" ? zh : en;
}

/* =================================================================
 * 多轮上下文（客户端传入）
 * ================================================================= */

export interface AgentContext {
  /** 上一轮 AI 推荐的商品（客户端从 products SSE 事件里拿到、用 getProduct(slug) 还原） */
  lastProducts?: Product[];
  /** 上一轮用户输入（未来扩展预留） */
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
 *   searchProducts / pickByMaxPrice / pickByAttr / describeProductEn / productList
 *   getSizingAdvice / getShippingInfo / getReturnInfo
 * ================================================================= */

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  // 货盘为全靴子（蓝禾高帮靴 + STRYDE 靴），意图关键词只用于"是否算鞋类需求"的判定
  const footwearIntent =
    /run|jog|sneaker|shoe|boot|casual|trail|hik|canvas|sandal|slip|leather|chunky|platform|靴|鞋|跑|休闲|帆布|凉|户外|登山|厚底|拉链|皮/.test(
      q
    );

  let hits = PRODUCTS.filter((p) => {
    const hay =
      `${p.name} ${p.tagline} ${p.description} ${p.category} ${p.features.join(" ")} ${p.material}`.toLowerCase();
    return q.split(/\s+/).some((t) => t.length > 2 && hay.includes(t));
  });
  // 中文整句里的关键词兜底（如"厚底""拉链""黑色"）
  if (hits.length === 0) {
    const cjkKw = ["厚底", "拉链", "黑色", "全黑", "亮面", "金属", "极简", "百搭", "通勤", "高帮", "靴", "增高", "复古"];
    const hitKw = cjkKw.filter((k) => q.includes(k));
    if (hitKw.length) {
      hits = PRODUCTS.filter((p) => {
        const hay = `${p.tagline} ${p.description} ${p.features.join(" ")} ${p.material}`;
        return hitKw.some((k) => hay.includes(k));
      });
    }
  }
  // 鞋类意图但文本没命中具体款 → 热度兜底，绝不冷场
  if (hits.length === 0 && footwearIntent) hits = [...PRODUCTS];
  return hits.sort((a, b) => b.heatScore - a.heatScore).slice(0, 3);
}

/**
 * 浏览位（用户要"多看几双"时用）：有真实评价的靴子优先，再按热度；
 * 货盘 D 主货号 14534-H（mono-boot，赛事指定现货男靴）保底占 1 个位置。
 */
function topRatedBoots(n = 3): Product[] {
  const scored = [...PRODUCTS].sort((a, b) => {
    const score = (p: Product) =>
      p.reviews > 0 ? p.rating * Math.log10(p.reviews + 1) + p.heatScore / 50 : p.heatScore / 50;
    return score(b) - score(a);
  });
  const hero = PRODUCTS.find((p) => p.sku === "14534-H" || p.slug === "mono-boot");
  if (!hero || n < 2) return scored.slice(0, n);
  const picks = scored.filter((p) => p.slug !== hero.slug).slice(0, n - 1);
  picks.push(hero);
  return picks.slice(0, n);
}

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

function pickFromPool(pool: Product[], keywords: string[]): Product[] {
  const kw = keywords.map((k) => k.toLowerCase());
  return pool
    .filter((p) => {
      const hay = `${p.features.join(" ")} ${p.description} ${p.material}`.toLowerCase();
      return kw.some((k) => hay.includes(k));
    })
    .sort((a, b) => b.heatScore - a.heatScore);
}

/* =================================================================
 * 推荐数量策略（货盘 D）：
 * - 明确购买场景（通勤/约会/旅行/出差/礼物/牛仔裤/西裤/脚型等）→ 只推 1 款最匹配，
 *   风格类场景一律主推 14534-H（mono-boot），不让用户在 3 张相似卡片里自己挑
 * - 功能/脚型约束（宽脚/窄脚/户外/雨天购买意图）存在明显备选 → 最多 2
 * - 用户明确要"多看几双"（some / options / a few / 几双 / 有哪些）→ 最多 3
 * - 咨询类（尺码/物流/退换/护理/防水能力）→ 默认 0 卡，上下文需要才附
 * - 多轮指代（that one / the black one）→ 围绕上一轮商品聚焦回答，不重铺 3 双
 * ================================================================= */

function heroBoot(): Product | undefined {
  return PRODUCTS.find((p) => p.sku === "14534-H" || p.slug === "mono-boot");
}

/** 用户是否想"多看几双"（浏览意图）→ 允许 3 张卡 */
function wantsMany(q: string): boolean {
  return /\bsome\b|\boptions?\b|\ba few\b|several|\bideas\b|show me|more pairs|几双|多(推荐|看|来|发)|都(推荐|看看|发来)|有哪些|还有什么|别的(款|选择)?|随便(推荐|看看)|再(推荐|看)/.test(
    q
  );
}

/** 风格/场景类需求的主推位：永远以 14534-H 领衔；withAlt=true 时最多补 1 个明显备选 */
function heroPick(alts: Product[], withAlt: boolean): Product[] {
  const hero = heroBoot();
  if (!hero) return alts.slice(0, withAlt ? 2 : 1);
  if (!withAlt) return [hero];
  const alt = alts.find((p) => p.slug !== hero.slug);
  return alt ? [hero, alt] : [hero];
}

/** 功能/脚型约束场景：有几个明显匹配给几张（1-2），绝不 3 张 */
function pickFocused(cands: Product[]): Product[] {
  const uniq = cands.filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i);
  return uniq.slice(0, Math.min(2, uniq.length));
}

/**
 * 根据 Product 的**结构化字段**（category/材质/features 关键词/trend/slug 等）
 * 生成一句自然的英文商品属性描述，绝不碰 catalog 里的中文 tagline/description 整句原文。
 * 不硬编码任何具体商品名，只按属性分类做句式分支。
 */
function describeProductEn(p: Product): string {
  const parts: string[] = [];
  const hay = `${p.features.join(" ")} ${p.material} ${p.description} ${p.slug} ${p.category}`.toLowerCase();

  if (p.category === "boots") {
    if (/platform|厚底|加厚|发泡|foam|sculptural|增高|lug/.test(hay))
      parts.push("chunky platform sole · subtle lift");
    if (/lug|齿花/.test(hay)) parts.push("grippy lug rubber outsole");
    if (/zipper|拉链/.test(hay)) parts.push("easy side-zip entry");
    if (/hologram|全息|iridescent/.test(hay)) parts.push("head-turning iridescent finish");
    // 注意：不用裸 "metal/金属"，避免误命中金属拉链/气眼；"金属感/金色/亮面" 才是装饰面质感
    else if (/贴膜|漆皮|亮面|patent|glossy|metallic|gold|金色|金属感|抛光|蛇纹|crocodile/.test(hay))
      parts.push("glossy statement finish");
    if (/极简|minimal|简约|干净|quiet|mono/.test(hay)) parts.push("clean minimal silhouette");
    if (/窄楦|收口|slim/.test(hay)) parts.push("slim tailored fit");
    if (/10\s*个?配色|ten color|colors?/.test(hay)) parts.push("10 colorways in stock");
    if (!parts.length) parts.push("street-ready high-top boot");
  } else if (p.category === "running") {
    if (/carbon|碳板/.test(hay)) parts.push("carbon-plated · max energy return");
    else if (/knit|飞织/.test(hay)) parts.push("breathable one-piece knit · featherlight");
    if (/trail|越野|齿花|rock|登山|防泼/.test(hay) || p.slug.includes("trail")) {
      parts.push("built for trails · deep-lug grip");
      if (/防泼|waterproof|water-resistant/.test(hay)) parts.push("water-repellent mesh");
    }
    if (!parts.length) parts.push("cushioned daily trainer");
  } else if (p.category === "lifestyle") {
    if (/chunky|厚底|老爹|90s/.test(hay) || p.slug.includes("chunk")) {
      parts.push("retro 90s chunky sole · street-style");
    } else if (
      /leather|头层牛皮|生胶|court|皮面/.test(hay) ||
      p.slug.includes("leather") ||
      p.slug.includes("court")
    ) {
      parts.push("smooth retro court silhouette");
    } else if (/slip|elastic|弹力|一脚蹬|穆勒|laceless/.test(hay) || p.slug.includes("slip")) {
      parts.push("stretchy laceless knit · slip-on ease");
    } else {
      parts.push("clean everyday casual · versatile layering piece");
    }
  } else if (p.category === "canvas") {
    if (/有机帆布|gots|organic/.test(hay)) parts.push("GOTS organic cotton canvas");
    else parts.push("timeless low-top canvas");
    parts.push("natural rubber sole · quiet grip");
  } else if (p.category === "sandals") {
    parts.push("quick-dry webbing · arch-support footbed");
    parts.push("summer-ready sport sandal");
  }

  const trendTag: Record<string, string> = {
    hot: "🔥 top-seller",
    rising: "📈 trending fast",
    new: "✨ new drop",
    steady: "⭐ customer favorite",
  };
  if (trendTag[p.trend]) parts.push(trendTag[p.trend]);

  if (/机洗|machine\s*wash/.test(hay)) parts.push("machine-washable");
  if (/防泼|waterproof|water-resistant/.test(hay)) parts.push("water-resistant");
  if (p.stock != null && p.stock < 500) parts.push("low stock");

  return parts.filter(Boolean).slice(0, 3).join(" · ");
}

function productList(products: Product[], lang: Lang): string {
  const sep = "  ·  ";
  const rev = L(lang, "reviews", "条评价");
  return products
    .map((p) => {
      // 关键：英文绝不插入 catalog 里的中文 tagline / description 原文；
      // 中文保留 catalog 原生 tagline（英文 slogan 原样展示也无妨）。
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
    "Most of our boots run in standard US sizes; our STRYDE-labeled pairs use EU 38–46 (every product page has a full EU/US size chart). If your feet are wide or you're between sizes, go up by half a size ✨ Our lace-up boots are adjustable across the instep, and the side zip makes them easy to get on and off. Free size exchanges within 30 days, on us!",
    "咱们大部分靴款是标准美码，STRYDE 系列用欧码 EU 38–46（每个商品页都有完整的欧码/美码对照表）✨ 脚比较宽、或者在两码之间的话，建议选大半码；系带款脚背松紧可以自己调，侧面还有拉链，穿脱很方便。30 天内免费换码，运费我们包～"
  );
}
function shippingBilingual(lang: Lang): string {
  return L(
    lang,
    "Orders are processed within 1–2 business days 🚚 International delivery usually takes 7–15 business days depending on your country, and shipping is free over $75. You'll get a tracking email the moment your order ships!",
    "下单后 1–2 个工作日内处理出库 🚚 国际运输一般 7–15 个工作日送达，具体看目的地国家；满 $75 免运费。一出库就会给你发追踪邮件哒～"
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
 * ================================================================= */

function isReferenceQuery(q: string): boolean {
  const en = /\b(which one|which ones|which (of )?(these|those|them)|that one|this one|that pair|this pair|the ([a-z]+ )?one(s)?\b|one of (these|those|them)|the (ones|pairs|shoes) (you|you'?ve) (recommend|suggest|showed)|is it|are they|does it|will it|would it|from those|from the recs|from your recs)\b/i;
  const zh = /(那(双|些|几双|个|三双|款)|这(双|几双|些|款)|刚才|刚刚|之前|你(推荐|说|挑)|选的|挑出来|你给的)/;
  return en.test(q) || zh.test(q);
}

function filterProductsByCriterion(
  pool: Product[],
  q: string
): { filtered: Product[]; criterionApplied: boolean } {
  const low = q.toLowerCase();
  const WIDE = /wide\s*feet?|宽脚|肥脚|脚.{0,3}(宽|胖|肥)|(宽|胖|肥).{0,3}脚|脚掌宽|脚背宽|脚面宽|脚型宽/;
  const NARROW = /narrow\s*feet?|thin\s*feet?|瘦脚|脚.{0,3}瘦|窄脚|脚型瘦|脚窄|偏瘦|小脚/;
  let matched: Product[] | null = null;
  if (WIDE.test(low)) {
    matched = pickFromPool(pool, [
      "圆头",
      "rounded",
      "cap toe",
      "鞋带",
      "jumbo",
      "lace",
      "气眼",
    ]).slice(0, 3);
  } else if (NARROW.test(low)) {
    matched = pickFromPool(pool, ["窄楦", "收口", "包裹", "利落", "slim"]).slice(0, 3);
  } else if (/\bblack\b|黑色|全黑|黑的|黑款/.test(low)) {
    // "the black one" → 在上轮推荐里挑黑色款（含 colors 色卡名）
    const colorHay = (p: Product) =>
      `${p.features.join(" ")} ${p.description} ${p.material} ${(p.colors ?? [])
        .map((c) => c.name)
        .join(" ")}`.toLowerCase();
    matched = pool.filter((p) => /黑|black/.test(colorHay(p))).slice(0, 3);
  } else if (/\bwhite\b|白色|米白/.test(low)) {
    const colorHay = (p: Product) =>
      `${p.features.join(" ")} ${p.description} ${p.material} ${(p.colors ?? [])
        .map((c) => c.name)
        .join(" ")}`.toLowerCase();
    matched = pool.filter((p) => /白|white/.test(colorHay(p))).slice(0, 3);
  } else if (/waterproof|防水|防雨|防泼|rain|雨/.test(low)) {
    matched = pickFromPool(pool, ["亮面", "贴膜", "glossy", "patent", "金属感", "漆皮"]).slice(0, 3);
  } else if (/wash|clean|清洗|洗|机洗/.test(low)) {
    // 靴款不可机洗：命中为空 → 走诚实告知分支
    matched = pickFromPool(pool, ["可机洗", "机洗", "快干"]).slice(0, 3);
  } else if (/running|run|跑鞋|跑步|碳板|jog|walk|通勤|久走|舒服/.test(low)) {
    // 全靴子货盘：久走/跑步意图 → 直接在推荐池里按热度给最舒服的款
    matched = pool.slice(0, 3);
  } else if (/casual|everyday|commut|\bwork\b|休闲|日常|通勤|百搭/.test(low)) {
    // 高帮靴本就是休闲百搭款 → 整个池子都符合
    matched = pool.slice(0, 3);
  } else if (/outdoor|hik(e|ing)|trail|户外|登山|爬山|越野|徒步|防滑/.test(low)) {
    matched = pickFromPool(pool, ["厚底", "橡胶", "lug", "platform", "发泡", "大底"]).slice(0, 3);
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
  // 信息类问题（材质/护理/物流/退换）有专门场景回答，不要当成"在推荐池里筛款"
  if (
    /leather|genuine|真皮|材质|面料|material|wash|clean|清洗|怎么洗|护理|ship|delivery|shipping|tracking|物流|快递|到货|发货|订单|return|refund|exchange|退|换货/i.test(
      q
    )
  )
    return null;

  let ordered: Product[] = [];
  let criterionWasEmpty = false;

  const sortTest = q.toLowerCase();
  if (/cheapest|least expensive|便宜|最便宜|最划算/.test(sortTest)) {
    // 超级指代（"which is cheapest"）→ 只给那一双
    ordered = [...ctx.lastProducts].sort((a, b) => a.price - b.price).slice(0, 1);
  } else if (/most expensive|priciest|最贵/.test(sortTest)) {
    ordered = [...ctx.lastProducts].sort((a, b) => b.price - a.price).slice(0, 1);
  } else if (
    /best rated|top rated|highest rated|most reviews|好评|评分|评价最高/.test(sortTest)
  ) {
    ordered = [...ctx.lastProducts]
      .sort(
        (a, b) =>
          b.rating * Math.log10(b.reviews + 1) - a.rating * Math.log10(a.reviews + 1)
      )
      .slice(0, 1);
  } else {
    const result = filterProductsByCriterion([...ctx.lastProducts], q);
    if (result.criterionApplied) {
      // 条件筛选（颜色/脚型/场景）→ 聚焦上一轮池内，最多 2 双
      ordered = result.filtered.slice(0, 2);
      if (ordered.length === 0) criterionWasEmpty = true;
    } else {
      // 纯指代（"that one / this pair"）→ 围绕上一轮主推款（客户端展示顺序的第 1 张）回答，
      // 不按热度重排、不重铺 3 双
      ordered = [ctx.lastProducts[0]];
    }
  }

  if (criterionWasEmpty) {
    return {
      text: L(
        lang,
        "To be totally honest — none of the pairs I just recommended are specifically designed for that requirement 🤍 Wanna restart with a fresh search? I can pick something with a roomier fit or a glossier finish.",
        "实话实说哦 🤍 刚才推荐的那几双没有专门针对这个要求的款。要不我们换个条件重新挑？我可以帮你找版型更宽松、或者亮面一点的款～"
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
    ordered.length === 1
      ? "Out of the pairs I just showed you, this one fits best 👇"
      : `Out of the pairs I just showed you, these ${ordered.length} fit best 👇`,
    ordered.length === 1
      ? "我刚刚推荐的那几双里，这双最符合你的要求 👇"
      : `我刚刚推荐的那几双里，这 ${ordered.length} 双最符合你的要求 👇`
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
  // 货盘为全靴子：诚实 pivot 到"久走通勤也舒服"，主推 1 款不铺卡片
  const picks = heroPick(topRatedBoots(3), false);
  return {
    text: L(
      lang,
      `Honest note: we specialize in street-ready high-top boots rather than performance running shoes 👟 But for all-day comfort walking, commuting and travel, this is the pair we'd actually pack:\n${productList(picks, lang)}\n\nWant a couple more comfortable options? Just ask!`,
      `实话实说：我们家主打街头高帮靴，没有专业竞速跑鞋 👟 但如果是日常走路、通勤、旅行要一整天舒服，我们最推荐这一双：\n${productList(picks, lang)}\n\n想多看几双舒服的款，随时说一声～`
    ),
    products: picks,
  };
}

function sceneCasual(lang: Lang, many = false): AgentReply {
  const picks = many ? topRatedBoots(3) : heroPick(topRatedBoots(3), false);
  return {
    text: L(
      lang,
      many
        ? `Everyday comfort with a clean street look ✌️ Our high-top boots go with everything — jeans, cargos, tailored pants. Here are the most versatile picks:\n${productList(picks, lang)}`
        : `Everyday comfort with a clean street look ✌️ For commuting and everyday wear, this is the pair I'd bet on — it goes with jeans, cargos and tailored pants alike:\n${productList(picks, lang)}`,
      many
        ? `日常通勤、逛街都百搭 ✌️ 我们的高帮靴本来就是不挑穿搭的款，牛仔裤、工装裤、西裤都能配。给你挑了最百搭的几双：\n${productList(picks, lang)}`
        : `日常通勤、逛街都百搭 ✌️ 通勤和日常穿，我首推这一双——牛仔裤、工装裤、西裤都能配：\n${productList(picks, lang)}`
    ),
    products: picks,
  };
}

function sceneOutdoor(lang: Lang): AgentReply {
  // 无专业登山靴：厚底/齿花橡胶大底应付轻度户外；有明显备选最多给 2
  const attr = pickByAttr(["厚底", "橡胶", "lug", "platform", "发泡", "大底", "防滑"], 3).filter(
    (p) => p.category === "boots"
  );
  const picks = pickFocused(attr.length ? attr : topRatedBoots(3));
  return {
    text: L(
      lang,
      `We don't make technical hiking boots, but thick lug-sole and platform pairs grip wet city streets and handle light trails with ease 🥾 Here ${picks.length > 1 ? "are the two standouts" : "is my pick"}:\n${productList(picks, lang)}\n\nFor serious mountain hikes I'd point you to proper gear.`,
      `我们没有专业登山靴，但大齿花橡胶底/厚底的靴款应付湿冷城市路面和轻度户外完全没问题 🥾 最合适${picks.length > 1 ? "的两双" : "的一双"}：\n${productList(picks, lang)}\n\n真要进山重装徒步的话建议选专业装备～`
    ),
    products: picks,
  };
}

function sceneWideFeet(lang: Lang): AgentReply {
  // 靴款里挑圆头/鞋带可调/不挤脚的；有第二个明显匹配才给 2
  const attr = pickByAttr(["圆头", "rounded", "cap toe", "鞋带", "jumbo", "lace", "气眼", "加宽"], 3);
  const picks = pickFocused(attr.length ? attr : topRatedBoots(3));
  return {
    text: L(
      lang,
      `For wide feet, go half a size up and pick lace-up styles with a rounded toe — you can loosen the laces across the instep, and the side zip keeps them easy to slip on. ${picks.length > 1 ? "Two roomiest picks" : "My pick"}:\n${productList(picks, lang)}\n\nTell me your usual US size and I'll fine-tune it.`,
      `脚宽建议选大半码，挑圆头+系带款——脚背那几格鞋带可以放松，侧面还有拉链，穿脱也方便。最合适${picks.length > 1 ? "的两双" : "的一双"}：\n${productList(picks, lang)}\n\n告诉我你平时穿 US 几码，我帮你再精准筛一下～`
    ),
    products: picks,
  };
}

function sceneNarrowFeet(lang: Lang): AgentReply {
  // 窄楦/收口/包裹感靴款；有第二个明显匹配才给 2
  const attr = pickByAttr(["窄楦", "收口", "包裹", "利落", "slim", "高帮"], 3);
  const picks = pickFocused(attr.length ? attr : topRatedBoots(3));
  return {
    text: L(
      lang,
      `Narrow feet? Look for slim-last, higher-shaft pairs — they hug the ankle and heel so there's no slippage, and lacing one eyelet tighter dials in the fit. ${picks.length > 1 ? "Two best fits" : "My pick"}:\n${productList(picks, lang)}\n\nFree size exchange within 30 days if the fit feels off.`,
      `瘦脚推荐挑窄楦收口、靴筒略高的款——脚踝和后跟包裹住走路不掉跟，鞋带最上面一格系紧一点更贴合。最合适${picks.length > 1 ? "的两双" : "的一双"}：\n${productList(picks, lang)}\n\n不合适的话 30 天内免费换码，放心～`
    ),
    products: picks,
  };
}

function sceneWaterproof(lang: Lang, withIntent: boolean): AgentReply {
  // 合规：不承诺压胶防水；纯咨询不附卡，明确购买意图才推（最多 2）
  const attr = pickByAttr(["贴膜", "漆皮", "亮面", "patent", "glossy", "金属感", "金色", "抛光"], 3);
  const picks = withIntent
    ? attr.length
      ? pickFocused(attr)
      : heroPick(topRatedBoots(3), false)
    : [];
  return {
    text: L(
      lang,
      withIntent
        ? `Quick honesty ☔ our boots aren't seam-sealed rain boots, but the glossy PU and patent-finish uppers shrug off light drizzle and wipe clean in seconds. Glossiest picks for wet days:\n${productList(picks, lang)}`
        : `Quick honesty ☔ our boots aren't seam-sealed rain boots, but the glossy PU and patent-finish uppers shrug off light drizzle and wipe clean in seconds with a damp cloth. Want to see the glossiest pairs? Just say the word!`,
      withIntent
        ? `说实话哈 ☔ 咱们的靴子不是压胶雨靴，但亮面 PU / 漆皮质感的鞋面应付小雨、溅水完全没问题，湿布一擦就干净。最适合雨天的款：\n${productList(picks, lang)}`
        : `说实话哈 ☔ 咱们的靴子不是压胶雨靴，但亮面 PU / 漆皮质感的鞋面应付小雨、溅水完全没问题，湿布一擦就干净。想看最防泼水的亮面款，随时说一声～`
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
        "Great question! 💡 Our boots aren't machine-washable, but care is super easy: wipe the smooth PU or microfiber upper with a damp cloth and mild soap, then let them air dry away from heat. A synthetic-safe conditioner every now and then keeps the finish looking fresh.",
        "好问题！💡 咱们的靴子不能机洗，但护理超简单：湿布沾点温和肥皂擦 PU/超纤鞋面，放在远离热源的地方阴干就行。偶尔用合成材质专用护理剂擦一擦，质感能保持更久～"
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
      "For any pair, just spot clean with a damp cloth and mild soap — avoid soaking them.",
      "所有靴款都用湿布加温和肥皂擦局部就行，别整双泡水。"
    )
  );
  // 护理咨询 → 默认不附商品卡
  return { text: parts.join(" ") };
}

function sceneMaterial(lang: Lang): AgentReply {
  // 合规专线（赛题红线）：超纤/PU 不是真皮，被问"是不是皮/什么材质"必须正面诚实回答；
  // 材质是购买信任时刻 → 附 1 张主推款卡片
  const hero = heroBoot();
  return {
    text: L(
      lang,
      "Great question — totally fair to ask! 🌱 Our boots use microfiber (a premium synthetic) for the upper and lining — not genuine leather — with a durable rubber outsole. Microfiber is soft, breathable and a breeze to wipe clean. Here's our signature pair:",
      "好问题，这个必须说清楚！🌱 咱们靴子的鞋面和内里都是 microfiber（超纤，一种高品质合成材质），不是真皮哦；大底是耐磨橡胶。超纤柔软透气，脏了湿布一擦就干净。给你看主推款："
    ),
    products: hero ? [hero] : undefined,
  };
}

function sceneGift(lang: Lang): AgentReply {
  // 货盘 D 为传统男靴：礼物场景一双定音，主推 14534-H
  const picks = heroPick(topRatedBoots(3), false);
  return {
    text: L(
      lang,
      `Gift shopping for him? I got you 🎁 This is my safest pick — our signature style, basically a guaranteed win:\n${productList(picks, lang)}\n\nWant a couple of backups to compare? Just ask! Gift receipts available, 30-day returns.`,
      `挑礼物对不对？🎁 最稳的就是这双主推款，几乎不会踩雷：\n${productList(picks, lang)}\n\n想再对比一两双备选，随时说～可以开礼物收据，30 天还能退，完全没风险。`
    ),
    products: picks,
  };
}

function sceneUnder100(q: string, lang: Lang, many = false): AgentReply {
  const m = q.match(/\$?\s*(\d{2,3})\b/);
  const budget = m ? parseInt(m[1], 10) : 100;
  const inBudget = pickByMaxPrice(budget);
  const hero = heroBoot();
  const one = hero && hero.price <= budget ? [hero] : inBudget.slice(0, 1);
  const picks = many ? inBudget.slice(0, 3) : one;
  return {
    text: L(
      lang,
      many
        ? `All of these are under ${formatUSD(budget)} — no compromise on quality 💰\n${productList(picks, lang)}\n\nWant me to narrow by style — commuting or going out?`
        : `My pick under ${formatUSD(budget)} — no compromise on quality 💰\n${productList(picks, lang)}\n\nWant to see a few more options in this range? Just ask!`,
      many
        ? `这几双都在 ${formatUSD(budget)} 以内，品质完全不打折 💰\n${productList(picks, lang)}\n\n要不要再按风格限定一下？通勤款还是约会款？`
        : `${formatUSD(budget)} 以内我最推荐这一双，品质完全不打折 💰\n${productList(picks, lang)}\n\n想多看几双这个价位的，随时说～`
    ),
    products: picks.length ? picks : undefined,
  };
}

function sceneJeans(lang: Lang): AgentReply {
  // 靴子 + 牛仔裤是本货盘核心穿搭：主推 1 双
  const picks = heroPick(topRatedBoots(3), false);
  return {
    text: L(
      lang,
      `Boots and jeans are kind of our whole thing 👖 Baggy, straight or skinny — this chunky high-top with a cream rubber sole nails it every time:\n${productList(picks, lang)}`,
      `靴子配牛仔裤本来就是我们家的主场 👖 阔腿、直筒、紧身都能搭——这双厚底米白橡胶大底的高帮靴最出片：\n${productList(picks, lang)}`
    ),
    products: picks,
  };
}

function sceneDressUp(lang: Lang): AgentReply {
  // 赛题货盘 D 官方场景之一：约会/稍正式——极简黑 mono-boot 配西裤，主推 1 双
  const picks = heroPick(topRatedBoots(3), false);
  return {
    text: L(
      lang,
      `Dressing up? A clean black pair with tailored trousers is a sharp move for date night and smarter occasions ✨ This is the one:\n${productList(picks, lang)}`,
      `要穿正式一点？一双极简黑靴配西裤，约会、稍正式的场合都很撑场面 ✨ 就是这一双：\n${productList(picks, lang)}`
    ),
    products: picks,
  };
}

function sceneTravel(lang: Lang): AgentReply {
  // 赛题货盘 D 官方场景之一：短途旅行/出差——主推 1 双
  const picks = heroPick(topRatedBoots(3), false);
  return {
    text: L(
      lang,
      `Weekend trip or work travel? You want a pair that slips on easy, matches everything and feels fine after a full day of walking ✈️ This is my travel-ready pick:\n${productList(picks, lang)}`,
      `短途旅行或出差？穿脱方便、百搭、走一整天也不累最省心 ✈️ 我主推这一双：\n${productList(picks, lang)}`
    ),
    products: picks,
  };
}

function sceneShorts(lang: Lang): AgentReply {
  // 短裤/夏天：亮色/厚底街头感款（"金属"会误命中金属拉链，改用金属感/亮面）；最多 2
  const attr = pickByAttr(["黄", "全息", "statement", "platform", "街头", "撞色", "厚底", "亮橙", "亮面", "金属感"], 3);
  const picks = pickFocused(attr.length ? attr : topRatedBoots(3));
  return {
    text: L(
      lang,
      `Shorts + chunky boots is the summer street-style move ☀️ Go bold — ${picks.length > 1 ? "these two make the outfit" : "this one makes the outfit"}:\n${productList(picks, lang)}`,
      `短裤配厚底靴正是夏天的街头穿法 ☀️ 建议大胆一点——${picks.length > 1 ? "这两双" : "这一双"}最出片：\n${productList(picks, lang)}`
    ),
    products: picks,
  };
}

function sceneStudentDiscount(lang: Lang): AgentReply {
  const hero = heroBoot();
  return {
    text: L(
      lang,
      `Student perks 🎓 Use code STUDENT10 for 10% off your first order — just verify with your .edu email at checkout. Free shipping kicks in at $75, too!`,
      `学生党专属福利 🎓 结账时用 STUDENT10 立减 10%，用 .edu 邮箱验证一下就行～满 $75 还免运费！`
    ),
    products: hero ? [hero] : undefined,
  };
}

function sceneGenericDiscount(lang: Lang): AgentReply {
  const hero = heroBoot();
  return {
    text: L(
      lang,
      `Welcome deal just for you 🎁 Use code STRYDE15 at checkout for 15% OFF your first order. Spend $75+ and shipping is on the house. Here's our signature pair to use it on:`,
      `新客首单优惠来啦 🎁 结账输码 STRYDE15，立减 15%！满 $75 免运费。可以直接用在这双主推款上：`
    ),
    products: hero ? [hero] : undefined,
  };
}

/* =================================================================
 * 统一入口 agentReply(userMessage, context?) — 兼容旧单参调用
 * ================================================================= */

export function agentReply(userMessage: string, context: AgentContext = {}): AgentReply {
  const q = userMessage.toLowerCase();
  const lang = detectLang(userMessage);
  // 数量策略：明确"多看几双"（some / options / a few / 几双）才给 3 张，默认聚焦主推
  const many = wantsMany(q);

  /* 指代问句（基于上轮推荐过滤/排序）优先 */
  const contextual = tryContextReply(q, lang, context);
  if (contextual) return contextual;

  if (/student|校园|学生/.test(q)) return sceneStudentDiscount(lang);

  if (
    /(under|below|less\s*than|cheap|budget|低于|预算|以内|以下|不超过).*\$?\s*\d{2,3}|\$\s*\d{2,3}\s*(or\s*less|max|and\s*under|以下|以内)/.test(
      q
    ) ||
    /不超过?\s*\d{2,3}\s*(美?元|刀)/.test(q) ||
    /\d{2,3}\s*(美?元|刀|块)?\s*(以内|以下|左右|预算内)/.test(q)
  )
    return sceneUnder100(q, lang, many);

  if (/wide\s*feet?|宽脚|肥脚|脚.{0,3}(宽|胖|肥)|(宽|胖|肥).{0,3}脚|脚掌宽|脚背宽|脚面宽|脚型宽/.test(q))
    return sceneWideFeet(lang);
  if (/narrow\s*feet?|thin\s*feet?|瘦脚|脚.{0,3}瘦|窄脚|脚型瘦|脚窄|偏瘦|小脚/.test(q))
    return sceneNarrowFeet(lang);
  if (/waterproof|water\s*proof|water\s*resistant|防水|防雨|防泼/.test(q))
    // 纯咨询不附卡；明确购买意图（need / looking for / 想买…）才推
    return sceneWaterproof(
      lang,
      /need|look(?:ing)?\s*for|recommend|want|buy|\bget\b|帮我|推荐|想(买|要)|找(一)?双/.test(q)
    );
  if (/wash|clean|清洗|洗|cleanable|machine\s*wash/.test(q)) return sceneWashable(lang);
  // 材质/真皮专线：超纤不是真皮，必须正面诚实回答（赛题合规红线）
  if (/leather|genuine|真皮|皮的|是不是皮|什么皮|material|材质|面料|什么料|upper|lining|outsole|大底|鞋面/.test(q))
    return sceneMaterial(lang);
  if (/\bgift\b|present|birthday|送礼|礼物|圣诞|valentine|anniversary|男友|男朋友|老公|爸爸|父亲|boyfriend|husband|\bdad\b/.test(q))
    return sceneGift(lang);
  if (/\bjeans?\b|denim|牛仔裤/.test(q)) return sceneJeans(lang);
  if (/\bdress\b|skirt|裙子|连衣裙|\bdate\b|dating|night\s*out|dress\s*up|正装|西裤|约会|晚宴|formal/.test(q))
    return sceneDressUp(lang);
  if (/\bshorts?\b|短裤/.test(q)) return sceneShorts(lang);
  if (/travel|\btrip\b|旅行|出差|短途|旅游|机场|walking\s*all\s*day|久走|走路多/.test(q))
    return sceneTravel(lang);
  if (/running|run\s*shoes?|跑鞋|跑步鞋|马拉松|碳板|jogging/.test(q)) return sceneRunning(lang);
  if (/casual|everyday|commut|\bwork\b|日常|休闲|百搭|通勤/.test(q)) return sceneCasual(lang, many);
  if (/outdoor|hik(e|ing)|trail|户外|登山|爬山|越野|徒步/.test(q)) return sceneOutdoor(lang);

  // 泛推荐意图（"recommend a pair" / "help me pick" / "推荐一双"）→ 主推 1 款；
  // 用户要"多看几双"（recommend some / show me options）→ 3 款
  if (
    /\brecommend\b|\bpick\b|bestseller|best\s*seller|popular|show me|something for|looking for|推荐|挑一|挑双|来一双|想买|有什么(好|值得)|热门|爆款/.test(
      q
    )
  )
    return sceneCasual(lang, many);

  /* 保留原有 4 个逻辑（未删除，regex 已扩中文关键词） */
  if (/size|尺码|码数|fit|large|small|多大码|选码/.test(q)) return { text: sizingBilingual(lang) };
  if (/ship|delivery|deliver|shipping|\border\b|tracking|\btrack\b|asap|物流|快递|运费|多久|到货|发货|订单|催|什么时候|when\s*.*(arrive|ship|deliver)|到哪/.test(q))
    return { text: shippingBilingual(lang) };
  if (/return|refund|exchange|退|换|退货|换货/.test(q)) return { text: returnBilingual(lang) };
  if (/deal|discount|sale|便宜|优惠|code|coupon|promo|省钱|首单/.test(q))
    return sceneGenericDiscount(lang);

  const hits = searchProducts(q).slice(0, many ? 3 : 1);
  if (hits.length > 0) {
    return {
      text: L(
        lang,
        `Based on what you said, ${hits.length > 1 ? `these are my top ${hits.length} picks` : "this is my top pick"} 🤙\n${productList(hits, lang)}\n\nTap the card for full details — need me to narrow by price or size?`,
        `根据你说的，我挑了${hits.length > 1 ? `这 ${hits.length} 双最合适的` : "这双最合适的"} 🤙\n${productList(hits, lang)}\n\n点卡片可以看详情，要不要我再按价格或者尺码帮你缩一下？`
      ),
      products: hits,
    };
  }
  return {
    text:
      lang === "zh"
        ? "我可以帮你做这些 👢\n• 挑靴：通勤、约会、短途旅行、轻户外\n• 尺码、物流、退换货咨询\n• 优惠码和学生折扣\n\n试试问：\"配牛仔裤的靴子\" 或者 \"想送人，预算 100 美元\""
        : AGENT_PERSONA.fallbackHelp,
  };
}
