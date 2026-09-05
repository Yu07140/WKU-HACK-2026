"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, RotateCcw, Save } from "lucide-react";
import {
  CLIP_LETTERS,
  clipLetterImage,
  isClipLetter,
  type ClipLetter,
} from "@/lib/data/strydeClips";
import { STATUS } from "@/lib/data/brand";

const STORAGE_KEY = "stryde-clip-letter";

/**
 * STRYDE CLIPS letter selector — SINGLE-LETTER selection.
 * One state value only: clicking a letter deselects the previous one
 * and swaps the boot preview instantly. No preview step, no multi-select.
 */
export function LetterSelector() {
  const [letter, setLetter] = useState<ClipLetter>("A");
  const [saved, setSaved] = useState(false);

  // Restore a previously saved letter; fresh visitors default to "A".
  useEffect(() => {
    try {
      const s = window.localStorage.getItem(STORAGE_KEY);
      if (s && isClipLetter(s)) setLetter(s);
    } catch {
      /* storage unavailable — keep default "A" */
    }
  }, []);

  // Preload the neighboring letters so switching feels instant.
  useEffect(() => {
    const i = CLIP_LETTERS.indexOf(letter);
    for (const j of [i - 1, i + 1]) {
      const next = CLIP_LETTERS[j];
      if (next) {
        const img = new window.Image();
        img.src = clipLetterImage(next);
      }
    }
  }, [letter]);

  const handleSave = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, letter);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch {
      /* storage unavailable */
    }
  }, [letter]);

  return (
    <section className="mb-20">
      <div className="mb-8">
        <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
          A–Z LETTER CLIPS
        </div>
        <h2 className="text-3xl font-black md:text-4xl">Your letter. Your boot.</h2>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        {/* ---------- BOOT PREVIEW ---------- */}
        <div>
          <div className="mb-3 text-xs font-bold tracking-[0.2em] text-ink/40">
            BOOT PREVIEW
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-cream">
            <div className="aspect-[4/5] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={letter}
                src={clipLetterImage(letter)}
                alt={`STRYDE 14534-H with silver letter ${letter} clip — full boot preview`}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-black tracking-wider text-paper">
              SILVER LETTER {letter}
            </div>
            <div className="absolute right-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-black tracking-wider text-ink/60">
              {STATUS.comingSoon}
            </div>
          </div>
        </div>

        {/* ---------- YOUR LETTER + A–Z GRID ---------- */}
        <div className="flex flex-col justify-center">
          <div className="text-xs font-bold tracking-[0.2em] text-ink/40">
            YOUR LETTER: <span className="text-ink">{letter}</span>
          </div>
          <div className="mt-4 grid grid-cols-6 gap-2 md:grid-cols-[repeat(13,minmax(0,1fr))] md:gap-2.5">
            {CLIP_LETTERS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLetter(l)}
                aria-pressed={l === letter}
                aria-label={`Select letter ${l}`}
                className={
                  "flex aspect-square items-center justify-center rounded-xl border text-sm font-black tracking-wider transition " +
                  (l === letter
                    ? "border-ink bg-ink text-paper shadow-sm"
                    : "border-ink/15 bg-paper text-ink/60 hover:border-ink/40 hover:text-ink")
                }
              >
                {l}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-black tracking-[0.2em] text-paper transition hover:bg-ink/85"
            >
              {saved ? <Check size={14} /> : <Save size={14} />}
              {saved ? "SAVED" : "SAVE MY STYLE"}
            </button>
            <button
              type="button"
              onClick={() => setLetter("A")}
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-paper px-6 py-3 text-xs font-black tracking-[0.2em] text-ink/60 transition hover:border-ink/40 hover:text-ink"
            >
              <RotateCcw size={14} /> RESET
            </button>
          </div>
          <p className="mt-4 text-xs text-ink/40">
            Your letter is saved on this device only. {STATUS.comingSoon} —
            personalized STRYDE Clips are currently in development.
          </p>
        </div>
      </div>
    </section>
  );
}
