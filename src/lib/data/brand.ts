import type { BrandKit } from "@/lib/types";

/**
 * 品牌资产 —— 模拟"白牌鞋厂"孵化出的海外 DTC 品牌
 * 模块 B 可在素材工坊里重新生成品牌名/slogan，改这里即可全站生效
 */
export const BRAND: BrandKit = {
  name: "STRYDE",
  slogan: "STAND UP. STAND OUT.",
  audience: "北美 22-35 岁城市通勤者与轻运动人群，注重设计感与性价比",
  voice: ["自信但不张扬", "轻松幽默", "直白讲利益点", "鼓励探索"],
  palette: [
    { name: "Ink 墨黑", hex: "#16130f" },
    { name: "Paper 暖纸白", hex: "#faf8f4" },
    { name: "Stone 石灰", hex: "#8a857e" },
    { name: "Taupe 暖灰褐", hex: "#b8b0a3" },
  ],
};

export const BRAND_STORY = [
  "STRYDE is a footwear brand built for the way your day moves.",
  "Our featured product is factory SKU 14534-H — a black minimalist ankle boot with microfiber upper & lining, rear zipper and rubber outsole.",
  "We use AI to compress the design, creative, media and retail workflow into a single demo timeline.",
  "Product and shipping details shown on this site are demo data. The 30-Day Guarantee on your first pair and the 15% first-pair offer are confirmed STRYDE policies.",
];

/**
 * STRYDE Ecosystem — copy hierarchy (spec §21).
 * One real SKU (14534-H) extended into a complete brand system.
 * DUO / CLIPS / CARE are not transaction-ready until supplier validation.
 */
export const ECOSYSTEM = {
  brand: "STAND UP.\nSTAND OUT.",
  system: "ONE BOOT.\nONE SYSTEM.",
  use: "ONE PAIR.\nMORE PLANS.",
  routines: "ONE BOOT.\nTHREE ROUTINES.",
  duo: "TWO PAIRS.\nONE ROTATION.",
  clips: "MAKE IT YOURS.",
  clipsCampaign: "SAME BOOT.\nYOUR DETAIL.",
  care: "KEEP THE ROUTE GOING.",
} as const;

/** STRYDE CLIPS — 4 concept collections (spec §5). Removable decorative clips on the 14534-H front loop. */
export const CLIP_COLLECTIONS = [
  {
    no: "01",
    slug: "signature",
    name: "SIGNATURE",
    desc: "STRYDE-branded marks designed around the brand wordmark.",
    samples: ["S", "STRYDE", "STAND OUT"],
    images: {
      S: "/clips/collections/signature/S.jpg",
      STRYDE: "/clips/collections/signature/STRYDE.jpg",
      "STAND OUT": "/clips/collections/signature/STAND-OUT.jpg",
    },
  },
  {
    no: "02",
    slug: "mono",
    name: "MONO",
    desc: "Minimal graphic symbols in black, graphite and silver-tone.",
    samples: [">", "≡", "◯", "▭"],
    images: {
      ">": "/clips/collections/mono/greater.png",
      "≡": "/clips/collections/mono/equal.png",
      "◯": "/clips/collections/mono/circle.jpg",
      "▭": "/clips/collections/mono/square.jpg",
    },
  },
  {
    no: "03",
    slug: "personal",
    name: "PERSONAL",
    desc: "Choose your initial — a quiet, personal signature.",
    samples: ["A", "F", "M", "S"],
    images: {},
  },
  {
    no: "04",
    slug: "city",
    name: "CITY",
    desc: "City-inspired text identity. No official logos or trademarks.",
    samples: ["NYC", "LDN", "TYO"],
    images: {
      LDN: "/clips/collections/city/LDN.jpg",
      NYC: "/clips/collections/city/NYC.png",
      TYO: "/clips/collections/city/TYO.jpg",
    },
  },
] as const;

/** Customer-facing status labels for concept-stage extensions (spec §1). */
export const STATUS = {
  available: "AVAILABLE",
  comingSoon: "COMING SOON",
  inDevelopment: "IN DEVELOPMENT",
  designPreview: "DESIGN PREVIEW",
  validationPending: "SUPPLIER VALIDATION PENDING",
} as const;

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
