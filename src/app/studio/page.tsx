"use client";

import { useState } from "react";
import {
  ImageIcon,
  PenLine,
  LayoutGrid,
  Sparkles,
  Clapperboard,
  History,
  Palette,
} from "lucide-react";
import { SceneGenerator } from "@/components/studio/SceneGenerator";
import { CopyGenerator } from "@/components/studio/CopyGenerator";
import { CreativeMatrix } from "@/components/studio/CreativeMatrix";
import { VideoScriptGenerator } from "@/components/studio/VideoScriptGenerator";
import { BrandKitCard } from "@/components/studio/BrandKitCard";
import { CreativeHistory } from "@/components/studio/CreativeHistory";
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
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-white">
          <Sparkles size={22} />
        </span>
        <div>
          <h1 className="text-3xl font-black">AIGC Creative Studio</h1>
          <p className="text-sm text-ink/55">
            REAL PRODUCT → AI CREATIVE → AD COPY → CREATIVE MATRIX → VIDEO SCRIPT → HISTORY
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
    </div>
  );
}
