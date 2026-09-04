import Link from "next/link";
import { ArrowRight, Ruler } from "lucide-react";
import { BRAND } from "@/lib/data/brand";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Size Guide — ${BRAND.name}`,
  description:
    "EU / US / UK / CM shoe size conversion for STRYDE footwear. EU 38–46, with foot measurement instructions.",
};

/**
 * Size guide — EU / US / UK / CM conversion
 * EU 38–46 per supplier spec for SKU 14534-H.
 * Foot measurement instructions only — no fit guarantees invented.
 */
const SIZE_ROWS: { eu: number; us: number; uk: number; cm: number }[] = [
  { eu: 38, us: 6, uk: 5, cm: 24.0 },
  { eu: 39, us: 6.5, uk: 5.5, cm: 24.5 },
  { eu: 40, us: 7, uk: 6, cm: 25.0 },
  { eu: 41, us: 8, uk: 7, cm: 26.0 },
  { eu: 42, us: 8.5, uk: 7.5, cm: 26.5 },
  { eu: 43, us: 9.5, uk: 8.5, cm: 27.5 },
  { eu: 44, us: 10, uk: 9, cm: 28.0 },
  { eu: 45, us: 11, uk: 10, cm: 29.0 },
  { eu: 46, us: 12, uk: 11, cm: 30.0 },
];

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-bold tracking-wider text-ink/70">
          <Ruler size={13} className="text-accent" />
          SIZE GUIDE
        </div>
        <h1 className="text-4xl font-black tracking-tight md:text-5xl">Find your size</h1>
        <p className="mt-4 max-w-xl text-ink/60">
          STRYDE footwear lists EU sizes (supplier spec). Use the conversion table below to
          find your usual US / UK size or foot length in centimetres.
        </p>
      </div>

      {/* ---------- 尺码表 ---------- */}
      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-cream text-ink/70">
              <th className="px-5 py-4 font-bold">EU</th>
              <th className="px-5 py-4 font-bold">US</th>
              <th className="px-5 py-4 font-bold">UK</th>
              <th className="px-5 py-4 font-bold">Foot length (cm)</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_ROWS.map((r) => (
              <tr key={r.eu} className="border-t border-ink/5">
                <td className="px-5 py-3 font-black text-accent">{r.eu}</td>
                <td className="px-5 py-3">{r.us}</td>
                <td className="px-5 py-3">{r.uk}</td>
                <td className="px-5 py-3">{r.cm.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-ink/45">
        Conversion tables are approximate and may vary by last and manufacturer.
        We do not guarantee a specific fit from this chart.
      </p>

      {/* ---------- 脚长测量说明 ---------- */}
      <section className="mt-14">
        <h2 className="text-2xl font-black">How to measure your foot</h2>
        <ol className="mt-5 space-y-3 text-ink/70">
          {[
            "Place a sheet of paper on a hard floor against a wall.",
            "Stand on the paper with your heel against the wall.",
            "Mark the tip of your longest toe on the paper.",
            "Measure the distance from the wall to the mark in centimetres.",
            "Compare your foot length (cm) to the table above and pick the closest EU size.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-black text-accent">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 rounded-2xl bg-cream p-4 text-sm text-ink/60">
          Tip: measure both feet and use the longer one. Feet can be slightly different
          sizes. If you are between two sizes, sizing is a personal preference — we do not
          recommend one over the other.
        </p>
      </section>

      {/* ---------- CTA ---------- */}
      <div className="mt-14">
        <Link href="/products">
          <Button size="lg">
            Shop footwear <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
