"use client";

import { useState } from "react";
import { Wand2, Loader2, Copy, Check } from "lucide-react";
import { PRODUCTS } from "@/lib/data/catalog";
import { ANGLE_LABELS, type Angle, type Platform, type CopyResult } from "@/lib/ai/copy";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label, Select } from "@/components/ui/input";

const PLATFORMS: Platform[] = ["Meta", "TikTok", "Google"];
const ANGLES: Angle[] = ["comfort", "value", "trend", "performance"];

export function CopyGenerator() {
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [platform, setPlatform] = useState<Platform>("Meta");
  const [angle, setAngle] = useState<Angle>("comfort");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CopyResult | null>(null);

  async function generate() {
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/generate-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, platform, angle }),
    });
    setResult(await res.json());
    setLoading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card className="space-y-4 p-5">
        <div>
          <Label>货盘 SKU</Label>
          <Select value={productId} onChange={(e) => setProductId(e.target.value)}>
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>投放渠道</Label>
          <div className="grid grid-cols-3 gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                  platform === p
                    ? "border-accent bg-accent/10 text-accent-dark"
                    : "border-ink/15 bg-white hover:border-ink/40"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>卖点角度</Label>
          <div className="grid grid-cols-2 gap-2">
            {ANGLES.map((a) => (
              <button
                key={a}
                onClick={() => setAngle(a)}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  angle === a
                    ? "border-accent bg-accent/10 text-accent-dark"
                    : "border-ink/15 bg-white hover:border-ink/40"
                }`}
              >
                {ANGLE_LABELS[a]}
              </button>
            ))}
          </div>
        </div>
        <Button className="w-full" onClick={generate} disabled={loading}>
          {loading ? <Loader2 size={17} className="animate-spin" /> : <Wand2 size={17} />}
          {loading ? "AI 撰写中..." : "生成投放文案"}
        </Button>
      </Card>

      <Card className="p-6">
        {!result && !loading && (
          <div className="flex h-full min-h-64 items-center justify-center text-center text-ink/40">
            <div>
              <Wand2 size={36} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">选择 SKU、渠道与卖点角度，AI 一次产出标题 / 正文 / CTA / 标签</p>
            </div>
          </div>
        )}
        {loading && (
          <div className="flex h-full min-h-64 items-center justify-center text-sm font-semibold text-ink/50">
            <Loader2 size={18} className="mr-2 animate-spin" /> 文案生成中...
          </div>
        )}
        {result && (
          <div className="animate-fade-up space-y-5">
            <CopyBlock label="Headline 标题" text={result.headline} big />
            <CopyBlock label="Body 正文" text={result.body} />
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/50">CTA</span>
              <span className="rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-white">
                {result.cta}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.hashtags.map((h) => (
                <span key={h} className="rounded-full bg-cream px-3 py-1 text-sm font-semibold text-sage">
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function CopyBlock({ label, text, big }: { label: string; text: string; big?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative rounded-xl border border-ink/10 p-4">
      <div className="mb-1 text-xs font-bold uppercase tracking-wider text-ink/50">{label}</div>
      <p className={big ? "text-xl font-black leading-snug" : "whitespace-pre-line text-sm leading-relaxed text-ink/75"}>
        {text}
      </p>
      <button
        onClick={() => {
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="absolute right-3 top-3 rounded-full p-1.5 text-ink/40 opacity-0 transition hover:bg-ink/5 group-hover:opacity-100"
      >
        {copied ? <Check size={15} className="text-sage" /> : <Copy size={15} />}
      </button>
    </div>
  );
}
