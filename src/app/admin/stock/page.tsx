import Link from "next/link";
import { Warehouse } from "lucide-react";
import { Panel } from "@/components/admin/ui";
import {
  EU_SIZES,
  STOCK_LIST,
  WAREHOUSE,
  getStockRowsForModel,
} from "@/lib/data/stock";

function Cell({ qty }: { qty: number }) {
  if (qty === 0)
    return <td className="px-2 py-2 text-center text-slate-700">—</td>;
  return (
    <td
      className={
        qty >= 100
          ? "px-2 py-2 text-center font-bold text-green-400"
          : "px-2 py-2 text-center text-slate-300"
      }
    >
      {qty}
    </td>
  );
}

export default function StockPage() {
  const groups: string[] = [];
  for (const r of STOCK_LIST) {
    if (!groups.includes(r.itemNo)) groups.push(r.itemNo);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">温州仓现货 · Stock</h1>
        <p className="mt-1 text-sm text-slate-400">
          {WAREHOUSE.name} · 更新于 {WAREHOUSE.updatedAt} ·{" "}
          {STOCK_LIST.length} 个 SKU 配色 · 共{" "}
          <span className="font-bold text-accent">{WAREHOUSE.totalPairs} 双</span>
        </p>
      </div>

      <Panel>
        <div className="space-y-8">
          {groups.map((itemNo) => {
            const rows = getStockRowsForModel(itemNo);
            const total = rows.reduce((s, r) => s + r.total, 0);
            return (
              <div key={itemNo}>
                <div className="mb-3 flex items-baseline gap-3">
                  <h2 className="text-lg font-black text-white">No. {itemNo}</h2>
                  <span className="text-sm text-slate-500">
                    {rows.length} colors · {total} pairs
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
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
                          className="border-b border-white/5 last:border-0"
                        >
                          <td className="px-4 py-2 font-semibold text-slate-200">{r.color}</td>
                          {r.sizes.map((q, i) => (
                            <Cell key={i} qty={q} />
                          ))}
                          <td className="px-4 py-2 text-right font-black text-white">{r.total}</td>
                          <td className="px-4 py-2 text-xs text-slate-500">{r.note ?? ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Warehouse size={14} className="text-accent" />
          数据来源：组委会货盘资料《Wenzhou Warehouse - Stock List》（2026-09）。
          库存随销售实时变动；型号 5910-5 与 5919-5 为同一鞋型的不同写法。
        </div>
      </Panel>
    </div>
  );
}
