"use client";

import { useState } from "react";
import { LayoutGrid, Loader2, Copy, Check, Download, ExternalLink } from "lucide-react";
import { PRODUCTS } from "@/lib/data/catalog";
import { aiImageUrl } from "@/lib/ai/image";
import { generateCopy, type Platform, type Angle, PLATFORM_LABELS } from "@/lib/ai/copy";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label, Select } from "@/components/ui/input";
import { downloadImage, useCreativeHistory } from "@/lib/store/creativeHistory";
import { cn } from "@/lib/utils";

const PLATFORMS: {
  id: Platform;
  size: "square" | "portrait_16_9";
  aspect: string;
  visual: string;
}[] = [
  {
    id: "TikTok",
    size: "portrait_16_9",
    aspect: "9:16",
    visual:
      "vertical tiktok style lifestyle snapshot, neon casual indoor lighting, gen z aesthetic",
  },
  {
    id: "Instagram",
    size: "square",
    aspect: "1:1",
    visual:
      "instagram feed lifestyle photo, warm editorial tones, styled flat surface or street backdrop, premium fashion aesthetic",
  },
  {
    id: "Meta",
    size: "square",
    aspect: "1:1",
    visual:
      "bold advertising campaign poster, vibrant orange and cream, premium sportswear ad style",
  },
];

const ANGLES: Angle[] = ["style", "versatility", "value", "detail"];

export function CreativeMatrix() {
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [angle, setAngle] = useState<Angle>("style");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadFail, setDownloadFail] = useState<string | null>(null);

  const { add } = useCreativeHistory();
  const product = PRODUCTS.find((p) => p.id === productId)!;

  function generate() {
    setLoading(true);
    setReady(false);
    setTimeout(() => {
      // 每个平台的创意包写入 Creative History
      for (const pf of PLATFORMS) {
        const copy = generateCopy(product, pf.id, angle);
        const url = aiImageUrl(
          `${product.creativePresets?.studio ?? product.imagePrompt}, ${pf.visual}`,
          pf.size
        );
        add({
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          refImage: product.image ?? product.colors[0]?.image,
          url,
          prompt: `${product.creativePresets?.studio ?? product.imagePrompt}, ${pf.visual}`,
          styleId: "studio",
          styleLabel: "Studio preset",
          aspect: pf.aspect,
          platform: pf.id,
        });
        void copy;
      }
      setLoading(false);
      setReady(true);
    }, 1200);
  }

  function allCopyText() {
    return PLATFORMS.map((pf) => {
      const copy = generateCopy(product, pf.id, angle);
      return [
        `==== ${PLATFORM_LABELS[pf.id]} ====`,
        copy.hook ? `Hook: ${copy.hook}` : "",
        copy.primaryCopy ? `Primary: ${copy.primaryCopy}` : "",
        `Headline: ${copy.headline}`,
        `CTA: ${copy.cta}`,
        `Hashtags: ${copy.hashtags.join(" ")}`,
      ]
        .filter(Boolean)
        .join("\n");
    }).join("\n\n");
  }

  async function handleDownload(url: string, platform: string) {
    const ok = await downloadImage(url, `stryde-${product.slug}-${platform.toLowerCase()}.jpg`);
    setDownloadFail(ok ? null : platform);
    setTimeout(() => setDownloadFail(null), 3000);
  }

  return (
    <div>
      <Card className="mb-6 flex flex-wrap items-end gap-4 p-5">
        <div className="min-w-56 flex-1">
          <Label>Select ONE product</Label>
          <Select value={productId} onChange={(e) => setProductId(e.target.value)}>
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.sku ? ` · ${p.sku}` : ""}
              </option>
            ))}
          </Select>
        </div>
        <div className="min-w-40">
          <Label>Marketing angle</Label>
          <Select value={angle} onChange={(e) => setAngle(e.target.value as Angle)}>
            {ANGLES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={generate} disabled={loading}>
          {loading ? <Loader2 size={17} className="animate-spin" /> : <LayoutGrid size={17} />}
          Generate All Creatives
        </Button>
      </Card>

      {loading && (
        <div className="flex items-center justify-center py-20 text-sm font-semibold text-ink/50">
          <Loader2 size={18} className="mr-2 animate-spin" /> Batch-generating visuals + copy for
          TikTok / Instagram / Meta...
        </div>
      )}

      {ready && (
        <>
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => {
                navigator.clipboard.writeText(allCopyText());
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-paper transition hover:bg-black"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "All copy copied!" : "COPY ALL COPY"}
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {PLATFORMS.map((pf) => {
              const copy = generateCopy(product, pf.id, angle);
              const imgUrl = aiImageUrl(
                `${product.creativePresets?.studio ?? product.imagePrompt}, ${pf.visual}`,
                pf.size
              );
              return (
                <Card key={pf.id} className="animate-fade-up">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={`${pf.id} creative`}
                      className={cn(
                        "w-full object-cover",
                        pf.size === "portrait_16_9" ? "aspect-[9/16]" : "aspect-square"
                      )}
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-xs font-bold text-white">
                      {PLATFORM_LABELS[pf.id]}
                    </span>
                    <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-white">
                      AI CREATIVE
                    </span>
                  </div>
                  <div className="space-y-2 p-4">
                    {copy.hook && (
                      <div className="text-sm font-black text-accent-dark">{copy.hook}</div>
                    )}
                    <div className="font-black leading-snug">{copy.headline}</div>
                    <p className="line-clamp-3 text-xs leading-relaxed text-ink/60">
                      {copy.primaryCopy ?? copy.body}
                    </p>
                    <div className="text-xs font-bold text-ink/70">CTA: {copy.cta}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {copy.hashtags.slice(0, 4).map((h) => (
                        <span
                          key={h}
                          className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-semibold text-sage"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => handleDownload(imgUrl, pf.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-ink/55 hover:text-ink"
                      >
                        <Download size={12} /> Download
                      </button>
                      {downloadFail === pf.id && (
                        <a
                          href={imgUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-ink/55"
                        >
                          <ExternalLink size={12} /> Open Image
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
