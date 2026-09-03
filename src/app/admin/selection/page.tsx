import { FlaskConical, ThumbsUp, Eye, ThumbsDown } from "lucide-react";
import { PRODUCTS } from "@/lib/data/catalog";
import { CATEGORY_LABELS } from "@/lib/types";
import { Panel, Bar } from "@/components/admin/ui";
import { formatUSD, cn } from "@/lib/utils";

/** AI 选款决策：热度 × 毛利 × 供应链柔性 */
function decide(heat: number, marginPct: number, moq: number) {
  if (heat >= 82 && marginPct >= 0.65)
    return { icon: ThumbsUp, label: "放量 Scale", cls: "bg-green-500/15 text-green-400", tip: "加大广告预算，备足安全库存" };
  if (heat >= 68 || (marginPct >= 0.7 && moq <= 500))
    return { icon: Eye, label: "测试 Test", cls: "bg-amber-500/15 text-amber-400", tip: "小预算 A/B 测试素材，48h 看 CTR" };
  return { icon: ThumbsDown, label: "观望 Hold", cls: "bg-slate-500/15 text-slate-400", tip: "暂不投放，等季节/趋势信号" };
}

export default function SelectionPage() {
  const rows = PRODUCTS.map((p) => {
    const margin = p.price - p.factoryCost;
    const marginPct = margin / p.price;
    const decision = decide(p.heatScore, marginPct, p.moq);
    return { p, margin, marginPct, decision };
  }).sort((a, b) => b.p.heatScore - a.p.heatScore);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-black text-white">
          <FlaskConical size={22} className="text-accent" /> AI 选款测试 · Product Selection
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          货盘 SKU × 广告点击/加购/搜索热度 × 毛利与供应链柔性 → 给出放量/测试/观望建议
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Panel className="p-5">
          <div className="text-xs uppercase tracking-wider text-slate-400">建议放量</div>
          <div className="mt-1 text-3xl font-black text-green-400">
            {rows.filter((r) => r.decision.label === "放量 Scale").length} 款
          </div>
        </Panel>
        <Panel className="p-5">
          <div className="text-xs uppercase tracking-wider text-slate-400">测试中</div>
          <div className="mt-1 text-3xl font-black text-amber-400">
            {rows.filter((r) => r.decision.label === "测试 Test").length} 款
          </div>
        </Panel>
        <Panel className="p-5">
          <div className="text-xs uppercase tracking-wider text-slate-400">货盘平均毛利率</div>
          <div className="mt-1 text-3xl font-black text-white">
            {Math.round(rows.reduce((s, r) => s + r.marginPct, 0) / rows.length * 100)}%
          </div>
        </Panel>
      </div>

      <Panel title="货盘决策矩阵">
        <div className="space-y-4">
          {rows.map(({ p, margin, marginPct, decision }) => (
            <div key={p.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{p.name}</span>
                    <span className="text-xs text-slate-500">{CATEGORY_LABELS[p.category]}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    零售 {formatUSD(p.price)} · 出厂 {formatUSD(p.factoryCost)} · MOQ {p.moq} · 打样 {p.leadTimeDays} 天
                  </div>
                </div>
                <span className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold", decision.cls)}>
                  <decision.icon size={13} /> {decision.label}
                </span>
              </div>

              <div className="mt-3 grid items-center gap-3 sm:grid-cols-[1fr_180px]">
                <div>
                  <div className="mb-1 flex justify-between text-[11px] text-slate-500">
                    <span>AI 热度（广告 CTR / 加购率 / 搜索趋势）</span>
                    <span className="font-bold text-slate-300">{p.heatScore}/100</span>
                  </div>
                  <Bar
                    value={p.heatScore}
                    max={100}
                    color={p.heatScore >= 82 ? "bg-accent" : p.heatScore >= 68 ? "bg-amber-400" : "bg-slate-500"}
                  />
                </div>
                <div className="text-xs text-slate-400">
                  毛利 <span className="font-bold text-white">{formatUSD(margin)}/双</span>
                  <span className="ml-1">({Math.round(marginPct * 100)}%)</span>
                  <div className="mt-1 text-slate-500">💡 {decision.tip}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <p className="rounded-2xl border border-accent/20 bg-accent/10 p-4 text-xs leading-relaxed text-orange-200">
        🤖 AI 选款逻辑（演示版）：热度 ≥82 且毛利率 ≥65% → 放量；热度 ≥68 或高毛利低 MOQ →
        小预算测试；其余观望。模块 D 可接入真实广告 API 与搜索趋势数据替换启发式规则。
      </p>
    </div>
  );
}
