import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getProductById } from "@/lib/data/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { CLIP_COLLECTIONS, STATUS } from "@/lib/data/brand";
import { LetterSelector } from "@/components/clips/LetterSelector";

export default function ClipsPage() {
  const hero = getProductById("boot-14534-h");

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      {/* ---------- HERO ---------- */}
      <div className="mb-14 border-b border-ink/10 pb-10">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <div className="text-xs font-bold tracking-[0.3em] text-ink/40">
            PERSONALIZE YOUR STRYDE
          </div>
          <span className="rounded-full bg-ink/90 px-3 py-1 text-[11px] font-black tracking-wider text-paper">
            {STATUS.comingSoon}
          </span>
          <span className="rounded-full bg-ink/10 px-3 py-1 text-[11px] font-bold tracking-wider text-ink/60">
            {STATUS.inDevelopment}
          </span>
        </div>
        <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
          MAKE IT YOURS.
        </h1>
        <p className="mt-4 text-2xl font-bold tracking-wide text-ink/70">STRYDE CLIPS</p>
        <p className="mt-5 max-w-xl text-lg text-ink/60">
          Small details. Your signature. A new way to personalize the 14534-H with removable
          STRYDE-designed clips.
        </p>
      </div>

      {/* ---------- BASE PRODUCT + CONCEPT ---------- */}
      <section className="mb-20 grid gap-10 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-cream">
          {hero && (
            <ProductImage
              src={hero.heroImage ?? hero.image}
              prompt={hero.imagePrompt}
              alt="STRYDE 14534-H — the base boot for STRYDE CLIPS"
              size="portrait_4_3"
              className="aspect-[4/5] w-full"
            />
          )}
          <div className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-black tracking-wider text-paper">
            {STATUS.designPreview}
          </div>
          {/* Conceptual clip indicator — marks the front loop area where clips attach */}
          <div className="absolute left-1/2 top-[42%] -translate-x-1/2">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 rounded-full border-2 border-accent bg-paper/90 px-3 py-1.5 text-xs font-black tracking-wider text-accent-dark shadow-lg">
                <Sparkles size={13} /> STRYDE CLIP
              </div>
              <div className="h-6 w-px bg-accent/60" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-xs font-bold tracking-[0.2em] text-accent">
            BASED ON 14534-H
          </div>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">
            Same boot.
            <br />
            Your detail.
          </h2>
          <p className="mt-4 text-ink/60 leading-relaxed">
            STRYDE CLIPS are removable decorative clip-on accessories designed around the existing
            front loop and linear detailing of the real 14534-H boot. The shoe itself stays exactly
            as supplied — only a small, personal detail changes.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-ink/70">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-accent">•</span> Removable — clip on, clip off
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-accent">•</span> Designed for the 14534-H front loop
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-accent">•</span> No change to the boot construction
            </li>
          </ul>
          <div className="mt-6 rounded-2xl bg-cream p-4 text-xs leading-relaxed text-ink/55">
            {STATUS.comingSoon} — Personalized STRYDE Clips are currently in development.
          </div>
        </div>
      </section>

      {/* ---------- A–Z LETTER SELECTOR ---------- */}
      <LetterSelector />

      {/* ---------- FOUR COLLECTIONS ---------- */}
      <section className="mb-20">
        <div className="mb-8">
          <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
            FOUR DIRECTIONS
          </div>
          <h2 className="text-3xl font-black md:text-4xl">The collections</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CLIP_COLLECTIONS.map((c) => (
            <div
              key={c.no}
              className="flex flex-col rounded-3xl border border-ink/10 bg-white p-6"
            >
              <div className="text-xs font-black tracking-[0.25em] text-ink/40">{c.no}</div>
              <h3 className="mt-2 text-xl font-black tracking-wide">{c.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{c.desc}</p>
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
          Sample marks shown as concept references. Third-party logos and official city trademarks
          are not used.
        </p>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-3xl rounded-3xl bg-ink p-10 text-center text-paper md:p-14">
        <h2 className="text-3xl font-black leading-tight md:text-4xl">
          KEEP THE ROUTE GOING.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-paper/60">
          Start with the 14534-H. Personalized STRYDE Clips are currently in development.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products/mono-boot">
            <Button size="lg">
              SHOP THE BOOT <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline" className="border-paper/30 text-paper hover:bg-paper/10">
              EXPLORE THE SYSTEM
            </Button>
          </Link>
        </div>
      </section>

      {/* ---------- DISCLOSURE ---------- */}
      <p className="mt-10 text-center text-xs leading-relaxed text-ink/40">
        {STATUS.comingSoon} — STRYDE CLIPS are currently in development.
      </p>
    </div>
  );
}
