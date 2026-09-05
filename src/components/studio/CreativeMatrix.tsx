"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, Loader2, Copy, Check, Download, ExternalLink } from "lucide-react";
import { PRODUCTS, getProductById } from "@/lib/data/catalog";
import { aiImageUrl } from "@/lib/ai/image";
import { generateCopy, type Platform, type Angle, PLATFORM_LABELS } from "@/lib/ai/copy";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label, Select } from "@/components/ui/input";
import { downloadImage, useCreativeHistory } from "@/lib/store/creativeHistory";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/store/lang";

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

/** 枚举值保持原文（存入记录 / 拼接文案），展示用本地翻译映射 */
const PLATFORM_DISPLAY: Record<Platform, [string, string]> = {
  Meta: ["Meta Ads", "Meta 广告"],
  TikTok: ["TikTok", "TikTok"],
  Instagram: ["Instagram", "Instagram"],
  Google: ["Google Ads", "Google 广告"],
};

const ANGLE_DISPLAY: Record<Angle, [string, string]> = {
  comfort: ["Comfort", "舒适脚感"],
  value: ["Value", "性价比 / 工厂直供"],
  trend: ["Trend", "潮流社交货币"],
  performance: ["Performance", "性能硬核"],
  style: ["Style", "风格穿搭"],
  versatility: ["Versatility", "一鞋多穿"],
  detail: ["Detail", "产品细节"],
};

export function CreativeMatrix() {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const [productId, setProductId] = useState(() => {
    // 支持从 AI 导购 /studio?productId=xxx 深链自动选中对应商品
    const fromUrl = searchParams.get("productId");
    if (fromUrl && PRODUCTS.some((p) => p.id === fromUrl)) return fromUrl;
    return getProductById("boot-14534-h")?.id ?? PRODUCTS[0].id;
  });
  const [angle, setAngle] = useState<Angle>("style");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadFail, setDownloadFail] = useState<string | null>(null);

  const { add } = useCreativeHistory();
  const product = PRODUCTS.find((p) => p.id === productId)!;

  // 真实供应商参考图（heroImage / image / colors[].realImage / colors[].image）
  const firstColor = product.colors.find((c) => c.realImage || c.image);
  const refImage =
    product.heroImage ??
    product.image ??
    (firstColor ? firstColor.realImage ?? firstColor.image : undefined);

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
          refImage,
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
          <Label>{t("Select ONE product", "选择一个商品")}</Label>
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
          <Label>{t("Marketing angle", "营销角度")}</Label>
          <Select value={angle} onChange={(e) => setAngle(e.target.value as Angle)}>
            {ANGLES.map((a) => (
              <option key={a} value={a}>
                {t(ANGLE_DISPLAY[a][0], ANGLE_DISPLAY[a][1])}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={generate} disabled={loading}>
          {loading ? <Loader2 size={17} className="animate-spin" /> : <LayoutGrid size={17} />}
          {t("Generate All Creatives", "一键生成全部创意")}
        </Button>
      </Card>

      {loading && (
        <div className="flex items-center justify-center py-20 text-sm font-semibold text-ink/50">
          <Loader2 size={18} className="mr-2 animate-spin" />{" "}
          {t(
            "Batch-generating visuals + copy for TikTok / Instagram / Meta...",
            "正在为 TikTok / Instagram / Meta 批量生成图片与文案…"
          )}
        </div>
      )}

      {ready && (
        <>
          {/* Factory Reference Image */}
          <div className="mb-6 flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream">
              {refImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={refImage}
                  alt={`${product.name} ${t("factory reference", "工厂实拍")}`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-ink/40">
                  {t("No ref photo", "暂无实拍图")}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-ink/50">
                {t("Factory Reference Image", "工厂实拍参考图")}
              </div>
              <div className="text-sm font-black">{product.name}</div>
              {product.sku && (
                <div className="text-xs text-ink/50">
                  {t("Supplier SKU", "供应商货号")}: {product.sku}
                </div>
              )}
              <div className="mt-1 text-[11px] text-ink/40">
                {t(
                  "Real supplier photo — the AI creatives below are concept visuals, not real product photos.",
                  "真实供应商实拍 — 下方 AI 创意为概念图，并非真实商品照片。"
                )}
              </div>
            </div>
          </div>

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
              {copied ? t("All copy copied!", "全部文案已复制！") : t("COPY ALL COPY", "复制全部文案")}
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
                      alt={`${pf.id} ${t("creative", "创意图")}`}
                      className={cn(
                        "w-full object-cover",
                        pf.size === "portrait_16_9" ? "aspect-[9/16]" : "aspect-square"
                      )}
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-xs font-bold text-white">
                      {t(PLATFORM_DISPLAY[pf.id][0], PLATFORM_DISPLAY[pf.id][1])}
                    </span>
                    <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-white">
                      {t("AI-Generated", "AI 生成")}
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
                    <div className="text-xs font-bold text-ink/70">
                      {t("CTA", "CTA")}: {copy.cta}
                    </div>
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
                        <Download size={12} /> {t("Download", "下载")}
                      </button>
                      {downloadFail === pf.id && (
                        <a
                          href={imgUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-ink/55"
                        >
                          <ExternalLink size={12} /> {t("Open Image", "打开图片")}
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
