"use client";

import { useState } from "react";
import { Wand2, Loader2, Copy, Check } from "lucide-react";
import { PRODUCTS } from "@/lib/data/catalog";
import { IMAGE_STYLES, aiImageUrl, type ImageSize } from "@/lib/ai/image";
import { Button } from "@/components/ui/button";
import { Label, Select, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const SIZES: { id: ImageSize; label: string }[] = [
  { id: "square", label: "1:1 社媒帖" },
  { id: "portrait_4_3", label: "3:4 信息流" },
  { id: "portrait_16_9", label: "9:16 短视频/TikTok" },
  { id: "landscape_16_9", label: "16:9 Banner" },
];

export function SceneGenerator() {
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [styleId, setStyleId] = useState(IMAGE_STYLES[0].id);
  const [size, setSize] = useState<ImageSize>("square");
  const [extra, setExtra] = useState("");
  const [seed, setSeed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const product = PRODUCTS.find((p) => p.id === productId)!;
  const style = IMAGE_STYLES.find((s) => s.id === styleId)!;
  const prompt = `${product.imagePrompt}, ${style.suffix}${extra ? ", " + extra : ""}`;
  const url = aiImageUrl(prompt, size) + (seed ? `&seed=${seed}` : "");

  function generate() {
    setLoading(true);
    setSeed((s) => s + 1);
    // 图片由 URL 实时生成，预加载一下模拟"出图中"
    const img = new Image();
    img.onload = img.onerror = () => setLoading(false);
    img.src = url;
    setTimeout(() => setLoading(false), 8000);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card className="space-y-4 p-5">
        <div>
          <Label>选择货盘 SKU</Label>
          <Select value={productId} onChange={(e) => setProductId(e.target.value)}>
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (${p.price})
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>出图风格</Label>
          <div className="grid grid-cols-2 gap-2">
            {IMAGE_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyleId(s.id)}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  styleId === s.id
                    ? "border-accent bg-accent/10 text-accent-dark"
                    : "border-ink/15 bg-white hover:border-ink/40"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>画幅</Label>
          <Select value={size} onChange={(e) => setSize(e.target.value as ImageSize)}>
            {SIZES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>补充描述（可选）</Label>
          <Textarea
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder="e.g. wearing beige cargo pants, rainy Tokyo street at night"
            className="min-h-20"
          />
        </div>
        <Button className="w-full" onClick={generate} disabled={loading}>
          {loading ? <Loader2 size={17} className="animate-spin" /> : <Wand2 size={17} />}
          {loading ? "AI 出图中..." : "Generate 生成素材"}
        </Button>
      </Card>

      <Card className="flex flex-col p-5">
        <div className="relative flex-1 overflow-hidden rounded-xl bg-cream">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="AI generated creative" className="h-full w-full object-contain" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-cream/70 text-sm font-semibold text-ink/60">
              <Loader2 size={18} className="mr-2 animate-spin" /> AIGC 渲染中，约 10 秒...
            </div>
          )}
        </div>
        <div className="mt-4 rounded-xl bg-cream p-3">
          <div className="mb-1 text-xs font-bold text-ink/50">PROMPT</div>
          <p className="text-xs leading-relaxed text-ink/70">{prompt}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-accent-dark"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "已复制图片 URL" : "复制图片 URL（可直接投放）"}
          </button>
        </div>
      </Card>
    </div>
  );
}
