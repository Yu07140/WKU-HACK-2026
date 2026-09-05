"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLIP_LETTERS, clipLetterImage, type ClipLetter } from "@/lib/data/strydeClips";

/**
 * STRYDE CLIPS — brand personalization module (homepage).
 * Single-letter selection: click a letter and the 14534-H preview updates
 * instantly (static /clips/letters/{A–Z}.png assets — no runtime generation).
 * Coming soon: no price / stock / cart / shipping anywhere in this module.
 */

const STRYDE_LETTERS = ["S", "T", "R", "Y", "D", "E"];

export function StrydeClips() {
  const [selectedLetter, setSelectedLetter] = useState<ClipLetter>("A");

  /* Preload previous + next letter so switching feels instant. */
  useEffect(() => {
    const i = CLIP_LETTERS.indexOf(selectedLetter);
    const neighbours = [
      CLIP_LETTERS[(i + CLIP_LETTERS.length - 1) % CLIP_LETTERS.length],
      CLIP_LETTERS[(i + 1) % CLIP_LETTERS.length],
    ];
    for (const letter of neighbours) {
      const img = new Image();
      img.src = clipLetterImage(letter);
    }
  }, [selectedLetter]);

  return (
    <section id="stryde-clips" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <style>{`@keyframes clipFade{from{opacity:0}to{opacity:1}}`}</style>

      {/* ---------- HEADER ---------- */}
      <div className="mb-10">
        <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
          MAKE IT YOURS.
        </div>
        <h2 className="text-3xl font-black md:text-4xl">STRYDE CLIPS</h2>
        <p className="mt-2 max-w-xl text-ink/55">
          Clip-on letter details designed around the signature front loop structure
          of the 14534-H.
        </p>
      </div>

      {/* ---------- HERO — live preview (60%) + letter picker (40%) ---------- */}
      <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
        {/* live preview — the boot IS the interaction */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
            <img
              key={selectedLetter}
              src={clipLetterImage(selectedLetter)}
              alt={`14534-H boot with silver ${selectedLetter} STRYDE Clip preview`}
              width={960}
              height={1200}
              className="h-auto w-full object-contain"
              style={{ animation: "clipFade 180ms ease" }}
            />
          </div>
        </div>

        {/* selector + status */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-black tracking-wide">MAKE IT PERSONAL</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/55">
            Choose your letter and make the same 14534-H feel more like yours.
          </p>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-black tracking-[0.2em] text-ink/50">
                YOUR LETTER · PICK ONE
              </span>
              <span className="whitespace-nowrap text-xs font-bold tracking-widest text-ink/45">
                YOUR LETTER:{" "}
                <span className="font-black text-ink">{selectedLetter}</span>
              </span>
            </div>
            <div
              className="grid grid-cols-7 gap-1.5"
              role="group"
              aria-label="Choose your STRYDE Clip letter"
            >
              {CLIP_LETTERS.map((letter) => {
                const active = selectedLetter === letter;
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => setSelectedLetter(letter)}
                    aria-pressed={active}
                    aria-label={`Preview STRYDE Clip letter ${letter}`}
                    className={`flex h-9 items-center justify-center rounded-md border text-xs font-bold transition ${
                      active
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/15 bg-white text-ink/70 hover:border-ink/50"
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* status */}
          <div className="mt-6 rounded-xl bg-cream p-4">
            <span className="inline-flex rounded-full bg-ink px-3 py-1 text-[11px] font-black tracking-wider text-paper">
              COMING SOON
            </span>
            <p className="mt-2 text-xs leading-relaxed text-ink/45">
              Personalized STRYDE Clips are currently in development.
            </p>
          </div>
        </div>
      </div>

      {/* ---------- OTHER DIRECTIONS (smaller, below the main experience) ---------- */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {/* STRYDE LETTERS */}
        <article className="group overflow-hidden rounded-3xl border border-ink/10 bg-white">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src="/products/14534-h/hero.jpg"
              alt="14534-H boot with STRYDE letter clips"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {STRYDE_LETTERS.map((ch) => (
                <span
                  key={ch}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-ink/20 bg-white/95 text-xs font-black text-ink shadow-sm"
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-base font-black tracking-wide">STRYDE LETTERS</h3>
            <p className="mt-1 text-sm text-ink/55">Signature preset exploration</p>
          </div>
        </article>

        {/* MONO DETAILS */}
        <article className="group overflow-hidden rounded-3xl border border-ink/10 bg-white">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src="/products/14534-h/detail-01.jpg"
              alt="14534-H boot with minimal mono clip accents"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            {/* minimal black & silver geometric accents */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
              <span className="h-px w-8 bg-white/80" />
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/70 bg-ink/70 text-[10px] font-black text-white">
                M
              </span>
              <span className="h-2 w-2 rotate-45 border border-white/80 bg-white/20" />
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/50 bg-white/85 text-[10px] font-black text-ink">
                D
              </span>
              <span className="h-px w-8 bg-white/80" />
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-base font-black tracking-wide">MONO DETAILS</h3>
            <p className="mt-1 text-sm text-ink/55">
              Minimal black-and-silver detail exploration
            </p>
          </div>
        </article>
      </div>

      {/* ---------- FULL EXPERIENCE ---------- */}
      <div className="mt-10 text-center">
        <Link href="/clips">
          <Button size="lg" variant="outline">
            EXPLORE STRYDE CLIPS <ArrowRight size={17} />
          </Button>
        </Link>
      </div>
    </section>
  );
}
