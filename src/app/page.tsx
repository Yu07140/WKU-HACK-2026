"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Layers, ShieldCheck } from "lucide-react";
import { getProductById } from "@/lib/data/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { NewsletterSignup } from "@/components/store/NewsletterSignup";
import { useLang } from "@/lib/store/lang";
import { CLIP_COLLECTIONS, ECOSYSTEM, STATUS } from "@/lib/data/brand";

export default function HomePage() {
  const { t } = useLang();
  const hero = getProductById("boot-14534-h");

  const ROUTINES = [
    { no: "01", title: t("COMMUTE", "通勤"), img: "/products/14534-h/hero.jpg" },
    { no: "02", title: t("AFTER HOURS", "夜场"), img: "/products/14534-h/black.jpg" },
    { no: "03", title: t("WEEKEND", "周末"), img: "/products/14534-h/lifestyle-01.jpg" },
  ];

  if (!hero) return null;

  return (
    <div>
      {/* ---------- HERO — 14534-H ---------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-12 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <div className="mb-6 text-xs font-bold tracking-[0.3em] text-ink/45">STRYDE</div>
            <h1 className="text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
              {t("STAND UP", "站起来")}
              <br />
              <span className="text-ink/80">{t("STAND OUT", "出众")}</span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-ink/65">
              {t(
                "A clean black boot built for the way your day actually moves — from work hours to everything after.",
                "一双干净的黑色靴，为你一天的每个时刻而生——从工作到下班后的所有场景。"
              )}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href={`/products/${hero.slug}`}>
                <Button size="lg">
                  {t("SHOP THE BOOT", "立即购买")} <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/products" className="text-sm font-bold text-ink/70 underline underline-offset-4 decoration-ink/30">
                {t("THE STRYDE SYSTEM", "STRYDE 系统")}
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium tracking-wider text-ink/45">
              <span>EU 38–46</span>
              <span className="h-1 w-1 rounded-full bg-ink/30" />
              <span>{t("Microfiber upper", "超纤鞋面")}</span>
              <span className="h-1 w-1 rounded-full bg-ink/30" />
              <span>{t("Rubber outsole", "橡胶大底")}</span>
            </div>
          </div>

          <div className="relative">
            <ProductImage
              src={hero.heroImage ?? hero.image}
              prompt={hero.imagePrompt}
              alt={`STRYDE 14534-H — black minimalist ankle boot`}
              size="portrait_4_3"
              className="aspect-[4/5] rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ---------- FIND YOUR STRYDE — Style Quiz 入口 ---------- */}
      <section className="bg-ink text-paper">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-16 md:py-20 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-bold tracking-[0.3em] text-paper/45">{t("STYLE QUIZ", "风格测试")}</div>
            <h2 className="mt-3 text-4xl font-black leading-tight md:text-5xl">{t("FIND YOUR STRYDE", "寻找你的 STRYDE")}</h2>
            <p className="mt-4 max-w-md text-paper/60">
              {t("Three questions. Find the pair that matches your style.", "三个问题，找到最适合你风格的那双。")}
            </p>
          </div>
          <Link href="/find-your-stryde">
            <Button size="lg" className="!bg-paper !text-ink hover:!bg-white">
              {t("FIND MY PAIR", "找到我的鞋")} <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* ---------- ONE BOOT. THREE ROUTINES. ---------- */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="mb-12">
            <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
              {t("EDITORIAL", "编辑精选")}
            </div>
            <h2 className="text-4xl font-black leading-tight md:text-5xl">
              {t("ONE BOOT", "一双靴")}
              <br />
              {t("THREE ROUTINES", "三种场景")}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {ROUTINES.map((r) => (
              <div key={r.no} className="group overflow-hidden rounded-3xl bg-white">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <ProductImage
                    src={r.img}
                    prompt="black minimalist ankle boot, clean editorial photography"
                    alt={r.title}
                    size="portrait_4_3"
                    className="h-full w-full transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-black tracking-wider text-paper">
                    {r.no} · {r.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-ink/40">
            {t("AI Campaign Concept — the real 14534-H remains the product reference.", "AI 营销概念图——实际商品以 14534-H 为准。")}
          </p>
        </div>
      </section>

      {/* ---------- MAKE IT YOURS. — STRYDE CLIPS ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-12 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
              {t("PERSONALIZE YOUR STRYDE", "个性化你的 STRYDE")}
            </div>
            <h2 className="text-4xl font-black leading-tight md:text-5xl">{ECOSYSTEM.clips}</h2>
            <p className="mt-4 text-2xl font-bold tracking-wide text-ink/70">
              {t("STRYDE CLIPS", "STRYDE CLIPS")}
            </p>
            <p className="mt-3 max-w-xl text-ink/60">
              {t(
                "Small details. Your signature. A new way to personalize the 14534-H with removable STRYDE-designed clips.",
                "小细节，大标记。用可拆装的 STRYDE 设计 clip 个性化 14534-H。"
              )}
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-ink/90 px-4 py-1.5 text-xs font-black tracking-wider text-paper">
            {STATUS.comingSoon}
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CLIP_COLLECTIONS.map((c) => (
            <div key={c.no} className="rounded-3xl border border-ink/10 bg-white p-6">
              <div className="text-xs font-black tracking-[0.25em] text-ink/40">{c.no}</div>
              <h3 className="mt-2 text-xl font-black tracking-wide">{t(c.name, c.name)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{c.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {c.samples.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-ink/15 bg-cream px-2 text-xs font-black tracking-wider text-ink/70"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/clips">
            <Button size="lg" variant="outline">
              {t("EXPLORE STRYDE CLIPS", "探索 STRYDE CLIPS")} <ArrowRight size={17} />
            </Button>
          </Link>
        </div>
      </section>

      {/* ---------- STRYDE DUO ---------- */}
      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.3em] text-paper/45">
              <Layers size={14} /> {t("BUNDLE", "组合")}
            </div>
            <h2 className="text-4xl font-black leading-tight md:text-5xl">
              {ECOSYSTEM.duo.split("\n").map((l, i) => (
                <span key={i}>
                  {l}
                  {i === 0 && <br />}
                </span>
              ))}
            </h2>
            <p className="mt-5 max-w-md text-paper/60">
              {t(
                "One for the workweek. One for everything after. Build a two-pair rotation using the same real 14534-H — choose each EU size separately.",
                "一双工作日，一双其余时间。用同一双真实 14534-H 组合两双轮换，每双欧码可分开选。"
              )}
            </p>
            <div className="mt-8">
              <Link href="/duo">
                <Button size="lg" className="bg-paper text-ink hover:bg-paper/90">
                  {t("BUILD YOUR DUO", "组合你的 DUO")} <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-paper/40">
              {t(
                "Bundle savings will be finalized after launch-cost validation.",
                "组合优惠将在发布成本验证后确定。"
              )}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((n) => (
              <div key={n} className="relative overflow-hidden rounded-3xl bg-cream">
                <ProductImage
                  src={hero.heroImage ?? hero.image}
                  prompt={hero.imagePrompt}
                  alt={`STRYDE 14534-H — Pair ${n}`}
                  size="portrait_4_3"
                  className="aspect-[4/5] w-full"
                />
                <div className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-black tracking-wider text-paper">
                  {t("PAIR", "双")} {n}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- STRYDE CARE 01 ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative overflow-hidden rounded-3xl bg-cream">
            <ProductImage
              src={hero.heroImage ?? hero.image}
              prompt={hero.imagePrompt}
              alt="STRYDE 14534-H — care system base"
              size="portrait_4_3"
              className="aspect-[4/5] w-full"
            />
          </div>
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.3em] text-ink/40">
              <ShieldCheck size={14} /> {t("FUTURE EXTENSION", "未来延伸")}
            </div>
            <h2 className="text-4xl font-black leading-tight md:text-5xl">{ECOSYSTEM.care}</h2>
            <p className="mt-4 text-2xl font-bold tracking-wide text-ink/70">
              {t("STRYDE CARE 01", "STRYDE CARE 01")}
            </p>
            <p className="mt-3 max-w-md text-ink/60">
              {t(
                "A future care extension designed around the STRYDE footwear system. In development — details will be shared at launch.",
                "围绕 STRYDE 鞋履系统设计的未来护理延伸，正在开发中，详情将于发布时公布。"
              )}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-ink/90 px-3 py-1 text-[11px] font-black tracking-wider text-paper">
                {STATUS.comingSoon}
              </span>
              <span className="rounded-full bg-ink/10 px-3 py-1 text-[11px] font-bold tracking-wider text-ink/60">
                {STATUS.inDevelopment}
              </span>
            </div>
            <div className="mt-8">
              <Link href="/care">
                <Button size="lg" variant="outline">
                  {t("EXPLORE THE CONCEPT", "探索概念")} <ArrowRight size={17} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-3xl bg-ink p-10 text-center text-paper md:p-14">
          <h2 className="text-3xl font-black leading-tight md:text-4xl">
            {t("STAND UP STAND OUT", "站起来 出众")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-paper/60">
            {t("The 14534-H — a clean black boot for the way your day moves.", "14534-H——为你一天的每个时刻而生的黑色靴。")}
          </p>
          <div className="mt-6">
            <div className="text-xs font-black tracking-[0.25em] text-paper/50">
              {t("JOIN THE STRYDE LIST", "加入 STRYDE 名单")}
            </div>
            <p className="mx-auto mt-2 max-w-md text-sm text-paper/40">
              {t(
                "Get 15% off your first pair, plus launch updates and early access.",
                "首双立享 15% 折扣，抢先获取发售动态与早鸟权益。"
              )}
            </p>
            <NewsletterSignup />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={`/products/${hero.slug}`}>
              <Button size="lg">
                <ShoppingBag size={18} /> {t("SHOP THE BOOT", "立即购买")}
              </Button>
            </Link>
            <Link href="/size-guide">
              <Button size="lg" variant="outline" className="border-paper/30 text-paper hover:bg-paper/10">
                {t("FIND YOUR SIZE", "寻找你的尺码")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
