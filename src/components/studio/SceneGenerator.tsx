"use client";

import { useEffect, useState } from "react";
import { Wand2, Loader2, Copy, Check, Download, ExternalLink, RotateCcw } from "lucide-react";
import { PRODUCTS } from "@/lib/data/catalog";
import { IMAGE_STYLES, aiImageUrl, type ImageSize } from "@/lib/ai/image";
import { Button } from "@/components/ui/button";
import { Label, Select, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { downloadImage, useCreativeHistory } from "@/lib/store/creativeHistory";
import { cn } from "@/lib/utils";

const SIZES: { id: ImageSize; label: string; aspect: string }[] = [
  { id: "square", label: "1:1 Social", aspect: "1:1" },
  { id: "portrait_4_3", label: "3:4 Feed", aspect: "3:4" },
  { id: "portrait_16_9", label: "9:16 Vertical / TikTok", aspect: "9:16" },
  { id: "landscape_16_9", label: "16:9 Banner", aspect: "16:9" },
];

export function SceneGenerator({
  draftPrompt,
  onDraftConsumed,
}: {
  draftPrompt?: string;
  onDraftConsumed?: () => void;
}) {
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [styleId, setStyleId] = useState(IMAGE_STYLES[0].id);
  const [size, setSize] = useState<ImageSize>("square");
  const [extra, setExtra] = useState("");
  const [seed, setSeed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState<"ok" | "fail" | null>(null);

  const { add } = useCreativeHistory();

  const product = PRODUCTS.find((p) => p.id === productId)!;
  const style = IMAGE_STYLES.find((s) => s.id === styleId)!;
  const preset = product.creativePresets?.[styleId];
  const basePrompt = preset ?? product.imagePrompt;
  const prompt = `${basePrompt}, ${style.suffix}${extra ? ", " + extra : ""}`;
  const url = aiImageUrl(prompt, size) + (seed ? `&seed=${seed}` : "");
  const refImage = product.image ?? product.colors[0]?.image;
  const aspect = SIZES.find((s) => s.id === size)?.aspect ?? "1:1";

  // Creative History 的 Reuse Prompt：接收页面传入的历史 prompt
  useEffect(() => {
    if (draftPrompt) {
      setExtra(draftPrompt);
      onDraftConsumed?.();
    }
  }, [draftPrompt, onDraftConsumed]);

  function generate() {
    setLoading(true);
    setDownloaded(null);
    setSeed((s) => s + 1);
    // 图片由 URL 实时生成，预加载一下模拟"出图中"
    const img = new Image();
    img.onload = img.onerror = () => setLoading(false);
    img.src = url;
    setTimeout(() => setLoading(false), 8000);
    add({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      refImage,
      url,
      prompt,
      styleId: style.id,
      styleLabel: style.label,
      aspect,
    });
  }

  async function handleDownload() {
    const ok = await downloadImage(url, `stryde-${product.slug}-${style.id}-${seed}.jpg`);
    setDownloaded(ok ? "ok" : "fail");
    setTimeout(() => setDownloaded(null), 2500);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card className="space-y-4 p-5">
        <div>
          <Label>Select Product / SKU</Label>
          <Select value={productId} onChange={(e) => setProductId(e.target.value)}>
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.sku ? ` · ${p.sku}` : ""}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Style</Label>
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
                {product.creativePresets?.[s.id] && (
                  <span className="ml-1 text-[10px] text-accent">★</span>
                )}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-ink/40">★ = product-tuned prompt preset</p>
        </div>
        <div>
          <Label>Aspect Ratio</Label>
          <Select value={size} onChange={(e) => setSize(e.target.value as ImageSize)}>
            {SIZES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Extra Description (optional)</Label>
          <Textarea
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder="e.g. wearing beige cargo pants, rainy Tokyo street at night"
            className="min-h-20"
          />
        </div>
        <Button className="w-full" onClick={generate} disabled={loading}>
          {loading ? <Loader2 size={17} className="animate-spin" /> : <Wand2 size={17} />}
          {loading ? "Generating..." : "Generate Creative"}
        </Button>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* REFERENCE PRODUCT —— 真实供应商实拍 */}
        <Card className="flex flex-col p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-ink/70">
              REFERENCE PRODUCT
            </span>
            <span className="text-[11px] text-ink/45">Real supplier photo</span>
          </div>
          <div className="relative flex-1 overflow-hidden rounded-xl bg-cream">
            {refImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={refImage}
                alt={`${product.name} real reference`}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full min-h-56 items-center justify-center px-6 text-center text-xs text-ink/40">
                No real photography for this SKU — it uses the demo catalog (AIGC visuals).
              </div>
            )}
          </div>
          <div className="mt-3 text-xs text-ink/55">
            <div className="font-bold text-ink/75">{product.name}</div>
            {product.sku && <div>Supplier SKU: {product.sku}</div>}
          </div>
        </Card>

        {/* AI CREATIVE —— 生成结果（概念图，非真实商品照） */}
        <Card className="flex flex-col p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
              AI CREATIVE
            </span>
            <span className="text-[11px] text-ink/45">Concept visual · not a real photo</span>
          </div>
          <div className="relative flex-1 overflow-hidden rounded-xl bg-cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="AI generated creative" className="h-full w-full object-contain" />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-cream/70 text-sm font-semibold text-ink/60">
                <Loader2 size={18} className="mr-2 animate-spin" /> Rendering (~10s)...
              </div>
            )}
          </div>
          <div className="mt-3 rounded-xl bg-cream p-3">
            <div className="mb-1 text-xs font-bold text-ink/50">PROMPT</div>
            <p className="line-clamp-3 text-xs leading-relaxed text-ink/70">{prompt}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-dark"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "URL copied" : "Copy Image URL"}
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-dark"
              >
                <Download size={13} />
                {downloaded === "ok" ? "Saved" : "Download Image"}
              </button>
              {downloaded === "fail" && (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/55"
                >
                  <ExternalLink size={13} /> Open Image
                </a>
              )}
              <button
                onClick={generate}
                disabled={loading}
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-bold text-ink/55",
                  loading && "opacity-50"
                )}
              >
                <RotateCcw size={13} /> Regenerate
              </button>
            </div>
            {downloaded === "fail" && (
              <p className="mt-1.5 text-[11px] text-ink/40">
                Direct download blocked by image host CORS — use Open Image instead.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
