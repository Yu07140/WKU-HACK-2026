"use client";

import { useState } from "react";
import { Copy, Check, Palette, Type, Mic2, ImagePlus } from "lucide-react";
import { Card } from "@/components/ui/card";

/* ------------------------------------------------------------------
 * Brand Kit —— STRYDE 品牌套件展示
 * 色板与排版取自站点既有设计 token（globals.css），不重做品牌
 * ------------------------------------------------------------------ */

const PALETTE = [
  { name: "Vermilion 朱红", hex: "#ff4d24", usage: "Accent / CTA" },
  { name: "Accent Dark 深朱红", hex: "#d63a16", usage: "Accent hover" },
  { name: "Paper 暖纸白", hex: "#faf8f4", usage: "Background" },
  { name: "Cream 奶油白", hex: "#f3efe7", usage: "Cards / soft bg" },
  { name: "Ink 墨黑", hex: "#16130f", usage: "Text / headings" },
  { name: "Sage 鼠尾草绿", hex: "#3f5d4b", usage: "Secondary / tags" },
];

const LOGO_PROMPT =
  "minimal wordmark logo for footwear brand STRYDE, bold geometric sans-serif uppercase letters, slight forward lean suggesting motion, vermilion orange accent on the final letter, clean white background, flat vector style, premium DTC sportswear brand, no tagline, no extra text";

export function BrandKitCard() {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 品牌核心 */}
      <Card className="space-y-5 p-6">
        <div>
          <div className="text-3xl font-black tracking-[0.14em]">
            STRYDE<span className="text-accent">.</span>
          </div>
          <div className="mt-1 text-sm font-bold text-accent-dark">STAND UP. STAND OUT.</div>
        </div>
        <div>
          <SectionTitle icon={<Mic2 size={13} />}>Brand Positioning</SectionTitle>
          <p className="text-sm leading-relaxed text-ink/70">
            A footwear brand built for the way your day moves. One real product, a faster path to market.
          </p>
        </div>
        <div>
          <SectionTitle icon={<Mic2 size={13} />}>Brand Personality</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {["Bold", "Young", "Honest", "Energetic"].map((t) => (
              <span
                key={t}
                className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-sage"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle icon={<Mic2 size={13} />}>Tone of Voice</SectionTitle>
          <p className="text-sm leading-relaxed text-ink/70">
            Direct, confident, youthful, simple — never overhyped.
          </p>
        </div>
      </Card>

      <div className="space-y-6">
        {/* 色板 */}
        <Card className="p-6">
          <SectionTitle icon={<Palette size={13} />}>Color Palette</SectionTitle>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {PALETTE.map((c) => (
              <button
                key={c.hex}
                onClick={() => copy(c.hex, c.hex)}
                className="group text-left"
                title="Click to copy HEX"
              >
                <div
                  className="flex h-16 items-end justify-end rounded-xl border border-ink/10 p-2"
                  style={{ background: c.hex }}
                >
                  {copied === c.hex ? (
                    <Check size={13} className="text-white mix-blend-difference" />
                  ) : (
                    <Copy
                      size={13}
                      className="text-white opacity-0 mix-blend-difference transition group-hover:opacity-100"
                    />
                  )}
                </div>
                <div className="mt-1.5 text-[11px] font-bold text-ink/75">{c.name}</div>
                <div className="text-[11px] text-ink/45">
                  {c.hex} · {c.usage}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* 排版 */}
        <Card className="p-6">
          <SectionTitle icon={<Type size={13} />}>Typography</SectionTitle>
          <div className="mt-3 space-y-3">
            <div className="rounded-xl border border-ink/10 p-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink/45">
                Heading
              </div>
              <div className="text-2xl font-black tracking-tight">Headings — Black 900</div>
            </div>
            <div className="rounded-xl border border-ink/10 p-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink/45">
                Body
              </div>
              <p className="text-sm leading-relaxed text-ink/70">
                Body copy — system sans-serif, regular 400, relaxed leading.
              </p>
            </div>
          </div>
        </Card>

        {/* Logo prompt */}
        <Card className="p-6">
          <SectionTitle icon={<ImagePlus size={13} />}>Logo Prompt</SectionTitle>
          <p className="mt-2 rounded-xl bg-cream p-3 text-xs leading-relaxed text-ink/70">
            {LOGO_PROMPT}
          </p>
          <button
            onClick={() => copy(LOGO_PROMPT, "logo")}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-accent-dark"
          >
            {copied === "logo" ? <Check size={13} /> : <Copy size={13} />}
            {copied === "logo" ? "Copied!" : "Copy logo prompt"}
          </button>
        </Card>
      </div>
    </div>
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink/50">
      {icon}
      {children}
    </div>
  );
}
