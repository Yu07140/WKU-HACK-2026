"use client";

import { useState } from "react";
import Link from "next/link";
import { Megaphone, Pause, Play, Plus, Sparkles } from "lucide-react";
import { CAMPAIGNS } from "@/lib/data/campaigns";
import { PRODUCTS } from "@/lib/data/catalog";
import { Panel } from "@/components/admin/ui";
import { formatUSD, formatNumber, cn, ph } from "@/lib/utils";
import type { Campaign } from "@/lib/types";

const STATUS_STYLE: Record<Campaign["status"], string> = {
  active: "bg-green-500/15 text-green-400",
  paused: "bg-amber-500/15 text-amber-400",
  draft: "bg-slate-500/15 text-slate-400",
};

export default function CampaignsPage() {
  const [list, setList] = useState<Campaign[]>(CAMPAIGNS);
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<Campaign["platform"]>("Meta");
  const [budget, setBudget] = useState(100);
  const [productId, setProductId] = useState(PRODUCTS[0].id);

  function create() {
    if (!name.trim()) return;
    setList((l) => [
      {
        id: `c${Date.now()}`,
        name,
        platform,
        status: "draft",
        budget,
        spend: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        startDate: new Date().toISOString().slice(0, 10),
        creativePrompt: PRODUCTS.find((p) => p.id === productId)?.imagePrompt,
      },
      ...l,
    ]);
    setName("");
  }

  function toggle(id: string) {
    setList((l) =>
      l.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "paused" : "active" }
          : c
      )
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">投放冷启动 · Ad Campaigns</h1>
        <p className="mt-1 text-sm text-slate-400">
          素材由 AIGC 工坊产出 → 这里一键建组投放，ROAS 实时回流
        </p>
      </div>

      {/* 新建活动 */}
      <Panel title="新建广告活动（素材来自素材工坊）">
        <div className="grid gap-3 md:grid-cols-[1fr_140px_140px_auto]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="活动名称 e.g. No. 5910-5 - 兴趣测试 #2"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-accent"
          />
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Campaign["platform"])}
            className="rounded-xl border border-white/10 bg-[#141924] px-3 py-2.5 text-sm text-white outline-none"
          >
            {["Meta", "TikTok", "Google"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white">
            <span className="text-slate-500">$</span>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full bg-transparent px-2 py-2.5 outline-none"
            />
            <span className="text-xs text-slate-500">/天</span>
          </div>
          <button
            onClick={create}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-dark"
          >
            <Plus size={16} /> 建组
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#141924] px-2 py-1.5 text-white outline-none"
          >
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                绑定货盘：{ph(p.name)}
              </option>
            ))}
          </select>
          <Link href="/studio" className="flex items-center gap-1 font-bold text-accent hover:underline">
            <Sparkles size={13} /> 先去工坊生成创意 →
          </Link>
        </div>
      </Panel>

      {/* 活动列表 */}
      <Panel title={`进行中 / 待启动（${list.length}）`}>
        <div className="space-y-3">
          {list.map((c) => {
            const ctr = c.impressions ? c.clicks / c.impressions : 0;
            const cvr = c.clicks ? c.conversions / c.clicks : 0;
            const cpa = c.conversions ? c.spend / c.conversions : 0;
            const revenue = c.conversions * 92; // 近似客单价
            return (
              <div
                key={c.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300">
                      <Megaphone size={16} />
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white">{c.name}</div>
                      <div className="text-xs text-slate-500">
                        {c.platform} · 日预算 {formatUSD(c.budget)} · 起 {c.startDate}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-bold",
                        STATUS_STYLE[c.status]
                      )}
                    >
                      {c.status}
                    </span>
                    <button
                      onClick={() => toggle(c.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:bg-white/10"
                      title={c.status === "active" ? "暂停" : "启动"}
                    >
                      {c.status === "active" ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
                  <Metric label="曝光" value={formatNumber(c.impressions)} />
                  <Metric label="点击" value={formatNumber(c.clicks)} />
                  <Metric label="CTR" value={c.impressions ? `${(ctr * 100).toFixed(2)}%` : "—"} />
                  <Metric label="转化" value={String(c.conversions)} />
                  <Metric label="CPA" value={c.conversions ? formatUSD(cpa) : "—"} />
                  <Metric
                    label="ROAS"
                    value={c.spend ? `${(revenue / c.spend).toFixed(2)}x` : "—"}
                    good={c.spend ? revenue / c.spend >= 2 : false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function Metric({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="rounded-lg bg-white/5 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-0.5 text-sm font-black ${good ? "text-green-400" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}
