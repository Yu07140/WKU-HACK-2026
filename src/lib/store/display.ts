import type { Product } from "@/lib/types";

/**
 * 商品展示适配层 —— 角色 1 专属
 *
 * 为什么需要这一层？
 * catalog.ts 里 p01-p10 是工厂原始货盘（SKU 名 "No. 5910-5"、中文 tagline/description/features）。
 * 直接展示给美国消费者不合适，但 catalog 是公共数据不能改。
 * 所以在这里做一层"防御性英文适配"，等角色 4 把 catalog 文案翻成英文后，这里会自动透传真名。
 *
 * 规则：
 * - 检测到中文字符 → 用英文 fallback
 * - 纯英文 → 直接透传
 * - 商品名 "No. XXXX" → 生成品牌风格英文名
 */

const CN_REGEX = /[\u4e00-\u9fff]/;

export function hasChinese(text: string): boolean {
  return CN_REGEX.test(text);
}

/** 展示用商品名：工厂型号 → 品牌英文名 */
export function displayName(p: Product): string {
  const name = p.name?.trim() ?? "";
  return displayNameString(name, p.model);
}

/** 字符串版本：供购物车/结账等只存了 productName 的地方用 */
export function displayNameString(name: string, model?: string): string {
  const n = name?.trim() ?? "";
  // 纯英文且不是 "No. XXXX" 直接用
  if (!hasChinese(n) && !/^No\.\s*\d/i.test(n)) {
    return n;
  }
  // "No. 5910-5" → "STRYDE 5910-5 Boot"
  if (/^No\.\s*([\w-]+)/i.test(n)) {
    const m = n.match(/^No\.\s*([\w-]+)/i)?.[1] ?? model;
    return `STRYDE ${m} Boot`;
  }
  // 含中文 → 用 model
  if (hasChinese(n)) {
    return model ? `STRYDE ${model} Boot` : "STRYDE Boot";
  }
  return n;
}

/** 展示用 tagline：中文 → 英文 fallback */
export function displayTagline(p: Product): string {
  const tagline = p.tagline ?? "";
  if (!hasChinese(tagline)) return tagline;

  // 根据第一个颜色名 + category 生成一个简洁英文 tagline
  const color = p.colors[0]?.name ?? "";
  const lower = tagline.toLowerCase();

  // 尝试从中文 tagline 里提取关键词（简单匹配）
  if (lower.includes("金") || color.toLowerCase().includes("gold")) return "Gloss after dark.";
  if (lower.includes("全息") || lower.includes("幻彩") || color.toLowerCase().includes("hologram")) return "One shoe, every color.";
  if (lower.includes("柠檬") || lower.includes("黄") || color.toLowerCase().includes("yellow")) return "Seen before bought.";
  if (lower.includes("黑白") || color.toLowerCase().includes("white")) return "Half night, half day.";
  if (lower.includes("拉链")) return "On and off in three seconds.";
  if (lower.includes("厚底") || lower.includes("加厚")) return "Taller. Bolder. Unmissable.";
  if (lower.includes("简约") || lower.includes("极简")) return "Strip down to the shape.";
  if (lower.includes("经典") || lower.includes("出货量")) return "The factory's most-loved pair.";

  return "Bold silhouettes, factory-direct.";
}

/** 展示用 description：中文 → 英文 fallback */
export function displayDescription(p: Product): string {
  const desc = p.description ?? "";
  if (!hasChinese(desc)) return desc;

  // 用 material + construction 拼一段英文描述
  const material = (p.material ?? "PU leather").split(/[（(]/)[0].trim();
  const sole = p.features?.find((f) => /底|sole/i.test(f))
    ? "chunky cream rubber sole"
    : "chunky rubber sole";

  const colorCount = p.colors.length;
  const colorWord = colorCount === 1 ? "one signature colorway" : `${colorCount} colorways`;

  return `A ${material.toLowerCase()} high-top boot with side zipper, jumbo laces, and ${sole}. Built on the same last as our best sellers — available in ${colorWord}. Factory-direct pricing with no middleman markup.`;
}

/** 展示用 features：中文 → 英文 fallback 列表 */
export function displayFeatures(p: Product): string[] {
  const feats = p.features ?? [];
  // 如果已经有英文 feature，过滤掉中文的只留英文
  const english = feats.filter((f) => !hasChinese(f));
  if (english.length > 0) return english;

  // 全中文 → 用通用英文卖点
  const base = [
    "Premium PU leather upper with cold-bonding construction",
    "Inner side zipper — easy on and off",
    "Chunky cream rubber outsole, ~3cm lift",
    "Jumbo laces with metal eyelets",
    "Unisex sizing, US 5–12",
  ];

  // 根据商品特征微调
  const custom: string[] = [];
  if (p.colors.length > 3) custom.push(`${p.colors.length} colorways in stock`);
  if (/金|gold/i.test(p.tagline + p.material)) custom.push("Metallic finish catches the light");
  if (/全息|幻彩|hologram/i.test(p.tagline + p.material)) custom.push("Iridescent film shifts color with every angle");
  if (/厚底|加厚|platform/i.test(p.tagline + p.imagePrompt)) custom.push("Extra-thick platform sole for height");
  if (/简约|极简|minimal/i.test(p.tagline + p.imagePrompt)) custom.push("Clean, minimalist lines — zero extra detail");
  if (/拉链|zipper/i.test(p.tagline)) custom.push("Full-length side zipper for fast on/off");

  return custom.length > 0 ? [...custom, ...base.slice(0, 5 - custom.length)] : base;
}

/** 展示用材质：中文备注去掉，只留英文材质名 */
export function displayMaterial(material: string | undefined): string {
  if (!material) return "—";
  // "PU Leather（Black Canvas 配色为帆布）" → "PU Leather"
  const cleaned = material.split(/[（(]/)[0].trim();
  return cleaned || material;
}

/** 展示用重量：中文去掉，只留数值+单位 */
export function displayWeight(weight: string | undefined): string {
  if (!weight || weight === "TBD") return weight ?? "—";
  // "约 0.92 kg / 双" → "0.92 kg / pair"
  const match = weight.match(/([\d.]+)\s*(kg|g)/i);
  if (match) return `${match[1]} ${match[2].toLowerCase()} / pair`;
  return weight;
}
