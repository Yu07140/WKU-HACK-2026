import Link from "next/link";
import { ArrowRight, Package, Sparkles, Compass } from "lucide-react";
import { BRAND } from "@/lib/data/brand";
import { getProductById } from "@/lib/data/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `About — ${BRAND.name}`,
  description:
    "STRYDE — one real product, a faster way to market. The product stays real. The process gets smarter.",
};

const PILLARS = [
  {
    icon: Package,
    title: "PRODUCT",
    items: ["Real factory SKU", "Real material", "Real construction"],
  },
  {
    icon: Sparkles,
    title: "PROCESS",
    items: ["AI-assisted creative", "Copy", "Product discovery", "Market testing"],
  },
  {
    icon: Compass,
    title: "PRINCIPLE",
    items: ["Move faster.", "Stay honest."],
  },
];

export default function AboutPage() {
  const featured = getProductById("boot-14534-h");

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="mb-4 text-xs font-bold tracking-[0.3em] text-ink/40">STRYDE</div>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
              STAND UP.
              <br />
              <span className="text-ink/80">STAND OUT.</span>
            </h1>
            <div className="mt-5 text-lg font-semibold text-ink/60">
              ONE REAL PRODUCT. A FASTER WAY TO MARKET.
            </div>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-ink/65">
              STRYDE began with a simple idea: a good product should not need months of
              traditional brand-building before it can meet its customer.
            </p>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink/65">
              We start with a real footwear product and use an AI-assisted creative and
              commerce workflow to move faster — from positioning and campaign concepts to
              product discovery and checkout.
            </p>
            <p className="mt-4 max-w-lg text-lg font-medium leading-relaxed text-ink/80">
              The product stays real. The process gets smarter.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/products/mono-boot">
                <Button size="lg">
                  Shop the boot <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/proof" className="text-sm font-bold text-ink/70 underline underline-offset-4 decoration-ink/30">
                See the evidence
              </Link>
            </div>
          </div>
          {featured && (
            <ProductImage
              src={featured.heroImage ?? featured.image}
              prompt={featured.imagePrompt}
              alt={`STRYDE 14534-H — black minimalist ankle boot`}
              size="landscape_4_3"
              className="aspect-[4/3] rounded-3xl shadow-2xl"
            />
          )}
        </div>
      </section>

      {/* ---------- PRODUCT / PROCESS / PRINCIPLE ---------- */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-8 md:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, items }) => (
              <div key={title} className="rounded-3xl bg-white p-8">
                <div className="mb-5 inline-flex rounded-2xl bg-ink/5 p-3 text-ink">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-black tracking-wide">{title}</h3>
                <ul className="mt-4 space-y-2.5 text-ink/65">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-4xl font-black leading-tight md:text-5xl">
          The boot built for the way your day moves.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-ink/55">
          14534-H — microfiber upper, rear zipper, rubber outsole. Sizes EU 38–46.
        </p>
        <div className="mt-8">
          <Link href="/products/mono-boot">
            <Button size="lg">
              SHOP THE BOOT <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
