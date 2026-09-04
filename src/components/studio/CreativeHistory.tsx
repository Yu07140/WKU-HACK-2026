"use client";

import { useState } from "react";
import { Copy, Check, Download, ExternalLink, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { downloadImage, useCreativeHistory, type CreativeRecord } from "@/lib/store/creativeHistory";

export function CreativeHistory({
  onReusePrompt,
}: {
  onReusePrompt: (prompt: string) => void;
}) {
  const { records, clear } = useCreativeHistory();

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-ink/55">
          Latest {records.length}/20 generated creatives · stored locally in your browser
        </p>
        {records.length > 0 && (
          <Button variant="outline" size="sm" onClick={clear}>
            <Trash2 size={14} /> Clear history
          </Button>
        )}
      </div>

      {records.length === 0 ? (
        <Card className="flex h-64 flex-col items-center justify-center text-center text-ink/40">
          <History size={36} className="mb-3 opacity-40" />
          <p className="text-sm">
            No creatives yet — generate visuals in Product Creative or Creative Matrix and they
            will show up here.
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {records.map((rec) => (
            <HistoryCard key={rec.id} rec={rec} onReusePrompt={onReusePrompt} />
          ))}
        </div>
      )}
    </div>
  );
}

function HistoryCard({
  rec,
  onReusePrompt,
}: {
  rec: CreativeRecord;
  onReusePrompt: (prompt: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [downloadFail, setDownloadFail] = useState(false);

  return (
    <Card className="overflow-hidden animate-fade-up">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={rec.url} alt={`creative ${rec.styleLabel}`} className="aspect-square w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-white">
          AI CREATIVE
        </span>
        {rec.platform && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[10px] font-bold text-white">
            {rec.platform}
          </span>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-ink/75">{rec.productName}</span>
          <span className="text-ink/40">
            {new Date(rec.timestamp).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 text-[11px] text-ink/50">
          <span className="rounded-full bg-cream px-2 py-0.5">{rec.styleLabel}</span>
          <span className="rounded-full bg-cream px-2 py-0.5">{rec.aspect}</span>
          {rec.sku && <span className="rounded-full bg-cream px-2 py-0.5">SKU {rec.sku}</span>}
        </div>
        <p className="line-clamp-2 text-[11px] leading-relaxed text-ink/45">{rec.prompt}</p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={async () => {
              const ok = await downloadImage(
                rec.url,
                `stryde-${rec.productId}-${rec.timestamp}.jpg`
              );
              setDownloadFail(!ok);
              setTimeout(() => setDownloadFail(false), 2500);
            }}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-ink/60 hover:text-ink"
          >
            <Download size={12} /> Download
          </button>
          {downloadFail && (
            <a
              href={rec.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-ink/50"
            >
              <ExternalLink size={12} /> Open Image
            </a>
          )}
          <button
            onClick={() => {
              navigator.clipboard.writeText(rec.prompt);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-ink/60 hover:text-ink"
          >
            {copied ? <Check size={12} className="text-sage" /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy Prompt"}
          </button>
          <button
            onClick={() => onReusePrompt(rec.prompt)}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-accent-dark"
          >
            ♻ Reuse Prompt
          </button>
        </div>
      </div>
    </Card>
  );
}
