/* ------------------------------------------------------------------
 * 全局类型定义 —— 鞋类供应链 DTC 数据模型
 * 四个模块共同依赖，修改字段前请先在群里同步（见 README 分工约定）
 * ------------------------------------------------------------------ */

export type Category = "boots" | "running" | "lifestyle" | "canvas" | "sandals";

export const CATEGORY_LABELS: Record<Category, string> = {
  boots: "Boots 靴子",
  running: "Running 跑鞋",
  lifestyle: "Lifestyle 休闲",
  canvas: "Canvas 帆布鞋",
  sandals: "Sandals 凉鞋",
};

export interface ProductColor {
  name: string;
  hex: string;
  /** 该配色对应的 AIGC 出图 prompt（素材工坊用） */
  imagePrompt: string;
  /** 真实货盘照片（public 目录下路径），无则走 AIGC 占位 */
  image?: string;
<<<<<<< HEAD
  /** 真实供应商照片（可选）。存在时前台优先展示实拍图 */
=======
  /** 真实供应商实拍图（可选）。存在时前台优先展示实拍图 */
>>>>>>> b9de0bfad5ffa5d8acbf9d490a21771c14b14810
  realImage?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: Category;
  /** 工厂货盘型号（如 5910-5，来自组委会货盘 PDF） */
  model?: string;
  /** 工艺（如 Cold Bonding 冷粘） */
  construction?: string;
  /** 真实货盘主图（public 目录下路径） */
  image?: string;
  /** 真实货盘图库（主图+正面图…） */
  images?: string[];
<<<<<<< HEAD
  /** 供应商原始 SKU（真实货盘商品必填，如 "11295-J"） */
  sku?: string;
=======
>>>>>>> b9de0bfad5ffa5d8acbf9d490a21771c14b14810
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
  /** 尺码制式，缺省为美码 US；真实供应商货盘可能为欧码 EU */
  sizeSystem?: "US" | "EU";
  /** 真实供应商主图（白底实拍，可选）。存在时前台优先展示实拍图 */
  heroImage?: string;
  /** 定价未经核实，仅为演示价（前台显著标注 Demo Pricing） */
  demoPricing?: boolean;
  /** 素材工坊专用：按风格 id 预置的产品级出图 prompt（可选） */
  creativePresets?: Record<string, string>;
  material: string;
  weight: string;
  description: string;
  features: string[];
  /** 主图 AIGC prompt */
  imagePrompt: string;
<<<<<<< HEAD
=======
  /** 供应商货号（如 11295-J，独立供应商 SKU 专用） */
  sku?: string;
>>>>>>> b9de0bfad5ffa5d8acbf9d490a21771c14b14810
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
  /** 尺码制式（US/EU），缺省 US（与 Product.sizeSystem 对应） */
  sizeSystem?: "US" | "EU";
  price: number;
  qty: number;
  imagePrompt: string;
  /** 真实货盘照片（可选） */
  image?: string;
<<<<<<< HEAD
  /** 真实商品图（可选），购物车/结账优先展示 */
=======
  /** 真实供应商实拍图（可选），购物车/结账优先展示 */
>>>>>>> b9de0bfad5ffa5d8acbf9d490a21771c14b14810
  realImage?: string;
}
