/* ------------------------------------------------------------------
 * 温州仓现货库存表 —— 来自组委会货盘资料 Wenzhou Warehouse - Stock List
 * 尺码为欧码 EU 35-45，数量单位：双
 * ------------------------------------------------------------------ */

export const EU_SIZES = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45] as const;

export interface StockRow {
  /** 货盘型号，如 5919-5 */
  itemNo: string;
  /** 仓库配色名（与库存表原文一致） */
  color: string;
  /** EU 35-45 对应数量，索引 0 = EU 35 */
  sizes: number[];
  total: number;
  note?: string;
}

export const WAREHOUSE = {
  name: "Wenzhou Warehouse",
  nameZh: "温州仓",
  totalPairs: 8454,
  updatedAt: "2026-09",
};

export const STOCK_LIST: StockRow[] = [
  { itemNo: "5919-5", color: "Black", sizes: [115, 63, 400, 32, 40, 17, 1, 37, 0, 18, 5], total: 728 },
  { itemNo: "5919-5", color: "Orange", sizes: [24, 180, 660, 335, 562, 640, 550, 400, 95, 90, 10], total: 3546 },
  { itemNo: "5919-5", color: "Rose Red", sizes: [5, 120, 50, 116, 41, 88, 52, 41, 41, 2, 0], total: 556 },
  { itemNo: "5919-5", color: "Pink", sizes: [0, 33, 30, 26, 10, 20, 64, 42, 9, 0, 20], total: 254 },
  { itemNo: "5919-5", color: "Black Patent", sizes: [0, 11, 3, 7, 9, 27, 21, 18, 21, 0, 0], total: 117 },
  { itemNo: "5919-5", color: "Denim", sizes: [0, 4, 3, 1, 0, 2, 7, 0, 0, 0, 0], total: 17 },
  { itemNo: "5919-5", color: "Beige", sizes: [0, 12, 6, 7, 20, 9, 18, 22, 13, 13, 0], total: 120 },
  { itemNo: "5919-5", color: "Black Snake", sizes: [0, 0, 0, 5, 15, 2, 18, 0, 0, 0, 0], total: 40 },
  { itemNo: "5919-5", color: "Yellow", sizes: [0, 0, 7, 13, 1, 0, 11, 0, 21, 3, 0], total: 56 },
  { itemNo: "5919-5", color: "Black Canvas", sizes: [0, 0, 0, 10, 25, 55, 60, 50, 20, 0, 0], total: 220 },
  { itemNo: "5925", color: "Laser", sizes: [0, 2, 6, 0, 0, 6, 6, 0, 0, 0, 0], total: 20 },
  { itemNo: "5925", color: "Black", sizes: [40, 29, 66, 104, 89, 73, 107, 100, 80, 0, 40], total: 728 },
  { itemNo: "5960", color: "Yellow", sizes: [0, 40, 40, 101, 100, 100, 99, 40, 0, 0, 0], total: 520 },
  { itemNo: "8801", color: "Black", sizes: [2, 17, 19, 16, 42, 2, 20, 22, 0, 0, 0], total: 140 },
  { itemNo: "5970", color: "Black", sizes: [0, 20, 38, 39, 40, 20, 63, 20, 0, 0, 0], total: 240 },
  { itemNo: "8058", color: "Black", sizes: [0, 0, 2, 5, 15, 2, 0, 6, 10, 0, 0], total: 40 },
  { itemNo: "6611", color: "Black", sizes: [40, 20, 40, 60, 60, 40, 60, 60, 40, 0, 0], total: 420 },
  { itemNo: "9001", color: "Black", sizes: [0, 16, 5, 7, 42, 40, 83, 69, 38, 0, 0], total: 300 },
  { itemNo: "5922", color: "Black", sizes: [0, 0, 0, 20, 39, 50, 65, 44, 24, 0, 0], total: 242 },
  { itemNo: "5830", color: "Gold", sizes: [0, 13, 21, 9, 13, 10, 13, 0, 0, 0, 0], total: 79 },
  { itemNo: "5830", color: "Silver", sizes: [0, 0, 10, 4, 0, 0, 6, 0, 0, 0, 0], total: 20 },
  { itemNo: "8013", color: "Black & White", sizes: [1, 0, 2, 0, 0, 6, 12, 6, 4, 0, 0], total: 31 },
  { itemNo: "5920", color: "Black", sizes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], total: 0, note: "Zero stock" },
  { itemNo: "5188", color: "Black", sizes: [1, 1, 2, 3, 2, 2, 5, 4, 0, 0, 0], total: 20 },
];

/** PDF 货盘与库存表对同一鞋型的型号写法不一致（5910-5 = 5919-5，十色一一对应） */
const MODEL_ALIAS: Record<string, string> = {
  "5910-5": "5919-5",
};

/** 商品目录配色名 → 库存表配色名（同一配色两份资料的叫法差异） */
const COLOR_ALIAS: Record<string, string> = {
  magenta: "Rose Red",
  "off-white": "Beige",
  "black patent leather": "Black Patent",
  "black canvas": "Black Canvas",
  "black snake pattern": "Black Snake",
};

/** 按型号 + 配色名查库存行（自动套用型号/配色别名），找不到返回 undefined */
export function findStockRow(
  itemNo?: string,
  colorName?: string
): StockRow | undefined {
  if (!itemNo) return undefined;
  const model = MODEL_ALIAS[itemNo] ?? itemNo;
  const colorKey = colorName
    ? COLOR_ALIAS[colorName.toLowerCase()] ?? colorName
    : undefined;
  return STOCK_LIST.find(
    (r) =>
      r.itemNo === model &&
      (!colorKey || r.color.toLowerCase() === colorKey.toLowerCase())
  );
}

/** 某型号下全部配色的库存行 */
export function getStockRowsForModel(itemNo?: string): StockRow[] {
  if (!itemNo) return [];
  const model = MODEL_ALIAS[itemNo] ?? itemNo;
  return STOCK_LIST.filter((r) => r.itemNo === model);
}
