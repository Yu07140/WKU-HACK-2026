import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { getOrders } from "@/lib/data/orders";
import { CAMPAIGNS, FUNNEL } from "@/lib/data/campaigns";
import { PRODUCTS } from "@/lib/data/catalog";
import { Panel, Stat, Bar } from "@/components/admin/ui";
import { formatUSD, formatNumber, pct } from "@/lib/utils";
import type { OrderChannel } from "@/lib/types";

const CHANNEL_META: Record<OrderChannel, { label: string; color: string }> = {
  direct: { label: "Direct 自然", color: "bg-slate-400" },
  meta: { label: "Meta", color: "bg-blue-500" },
  tiktok: { label: "TikTok", color: "bg-pink-500" },
  google: { label: "Google", color: "bg-amber-400" },
};

export default function AdminOverview() {
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

  const topProducts = [...PRODUCTS].sort((a, b) => b.heatScore - a.heatScore).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">增长总览 · Growth Overview</h1>
          <p className="mt-1 text-sm text-slate-400">
            白牌货盘 → DTC 品牌冷启动第 14 天 · 数据每 5 分钟刷新
          </p>
        </div>
        <Link
          href="/admin/campaigns"
          className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-accent-dark"
        >
          <TrendingUp size={15} /> 去投放 <ArrowRight size={14} />
        </Link>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="GMV 成交额" value={formatUSD(revenue)} accent sub={`${orders.length} 笔订单 · 近 14 天`} />
        <Stat label="ROAS 广告回报" value={`${roas.toFixed(2)}x`} sub={`广告花费 ${formatUSD(spend)} → 归因成交 ${formatUSD(adRevenue)}`} />
        <Stat label="转化率 CVR" value={pct(FUNNEL.orders / FUNNEL.visits)} sub="访问 → 支付，行业均值 ~1.2%" />
        <Stat label="AI 素材产出" value="148 件" sub="场景图 96 · 文案 41 · 视频脚本 11" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 漏斗 */}
        <Panel title="转化漏斗 · Conversion Funnel">
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
            🤖 AI 洞察：加购→结账流失 60%，主要发生在运费页（$75 免邮门槛过高）。
            建议把免邮门槛降到 $60，预计 CVR +0.4pt。
          </p>
        </Panel>

        {/* 渠道 */}
        <Panel title="渠道成交 · Revenue by Channel">
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
            TikTok 信息流 CPA 最低（$3.14），素材来自 AIGC 创意矩阵；
            Google 搜索意向最强、客单价最高。Meta 适合再营销兜底。
          </p>
        </Panel>
      </div>

      {/* 选款热度 */}
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
                {p.name}
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
