import Link from "next/link";
import { Ruler, Footprints, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const US_EU_UK = [
  { us: "6", eu: "38", uk: "5.5" },
  { us: "6.5", eu: "39", uk: "6" },
  { us: "7", eu: "40", uk: "6.5" },
  { us: "7.5", eu: "41", uk: "7" },
  { us: "8", eu: "42", uk: "7.5" },
  { us: "8.5", eu: "43", uk: "8" },
  { us: "9", eu: "44", uk: "8.5" },
  { us: "9.5", eu: "45", uk: "9" },
  { us: "10", eu: "46", uk: "9.5" },
  { us: "10.5", eu: "47", uk: "10" },
  { us: "11", eu: "48", uk: "10.5" },
  { us: "12", eu: "49", uk: "11.5" },
  { us: "13", eu: "50", uk: "12.5" },
];

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-12">
        <div className="mb-3 text-xs font-bold tracking-[0.2em] text-ink/45">SIZE GUIDE</div>
        <h1 className="text-4xl font-black md:text-5xl">Find your fit.</h1>
        <p className="mt-3 max-w-xl text-ink/60">
          Not sure between a 9 and a 9.5? Measure your foot and use the chart below.
          All STRYDE shoes are built on US sizing.
        </p>
      </div>

      {/* ---------- US / EU / UK 对照 ---------- */}
      <section className="rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-1 text-xl font-black">International Size Conversion</h2>
        <p className="mb-5 text-sm text-ink/55">
          If you normally wear EU or UK sizes, find the US equivalent below.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-wider text-ink/50">
                <th className="pb-3 pr-6">US Men's</th>
                <th className="pb-3 pr-6">EU</th>
                <th className="pb-3">UK</th>
              </tr>
            </thead>
            <tbody>
              {US_EU_UK.map((r) => (
                <tr key={r.us} className="border-b border-ink/5 last:border-0">
                  <td className="py-3 pr-6 font-bold">{r.us}</td>
                  <td className="py-3 pr-6 text-ink/70">{r.eu}</td>
                  <td className="py-3 text-ink/70">{r.uk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- 量脚方法 ---------- */}
      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-ink/10 bg-white p-7">
          <div className="mb-4 inline-flex rounded-2xl bg-accent/10 p-3 text-accent">
            <Footprints size={22} />
          </div>
          <h3 className="text-lg font-black">How to measure your foot</h3>
          <ol className="mt-3 space-y-2 text-sm text-ink/70">
            <li>1. Place a blank piece of paper on a hard floor.</li>
            <li>2. Stand on the paper with your full weight.</li>
            <li>3. Trace around your foot with a pen held straight up.</li>
            <li>4. Mark the longest point — from heel to tip of your longest toe.</li>
            <li>5. Measure that distance in centimeters.</li>
            <li>6. Use the chart above to find your US size.</li>
          </ol>
        </div>
        <div className="rounded-3xl border border-ink/10 bg-white p-7">
          <div className="mb-4 inline-flex rounded-2xl bg-sage/10 p-3 text-sage">
            <Ruler size={22} />
          </div>
          <h3 className="text-lg font-black">Quick tips</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            <li>• Measure at the end of the day — feet swell slightly.</li>
            <li>• Wear the socks you'll wear with the boots.</li>
            <li>• Measure both feet — size up if they differ.</li>
            <li>• Between two sizes? Go up for room to move.</li>
            <li>• Our boots run true to size for most wearers.</li>
          </ul>
        </div>
      </section>

      {/* ---------- 退换承诺 ---------- */}
      <section className="mt-14 rounded-3xl bg-ink p-8 text-paper text-center">
        <h2 className="text-2xl font-black md:text-3xl">Still not sure?</h2>
        <p className="mx-auto mt-3 max-w-md text-paper/70">
          Order both sizes. Keep the one that fits. Send the other back within 30 days — free.
        </p>
        <div className="mt-6">
          <Link href="/products">
            <Button size="lg">
              Shop all shoes <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
