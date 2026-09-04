import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/data/brand";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Size Guide — ${BRAND.name}`,
  description:
    "EU size range for SKU 14534-H (EU 38–46, supplier-verified). US / UK / CM conversion pending supplier confirmation.",
};

/**
 * Size guide — only EU 38–46 is supplier-verified for SKU 14534-H.
 * US / UK / CM conversion values are NOT provided in the supplied materials,
 * so they are shown as TBC rather than invented.
 */
const EU_SIZES = [38, 39, 40, 41, 42, 43, 44, 45, 46];
const PENDING = "Pending supplier confirmation";

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-10">
        <div className="mb-4 text-xs font-bold tracking-[0.3em] text-ink/40">
          14534-H
        </div>
        <h1 className="text-4xl font-black tracking-tight md:text-5xl">FIND YOUR SIZE</h1>
        <p className="mt-4 max-w-xl text-ink/60">
          The 14534-H is supplied in EU sizes 38–46. Use the measurement guide below and
          confirm your size before ordering.
        </p>
      </div>

      {/* ---------- 尺码表 ---------- */}
      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-cream text-ink/70">
              <th className="px-5 py-4 font-bold">EU (verified)</th>
              <th className="px-5 py-4 font-bold">US</th>
              <th className="px-5 py-4 font-bold">UK</th>
              <th className="px-5 py-4 font-bold">Foot length (cm)</th>
            </tr>
          </thead>
          <tbody>
            {EU_SIZES.map((eu) => (
              <tr key={eu} className="border-t border-ink/5">
                <td className="px-5 py-3 font-black text-ink">{eu}</td>
                <td className="px-5 py-3 text-ink/40">{PENDING}</td>
                <td className="px-5 py-3 text-ink/40">{PENDING}</td>
                <td className="px-5 py-3 text-ink/40">{PENDING}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-ink/45">
        EU 38–46 is supplier-verified. Cross-market conversion values (US / UK / CM) will be
        confirmed before live commercial launch.
      </p>

      {/* ---------- 脚长测量说明 ---------- */}
      <section className="mt-14">
        <h2 className="text-2xl font-black">How to measure</h2>
        <ol className="mt-5 space-y-3 text-ink/70">
          {[
            "Place your heel against a wall on a sheet of paper.",
            "Mark the end of the longest toe.",
            "Measure heel-to-toe length.",
            "Use the confirmed supplier conversion table before final ordering.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-black text-accent">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
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
