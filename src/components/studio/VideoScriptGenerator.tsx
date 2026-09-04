"use client";

import { useState } from "react";
import { Clapperboard, Loader2, Copy, Check, RotateCcw } from "lucide-react";
import { PRODUCTS } from "@/lib/data/catalog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label, Select } from "@/components/ui/input";
import { generateVideoScript, scriptToText, type VideoScript } from "@/lib/ai/videoScript";

export function VideoScriptGenerator() {
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [variant, setVariant] = useState(0);
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<VideoScript | null>(null);
  const [copied, setCopied] = useState(false);

  const product = PRODUCTS.find((p) => p.id === productId)!;

  function generate(nextVariant?: number) {
    const v = nextVariant ?? variant;
    setLoading(true);
    setTimeout(() => {
      setScript(generateVideoScript(product, v));
      setLoading(false);
    }, 700);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card className="space-y-4 p-5">
        <div>
          <Label>Product / SKU</Label>
          <Select
            value={productId}
            onChange={(e) => {
              setProductId(e.target.value);
              setScript(null);
              setVariant(0);
            }}
          >
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.sku ? ` · ${p.sku}` : ""}
              </option>
            ))}
          </Select>
        </div>
        <Button className="w-full" onClick={() => generate()} disabled={loading}>
          {loading ? <Loader2 size={17} className="animate-spin" /> : <Clapperboard size={17} />}
          {loading ? "Writing script..." : "Generate 15s Script"}
        </Button>
        <p className="text-[11px] leading-relaxed text-ink/40">
          Offline template engine — works without any API key. Replace
          <code className="mx-1 rounded bg-cream px-1">lib/ai/videoScript.ts</code>
          internals with an LLM call to upgrade.
        </p>
      </Card>

      <Card className="p-6">
        {!script && !loading && (
          <div className="flex h-full min-h-64 items-center justify-center text-center text-ink/40">
            <div>
              <Clapperboard size={36} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">
                Generate a structured 15-second TikTok / Reels script: 4 scenes with visuals,
                on-screen text, voiceover and CTA.
              </p>
            </div>
          </div>
        )}
        {loading && (
          <div className="flex h-full min-h-64 items-center justify-center text-sm font-semibold text-ink/50">
            <Loader2 size={18} className="mr-2 animate-spin" /> Writing script...
          </div>
        )}
        {script && (
          <div className="animate-fade-up">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                15s · TikTok / Reels
              </span>
              <span className="text-xs text-ink/50">
                {product.name}
                {product.sku ? ` · ${product.sku}` : ""}
              </span>
            </div>
            <div className="space-y-3">
              {script.scenes.map((s) => (
                <div key={s.time} className="rounded-xl border border-ink/10 p-4">
                  <div className="text-xs font-black text-accent-dark">{s.time}</div>
                  <div className="mt-2 space-y-1 text-sm leading-relaxed text-ink/75">
                    <p>
                      <span className="font-bold text-ink/55">Visual:</span> {s.visual}
                    </p>
                    <p>
                      <span className="font-bold text-ink/55">On-screen text:</span> {s.text}
                    </p>
                    <p>
                      <span className="font-bold text-ink/55">Voiceover:</span> {s.voiceover}
                    </p>
                  </div>
                </div>
              ))}
              {script.scenes[3] && (
                <div className="rounded-xl bg-cream p-3 text-xs text-ink/60">
                  <span className="font-bold text-ink/70">End CTA:</span>{" "}
                  {script.scenes[3].voiceover}
                </div>
              )}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(scriptToText(product, script));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-paper transition hover:bg-black"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Script copied!" : "Copy Script"}
              </button>
              <button
                onClick={() => {
                  const v = variant + 1;
                  setVariant(v);
                  generate(v);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 text-xs font-bold text-ink/70 transition hover:border-ink/50"
              >
                <RotateCcw size={14} /> Regenerate
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
