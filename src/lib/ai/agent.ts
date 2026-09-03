import { PRODUCTS } from "@/lib/data/catalog";
import type { Product } from "@/lib/types";

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

export function getSizingAdvice(): string {
  return "尺码建议：STRYDE 全部为标准美码（US size）。脚宽或介于两码之间，建议选大半码；飞织款（Cloud Knit / Slip Ease）包裹性强，正常码即可。下单后 30 天内免费换码，运费我们承担 👟";
}

export function getShippingInfo(): string {
  return "物流与售后：美国本土 48 小时内发货、3-5 个工作日送达，满 $75 免运费；加拿大/欧洲 7-10 天。支持 30 天无理由试穿，磨脚、不合脚直接退。";
}

export function getReturnInfo(): string {
  return "退换政策：签收后 30 天内，鞋子保持原状态可无理由全额退款；尺码不合适免费换码一次。退款在收到退货后 3 个工作日内原路退回。";
}

export function agentReply(userMessage: string): AgentReply {
  const q = userMessage.toLowerCase();

  if (/size|尺码|码数|fit|large|small/.test(q)) {
    return { text: getSizingAdvice() };
  }
  if (/ship|delivery|deliver|shipping|物流|快递|运费|多久|when/.test(q)) {
    return { text: getShippingInfo() };
  }
  if (/return|refund|exchange|退|换|refund/.test(q)) {
    return { text: getReturnInfo() };
  }
  if (/deal|discount|sale|便宜|优惠|code|coupon/.test(q)) {
    return {
      text: "新客福利 🎁 首单立减 15%，结账时输入码 STRYDE15。另外满 $75 美国境内免运费，现在入手 Cloud Knit Runner 正合适！",
      products: PRODUCTS.filter((p) => p.trend === "hot").slice(0, 2),
    };
  }

  const hits = searchProducts(q);
  if (hits.length > 0) {
    const list = hits
      .map((p) => `• ${p.name} — $${p.price}：${p.tagline}（${p.rating}★ / ${p.reviews} 条评价）`)
      .join("\n");
    return {
      text: `根据你的需求，我挑了 ${hits.length} 双最值得看的：\n${list}\n\n点击商品卡片可以看详情和真实买家秀。需要我按预算或尺码再筛一下吗？`,
      products: hits,
    };
  }

  return {
    text:
      "我是 STRYDE 的 AI 导购，可以帮你：\n• 按场景推荐鞋款（跑步 / 通勤 / 户外 / 夏日）\n• 解答尺码、物流、退换问题\n• 报上新客优惠码\n\n试试问我：\"I need shoes for daily running\" 或 \"有什么百搭的休闲鞋？\"",
  };
}
