"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import { PRODUCTS, getProduct } from "@/lib/data/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/store/lang";

const PRODUCT_ID = "p01"; // No. 5910-5

/** Quiz 结果颜色 → 货盘真实配色名映射 */
const COLOR_TO_CATALOG: Record<string, string> = {
  Black: "Black",
  "Black Patent": "Black Patent Leather",
  "Black Canvas": "Black Canvas",
  "Black Snake": "Black Snake Pattern",
  Beige: "Off-white",
  Denim: "Denim",
  Orange: "Orange",
  Pink: "Pink",
  Yellow: "Yellow",
  "Rose Red": "Magenta",
};

/** 并列时的优先级 */
const TIEBREAKER = [
  "Black Patent",
  "Black",
  "Denim",
  "Black Snake",
  "Orange",
  "Rose Red",
  "Beige",
  "Pink",
  "Yellow",
  "Black Canvas",
];

type ColorKey = keyof typeof COLOR_TO_CATALOG;

/** 每个答案给候选颜色加分 */
type Scoring = Partial<Record<ColorKey, number>>;

const STORAGE_KEY = "stryde-style-quiz-result";

function computeResult(answers: Scoring[]): ColorKey[] {
  const totals: Record<string, number> = {};
  for (const a of answers) {
    for (const [k, v] of Object.entries(a)) {
      totals[k] = (totals[k] ?? 0) + (v ?? 0);
    }
  }
  const ranked = Object.entries(totals)
    .filter(([, v]) => v > 0)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return TIEBREAKER.indexOf(a[0]) - TIEBREAKER.indexOf(b[0]);
    })
    .map(([k]) => k as ColorKey);
  return ranked.length ? ranked : ["Black"];
}

export function StyleQuiz() {
  const { t } = useLang();
  const product = getProduct(PRODUCT_ID) ?? PRODUCTS[0];
  const [step, setStep] = useState(0); // 0,1,2 = questions, 3 = result
  const [answers, setAnswers] = useState<Scoring[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  // 翻译后的题目
  const QUESTIONS = [
    {
      no: "01",
      title: t("WHAT'S YOUR STYLE?", "你的风格是什么？"),
      subtitle: t("Pick the one that feels most like your closet.", "选一个最像你衣柜风格的。"),
      options: [
        { label: t("MINIMAL", "极简"), desc: t("Clean lines. No extra noise.", "利落线条，不做多余。"), score: { Black: 3, Beige: 2, "Black Patent": 2 } as Scoring },
        { label: t("STREET", "街头"), desc: t("Relaxed. Built around denim and layers.", "随性。围绕牛仔和叠穿。"), score: { Denim: 3, "Black Canvas": 2, Yellow: 1 } as Scoring },
        { label: t("BOLD", "大胆"), desc: t("Color first. Attention welcome.", "颜色优先，欢迎注目。"), score: { Orange: 3, "Rose Red": 2, Pink: 2, Yellow: 1 } as Scoring },
        { label: t("EXPERIMENTAL", "实验"), desc: t("Texture, contrast, and unexpected details.", "质感、对比和意外细节。"), score: { "Black Snake": 3, "Black Patent": 2, "Rose Red": 1 } as Scoring },
      ],
    },
    {
      no: "02",
      title: t("WHAT DO YOU WEAR MOST?", "你最常穿什么？"),
      subtitle: t("Your go-to uniform.", "你的日常制服。"),
      options: [
        { label: t("WIDE-LEG JEANS", "阔腿牛仔裤"), desc: t("Denim on repeat.", "牛仔循环。"), score: { Denim: 3, "Black Canvas": 1 } as Scoring },
        { label: t("ALL BLACK", "一身黑"), desc: t("Head to toe, no exceptions.", "从头到脚，没有例外。"), score: { Black: 3, "Black Patent": 3, "Black Snake": 2 } as Scoring },
        { label: t("DRESSES & SKIRTS", "连衣裙 & 半身裙"), desc: t("Flowy, structured, somewhere in between.", "飘逸、挺括、或介于两者之间。"), score: { Beige: 3, Pink: 2, "Rose Red": 2 } as Scoring },
        { label: t("CARGOS & OVERSIZED FITS", "工装 &  Oversized"), desc: t("Room to move, layers on layers.", "活动自如，层层叠叠。"), score: { Denim: 2, "Black Canvas": 2, Orange: 2 } as Scoring },
      ],
    },
    {
      no: "03",
      title: t("HOW MUCH ATTENTION DO YOU WANT?", "你想获得多少关注？"),
      subtitle: t("Be honest.", "诚实一点。"),
      options: [
        { label: t("KEEP IT CLEAN", "低调内敛"), desc: t("I want the shape to do the talking.", "让鞋型自己说话。"), score: { Black: 3, Beige: 2, "Black Canvas": 2 } as Scoring },
        { label: t("NOTICEABLE", "有点存在感"), desc: t("A little attention is the point.", "适当的注目，刚刚好。"), score: { "Black Patent": 2, Pink: 2, Yellow: 2, Denim: 1 } as Scoring },
        { label: t("MAIN CHARACTER", "主角光环"), desc: t("I didn't come here to blend in.", "我来就是不想被忽略。"), score: { "Black Snake": 3, Orange: 3, "Rose Red": 3 } as Scoring },
      ],
    },
  ];

  // 翻译后的结果文案
  const RESULT_COPY: Record<string, { tagline: string; body: string }> = {
    Black: { tagline: t("AFTER DARK", "入夜"), body: t("Quiet color. Loud silhouette.", "低调颜色，高调轮廓。") },
    "Black Patent": { tagline: t("FLASH MODE", "闪光模式"), body: t("Clean from a distance. Impossible to ignore up close.", "远处干净，近处无法忽视。") },
    Denim: { tagline: t("OFF-DUTY", "休闲时刻"), body: t("Built for wide denim, layers and everyday streetwear.", "为阔腿牛仔、叠穿和日常街头而生。") },
    "Black Canvas": { tagline: t("EVERYDAY EDGE", "日常锋芒"), body: t("Low-key color. High-impact shape.", "低调颜色，强力造型。") },
    "Black Snake": { tagline: t("NO SAFE CHOICES", "拒绝平庸"), body: t("For days when basic isn't an option.", "当基础款不再是选项时。") },
    Orange: { tagline: t("MAIN CHARACTER", "主角"), body: t("Not designed to blend in.", "从不是为了融入而设计。") },
    "Rose Red": { tagline: t("HOT ENERGY", "热烈能量"), body: t("The outfit starts from the shoes.", "整套搭配从鞋开始。") },
    Pink: { tagline: t("SOFT COLOR. BIG ATTITUDE.", "柔软颜色，大态度"), body: t("Sweet color. Serious silhouette.", "甜美颜色，严肃轮廓。") },
    Beige: { tagline: t("QUIET STATEMENT", "安静的宣言"), body: t("Soft tone. Strong shape.", "柔和色调，强力造型。") },
    Yellow: { tagline: t("TURN IT UP", "点亮全场"), body: t("Bright enough to change the whole outfit.", "足够点亮整套搭配。") },
  };

  const SHORT_COPY: Record<string, string> = {
    Black: t("After-dark staple.", "入夜必备。"),
    "Black Patent": t("Polished and glossy.", "精致有光泽。"),
    Denim: t("Off-duty streetwear.", "休闲街头风。"),
    "Black Canvas": t("Everyday low-key.", "日常低调。"),
    "Black Snake": t("Texture, not basic.", "有质感，不平庸。"),
    Orange: t("Built to stand out.", "生来出众。"),
    "Rose Red": t("Outfit starts here.", "搭配从这里开始。"),
    Pink: t("Soft color, big shape.", "柔软颜色，大气造型。"),
    Beige: t("Neutral, versatile.", "中性百搭。"),
    Yellow: t("Bright and playful.", "明亮活泼。"),
  };

  // 从 localStorage 恢复结果
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    if (restored) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAnswers(parsed);
          setStep(3);
        }
      } catch { /* ignore */ }
    }
    setRestored(true);
  }, [restored]);

  function choose(idx: number) {
    setSelected(idx);
    const scoring = QUESTIONS[step].options[idx].score;
    const next = [...answers, scoring];
    setAnswers(next);
    setTimeout(() => {
      if (step < 2) {
        setStep(step + 1);
        setSelected(null);
      } else {
        setStep(3);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      }
    }, 350);
  }

  function restart() {
    setAnswers([]);
    setStep(0);
    setSelected(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }

  if (step < 3) {
    const q = QUESTIONS[step];
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 md:py-20">
        <div className="mb-10">
          <div className="text-xs font-bold tracking-[0.3em] text-ink/40">{t("FIND YOUR STRYDE", "寻找你的 STRYDE")}</div>
          <h1 className="mt-3 text-3xl font-black leading-tight md:text-4xl">{q.title}</h1>
          <p className="mt-2 text-ink/55">{q.subtitle}</p>
        </div>

        {/* progress */}
        <div className="mb-8 flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-ink/50">{q.no} / 03</span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-ink transition-all duration-500"
              style={{ width: `${((step + 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className={cn(
          "grid gap-3",
          q.options.length === 4 ? "sm:grid-cols-2" : "grid-cols-1"
        )}>
          {q.options.map((opt, i) => (
            <button
              key={opt.label}
              onClick={() => choose(i)}
              className={cn(
                "group rounded-2xl border-2 p-5 text-left transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                selected === i
                  ? "border-ink bg-ink text-paper scale-[0.98]"
                  : "border-ink/15 bg-white hover:border-ink/40 hover:bg-ink/[0.03]"
              )}
            >
              <div className="text-lg font-black tracking-wide">{opt.label}</div>
              <div className={cn(
                "mt-1 text-sm",
                selected === i ? "text-paper/70" : "text-ink/55"
              )}>{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Result
  const ranked = computeResult(answers);
  const best = ranked[0];
  const also = ranked.slice(1, 3);
  const bestCatalogName = COLOR_TO_CATALOG[best];
  const bestColor = product.colors.find((c) => c.name === bestCatalogName) ?? product.colors[0];
  const copy = RESULT_COPY[best];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-20">
      <div className="text-center">
        <div className="text-xs font-bold tracking-[0.3em] text-ink/40">{t("YOUR STRYDE", "你的 STRYDE")}</div>
        <h1 className="mt-3 text-5xl font-black leading-tight tracking-tight md:text-7xl">
          {best.toUpperCase()}
        </h1>
        <div className="mt-2 inline-block rounded-full bg-ink px-4 py-1 text-[10px] font-black tracking-[0.2em] text-paper">
          {t("YOUR BEST MATCH", "你的最佳匹配")}
        </div>
      </div>

      {/* Best match product */}
      <div className="mt-10 overflow-hidden rounded-3xl border border-ink/10 bg-white">
        <div className="aspect-square w-full bg-cream">
          <ProductImage
            src={bestColor.realImage ?? bestColor.image}
            prompt={bestColor.imagePrompt}
            alt={`${product.name} ${bestColor.name}`}
            size="square_hd"
            className="h-full w-full"
          />
        </div>
        <div className="p-6 md:p-8">
          <div className="text-xs font-black tracking-[0.25em] text-ink/40">{copy.tagline}</div>
          <p className="mt-2 text-xl font-bold text-ink md:text-2xl">{copy.body}</p>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <div className="text-sm text-ink/50">{product.name} · {bestColor.name}</div>
              <div className="mt-1 text-2xl font-black">${product.price}</div>
            </div>
            <Link href={`/products/${product.slug}?color=${encodeURIComponent(bestCatalogName)}`}>
              <Button size="lg">
                {t("SHOP MY MATCH", "购买我的匹配")} <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Also your style */}
      {also.length > 0 && (
        <div className="mt-12">
          <div className="mb-5 text-xs font-bold tracking-[0.3em] text-ink/40">{t("ALSO YOUR STYLE", "也适合你")}</div>
          <div className="grid gap-4 sm:grid-cols-2">
            {also.map((c) => {
              const catName = COLOR_TO_CATALOG[c];
              const color = product.colors.find((x) => x.name === catName);
              if (!color) return null;
              return (
                <Link
                  key={c}
                  href={`/products/${product.slug}?color=${encodeURIComponent(catName)}`}
                  className="group overflow-hidden rounded-2xl border border-ink/10 bg-white transition hover:border-ink/30"
                >
                  <div className="aspect-square w-full bg-cream">
                    <ProductImage
                      src={color.realImage ?? color.image}
                      prompt={color.imagePrompt}
                      alt={`${product.name} ${color.name}`}
                      size="square"
                      className="h-full w-full"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-base font-black">{c.toUpperCase()}</div>
                    <div className="mt-1 text-sm text-ink/55">{SHORT_COPY[c]}</div>
                    <div className="mt-3 flex items-center gap-1 text-sm font-bold text-ink group-hover:text-accent">
                      {t("VIEW THIS PAIR", "查看这双")} <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Retake */}
      <div className="mt-14 text-center">
        <div className="text-sm text-ink/50">{t("NOT QUITE YOU?", "不是很适合你？")}</div>
        <button
          onClick={restart}
          className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-ink underline underline-offset-4 decoration-ink/30 hover:text-accent hover:decoration-accent"
        >
          <RefreshCw size={14} /> {t("TAKE THE QUIZ AGAIN", "重新测试")}
        </button>
      </div>
    </div>
  );
}
