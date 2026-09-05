"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { PRODUCTS, getProductById } from "@/lib/data/catalog";
import { ProductCard } from "@/components/store/ProductCard";
import { StrydeClips } from "@/components/store/StrydeClips";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { NewsletterSignup } from "@/components/store/NewsletterSignup";
import { useLang } from "@/lib/store/lang";

export default function HomePage() {
  const { t } = useLang();
  const hero = getProductById("boot-14534-h") ?? PRODUCTS[0];
  const others = [...PRODUCTS]
    .filter((p) => p.id !== hero.id)
    .sort((a, b) => b.heatScore - a.heatScore)
    .slice(0, 3);

  const PLANS = [
    { no: "01", title: t("WORKDAY", "工作日"), desc: t("A clean black silhouette that fits easily into a sharper everyday wardrobe.", "利落的黑色轮廓，轻松融入日常穿搭。") },
    { no: "02", title: t("AFTER HOURS", "下班后"), desc: t("Simple enough for dinner, dates and city nights without changing the whole look.", "足够简约，晚餐、约会、城市夜景无需换装。") },
    { no: "03", title: t("WEEKEND", "周末"), desc: t("Easy styling for short trips, walks and casual plans.", "短途出行、散步和休闲计划的百搭之选。") },
  ];

  const ROUTINES = [
    { no: "01", title: t("COMMUTE", "通勤"), img: "/products/14534-h/hero.jpg" },
    { no: "02", title: t("AFTER HOURS", "夜场"), img: "/products/14534-h/black.jpg" },
    { no: "03", title: t("WEEKEND", "周末"), img: "/products/14534-h/lifestyle-01.jpg" },
  ];

  return (
    <div>
      {/* ---------- HERO — 14534-H, product & brand first ---------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-12 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <div className="mb-6 text-xs font-bold tracking-[0.3em] text-ink/45">
              STRYDE
            </div>
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
              <Link href="/find-your-stryde">
                <Button size="lg" variant="outline" className="text-ink border-ink hover:bg-ink hover:text-paper">
                  {t("FIND MY PAIR", "找到我的鞋")} <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/about" className="text-sm font-bold text-ink/70 underline underline-offset-4 decoration-ink/30">
                {t("EXPLORE STRYDE", "了解 STRYDE")}
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

      {/* ---------- ONE PAIR. MORE PLANS. ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-12">
          <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
            {t("THE DAILY ROUTE", "日常路线")}
          </div>
          <h2 className="text-4xl font-black leading-tight md:text-5xl">
            {t("ONE PAIR", "一双鞋")}
            <br />
            {t("MORE PLANS", "更多可能")}
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.no} className="border-t border-ink/15 pt-6">
              <div className="text-xs font-black tracking-[0.25em] text-ink/40">{p.no}</div>
              <h3 className="mt-3 text-2xl font-black tracking-wide">{p.title}</h3>
              <p className="mt-3 text-ink/60 leading-relaxed">{p.desc}</p>
            </div>
          ))}
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

      {/* ---------- STRYDE CLIPS — brand personalization concept around 14534-H ---------- */}
      <StrydeClips />

      {/* ---------- CREATIVE LAB — secondary concepts ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-10">
          <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
            {t("CREATIVE LAB", "创意实验室")}
          </div>
          <h2 className="text-3xl font-black md:text-4xl">{t("Other Concepts", "其他概念")}</h2>
          <p className="mt-2 max-w-xl text-ink/55">
            {t(
              "Secondary footwear concepts explored during the sprint. These are separate directions and are not part of the official 14534-H men's boot supply chain.",
              "冲刺期间探索的次要鞋款概念。这些是独立方向，不属于 14534-H 男靴的正式供应链。"
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
          {others.map((p) => (
            <div key={p.id} className="relative">
              <ProductCard product={p} concept />
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-3xl bg-ink p-10 text-center text-paper md:p-14">
          <h2 className="text-3xl font-black leading-tight md:text-4xl">
            {t("STAND UP STAND OUT", "站起来 出众")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-paper/60">
            {t("The 14534-H — a clean black boot for the way your day moves.", "14534-H——为你一天的每个时刻而生的黑色靴。")}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-paper/40">
            {t("Drop your email for 15% off your first pair.", "输入邮箱，首双立享 15% 折扣。")}
          </p>
          <NewsletterSignup />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={`/products/${hero.slug}`}>
              <Button size="lg">
                <ShoppingBag size={18} /> {t("SHOP THE BOOT", "立即购买")}
              </Button>
            </Link>
            <Link href="/size-guide">
              <Button size="lg" variant="outline">
                {t("FIND YOUR SIZE", "寻找你的尺码")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
