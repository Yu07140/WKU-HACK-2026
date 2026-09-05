"use client";

import { useState } from "react";
import { Copy, Check, Palette, Type, Mic2, ImagePlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLang } from "@/lib/store/lang";

/* ------------------------------------------------------------------
 * Brand Kit —— STRYDE 品牌套件展示
 * 色板与排版取自站点既有设计 token（globals.css），不重做品牌
 * ------------------------------------------------------------------ */

const PALETTE = [
  { name: "Vermilion 朱红", hex: "#ff4d24", usage: "Accent / CTA", usageCn: "强调色 / CTA" },
  { name: "Accent Dark 深朱红", hex: "#d63a16", usage: "Accent hover", usageCn: "强调色悬停" },
  { name: "Paper 暖纸白", hex: "#faf8f4", usage: "Background", usageCn: "页面背景" },
  { name: "Cream 奶油白", hex: "#f3efe7", usage: "Cards / soft bg", usageCn: "卡片 / 浅色底" },
  { name: "Ink 墨黑", hex: "#16130f", usage: "Text / headings", usageCn: "正文 / 标题" },
  { name: "Sage 鼠尾草绿", hex: "#3f5d4b", usage: "Secondary / tags", usageCn: "辅助色 / 标签" },
];

const PERSONALITY_TAGS = ["Bold", "Young", "Honest", "Energetic"] as const;

const PERSONALITY_TAG_CN: Record<(typeof PERSONALITY_TAGS)[number], string> = {
  Bold: "大胆",
  Young: "年轻",
  Honest: "真诚",
  Energetic: "活力",
};

const LOGO_PROMPT =
  "minimal wordmark logo for footwear brand STRYDE, bold geometric sans-serif uppercase letters, slight forward lean suggesting motion, vermilion orange accent on the final letter, clean white background, flat vector style, premium DTC sportswear brand, no tagline, no extra text";

export function BrandKitCard() {
  const { t } = useLang();
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
          <SectionTitle icon={<Mic2 size={13} />}>{t("Brand Positioning", "品牌定位")}</SectionTitle>
          <p className="text-sm leading-relaxed text-ink/70">
            {t(
              "A footwear brand built for the way your day moves. One real product, a faster path to market.",
              "为一天的行动轨迹而生的鞋履品牌。一件真实产品，一条更快的上市路径。"
            )}
          </p>
        </div>
        <div>
          <SectionTitle icon={<Mic2 size={13} />}>{t("Brand Personality", "品牌个性")}</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {PERSONALITY_TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-sage"
              >
                {t(tag, PERSONALITY_TAG_CN[tag])}
              </span>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle icon={<Mic2 size={13} />}>{t("Tone of Voice", "语气风格")}</SectionTitle>
          <p className="text-sm leading-relaxed text-ink/70">
            {t("Direct, confident, youthful, simple — never overhyped.", "直接、自信、年轻、简洁 — 绝不浮夸。")}
          </p>
        </div>
      </Card>

      <div className="space-y-6">
        {/* 色板 */}
        <Card className="p-6">
          <SectionTitle icon={<Palette size={13} />}>{t("Color Palette", "色板")}</SectionTitle>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {PALETTE.map((c) => (
              <button
                key={c.hex}
                onClick={() => copy(c.hex, c.hex)}
                className="group text-left"
                title={t("Click to copy HEX", "点击复制 HEX")}
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
                  {c.hex} · {t(c.usage, c.usageCn)}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* 排版 */}
        <Card className="p-6">
          <SectionTitle icon={<Type size={13} />}>{t("Typography", "字体排版")}</SectionTitle>
          <div className="mt-3 space-y-3">
            <div className="rounded-xl border border-ink/10 p-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink/45">
                {t("Heading", "标题")}
              </div>
              <div className="text-2xl font-black tracking-tight">
                {t("Headings — Black 900", "标题字重 — Black 900")}
              </div>
            </div>
            <div className="rounded-xl border border-ink/10 p-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink/45">
                {t("Body", "正文")}
              </div>
              <p className="text-sm leading-relaxed text-ink/70">
                {t(
                  "Body copy — system sans-serif, regular 400, relaxed leading.",
                  "正文字体 — 系统无衬线体，常规 400，宽松行距。"
                )}
              </p>
            </div>
          </div>
        </Card>

        {/* Logo prompt */}
        <Card className="p-6">
          <SectionTitle icon={<ImagePlus size={13} />}>{t("Logo Prompt", "Logo 提示词")}</SectionTitle>
          <p className="mt-2 rounded-xl bg-cream p-3 text-xs leading-relaxed text-ink/70">
            {LOGO_PROMPT}
          </p>
          <button
            onClick={() => copy(LOGO_PROMPT, "logo")}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-accent-dark"
          >
            {copied === "logo" ? <Check size={13} /> : <Copy size={13} />}
            {copied === "logo" ? t("Copied!", "已复制！") : t("Copy logo prompt", "复制 Logo 提示词")}
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
