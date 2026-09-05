"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import { PRODUCTS, getProduct } from "@/lib/data/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

const QUESTIONS = [
  {
    no: "01",
    title: "WHAT'S YOUR STYLE?",
    subtitle: "Pick the one that feels most like your closet.",
    options: [
      { label: "MINIMAL", desc: "Clean lines. No extra noise.", score: { Black: 3, Beige: 2, "Black Patent": 2 } as Scoring },
      { label: "STREET", desc: "Relaxed. Built around denim and layers.", score: { Denim: 3, "Black Canvas": 2, Yellow: 1 } as Scoring },
      { label: "BOLD", desc: "Color first. Attention welcome.", score: { Orange: 3, "Rose Red": 2, Pink: 2, Yellow: 1 } as Scoring },
      { label: "EXPERIMENTAL", desc: "Texture, contrast, and unexpected details.", score: { "Black Snake": 3, "Black Patent": 2, "Rose Red": 1 } as Scoring },
    ],
  },
  {
    no: "02",
    title: "WHAT DO YOU WEAR MOST?",
    subtitle: "Your go-to uniform.",
    options: [
      { label: "WIDE-LEG JEANS", desc: "Denim on repeat.", score: { Denim: 3, "Black Canvas": 1 } as Scoring },
      { label: "ALL BLACK", desc: "Head to toe, no exceptions.", score: { Black: 3, "Black Patent": 3, "Black Snake": 2 } as Scoring },
      { label: "DRESSES & SKIRTS", desc: "Flowy, structured, somewhere in between.", score: { Beige: 3, Pink: 2, "Rose Red": 2 } as Scoring },
      { label: "CARGOS & OVERSIZED FITS", desc: "Room to move, layers on layers.", score: { Denim: 2, "Black Canvas": 2, Orange: 2 } as Scoring },
    ],
  },
  {
    no: "03",
    title: "HOW MUCH ATTENTION DO YOU WANT?",
    subtitle: "Be honest.",
    options: [
      { label: "KEEP IT CLEAN", desc: "I want the shape to do the talking.", score: { Black: 3, Beige: 2, "Black Canvas": 2 } as Scoring },
      { label: "NOTICEABLE", desc: "A little attention is the point.", score: { "Black Patent": 2, Pink: 2, Yellow: 2, Denim: 1 } as Scoring },
      { label: "MAIN CHARACTER", desc: "I didn't come here to blend in.", score: { "Black Snake": 3, Orange: 3, "Rose Red": 3 } as Scoring },
    ],
  },
];

const RESULT_COPY: Record<string, { tagline: string; body: string }> = {
  Black: { tagline: "AFTER DARK", body: "Quiet color. Loud silhouette." },
  "Black Patent": { tagline: "FLASH MODE", body: "Clean from a distance. Impossible to ignore up close." },
  Denim: { tagline: "OFF-DUTY", body: "Built for wide denim, layers and everyday streetwear." },
  "Black Canvas": { tagline: "EVERYDAY EDGE", body: "Low-key color. High-impact shape." },
  "Black Snake": { tagline: "NO SAFE CHOICES", body: "For days when basic isn't an option." },
  Orange: { tagline: "MAIN CHARACTER", body: "Not designed to blend in." },
  "Rose Red": { tagline: "HOT ENERGY", body: "The outfit starts from the shoes." },
  Pink: { tagline: "SOFT COLOR. BIG ATTITUDE.", body: "Sweet color. Serious silhouette." },
  Beige: { tagline: "QUIET STATEMENT", body: "Soft tone. Strong shape." },
  Yellow: { tagline: "TURN IT UP", body: "Bright enough to change the whole outfit." },
};

const SHORT_COPY: Record<string, string> = {
  Black: "After-dark staple.",
  "Black Patent": "Polished and glossy.",
  Denim: "Off-duty streetwear.",
  "Black Canvas": "Everyday low-key.",
  "Black Snake": "Texture, not basic.",
  Orange: "Built to stand out.",
  "Rose Red": "Outfit starts here.",
  Pink: "Soft color, big shape.",
  Beige: "Neutral, versatile.",
  Yellow: "Bright and playful.",
};

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
  const product = getProduct(PRODUCT_ID) ?? PRODUCTS[0];
  const [step, setStep] = useState(0); // 0,1,2 = questions, 3 = result
  const [answers, setAnswers] = useState<Scoring[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

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
          <div className="text-xs font-bold tracking-[0.3em] text-ink/40">FIND YOUR STRYDE</div>
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
        <div className="text-xs font-bold tracking-[0.3em] text-ink/40">YOUR STRYDE</div>
        <h1 className="mt-3 text-5xl font-black leading-tight tracking-tight md:text-7xl">
          {best.toUpperCase()}
        </h1>
        <div className="mt-2 inline-block rounded-full bg-ink px-4 py-1 text-[10px] font-black tracking-[0.2em] text-paper">
          YOUR BEST MATCH
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
                SHOP MY MATCH <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Also your style */}
      {also.length > 0 && (
        <div className="mt-12">
          <div className="mb-5 text-xs font-bold tracking-[0.3em] text-ink/40">ALSO YOUR STYLE</div>
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
                      VIEW THIS PAIR <ArrowRight size={14} />
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
        <div className="text-sm text-ink/50">NOT QUITE YOU?</div>
        <button
          onClick={restart}
          className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-ink underline underline-offset-4 decoration-ink/30 hover:text-accent hover:decoration-accent"
        >
          <RefreshCw size={14} /> TAKE THE QUIZ AGAIN
        </button>
      </div>
    </div>
  );
}
