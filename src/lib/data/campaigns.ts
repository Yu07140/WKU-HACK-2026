import type { Campaign } from "@/lib/types";

/**
 * 广告投放活动 —— 模拟冷启动期各渠道数据
 * creativePrompt / creativeCopy 来自模块 B 素材工坊
 * 模块 D 负责看板与新建活动
 */
export const CAMPAIGNS: Campaign[] = [
  {
    id: "c01",
    name: "No. 5910-5 Orange - Meta 兴趣定向",
    platform: "Meta",
    status: "active",
    budget: 150,
    spend: 132.4,
    impressions: 86400,
    clicks: 2160,
    conversions: 48,
    creativePrompt:
      "gen z street style photo, bright orange high top fashion boots with jumbo laces and chunky cream sole, city street at golden hour, lifestyle ad",
    creativeCopy: "The boot that sells itself. Factory-direct, side zip, $89 shipped. (Demo creative — not verified claims.)",
    startDate: "2026-08-26",
  },
  {
    id: "c02",
    name: "No. 5910-5 - TikTok 达人挑战",
    platform: "TikTok",
    status: "active",
    budget: 200,
    spend: 178.9,
    impressions: 214000,
    clicks: 6840,
    conversions: 57,
    creativePrompt:
      "gen z tiktok style outfit check video still, chunky high top boots with baggy jeans, neon lighting, vertical",
    creativeCopy: "POV: you found the boots all over your FYP. 4cm height boost + side zip included. #STRYDE",
    startDate: "2026-08-28",
  },
  {
    id: "c03",
    name: "No. 9525 Holographic - Google 搜索",
    platform: "Google",
    status: "active",
    budget: 120,
    spend: 96.2,
    impressions: 24800,
    clicks: 1190,
    conversions: 31,
    creativePrompt:
      "holographic iridescent high top fashion boot on dark studio background, color shifting purple blue reflections, premium shopping ad",
    creativeCopy: "Holographic boots that break the algorithm — $98, factory direct. (Demo creative — not verified claims.)",
    startDate: "2026-08-27",
  },
  {
    id: "c04",
    name: "No. 8801 - 入门款转化测试",
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
    name: "No. 5960 Lemon Drop - 新色测试",
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

/** 漏斗（近 14 天）—— 用于看板转化漏斗，与订单表数量保持一致（17 单） */
export const FUNNEL = {
  visits: 1200,
  productViews: 520,
  addToCart: 130,
  checkout: 41,
  orders: 17,
};
