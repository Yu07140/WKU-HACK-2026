/** 轻量 className 合并 */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------
 * 脚手架占位模式
 * true = 组委会真实货盘（商品名/价格/图片）尚未接入，
 *        全站名称显示 "?????"、价格显示 "$???"、图片显示灰色占位块
 * 2026-09-04：3 个真实供应商 SKU（11295-J / 14534-H / 53125-J）已接入，
 * 按约定切换为 false，全站恢复真实展示（真实实拍图优先，其余走 AIGC）
 * ------------------------------------------------------------------ */
export const PLACEHOLDER_MODE = false;

export const PH_NAME = "?????";

/** 名称占位：占位模式下统一返回 "?????"，否则返回真实文案 */
export function ph(real: string) {
  return PLACEHOLDER_MODE ? PH_NAME : real;
}

export function formatUSD(n: number) {
  return PLACEHOLDER_MODE ? "$???" : `$${n.toFixed(2)}`;
}

export function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

/**
 * 从 material 字符串解析 Upper / Lining / Outsole。
 * 供应商 SKU 格式："Upper: microfiber · Lining: microfiber · Outsole: rubber（供应商已验证字段）"
 * Lanhe 货盘格式："PU Leather" / "PU Leather（金属贴膜）" —— 整体作为 upper 返回
 */
export function parseMaterial(
  material: string,
  part: "upper" | "lining" | "outsole"
): string {
  const lower = material.toLowerCase();
  const map: Record<string, string> = { upper: "", lining: "", outsole: "" };
  const pairs = material.split(/·|;|；/).map((s) => s.trim());
  for (const p of pairs) {
    const m = p.match(/^(upper|lining|outsole)[::]\s*(.+)/i);
    if (m) {
      const key = m[1].toLowerCase();
      map[key] = m[2].replace(/（.*?）|\(.*?\)/g, "").trim();
    }
  }
  if (map.upper || map.lining || map.outsole) {
    return map[part] || "—";
  }
  // Lanhe 格式：整串作为 upper
  if (part === "upper") return material.replace(/（.*?）|\(.*?\)/g, "").trim();
  return "—";
}
