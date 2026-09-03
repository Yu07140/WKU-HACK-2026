/* ------------------------------------------------------------------
 * 全局类型定义 —— 鞋类供应链 DTC 数据模型
 * 四个模块共同依赖，修改字段前请先在群里同步（见 README 分工约定）
 * ------------------------------------------------------------------ */

export type Category = "running" | "lifestyle" | "canvas" | "sandals";

export const CATEGORY_LABELS: Record<Category, string> = {
  running: "Running 跑鞋",
  lifestyle: "Lifestyle 休闲",
  canvas: "Canvas 帆布鞋",
  sandals: "Sandals 凉鞋",
};

export interface ProductColor {
  name: string;
  hex: string;
  /** 该配色对应的 AIGC 出图 prompt */
  imagePrompt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: Category;
  /** 零售价（USD，面向海外消费者） */
  price: number;
  compareAt?: number;
  /** 工厂出厂价（USD，供应链成本） */
  factoryCost: number;
  /** 起订量 MOQ */
  moq: number;
  /** 打样/生产周期（天） */
  leadTimeDays: number;
  colors: ProductColor[];
  /** 美码 US sizes */
  sizes: number[];
  material: string;
  weight: string;
  description: string;
  features: string[];
  /** 主图 AIGC prompt */
  imagePrompt: string;
  /** 选款热度 0-100（AI 综合广告点击/加购/搜索趋势） */
  heatScore: number;
  trend: "hot" | "rising" | "new" | "steady";
  stock: number;
  rating: number;
  reviews: number;
  createdAt: string;
}

export type OrderChannel = "direct" | "meta" | "tiktok" | "google";
export type OrderStatus = "paid" | "fulfilled" | "shipped" | "delivered";

export interface Order {
  id: string;
  date: string;
  customer: string;
  email: string;
  country: string;
  productId: string;
  productName: string;
  color: string;
  size: number;
  qty: number;
  amount: number;
  channel: OrderChannel;
  status: OrderStatus;
}

export interface Campaign {
  id: string;
  name: string;
  platform: "Meta" | "TikTok" | "Google";
  status: "active" | "paused" | "draft";
  /** 日预算 USD */
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  /** 关联的 AIGC 创意 prompt 与文案（素材工坊产出） */
  creativePrompt?: string;
  creativeCopy?: string;
  startDate: string;
}

export interface BrandKit {
  name: string;
  slogan: string;
  audience: string;
  voice: string[];
  palette: { name: string; hex: string }[];
}

/** 购物车条目 */
export interface CartItem {
  productId: string;
  productName: string;
  slug: string;
  color: string;
  size: number;
  price: number;
  qty: number;
  imagePrompt: string;
}
