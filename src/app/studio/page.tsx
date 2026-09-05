"use client";

import { Suspense, useState } from "react";
import {
  ImageIcon,
  PenLine,
  LayoutGrid,
  Sparkles,
  Clapperboard,
  History,
  Palette,
  Lock,
} from "lucide-react";
import { SceneGenerator } from "@/components/studio/SceneGenerator";
import { CopyGenerator } from "@/components/studio/CopyGenerator";
import { CreativeMatrix } from "@/components/studio/CreativeMatrix";
import { VideoScriptGenerator } from "@/components/studio/VideoScriptGenerator";
import { BrandKitCard } from "@/components/studio/BrandKitCard";
import { CreativeHistory } from "@/components/studio/CreativeHistory";
import { getProductById } from "@/lib/data/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "scene", label: "Product Creative", icon: ImageIcon },
  { id: "copy", label: "Ad Copy", icon: PenLine },
  { id: "matrix", label: "Creative Matrix", icon: LayoutGrid },
  { id: "video", label: "Video Script", icon: Clapperboard },
  { id: "brand", label: "Brand Kit", icon: Palette },
  { id: "history", label: "Creative History", icon: History },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function StudioPage() {
  const [tab, setTab] = useState<TabId>("scene");
  const [draftPrompt, setDraftPrompt] = useState<string | undefined>(undefined);

  /** Creative History → Product Creative：复用 prompt */
  function reusePrompt(prompt: string) {
    setDraftPrompt(prompt);
    setTab("scene");
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-paper">
          <Sparkles size={22} />
        </span>
        <div>
          <h1 className="text-3xl font-black">Creative Studio</h1>
          <p className="text-sm font-semibold tracking-wider text-ink/50">
            REAL PRODUCT. FASTER CREATIVE.
          </p>
        </div>
      </div>

      <div className="mt-8 inline-flex max-w-full flex-wrap rounded-full border border-ink/15 bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition",
              tab === t.id ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"
            )}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {/* ---------- REFERENCE LOCK ---------- */}
      <ReferenceLock />

      {/* useSearchParams() 需要 Suspense 边界（Next.js App Router 静态渲染要求） */}
      <Suspense fallback={null}>
        <div className="mt-8">
          {tab === "scene" && (
            <SceneGenerator
              draftPrompt={draftPrompt}
              onDraftConsumed={() => setDraftPrompt(undefined)}
            />
          )}
          {tab === "copy" && <CopyGenerator />}
          {tab === "matrix" && <CreativeMatrix />}
          {tab === "video" && <VideoScriptGenerator />}
          {tab === "brand" && <BrandKitCard />}
          {tab === "history" && <CreativeHistory onReusePrompt={reusePrompt} />}
        </div>
      </Suspense>
    </div>
  );
}

/** REFERENCE LOCK: 工厂实拍 vs AI 创意，产品参考锁定 */
function ReferenceLock() {
  const hero = getProductById("boot-14534-h");
  return (
    <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-700">
          <Lock size={12} /> REFERENCE LOCK: ON
        </span>
        <span className="text-xs text-ink/50">SKU 14534-H — product reference locked to factory photography</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-ink/10">
            {hero && (
              <ProductImage
                src={hero.heroImage ?? hero.image}
                prompt={hero.imagePrompt}
                alt="Factory reference"
                size="landscape_4_3"
                className="h-full w-full"
              />
            )}
          </div>
          <div className="mt-2 text-center text-xs font-bold">FACTORY REFERENCE IMAGE</div>
        </div>
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-accent/30 bg-cream">
            {hero && (
              <ProductImage
                src={hero.heroImage ?? hero.image}
                prompt={hero.creativePresets?.ad ?? hero.imagePrompt}
                alt="AI creative"
                size="landscape_4_3"
                className="h-full w-full"
              />
            )}
          </div>
          <div className="mt-2 text-center text-xs font-bold text-accent-dark">AI-GENERATED CREATIVE</div>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-ink/55">
        The factory product remains the source of truth. AI generates the campaign direction —
        not a fictional sellable SKU.
      </p>
    </div>
  );
}
