import type { Product } from "@/lib/types";

/**
 * 标准化鞋类供应链样本数据（组委会货盘的数字化版本）
 * price = 海外零售价 | factoryCost = 出厂价 | moq = 起订量
 * heatScore = AI 选款模型综合热度（广告点击/加购/搜索趋势）
 */
export const PRODUCTS: Product[] = [
  {
    id: "p01",
    slug: "cloud-knit-runner",
    name: "Cloud Knit Runner",
    tagline: "一整片飞织，轻到忘记穿鞋",
    category: "running",
    price: 89,
    compareAt: 119,
    factoryCost: 22,
    moq: 500,
    leadTimeDays: 21,
    colors: [
      {
        name: "Cloud White",
        hex: "#f2f0ec",
        imagePrompt:
          "a single minimalist white knit running sneaker, one piece flyknit upper, white sole",
      },
      {
        name: "Vermilion",
        hex: "#ff4d24",
        imagePrompt:
          "a single vermilion red knit running sneaker, one piece flyknit upper, white sole",
      },
      {
        name: "Stone Grey",
        hex: "#8a8784",
        imagePrompt:
          "a single stone grey knit running sneaker, one piece flyknit upper, dark sole",
      },
    ],
    sizes: [6, 7, 8, 9, 10, 11, 12],
    material: "飞织鞋面 + 高弹 EVA 中底 + 橡胶防滑片",
    weight: "238g (US 9)",
    description:
      "Cloud Knit Runner 用一整片飞织替代传统拼接，整鞋仅 238g。透气袜套结构贴合脚型，通勤 5 公里和晨跑都能一双搞定。",
    features: [
      "一体飞织鞋面，零磨脚缝合线",
      "高弹 EVA 中底，能量回馈 65%",
      "可机洗，快干不变形",
      "含回收材料 38%",
    ],
    imagePrompt:
      "a single minimalist white knit running sneaker, one piece flyknit upper, floating slightly above ground",
    heatScore: 92,
    trend: "hot",
    stock: 2400,
    rating: 4.8,
    reviews: 1284,
    createdAt: "2026-07-02",
  },
  {
    id: "p02",
    slug: "urban-chunk-90",
    name: "Urban Chunk 90",
    tagline: "90 年代厚底回潮，走路自带 BGM",
    category: "lifestyle",
    price: 109,
    compareAt: 139,
    factoryCost: 28,
    moq: 400,
    leadTimeDays: 25,
    colors: [
      {
        name: "Cream White",
        hex: "#ede6d8",
        imagePrompt:
          "a chunky 90s dad sneaker in cream white with thick layered sole, retro paneling",
      },
      {
        name: "Black Ink",
        hex: "#1c1b1a",
        imagePrompt:
          "a chunky 90s dad sneaker in black with thick layered sole, retro paneling",
      },
      {
        name: "Sage Green",
        hex: "#7d927f",
        imagePrompt:
          "a chunky 90s dad sneaker in sage green and cream with thick layered sole",
      },
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    material: "牛剖层革 + 网布拼接 + 4cm 厚底",
    weight: "386g (US 9)",
    description:
      "Urban Chunk 90 把千禧年的老爹鞋轮廓重新调色：奶油色厚底、复古拼接、隐形增高 4cm。配阔腿裤就是街头本身。",
    features: [
      "4cm 厚底，悄悄拉长比例",
      "复古皮革拼接，越穿越有味道",
      "记忆海绵鞋垫，久站不累",
      "TikTok 同款话题 2.3 亿播放",
    ],
    imagePrompt:
      "a chunky 90s retro dad sneaker in cream white with thick sculpted layered sole",
    heatScore: 88,
    trend: "rising",
    stock: 1600,
    rating: 4.7,
    reviews: 856,
    createdAt: "2026-07-18",
  },
  {
    id: "p03",
    slug: "court-classic-canvas",
    name: "Court Classic Canvas",
    tagline: "每个人鞋柜里都该有的那双帆布鞋",
    category: "canvas",
    price: 59,
    factoryCost: 14,
    moq: 800,
    leadTimeDays: 18,
    colors: [
      {
        name: "White",
        hex: "#f5f4f1",
        imagePrompt: "a classic low top white canvas sneaker with rubber toe cap",
      },
      {
        name: "Black",
        hex: "#201f1e",
        imagePrompt: "a classic low top black canvas sneaker with white rubber sole",
      },
      {
        name: "Navy",
        hex: "#2c3a52",
        imagePrompt: "a classic low top navy blue canvas sneaker with white rubber sole",
      },
    ],
    sizes: [5, 6, 7, 8, 9, 10, 11, 12],
    material: "12oz 有机帆布 + 天然橡胶大底",
    weight: "290g (US 9)",
    description:
      "Court Classic 把帆布鞋做到极致：12 盎司有机帆布、天然橡胶大底、 Ortholite 鞋垫。$59 的价格，大牌同款脚感。",
    features: [
      "GOTS 认证有机棉帆布",
      "天然橡胶大底，抓地静音",
      "30 天免费试穿，磨脚包退",
      "工厂爆款，年出货 40 万双",
    ],
    imagePrompt: "a classic low top white canvas sneaker with rubber toe cap, side profile",
    heatScore: 81,
    trend: "steady",
    stock: 5200,
    rating: 4.6,
    reviews: 3421,
    createdAt: "2026-06-20",
  },
  {
    id: "p04",
    slug: "trail-grip-gtx",
    name: "Trail Grip GTX",
    tagline: "周末进山的硬核装备",
    category: "running",
    price: 119,
    compareAt: 159,
    factoryCost: 31,
    moq: 300,
    leadTimeDays: 30,
    colors: [
      {
        name: "Forest Green",
        hex: "#3f5d4b",
        imagePrompt:
          "a rugged forest green trail running shoe with aggressive lugged outsole, toe protection",
      },
      {
        name: "Desert Sand",
        hex: "#c9b18c",
        imagePrompt:
          "a rugged desert sand colored trail running shoe with aggressive lugged outsole",
      },
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    material: "防泼水工程网布 + 防滑大齿花橡胶底",
    weight: "312g (US 9)",
    description:
      "Trail Grip 为山野而生：5mm 深齿花咬住湿滑岩石，防泼水面膜挡住晨露，Rock Plate 防碎石硌脚。",
    features: [
      "5mm 多向齿花，湿地抓地力 +40%",
      "内置 Rock Plate 防穿刺",
      "防泼水处理，小雨直接冲",
      "鞋头防踢橡胶保护",
    ],
    imagePrompt:
      "a rugged trail running shoe in forest green with aggressive deep lugged outsole, hiking gear",
    heatScore: 74,
    trend: "rising",
    stock: 980,
    rating: 4.7,
    reviews: 412,
    createdAt: "2026-08-01",
  },
  {
    id: "p05",
    slug: "slip-ease-moc",
    name: "Slip Ease Moc",
    tagline: "一脚蹬，给讨厌系鞋带的你",
    category: "lifestyle",
    price: 75,
    factoryCost: 19,
    moq: 500,
    leadTimeDays: 20,
    colors: [
      {
        name: "Oat",
        hex: "#d9cbb2",
        imagePrompt: "a minimalist oat beige slip on knit sneaker, no laces, elastic collar",
      },
      {
        name: "Charcoal",
        hex: "#3a3a3a",
        imagePrompt: "a minimalist charcoal grey slip on knit sneaker, no laces, elastic collar",
      },
    ],
    sizes: [6, 7, 8, 9, 10, 11, 12],
    material: "弹力飞织 + 轻量 EVA",
    weight: "221g (US 9)",
    description:
      "Slip Ease 没有鞋带、没有搭扣，弹力鞋口一脚蹬进。机场安检、咖啡外卖、居家办公，全天零摩擦。",
    features: [
      "全鞋 221g，系列最轻",
      "弹力鞋口，袜子般穿脱",
      "可折叠后跟，秒变穆勒拖",
      "差旅党公认登机神鞋",
    ],
    imagePrompt: "a minimalist slip on knit sneaker in oat beige, no laces, clean studio shot",
    heatScore: 69,
    trend: "new",
    stock: 1300,
    rating: 4.5,
    reviews: 238,
    createdAt: "2026-08-15",
  },
  {
    id: "p06",
    slug: "court-pro-leather",
    name: "Court Pro Leather",
    tagline: "复古球场皮面，日常也能压得住",
    category: "lifestyle",
    price: 99,
    factoryCost: 26,
    moq: 400,
    leadTimeDays: 28,
    colors: [
      {
        name: "White / Green",
        hex: "#f2f0ec",
        imagePrompt:
          "a retro leather court sneaker in white with green heel tab and side stripe, gum sole",
      },
      {
        name: "White / Red",
        hex: "#f2f0ec",
        imagePrompt:
          "a retro leather court sneaker in white with red heel tab and side stripe, gum sole",
      },
    ],
    sizes: [6, 7, 8, 9, 10, 11, 12],
    material: "头层牛皮 + 生胶大底",
    weight: "345g (US 9)",
    description:
      "Court Pro 复刻 70 年代网球场轮廓：头层牛皮鞋面、生胶大底、撞色鞋跟标。西装裤和短裤都能配。",
    features: [
      "头层牛皮，越穿越合脚",
      "生胶大底，复古质感拉满",
      "杯式鞋垫，支撑优于帆布鞋",
      "附赠双色鞋带",
    ],
    imagePrompt:
      "a retro 70s leather court sneaker in white with green accents and gum rubber sole",
    heatScore: 65,
    trend: "steady",
    stock: 1100,
    rating: 4.6,
    reviews: 503,
    createdAt: "2026-06-30",
  },
  {
    id: "p07",
    slug: "breeze-sport-sandal",
    name: "Breeze Sport Sandal",
    tagline: "夏天的鞋，不该又闷又滑",
    category: "sandals",
    price: 49,
    factoryCost: 12,
    moq: 1000,
    leadTimeDays: 15,
    colors: [
      {
        name: "Black",
        hex: "#262524",
        imagePrompt: "a black sport hiking sandal with adjustable straps and contoured footbed",
      },
      {
        name: "Sand",
        hex: "#cbb98f",
        imagePrompt: "a sand colored sport hiking sandal with adjustable straps and contoured footbed",
      },
    ],
    sizes: [6, 7, 8, 9, 10, 11, 12],
    material: "快干织带 + 双密度 EVA 脚床",
    weight: "256g (US 9)",
    description:
      "Breeze 用运动鞋的思路做凉鞋：人体工学脚床支撑足弓，快干织带涉水无忧，魔术贴一秒调节。",
    features: [
      "足弓支撑脚床，走一天不累",
      "快干织带，溯溪/海滩通用",
      "防滑橡胶贴片，湿地不打滑",
      "夏季引流款，广告 CPC 最低",
    ],
    imagePrompt: "a sport hiking sandal in black with adjustable straps, contoured footbed, product photo",
    heatScore: 58,
    trend: "new",
    stock: 3400,
    rating: 4.4,
    reviews: 187,
    createdAt: "2026-08-20",
  },
  {
    id: "p08",
    slug: "glide-carbon-runner",
    name: "Glide Carbon Pro",
    tagline: "碳板推进，给认真 PB 的跑者",
    category: "running",
    price: 139,
    compareAt: 179,
    factoryCost: 36,
    moq: 300,
    leadTimeDays: 35,
    colors: [
      {
        name: "Hyper Orange",
        hex: "#ff4d24",
        imagePrompt:
          "a high performance carbon plate running shoe in hyper orange, sleek racing silhouette, thick foam midsole",
      },
      {
        name: "Night Black",
        hex: "#181818",
        imagePrompt:
          "a high performance carbon plate running shoe in black with neon accents, thick foam midsole",
      },
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    material: "超临界发泡中底 + 全掌碳板 + 透明大底",
    weight: "246g (US 9)",
    description:
      "Glide Carbon Pro 搭载全掌碳纤维板与超临界发泡中底，蹬伸回弹一触即发。$139 买到旗舰碳板体验。",
    features: [
      "全掌碳板，推进效率 +18%",
      "超临界发泡，能量回馈 82%",
      "246g 竞速重量",
      "对标 $250+ 国际旗舰",
    ],
    imagePrompt:
      "a high performance carbon plate racing running shoe in hyper orange with thick foam midsole, dynamic angle",
    heatScore: 84,
    trend: "hot",
    stock: 760,
    rating: 4.9,
    reviews: 629,
    createdAt: "2026-07-25",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}
