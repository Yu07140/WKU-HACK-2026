"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, Loader2, Rocket } from "lucide-react";
import { PRODUCTS } from "@/lib/data/catalog";
import { aiImageUrl } from "@/lib/ai/image";
import { generateCopy, type Platform, type Angle } from "@/lib/ai/copy";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PLATFORMS: { id: Platform; size: "square" | "portrait_16_9"; visual: string }[] = [
  { id: "Meta", size: "square", visual: "bold advertising campaign poster, vibrant orange and cream, premium sportswear ad style" },
  { id: "TikTok", size: "portrait_16_9", visual: "vertical tiktok style lifestyle snapshot, neon casual indoor lighting, gen z aesthetic" },
  { id: "Google", size: "square", visual: "clean google shopping product photo on pure white background, sharp e-commerce catalog style" },
];

const ANGLES: Angle[] = ["comfort", "value", "trend", "performance"];

export function CreativeMatrix() {
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [angle, setAngle] = useState<Angle>("value");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const product = PRODUCTS.find((p) => p.id === productId)!;

  function generate() {
    setLoading(true);
    setReady(false);
    setTimeout(() => {
      setLoading(false);
      setReady(true);
    }, 1200);
  }

  return (
    <div>
      <Card className="mb-6 flex flex-wrap items-end gap-4 p-5">
        <div className="min-w-56 flex-1">
          <Label>货盘 SKU</Label>
          <Select value={productId} onChange={(e) => setProductId(e.target.value)}>
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="min-w-40">
          <Label>统一卖点角度</Label>
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
          一键生成 3 平台创意矩阵
        </Button>
      </Card>

      {loading && (
        <div className="flex items-center justify-center py-20 text-sm font-semibold text-ink/50">
          <Loader2 size={18} className="mr-2 animate-spin" /> 正在为 Meta / TikTok / Google 批量出图 + 写文案...
        </div>
      )}

      {ready && (
        <div className="grid gap-6 md:grid-cols-3">
          {PLATFORMS.map((pf) => {
            const copy = generateCopy(product, pf.id, angle);
            const imgUrl = aiImageUrl(
              `${product.imagePrompt}, ${pf.visual}`,
              pf.size
            );
            return (
              <Card key={pf.id} className="overflow-hidden animate-fade-up">
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
                    {pf.id}
                  </span>
                </div>
                <div className="space-y-2 p-4">
                  <div className="font-black leading-snug">{copy.headline}</div>
                  <p className="line-clamp-3 text-xs leading-relaxed text-ink/60">{copy.body}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {copy.hashtags.slice(0, 3).map((h) => (
                      <span key={h} className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-semibold text-sage">
                        {h}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/admin/campaigns"
                    className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-ink py-2 text-xs font-bold text-paper transition hover:bg-black"
                  >
                    <Rocket size={13} /> 推送到投放看板
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
