/** 轻量 className 合并 */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------
 * 脚手架占位模式
 * true = 组委会真实货盘（商品名/价格/图片）尚未接入，
 *        全站名称显示 "?????"、价格显示 "$???"、图片显示灰色占位块
 * 拿到真实数据填入 lib/data/catalog.ts 后，把这里改成 false 即可恢复
 * ------------------------------------------------------------------ */
export const PLACEHOLDER_MODE = true;

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
