import type { BrandKit } from "@/lib/types";

/**
 * 品牌资产 —— 模拟"白牌鞋厂"孵化出的海外 DTC 品牌
 * 模块 B 可在素材工坊里重新生成品牌名/slogan，改这里即可全站生效
 */
export const BRAND: BrandKit = {
  name: "STRYDE",
  slogan: "Step Beyond. — 每一步，都跨向更远的地方",
  audience: "北美 22-35 岁城市通勤者与轻运动人群，注重设计感与性价比",
  voice: ["自信但不张扬", "轻松幽默", "直白讲利益点", "鼓励探索"],
  palette: [
    { name: "Vermilion 朱红", hex: "#ff4d24" },
    { name: "Paper 暖纸白", hex: "#faf8f4" },
    { name: "Ink 墨黑", hex: "#16130f" },
    { name: "Sage 鼠尾草绿", hex: "#3f5d4b" },
  ],
};

export const BRAND_STORY = [
  "STRYDE is a hackathon demo of a factory-direct footwear brand.",
  "Our featured product is factory SKU 14534-H — a black minimalist ankle boot with microfiber upper & lining, rear zipper and rubber outsole.",
  "We use AI to compress the design, creative, media and retail workflow into a single demo timeline.",
  "Pricing, shipping and policies shown on this site are demo data, not verified operational commitments.",
];

/** 供货工厂（货盘来源：Lanhe Product Collection 2026） */
export const MANUFACTURER = {
  name: "Lanhe International",
  title: "OEM / ODM Footwear Manufacturer",
  category: "Casual Boots",
  construction: "Cold Bonding 冷粘工艺",
  mainMaterial: "Varies by SKU — 14534-H is microfiber upper & lining; Lanhe styles are PU leather",
  moq: 300,
  leadTimeDays: 25,
};
