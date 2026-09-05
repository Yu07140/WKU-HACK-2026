"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";

/**
 * STRYDE CLIPS — brand personalization concept module (homepage).
 * Clip-on letter accessories designed around the front loop of the 14534-H.
 * CONCEPT ONLY: no price / stock / cart / shipping anywhere in this module.
 * "CUSTOMIZE YOUR INITIALS" opens a concept-preview modal (no navigation, no order).
 */

const STRYDE_LETTERS = ["S", "T", "R", "Y", "D", "E"];
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_LETTERS = 3;

export function StrydeClips() {
  const [letters, setLetters] = useState<string[]>(["A", "M", "L"]);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmPulse, setConfirmPulse] = useState(false);

  /** Max 3 letters; a 4th click is ignored. Click a selected letter to remove it. */
  function toggle(letter: string) {
    setSaved(false);
    setLetters((cur) =>
      cur.includes(letter)
        ? cur.filter((x) => x !== letter)
        : cur.length >= MAX_LETTERS
          ? cur
          : [...cur, letter]
    );
  }

  function confirmPreview() {
    setConfirmPulse(true);
    window.setTimeout(() => setConfirmPulse(false), 1600);
  }

  /* Modal: ESC to close + body scroll lock */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section id="stryde-clips" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      {/* ---------- HEADER ---------- */}
      <div className="mb-10">
        <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
          MAKE IT YOURS.
        </div>
        <h2 className="text-3xl font-black md:text-4xl">STRYDE CLIPS</h2>
        <p className="mt-2 max-w-xl text-ink/55">
          Clip-on letter details designed around the signature front loop structure of
          the 14534-H. Choose the STRYDE letters, or make the pair feel more personal
          with your own initials.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1 text-xs font-bold tracking-wider text-ink/55">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          CONCEPT ONLY — currently under sourcing validation
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* ---------- CARD 1 — STRYDE LETTERS ---------- */}
        <article className="group overflow-hidden rounded-3xl border border-ink/10 bg-white">
          <div className="relative aspect-[4/5] overflow-hidden">
            <ProductImage
              src="/products/14534-h/hero.jpg"
              prompt="black minimalist ankle boot, clean editorial photography"
              alt="14534-H boot with STRYDE letter clips concept"
              size="portrait_4_3"
              className="h-full w-full transition duration-500 group-hover:scale-105"
            />
            {/* letter chips along the front loop detail */}
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5">
              {STRYDE_LETTERS.map((ch) => (
                <span
                  key={ch}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-ink/20 bg-white/95 text-sm font-black text-ink shadow-sm"
                >
                  {ch}
                </span>
              ))}
            </div>
            <div className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-black tracking-wider text-paper">
              CONCEPT
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-black tracking-wide">STRYDE LETTERS</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/55">
              A signature clip-on set using the STRYDE letter forms across the front
              loop detail.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-black tracking-[0.2em] text-ink/70">
              EXPLORE THE IDEA <ArrowRight size={14} />
            </span>
          </div>
        </article>

        {/* ---------- CARD 2 — MAKE IT PERSONAL (opens concept preview modal) ---------- */}
        <article className="overflow-hidden rounded-3xl border border-accent/40 bg-white">
          <div className="relative aspect-[4/5] overflow-hidden bg-cream">
            <ProductImage
              src="/products/14534-h/black.jpg"
              prompt="black minimalist ankle boot, clean editorial photography"
              alt="14534-H boot with custom initials clips concept"
              size="portrait_4_3"
              className="h-full w-full object-cover"
            />
            <div className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-black tracking-wider text-paper">
              COMING NEXT
            </div>
            {/* live preview chips over the boot */}
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
              {letters.length > 0 ? (
                letters.map((ch) => (
                  <span
                    key={ch}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-sm font-black text-paper shadow-md"
                  >
                    {ch}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink/50">
                  Your letters will appear here
                </span>
              )}
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-black tracking-wide">MAKE IT PERSONAL</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/55">
              Swap in your own initials and turn the same silhouette into something
              that feels more like yours.
            </p>

            {/* quick inline picker — mirrors the modal selection in real time */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-black tracking-[0.2em] text-ink/50">
                  YOUR LETTERS · UP TO 3
                </span>
                {letters.length > 0 && (
                  <button
                    onClick={() => {
                      setLetters([]);
                      setSaved(false);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-ink/45 underline-offset-2 hover:text-ink hover:underline"
                  >
                    <RotateCcw size={12} /> RESET
                  </button>
                )}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {ALPHA.map((ch) => {
                  const active = letters.includes(ch);
                  const full = !active && letters.length >= MAX_LETTERS;
                  return (
                    <button
                      key={ch}
                      onClick={() => toggle(ch)}
                      disabled={full}
                      aria-pressed={active}
                      className={`flex h-9 items-center justify-center rounded-md border text-xs font-bold transition ${
                        active
                          ? "border-ink bg-ink text-paper"
                          : full
                            ? "cursor-not-allowed border-ink/10 bg-white text-ink/25"
                            : "border-ink/15 bg-white text-ink/70 hover:border-ink/50"
                      }`}
                    >
                      {ch}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-ink/45">
                Selected letters:{" "}
                <span className="font-black tracking-widest text-ink">
                  {letters.length > 0 ? letters.join(" ") : "—"}
                </span>
              </p>
              <button
                onClick={() => setOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-xs font-black tracking-[0.2em] text-paper transition hover:bg-ink/85"
              >
                CUSTOMIZE YOUR INITIALS <ArrowRight size={14} />
              </button>
              <p className="mt-3 text-xs leading-relaxed text-ink/40">
                Custom letter clips are currently a concept under sourcing validation.
              </p>
            </div>
          </div>
        </article>

        {/* ---------- CARD 3 — MONO DETAILS ---------- */}
        <article className="group overflow-hidden rounded-3xl border border-ink/10 bg-white">
          <div className="relative aspect-[4/5] overflow-hidden">
            <ProductImage
              src="/products/14534-h/detail-01.jpg"
              prompt="black minimalist ankle boot detail close-up, clean editorial photography"
              alt="14534-H boot with minimal mono clip accents concept"
              size="portrait_4_3"
              className="h-full w-full transition duration-500 group-hover:scale-105"
            />
            {/* minimal black & silver geometric accents */}
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
              <span className="h-px w-8 bg-white/80" />
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/70 bg-ink/70 text-[10px] font-black text-white">
                M
              </span>
              <span className="h-2 w-2 rotate-45 border border-white/80 bg-white/20" />
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/50 bg-white/85 text-[10px] font-black text-ink">
                D
              </span>
              <span className="h-px w-8 bg-white/80" />
            </div>
            <div className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-black tracking-wider text-paper">
              CONCEPT
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-black tracking-wide">MONO DETAILS</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/55">
              Minimal black-and-silver clip accents for a quieter take on
              personalization.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-black tracking-[0.2em] text-ink/70">
              SEE THE CONCEPT <ArrowRight size={14} />
            </span>
          </div>
        </article>
      </div>

      {/* ---------- CONCEPT PREVIEW MODAL ---------- */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="STRYDE CLIPS concept preview"
        >
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-paper shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink/60 shadow-sm transition hover:text-ink"
            >
              <X size={18} />
            </button>

            {saved ? (
              /* ---------- SAVED STATE ---------- */
              <div className="flex flex-col items-center px-8 py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper">
                  <Check size={26} />
                </span>
                <h3 className="mt-5 text-2xl font-black tracking-wide">
                  CONCEPT SAVED
                </h3>
                <p className="mt-2 text-sm text-ink/55">
                  Your STRYDE CLIPS configuration:
                </p>
                <p className="mt-2 text-2xl font-black tracking-[0.3em] text-ink">
                  {letters.length > 0 ? letters.join(" · ") : "—"}
                </p>
                <p className="mt-4 text-xs text-ink/40">
                  Coming next — sourcing validation in progress.
                </p>
                <button
                  onClick={() => setSaved(false)}
                  className="mt-6 text-xs font-black tracking-[0.2em] text-ink/60 underline-offset-4 hover:text-ink hover:underline"
                >
                  BACK TO EDITOR
                </button>
              </div>
            ) : (
              /* ---------- EDITOR ---------- */
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <div className="text-xs font-bold tracking-[0.3em] text-ink/40">
                    MAKE IT YOURS.
                  </div>
                  <h3 className="mt-1 text-2xl font-black">
                    Preview your initials on the 14534-H.
                  </h3>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* boot preview — real 14534-H photo with live letter chips */}
                  <div
                    className={`relative aspect-[4/5] overflow-hidden rounded-2xl border bg-white transition ${
                      confirmPulse ? "border-accent ring-2 ring-accent" : "border-ink/10"
                    }`}
                  >
                    <ProductImage
                      src="/products/14534-h/hero.jpg"
                      prompt="black minimalist ankle boot, clean editorial photography"
                      alt="14534-H boot with your initials clip preview"
                      size="portrait_4_3"
                      className="h-full w-full"
                    />
                    {confirmPulse && (
                      <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-black tracking-widest text-paper">
                        LIVE PREVIEW
                      </span>
                    )}
                    {/* clip-on overlay updates in real time with the selection */}
                    <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5">
                      {letters.length > 0 ? (
                        <>
                          <span className="h-4 w-px bg-ink/40" />
                          <div className="flex gap-1.5">
                            {letters.map((ch) => (
                              <span
                                key={ch}
                                className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-base font-black text-paper shadow-lg"
                              >
                                {ch}
                              </span>
                            ))}
                          </div>
                        </>
                      ) : (
                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink/50 shadow-sm">
                          Pick up to 3 letters
                        </span>
                      )}
                    </div>
                  </div>

                  {/* picker + actions */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-black tracking-[0.2em] text-ink/50">
                        YOUR INITIALS
                      </span>
                      {letters.length > 0 && (
                        <button
                          onClick={() => {
                            setLetters([]);
                            setSaved(false);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-ink/45 underline-offset-2 hover:text-ink hover:underline"
                        >
                          <RotateCcw size={12} /> RESET
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-7 gap-1.5">
                      {ALPHA.map((ch) => {
                        const active = letters.includes(ch);
                        const full = !active && letters.length >= MAX_LETTERS;
                        return (
                          <button
                            key={ch}
                            onClick={() => toggle(ch)}
                            disabled={full}
                            aria-pressed={active}
                            className={`flex h-9 items-center justify-center rounded-md border text-xs font-bold transition ${
                              active
                                ? "border-ink bg-ink text-paper"
                                : full
                                  ? "cursor-not-allowed border-ink/10 bg-white text-ink/25"
                                  : "border-ink/15 bg-white text-ink/70 hover:border-ink/50"
                            }`}
                          >
                            {ch}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-3 text-xs text-ink/45">
                      Selected letters:{" "}
                      <span className="font-black tracking-widest text-ink">
                        {letters.length > 0 ? letters.join(" ") : "—"}
                      </span>
                    </p>

                    <div className="mt-5 flex flex-col gap-2.5">
                      <button
                        onClick={confirmPreview}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ink bg-white px-5 py-2.5 text-xs font-black tracking-[0.2em] text-ink transition hover:bg-cream"
                      >
                        PREVIEW ON THE BOOT <ArrowRight size={14} />
                      </button>
                      <button
                        onClick={() => setSaved(true)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-xs font-black tracking-[0.2em] text-paper transition hover:bg-ink/85"
                      >
                        SAVE MY CONCEPT
                      </button>
                    </div>

                    <div className="mt-5 rounded-xl bg-cream p-3.5">
                      <p className="text-xs font-black tracking-[0.2em] text-ink/60">
                        COMING NEXT
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-ink/45">
                        Custom letter clips are currently a concept under sourcing
                        validation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
