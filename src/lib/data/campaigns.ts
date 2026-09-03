import type { Campaign } from "@/lib/types";

/**
 * 广告投放活动 —— 模拟冷启动期各渠道数据
 * creativePrompt / creativeCopy 来自模块 B 素材工坊
 * 模块 D 负责看板与新建活动
 */
export const CAMPAIGNS: Campaign[] = [
  {
    id: "c01",
    name: "Cloud Knit Runner - Meta 兴趣定向",
    platform: "Meta",
    status: "active",
    budget: 150,
    spend: 132.4,
    impressions: 86400,
    clicks: 2160,
    conversions: 48,
    creativePrompt:
      "young woman running through city park at sunrise wearing white knit running sneakers, slow motion, lifestyle ad",
    creativeCopy: "Light enough to forget you're wearing them. 238g of pure comfort. Free shipping & 30-day trial.",
    startDate: "2026-08-26",
  },
  {
    id: "c02",
    name: "Urban Chunk 90 - TikTok 达人挑战",
    platform: "TikTok",
    status: "active",
    budget: 200,
    spend: 178.9,
    impressions: 214000,
    clicks: 6840,
    conversions: 57,
    creativePrompt:
      "gen z tiktok style outfit check video still, chunky cream dad sneakers with baggy jeans, neon lighting, vertical",
    creativeCopy: "POV: you found the sneakers all over your FYP. 4cm height boost included. #STRYDE",
    startDate: "2026-08-28",
  },
  {
    id: "c03",
    name: "Glide Carbon Pro - Google 搜索",
    platform: "Google",
    status: "active",
    budget: 120,
    spend: 96.2,
    impressions: 24800,
    clicks: 1190,
    conversions: 31,
    creativePrompt:
      "hyper orange carbon plate running shoe on dark track, speed lines, performance focused google shopping ad",
    creativeCopy: "Carbon plate performance without the $250 price tag. Glide Carbon Pro — $139, ship in 48h.",
    startDate: "2026-08-27",
  },
  {
    id: "c04",
    name: "Breeze Sandal - 夏季清仓测试",
    platform: "Meta",
    status: "paused",
    budget: 80,
    spend: 80,
    impressions: 64200,
    clicks: 980,
    conversions: 12,
    startDate: "2026-08-20",
  },
  {
    id: "c05",
    name: "Slip Ease - 差旅人群测试",
    platform: "TikTok",
    status: "draft",
    budget: 100,
    spend: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    startDate: "2026-09-04",
  },
];

/** 漏斗（近 14 天）—— 用于看板转化漏斗 */
export const FUNNEL = {
  visits: 48200,
  productViews: 19800,
  addToCart: 4210,
  checkout: 1680,
  orders: 1402,
};
