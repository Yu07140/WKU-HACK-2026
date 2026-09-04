import { PRODUCTS, getProductById } from "@/lib/data/catalog";
import type { Product } from "@/lib/types";
import { ph, formatUSD } from "@/lib/utils";

/* ------------------------------------------------------------------
 * AI 导购 Agent —— 端侧轻量规则引擎 + 商品检索（RAG 雏形）
 * 零 API Key 也能完整演示；模块 C 可替换为 LLM function-calling，
 * 工具签名保持：searchProducts / getSizingAdvice / getShippingInfo
 * ------------------------------------------------------------------ */

export interface AgentReply {
  text: string;
  /** 回复中引用到的商品（前端可渲染商品卡片） */
  products?: Product[];
}

/** 14534-H 官方已验证事实 */
const HERO_FACTS =
  "主推款 SKU 14534-H：黑色极简踝靴，后拉链，鞋舌附近横向平行装饰线，浅棕色内里。" +
  "鞋面 microfiber（超迁），内里 microfiber，大底 rubber（橡胶）。" +
  "尺码 EU 38–46。适用场景：通勤、商务休闲、约会、短途城市出行、轻户外。" +
  "面料不是真皮。";

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  const kw: Record<string, string[]> = {
    running: ["run", "running", "jog", "marathon", "跑鞋", "跑步", "碳板", "carbon"],
    lifestyle: ["chunky", "dad", "retro", "court", "潮流", "休闲", "老爹", "复古"],
    boots: ["boot", "ankle boot", "靴子", "踝靴", "通勤", "business", "casual"],
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
  // 14534-H 始终优先
  const hero = getProductById("boot-14534-h");
  if (hero && !hits.some((h) => h.id === hero.id)) {
    hits = [hero, ...hits];
  }
  return hits.slice(0, 3);
}

export function getSizingAdvice(): string {
  return (
    "The 14534-H comes in EU sizes 38–46. If you're between two sizes or have a wider foot, I'd go half a size up — the rear zipper makes them easy to get on and off. The full size guide is under /size-guide if you want to measure first."
  );
}

export function getShippingInfo(): string {
  return (
    "International shipping cost and delivery time depend on where you are. We'll show the final estimate at checkout once the destination is confirmed."
  );
}

export function getReturnInfo(): string {
  return (
    "Our return policy is being finalized before live sales. I can't promise specific return windows or shipping terms yet, but I'd check the FAQ for the latest wording."
  );
}

export interface AgentReplyContext {
  lastProducts?: Product[];
}

export function agentReply(userMessage: string, ctx?: AgentReplyContext): AgentReply {
  const q = userMessage.toLowerCase();
  const lastProducts = ctx?.lastProducts ?? [];

  // 多轮指代：用户问 "which one / 那双 / 哪个" 且有上一轮推荐，直接回传
  if (/which one|that one|the one|那双|那个|哪个|this one/.test(q) && lastProducts.length) {
    const list = lastProducts
      .map((p) => `• ${ph(p.name)} — ${formatUSD(p.price)}：${p.tagline}`)
      .join("\n");
    return {
      text: `你上一轮看的这 ${lastProducts.length} 双：\n${list}\n\n需要我详细介绍其中哪一双吗？`,
      products: lastProducts,
    };
  }

  // 真皮相关：诚实回答（自然语气）
  if (/leather|真皮|皮的|是不是皮|genuine leather|real leather/.test(q)) {
    return {
      text:
        "It's microfiber rather than genuine leather. The official supplier spec lists a microfiber upper and lining.",
      products: [getProductById("boot-14534-h")].filter(Boolean) as Product[],
    };
  }

  // 穿搭建议
  if (/wear|style|搭配|穿什么|outfit|what to|styling/.test(q)) {
    return {
      text:
        "For a sharper look, try straight black or charcoal trousers. For weekends, dark denim works well too.",
      products: [getProductById("boot-14534-h")].filter(Boolean) as Product[],
    };
  }

  // 美码换算：诚实回答
  if (/us size|us 码|美码|us conversion|us 换算/.test(q)) {
    return {
      text:
        "The supplier currently confirms EU sizes 38–46. I'd confirm the US conversion before ordering.",
      products: [getProductById("boot-14534-h")].filter(Boolean) as Product[],
    };
  }

  if (/size|尺码|码数|fit|large|small/.test(q)) {
    return { text: getSizingAdvice() };
  }
  if (/ship|delivery|deliver|shipping|物流|快递|运费|多久|when/.test(q)) {
    return { text: getShippingInfo() };
  }
  if (/return|refund|exchange|退|换|refund/.test(q)) {
    return { text: getReturnInfo() };
  }
  if (/14534|主推|hero|primary|main|旗舰|the boot/.test(q)) {
    return {
      text:
        "The 14534-H is a clean black ankle boot — rear zipper, microfiber upper and lining, rubber outsole. Sizes EU 38–46. It's our flagship style.",
      products: [getProductById("boot-14534-h")].filter(Boolean) as Product[],
    };
  }
  if (/material|材质|面料|upper|lining|outsole|什么料/.test(q)) {
    return { text: "Upper and lining are microfiber, outsole is rubber." };
  }
  if (/deal|discount|sale|便宜|优惠|code|coupon/.test(q)) {
    return {
      text:
        "New customers get 15% off with code STRYDE15 at checkout. I'd start with the 14534-H — it's our most versatile pair.",
      products: [getProductById("boot-14534-h")].filter(Boolean) as Product[],
    };
  }

  const hits = searchProducts(q);
  if (hits.length > 0) {
    const list = hits
      .map((p) => `• ${ph(p.name)} — ${formatUSD(p.price)}: ${p.tagline}`)
      .join("\n");
    return {
      text: `Here are a few pairs worth a look:\n${list}\n\nWant me to narrow it down by size or budget?`,
      products: hits,
    };
  }

  return {
    text:
      "I can help with sizing, styling, materials, shipping and returns. The 14534-H is a good place to start if you're browsing. What are you looking for?",
  };
}
