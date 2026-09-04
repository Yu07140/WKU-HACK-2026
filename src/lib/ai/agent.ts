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
    "尺码建议：主推款 14534-H 为欧码 EU 38–46。" +
    "其他 Lanhe 货盘款式为美码 US，详情页有标注。" +
    "脚宽或介于两码之间，建议选大半码。后拉链款穿脱方便。" +
    "具体请看 /size-guide 的 EU/US/UK/CM 对照表和脚长测量方法。" +
    "（我们不保证具体脚型适配，尺码偏好因人而异。）"
  );
}

export function getShippingInfo(): string {
  return (
    "The international delivery estimate has not yet been confirmed for this supplier route.\n" +
    "Final shipping cost and delivery estimate depend on the destination and logistics method."
  );
}

export function getReturnInfo(): string {
  return (
    "退换政策（Demo）：这是演示店铺，正式退换政策会在真实销售前确定。" +
    "目前不承诺具体退换时效或运费承担方式。"
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

  // 真皮相关：诚实回答（精确措辞）
  if (/leather|真皮|皮的|是不是皮|genuine leather|real leather/.test(q)) {
    return {
      text:
        "No. The official supplier specification lists a microfiber upper.\n\n" +
        HERO_FACTS,
      products: [getProductById("boot-14534-h")].filter(Boolean) as Product[],
    };
  }

  // 美码换算：诚实回答
  if (/us size|us 码|美码|us conversion|us 换算/.test(q)) {
    return {
      text:
        "The official supplier material currently confirms EU sizes 38–46. " +
        "I would confirm the US conversion before ordering.",
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
  if (/14534|主推|hero|primary|主推广/.test(q)) {
    return {
      text: HERO_FACTS + " 工厂价 RMB 98/双，国内券后控价 RMB 148/双（参考）。",
      products: [getProductById("boot-14534-h")].filter(Boolean) as Product[],
    };
  }
  if (/material|材质|面料|upper|lining|outsole|什么料/.test(q)) {
    return { text: HERO_FACTS };
  }
  if (/deal|discount|sale|便宜|优惠|code|coupon/.test(q)) {
    return {
      text:
        "新客福利 🎁 首单立减 15%，结账时输入码 STRYDE15（Demo 优惠码）。" +
        "推荐先看主推款 14534-H。",
      products: [getProductById("boot-14534-h")].filter(Boolean) as Product[],
    };
  }

  const hits = searchProducts(q);
  if (hits.length > 0) {
    const list = hits
      .map((p) => `• ${ph(p.name)} — ${formatUSD(p.price)}：${p.tagline}`)
      .join("\n");
    return {
      text: `根据你的需求，我挑了 ${hits.length} 双最值得看的：\n${list}\n\n点击商品卡片可以看详情。需要我按预算或尺码再筛一下吗？`,
      products: hits,
    };
  }

  return {
    text:
      "我是 STRYDE 的 AI 导购，可以帮你：\n" +
      "• 推荐主推款 14534-H（通勤、商务休闲、约会）\n" +
      "• 解答尺码、物流、退换问题\n" +
      "• 说明材质（14534-H 是 microfiber，不是真皮）\n" +
      "• 报上新客优惠码\n\n" +
      '试试问我："14534-H 是什么材质？" 或 "通勤穿哪双？"',
  };
}
