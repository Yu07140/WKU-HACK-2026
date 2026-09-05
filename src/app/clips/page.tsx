"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getProductById } from "@/lib/data/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { CLIP_COLLECTIONS, STATUS } from "@/lib/data/brand";
import { LetterSelector } from "@/components/clips/LetterSelector";
import { useLang } from "@/lib/store/lang";

// Render-site translations for CLIP_COLLECTIONS data (data file stays untouched).
const COLLECTION_NAME_CN: Record<string, string> = {
  SIGNATURE: "品牌签名",
  MONO: "极简符号",
  PERSONAL: "专属字母",
  CITY: "城市代码",
};

const COLLECTION_DESC_CN: Record<string, string> = {
  "STRYDE-branded marks designed around the brand wordmark.":
    "以 STRYDE 品牌字标为灵感的标志性字母扣。",
  "Minimal graphic symbols in black, graphite and silver-tone.":
    "黑色、石墨与银色调的极简图形符号。",
  "Choose your initial — a quiet, personal signature.":
    "选择你的首字母——低调的个人签名。",
  "City-inspired text identity. No official logos or trademarks.":
    "城市灵感的文字标识，不含官方标志或商标。",
};

export default function ClipsPage() {
  const { t } = useLang();
  const hero = getProductById("boot-14534-h");

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      {/* ---------- HERO ---------- */}
      <div className="mb-14 border-b border-ink/10 pb-10">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <div className="text-xs font-bold tracking-[0.3em] text-ink/40">
            {t("PERSONALIZE YOUR STRYDE", "个性化你的 STRYDE")}
          </div>
          <span className="rounded-full bg-ink/90 px-3 py-1 text-[11px] font-black tracking-wider text-paper">
            {t(STATUS.comingSoon, "即将推出")}
          </span>
          <span className="rounded-full bg-ink/10 px-3 py-1 text-[11px] font-bold tracking-wider text-ink/60">
            {t(STATUS.inDevelopment, "开发中")}
          </span>
        </div>
        <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
          {t("MAKE IT YOURS.", "打造你的专属。")}
        </h1>
        <p className="mt-4 text-2xl font-bold tracking-wide text-ink/70">STRYDE CLIPS</p>
        <p className="mt-5 max-w-xl text-lg text-ink/60">
          {t(
            "Small details. Your signature. A new way to personalize the 14534-H with removable STRYDE-designed clips.",
            "细节自由搭配，签名由你定义——用可拆卸的 STRYDE 字母扣为 14534-H 打造全新个性化方式。"
          )}
        </p>
      </div>

      {/* ---------- BASE PRODUCT + CONCEPT ---------- */}
      <section className="mb-20 grid gap-10 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-cream">
          {hero && (
            <ProductImage
              src={hero.heroImage ?? hero.image}
              prompt={hero.imagePrompt}
              alt={t(
                "STRYDE 14534-H — the base boot for STRYDE CLIPS",
                "STRYDE 14534-H — STRYDE CLIPS 的基础靴款"
              )}
              size="portrait_4_3"
              className="aspect-[4/5] w-full"
            />
          )}
          <div className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-black tracking-wider text-paper">
            {t(STATUS.designPreview, "设计预览")}
          </div>
          {/* Conceptual clip indicator — marks the front loop area where clips attach */}
          <div className="absolute left-1/2 top-[42%] -translate-x-1/2">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 rounded-full border-2 border-accent bg-paper/90 px-3 py-1.5 text-xs font-black tracking-wider text-accent-dark shadow-lg">
                <Sparkles size={13} /> {t("STRYDE CLIP", "STRYDE 字母扣")}
              </div>
              <div className="h-6 w-px bg-accent/60" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-xs font-bold tracking-[0.2em] text-accent">
            {t("BASED ON 14534-H", "基于 14534-H")}
          </div>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">
            {t("Same boot.", "同一双靴，")}
            <br />
            {t("Your detail.", "属于你的细节。")}
          </h2>
          <p className="mt-4 text-ink/60 leading-relaxed">
            {t(
              "STRYDE CLIPS are removable decorative clip-on accessories designed around the existing front loop and linear detailing of the real 14534-H boot. The shoe itself stays exactly as supplied — only a small, personal detail changes.",
              "STRYDE CLIPS 是围绕 14534-H 现有的前部环状与线条细节设计的可拆卸装饰扣。鞋子本身保持原样——只做小而个人化的改变。"
            )}
          </p>
          <ul className="mt-6 space-y-2 text-sm text-ink/70">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-accent">•</span>{" "}
              {t("Removable — clip on, clip off", "可拆卸——随扣随取")}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-accent">•</span>{" "}
              {t("Designed for the 14534-H front loop", "专为 14534-H 前部环扣设计")}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-accent">•</span>{" "}
              {t("No change to the boot construction", "不改变靴子本身结构")}
            </li>
          </ul>
          <div className="mt-6 rounded-2xl bg-cream p-4 text-xs leading-relaxed text-ink/55">
            {t(STATUS.comingSoon, "即将推出")} —{" "}
            {t(
              "Personalized STRYDE Clips are currently in development.",
              "个性化 STRYDE 字母扣目前正在开发中。"
            )}
          </div>
        </div>
      </section>

      {/* ---------- A–Z LETTER SELECTOR ---------- */}
      <LetterSelector />

      {/* ---------- FOUR COLLECTIONS ---------- */}
      <section className="mb-20">
        <div className="mb-8">
          <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
            {t("FOUR DIRECTIONS", "四大方向")}
          </div>
          <h2 className="text-3xl font-black md:text-4xl">{t("The collections", "系列一览")}</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CLIP_COLLECTIONS.map((c) => (
            <div
              key={c.no}
              className="flex flex-col rounded-3xl border border-ink/10 bg-white p-6"
            >
              <div className="text-xs font-black tracking-[0.25em] text-ink/40">{c.no}</div>
              <h3 className="mt-2 text-xl font-black tracking-wide">
                {t(c.name, COLLECTION_NAME_CN[c.name] ?? c.name)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">
                {t(c.desc, COLLECTION_DESC_CN[c.desc] ?? c.desc)}
              </p>
              <div className="mt-auto pt-5">
                <div className="flex flex-wrap gap-2">
                  {c.samples.map((s) => (
                    <span
                      key={s}
                      className="flex h-10 min-w-10 items-center justify-center rounded-xl border border-ink/15 bg-cream px-2 text-sm font-black tracking-wider text-ink/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink/40">
          {t(
            "Sample marks shown as concept references. Third-party logos and official city trademarks are not used.",
            "示例标识仅作概念参考。未使用任何第三方品牌标识或官方城市商标。"
          )}
        </p>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-3xl rounded-3xl bg-ink p-10 text-center text-paper md:p-14">
        <h2 className="text-3xl font-black leading-tight md:text-4xl">
          {t("KEEP THE ROUTE GOING.", "让路线继续延伸。")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-paper/60">
          {t(
            "Start with the 14534-H. Personalized STRYDE Clips are currently in development.",
            "从 14534-H 开始。个性化 STRYDE 字母扣目前正在开发中。"
          )}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products/mono-boot">
            <Button size="lg">
              {t("SHOP THE BOOT", "选购靴款")} <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline" className="border-paper/30 text-paper hover:bg-paper/10">
              {t("EXPLORE THE SYSTEM", "探索完整系统")}
            </Button>
          </Link>
        </div>
      </section>

      {/* ---------- DISCLOSURE ---------- */}
      <p className="mt-10 text-center text-xs leading-relaxed text-ink/40">
        {t(STATUS.comingSoon, "即将推出")} —{" "}
        {t("STRYDE CLIPS are currently in development.", "STRYDE CLIPS 目前正在开发中。")}
      </p>
    </div>
  );
}
