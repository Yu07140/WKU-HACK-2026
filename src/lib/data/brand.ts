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
  "STRYDE 由 Lanhe International 工厂直供——一家为全球品牌做 OEM/ODM 的冷粘鞋厂。",
  "同样的鞋楦、同样的 PU 皮、同样的冷粘产线，过去只能贴着别人的 logo 漂洋过海。",
  "今天我们用 AI 把设计、素材、投放和零售的链路压缩到几天——",
  "工厂直达你的脚下，没有中间商，没有溢价。",
];

/** 供货工厂（货盘来源：Lanhe Product Collection 2026） */
export const MANUFACTURER = {
  name: "Lanhe International",
  title: "OEM / ODM Footwear Manufacturer",
  category: "Casual Boots",
  construction: "Cold Bonding 冷粘工艺",
  mainMaterial: "PU Leather",
  moq: 300,
  leadTimeDays: 25,
};
