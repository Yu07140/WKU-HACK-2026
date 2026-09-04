import Link from "next/link";
import { Warehouse, ArrowRight } from "lucide-react";
import {
  EU_SIZES,
  STOCK_LIST,
  WAREHOUSE,
  getStockRowsForModel,
} from "@/lib/data/stock";

export const metadata = {
  title: "Warehouse Stock — 温州仓现货库存表",
  description:
    "Lanhe 工厂温州仓实时现货：24 个 SKU 配色、EU 35-45 分码库存、共 8454 双，48 小时内发货。",
};

function Cell({ qty }: { qty: number }) {
  if (qty === 0)
    return <td className="px-2 py-2 text-center text-ink/25">—</td>;
  return (
    <td
      className={
        qty >= 100
          ? "px-2 py-2 text-center font-bold text-sage"
          : "px-2 py-2 text-center text-ink/70"
      }
    >
      {qty}
    </td>
  );
}

export default function StockPage() {
  // 按型号分组展示，保持库存表原始顺序
  const groups: string[] = [];
  for (const r of STOCK_LIST) {
    if (!groups.includes(r.itemNo)) groups.push(r.itemNo);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-bold tracking-wider text-ink/70">
            <Warehouse size={13} className="text-accent" />
            {WAREHOUSE.name.toUpperCase()} · {WAREHOUSE.updatedAt}
          </div>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            仓库现货 · Stock List
          </h1>
          <p className="mt-3 max-w-xl text-ink/65">
            工厂温州仓实时现货库存，{STOCK_LIST.length} 个 SKU 配色、共{" "}
            <span className="font-bold text-accent">{WAREHOUSE.totalPairs} 双</span>
            。下单后 48 小时内从温州直发，售完即止。
          </p>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-ink/85"
        >
          去选购现货 <ArrowRight size={15} />
        </Link>
      </div>

      {groups.map((itemNo) => {
        const rows = getStockRowsForModel(itemNo);
        const total = rows.reduce((s, r) => s + r.total, 0);
        return (
          <div key={itemNo} className="mt-10">
            <div className="mb-3 flex items-baseline gap-3">
              <h2 className="text-xl font-black">No. {itemNo}</h2>
              <span className="text-sm text-ink/50">
                {rows.length} colors · {total} pairs
              </span>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/10 bg-cream text-xs uppercase tracking-wider text-ink/60">
                    <th className="px-4 py-3 font-semibold">Color</th>
                    {EU_SIZES.map((s) => (
                      <th key={s} className="px-2 py-3 text-center font-semibold">
                        EU {s}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right font-semibold">Total</th>
                    <th className="px-4 py-3 font-semibold">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.color}
                      className="border-b border-ink/5 last:border-0 hover:bg-cream/50"
                    >
                      <td className="px-4 py-2 font-semibold">{r.color}</td>
                      {r.sizes.map((q, i) => (
                        <Cell key={i} qty={q} />
                      ))}
                      <td className="px-4 py-2 text-right font-black">{r.total}</td>
                      <td className="px-4 py-2 text-xs text-ink/50">{r.note ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <div className="mt-10 rounded-2xl bg-cream p-5 text-sm text-ink/65">
        数据来源：组委会货盘资料《Wenzhou Warehouse - Stock List》（2026-09）。
        库存随销售实时变动，以客服确认为准；型号 5910-5 与 5919-5 为同一鞋型的不同写法。
      </div>
    </div>
  );
}
