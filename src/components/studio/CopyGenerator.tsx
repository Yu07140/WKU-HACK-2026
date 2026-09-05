"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Wand2, Loader2, Copy, Check } from "lucide-react";
import { PRODUCTS, getProductById } from "@/lib/data/catalog";
import {
  ANGLE_LABELS,
  PLATFORM_LABELS,
  type Angle,
  type Platform,
  type CopyResult,
} from "@/lib/ai/copy";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label, Select } from "@/components/ui/input";

const PLATFORMS: Platform[] = ["TikTok", "Instagram", "Meta", "Google"];
const ANGLES: Angle[] = ["style", "versatility", "value", "detail"];

export function CopyGenerator() {
  const searchParams = useSearchParams();
  const [productId, setProductId] = useState(() => {
    // 支持从 AI 导购 /studio?productId=xxx 深链自动选中对应商品
    const fromUrl = searchParams.get("productId");
    if (fromUrl && PRODUCTS.some((p) => p.id === fromUrl)) return fromUrl;
    return getProductById("boot-14534-h")?.id ?? PRODUCTS[0].id;
  });
  const [platform, setPlatform] = useState<Platform>("TikTok");
  const [angle, setAngle] = useState<Angle>("style");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CopyResult | null>(null);

  const product = PRODUCTS.find((p) => p.id === productId);

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
          <Label>Product / SKU</Label>
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
          <Label>Platform</Label>
          <div className="grid grid-cols-2 gap-2">
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
                {PLATFORM_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>Marketing Angle</Label>
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
          {loading ? "Writing..." : "Generate Ad Copy"}
        </Button>
      </Card>

      <Card className="p-6">
        {!result && !loading && (
          <div className="flex h-full min-h-64 items-center justify-center text-center text-ink/40">
            <div>
              <Wand2 size={36} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">
                Pick a SKU, platform and angle — get Hook / Primary Copy / Headline / CTA +
                hashtags in one shot.
              </p>
            </div>
          </div>
        )}
        {loading && (
          <div className="flex h-full min-h-64 items-center justify-center text-sm font-semibold text-ink/50">
            <Loader2 size={18} className="mr-2 animate-spin" /> Generating copy...
          </div>
        )}
        {result && product && (
          <div className="animate-fade-up space-y-5">
            {result.hook && (
              <CopyBlock label="Hook" text={result.hook} big accent />
            )}
            {result.primaryCopy && (
              <CopyBlock label="Primary Copy" text={result.primaryCopy} />
            )}
            <CopyBlock label="Headline" text={result.headline} />
            <div className="rounded-xl border border-ink/10 p-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-ink/50">
                CTA + variants
              </div>
              <span className="rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-white">
                {result.cta}
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {(result.ctaVariants ?? []).map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-ink/60"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.hashtags.map((h) => (
                <span
                  key={h}
                  className="rounded-full bg-cream px-3 py-1 text-sm font-semibold text-sage"
                >
                  {h}
                </span>
              ))}
            </div>
            <CopyAllBlock
              text={copyToText(product.name, platform, angle, result)}
              label="Copy all copy"
            />
          </div>
        )}
      </Card>
    </div>
  );
}

function copyToText(
  productName: string,
  platform: Platform,
  angle: Angle,
  r: CopyResult
) {
  return [
    `${productName} · ${PLATFORM_LABELS[platform]} · ${ANGLE_LABELS[angle]}`,
    r.hook ? `Hook: ${r.hook}` : "",
    r.primaryCopy ? `Primary: ${r.primaryCopy}` : "",
    `Headline: ${r.headline}`,
    `CTA: ${r.cta}`,
    r.ctaVariants?.length ? `CTA variants: ${r.ctaVariants.join(" | ")}` : "",
    `Hashtags: ${r.hashtags.join(" ")}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function CopyBlock({
  label,
  text,
  big,
  accent,
}: {
  label: string;
  text: string;
  big?: boolean;
  accent?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative rounded-xl border border-ink/10 p-4">
      <div className="mb-1 text-xs font-bold uppercase tracking-wider text-ink/50">{label}</div>
      <p
        className={
          big
            ? `text-xl font-black leading-snug${accent ? " text-accent-dark" : ""}`
            : "whitespace-pre-line text-sm leading-relaxed text-ink/75"
        }
      >
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

function CopyAllBlock({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-2.5 text-xs font-bold text-paper transition hover:bg-black"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied!" : label}
    </button>
  );
}
