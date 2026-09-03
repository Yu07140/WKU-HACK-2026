"use client";

import { useState } from "react";
import { ImageIcon, PenLine, LayoutGrid, Sparkles } from "lucide-react";
import { SceneGenerator } from "@/components/studio/SceneGenerator";
import { CopyGenerator } from "@/components/studio/CopyGenerator";
import { CreativeMatrix } from "@/components/studio/CreativeMatrix";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "scene", label: "场景图生成", icon: ImageIcon },
  { id: "copy", label: "广告文案", icon: PenLine },
  { id: "matrix", label: "创意矩阵", icon: LayoutGrid },
] as const;

export default function StudioPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("scene");

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-white">
          <Sparkles size={22} />
        </span>
        <div>
          <h1 className="text-3xl font-black">AIGC 素材工坊 · Creative Studio</h1>
          <p className="text-sm text-ink/55">
            白牌货盘 → 可投放素材：场景图、多语言广告文案、跨平台创意矩阵，分钟级产出
          </p>
        </div>
      </div>

      <div className="mt-8 inline-flex rounded-full border border-ink/15 bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition",
              tab === t.id ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"
            )}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "scene" && <SceneGenerator />}
        {tab === "copy" && <CopyGenerator />}
        {tab === "matrix" && <CreativeMatrix />}
      </div>
    </div>
  );
}
