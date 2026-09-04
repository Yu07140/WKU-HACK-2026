import Link from "next/link";
import { ArrowRight, Factory, Package, Award, Check, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/data/brand";
import { getProductById } from "@/lib/data/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `About — ${BRAND.name}`,
  description:
    "A real factory SKU. A 24-hour brand sprint. How STRYDE turns supplier data into a market-ready DTC product with AI.",
};

const WHAT_STAYS_REAL = [
  "factory product",
  "SKU (14534-H)",
  "material (microfiber / rubber)",
  "size range (EU 38–46)",
  "supplier photography",
];

const WHAT_AI_ACCELERATES = [
  "positioning",
  "campaign concepts",
  "ad copy",
  "creative variants",
  "shopping assistance",
  "performance analysis",
];

export default function AboutPage() {
  const featured = getProductById("boot-14534-h");

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-bold tracking-wider text-ink/70">
              <Factory size={13} className="text-accent" />
              A REAL FACTORY SKU. A 24-HOUR BRAND SPRINT.
            </div>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
              We didn't invent the shoe.
              <br />
              <span className="text-accent">We rebuilt the path to market.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink/65">
              STRYDE starts with a real factory product: SKU 14534-H. Instead of spending
              weeks on positioning, creative production, store setup and market testing,
              our team built an AI-assisted workflow that compresses those steps into a
              24-hour sprint.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/products/mono-boot">
                <Button size="lg">
                  See SKU 14534-H <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/proof">
                <Button size="lg" variant="outline">
                  Open Proof Mode
                </Button>
              </Link>
            </div>
          </div>
          {featured && (
            <ProductImage
              src={featured.heroImage ?? featured.image}
              prompt={featured.imagePrompt}
              alt={`${featured.name} — SKU 14534-H`}
              size="landscape_4_3"
              className="aspect-[4/3] rounded-3xl shadow-2xl"
            />
          )}
        </div>
      </section>

      {/* ---------- WHAT STAYS REAL / WHAT AI ACCELERATES ---------- */}
      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2">
          <div>
            <div className="mb-4 text-xs font-bold tracking-[0.25em] text-accent">
              WHAT STAYS REAL
            </div>
            <ul className="space-y-3">
              {WHAT_STAYS_REAL.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-accent" />
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-accent">
              <Sparkles size={14} /> WHAT AI ACCELERATES
            </div>
            <ul className="space-y-3">
              {WHAT_AI_ACCELERATES.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-accent" />
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-paper/10">
          <div className="mx-auto max-w-4xl px-6 py-12 text-center">
            <p className="text-2xl font-semibold md:text-3xl">
              AI changes the speed.
              <br />
              <span className="text-accent">It does not change the truth of the product.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- 14534-H 官方规格 ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-black">Featured product: SKU 14534-H</h2>
          <p className="mt-3 text-ink/55">
            Verified supplier facts. We only claim what the supplier has confirmed.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Package,
              title: "Factory SKU 14534-H",
              desc: "Black minimalist ankle boot. Rear zipper. Horizontal decorative lines around the tongue area. Light brown interior.",
            },
            {
              icon: Award,
              title: "Verified materials",
              desc: "Upper: microfiber. Lining: microfiber. Outsole: rubber. We do not call it leather.",
            },
            {
              icon: Factory,
              title: "Verified sizing & price",
              desc: "Sizes EU 38–46. Factory price RMB 98/pair. Domestic after-coupon control price RMB 148/pair.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-3xl border border-ink/10 bg-white p-7 shadow-sm"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-accent/10 p-3 text-accent">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-3 text-ink/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-4xl font-black leading-tight md:text-5xl">
          Meet the boot
          <br />
          <span className="text-accent">built for the daily route.</span>
        </h2>
        <p className="mt-5 text-ink/55 max-w-xl mx-auto">
          SKU 14534-H — microfiber, rear zipper, rubber outsole. Sizes EU 38–46.
        </p>
        <div className="mt-8">
          <Link href="/products/mono-boot">
            <Button size="lg">
              Shop 14534-H <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
