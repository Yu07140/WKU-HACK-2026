"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { getOrders } from "@/lib/data/orders";
import { CAMPAIGNS, FUNNEL } from "@/lib/data/campaigns";
import { PRODUCTS, getProductById } from "@/lib/data/catalog";
import { Panel, Stat, Bar } from "@/components/admin/ui";
import { formatUSD, formatNumber, pct, ph, cn } from "@/lib/utils";
import type { OrderChannel } from "@/lib/types";

const CHANNEL_META: Record<OrderChannel, { label: string; color: string }> = {
  direct: { label: "Direct 自然", color: "bg-slate-400" },
  meta: { label: "Meta", color: "bg-blue-500" },
  tiktok: { label: "TikTok", color: "bg-pink-500" },
  google: { label: "Google", color: "bg-amber-400" },
};

export default function AdminOverview() {
  const [mode, setMode] = useState<"plan" | "actual">("plan");

  const orders = getOrders();
  const revenue = orders.reduce((s, o) => s + o.amount, 0);
  const adRevenue = orders
    .filter((o) => o.channel !== "direct")
    .reduce((s, o) => s + o.amount, 0);
  const spend = CAMPAIGNS.reduce((s, c) => s + c.spend, 0);
  const roas = adRevenue / spend;

  const channelRev = (["meta", "tiktok", "google", "direct"] as OrderChannel[]).map(
    (ch) => ({
      ch,
      rev: orders.filter((o) => o.channel === ch).reduce((s, o) => s + o.amount, 0),
      n: orders.filter((o) => o.channel === ch).length,
    })
  );
  const maxChannelRev = Math.max(...channelRev.map((c) => c.rev));

  const funnelSteps = [
    { label: "Visits 访问", value: FUNNEL.visits },
    { label: "Product Views 商品浏览", value: FUNNEL.productViews },
    { label: "Add to Cart 加购", value: FUNNEL.addToCart },
    { label: "Checkout 发起结账", value: FUNNEL.checkout },
    { label: "Orders 成交", value: FUNNEL.orders },
  ];

  // 14534-H 始终排第一
  const hero = getProductById("boot-14534-h");
  const topProducts = [
    ...(hero ? [hero] : []),
    ...[...PRODUCTS]
      .filter((p) => p.id !== hero?.id)
      .sort((a, b) => b.heatScore - a.heatScore),
  ].slice(0, 5);

  const isActual = mode === "actual";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">增长总览 · Growth Overview</h1>
          <p className="mt-1 text-sm text-slate-400">
            白牌货盘 → DTC 品牌冷启动演示 · 数据为模拟数据集
          </p>
        </div>
        <Link
          href="/admin/campaigns"
          className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-accent-dark"
        >
          <TrendingUp size={15} /> 去投放 <ArrowRight size={14} />
        </Link>
      </div>

      {/* PLAN / ACTUAL 切换 */}
      <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
        {(["plan", "actual"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-bold transition",
              mode === m ? "bg-white text-ink" : "text-slate-400 hover:text-white"
            )}
          >
            {m === "plan" ? "PLAN (Simulated)" : "ACTUAL"}
          </button>
        ))}
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="GMV 成交额"
          value={isActual ? "$0" : formatUSD(revenue)}
          accent
          sub={
            isActual
              ? "No live campaign data yet"
              : `${orders.length} 笔订单 · 模拟`
          }
        />
        <Stat
          label="ROAS 广告回报"
          value={isActual ? "—" : `${roas.toFixed(2)}x`}
          sub={
            isActual
              ? "No live campaign data yet"
              : `广告花费 ${formatUSD(spend)} → 归因成交 ${formatUSD(adRevenue)}（模拟）`
          }
        />
        <Stat
          label="转化率 CVR"
          value={isActual ? "0.0%" : pct(FUNNEL.orders / FUNNEL.visits)}
          sub={isActual ? "No live campaign data yet" : "访问 → 支付（模拟）"}
        />
        <Stat
          label="AI 素材产出"
          value={isActual ? "0 件" : "148 件"}
          sub={isActual ? "No live campaign data yet" : "场景图 96 · 文案 41 · 视频脚本 11"}
        />
      </div>

      {isActual && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <div className="text-lg font-bold text-slate-300">No live campaign data yet.</div>
          <p className="mt-2 text-sm text-slate-500">
            ACTUAL mode only records real campaign results. The PLAN / Simulated
            mode above demonstrates the dashboard workflow.
          </p>
        </div>
      )}

      {!isActual && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 漏斗 */}
            <Panel title="转化漏斗 · Conversion Funnel (Simulated)">
              <div className="space-y-4">
                {funnelSteps.map((s, i) => {
                  const prev = i === 0 ? s.value : funnelSteps[i - 1].value;
                  const stepRate = s.value / prev;
                  return (
                    <div key={s.label}>
                      <div className="mb-1.5 flex justify-between text-xs">
                        <span className="font-semibold text-slate-300">{s.label}</span>
                        <span className="text-slate-400">
                          {formatNumber(s.value)}
                          {i > 0 && <span className="ml-2 text-slate-500">{pct(stepRate)} ↓</span>}
                        </span>
                      </div>
                      <Bar value={s.value} max={FUNNEL.visits} color="bg-gradient-to-r from-accent to-amber-400" />
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 rounded-xl bg-accent/10 p-3 text-xs leading-relaxed text-orange-200">
                🤖 AI 洞察（模拟）：加购→结账流失 60%。建议优化结账页体验。
              </p>
            </Panel>

            {/* 渠道 */}
            <Panel title="渠道成交 · Revenue by Channel (Simulated)">
              <div className="space-y-4">
                {channelRev.map((c) => (
                  <div key={c.ch}>
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">
                        {CHANNEL_META[c.ch].label}
                      </span>
                      <span className="text-slate-400">
                        {formatUSD(c.rev)} · {c.n} 单
                      </span>
                    </div>
                    <Bar value={c.rev} max={maxChannelRev} color={CHANNEL_META[c.ch].color} />
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-xl bg-white/5 p-3 text-xs leading-relaxed text-slate-400">
                渠道分布为演示数据，非真实投放结果。
              </p>
            </Panel>
          </div>
        </>
      )}

      {/* 选款热度 — 始终展示（产品属性，非结果） */}
      <Panel
        title="AI 选款热度榜 · Top Products"
        action={
          <Link href="/admin/selection" className="text-xs font-bold text-accent hover:underline">
            完整选款测试 →
          </Link>
        }
      >
        <div className="space-y-3">
          {topProducts.map((p) => (
            <div key={p.id} className="flex items-center gap-4">
              <span className="w-44 shrink-0 truncate text-sm font-semibold text-slate-200">
                {ph(p.name)}
                {p.sku === "14534-H" && (
                  <span className="ml-2 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                    PRIMARY
                  </span>
                )}
              </span>
              <Bar
                value={p.heatScore}
                max={100}
                color={p.heatScore >= 85 ? "bg-accent" : p.heatScore >= 70 ? "bg-amber-400" : "bg-slate-500"}
                className="flex-1"
              />
              <span className="w-10 text-right text-sm font-black text-white">{p.heatScore}</span>
              <span className="hidden w-24 text-right text-xs text-slate-400 sm:block">
                毛利 {formatUSD(p.price - p.factoryCost)}/双
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
