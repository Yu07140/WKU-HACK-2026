"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, ExternalLink } from "lucide-react";
import { Panel } from "@/components/admin/ui";
import { ORDER_STATUS_LABEL } from "@/lib/data/orders";
import { formatUSD, formatDate, cn } from "@/lib/utils";
import type { Order, OrderChannel } from "@/lib/types";

const CHANNEL_LABEL: Record<OrderChannel, string> = {
  direct: "Direct",
  meta: "Meta",
  tiktok: "TikTok",
  google: "Google",
};

const STATUS_STYLE: Record<Order["status"], string> = {
  paid: "bg-blue-500/15 text-blue-400",
  fulfilled: "bg-amber-500/15 text-amber-400",
  shipped: "bg-purple-500/15 text-purple-400",
  delivered: "bg-green-500/15 text-green-400",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/orders", { cache: "no-store" });
    setOrders(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const revenue = orders.reduce((s, o) => s + o.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">交易闭环 · Orders</h1>
          <p className="mt-1 text-sm text-slate-400">
            独立站结账实时写入 · 共 {orders.length} 单 · GMV {formatUSD(revenue)}
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> 刷新
        </button>
      </div>

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4 font-semibold">订单号</th>
                <th className="pb-3 pr-4 font-semibold">日期</th>
                <th className="pb-3 pr-4 font-semibold">客户 / 地区</th>
                <th className="pb-3 pr-4 font-semibold">商品</th>
                <th className="pb-3 pr-4 font-semibold">渠道</th>
                <th className="pb-3 pr-4 font-semibold">金额</th>
                <th className="pb-3 font-semibold">状态</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-white/5 last:border-0">
                  <td className="py-3 pr-4 font-mono text-xs font-bold text-accent">{o.id}</td>
                  <td className="py-3 pr-4 text-slate-400">{formatDate(o.date)}</td>
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-white">{o.customer}</div>
                    <div className="text-xs text-slate-500">{o.country}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="text-slate-200">{o.productName}</div>
                    <div className="text-xs text-slate-500">
                      {o.color} · US {o.size} × {o.qty}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-slate-300">{CHANNEL_LABEL[o.channel]}</td>
                  <td className="py-3 pr-4 font-black text-white">{formatUSD(o.amount)}</td>
                  <td className="py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", STATUS_STYLE[o.status])}>
                      {ORDER_STATUS_LABEL[o.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <a
        href="/checkout"
        target="_blank"
        className="flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
      >
        <ExternalLink size={13} /> 打开独立站结账页，下一单试试实时回流
      </a>
    </div>
  );
}
