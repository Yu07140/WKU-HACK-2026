import Link from "next/link";
import { ArrowRight, Factory, Truck, RotateCcw, Heart, Award, Package } from "lucide-react";
import { BRAND, BRAND_STORY } from "@/lib/data/brand";
import { getProductById } from "@/lib/data/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `About Us — ${BRAND.name}`,
  description:
    "Factory-direct footwear accelerated by AI-powered DTC workflows. (Demo brand narrative — hackathon prototype.)",
};

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
              FACTORY-DIRECT · AI ACCELERATED (Demo)
            </div>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
              From a factory floor
              <br />
              to your <span className="text-accent">front door.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink/65">
              STRYDE is a hackathon demo of a factory-direct footwear brand powered by
              AI-driven DTC workflows. Our featured product is factory SKU 14534-H,
              a black minimalist ankle boot built for commuting, business casual and
              short city trips.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/products/mono-boot">
                <Button size="lg">
                  See SKU 14534-H <ArrowRight size={18} />
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

      {/* ---------- 4 句品牌故事 ---------- */}
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <div className="mb-4 text-xs font-bold tracking-[0.25em] text-accent">
            OUR STORY
          </div>
          <div className="space-y-6 text-2xl font-semibold leading-relaxed md:text-3xl">
            <p>We spent 18 years making boots for other labels.</p>
            <p className="text-paper/70">Same lasts, same leather, same hands.</p>
            <p>They put a logo on the box and doubled the price.</p>
            <p className="text-accent">We put ours on it instead.</p>
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

      {/* ---------- 承诺（均标注 Demo） ---------- */}
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 md:grid-cols-4">
          {[
            [Truck, "Factory-direct shipping*", "Demo policy"],
            [RotateCcw, "30-day return*", "Demo return policy"],
            [Heart, "Rating (Demo)", "no verified reviews yet"],
            [Factory, "Factory SKU 14534-H", "microfiber · rubber outsole"],
          ].map(([Icon, big, small]) => (
            <div key={big as string} className="flex items-start gap-3">
              <Icon size={22} className="mt-0.5 text-accent shrink-0" />
              <div>
                <div className="text-sm font-bold">{big as string}</div>
                <div className="text-xs text-ink/55 mt-0.5">{small as string}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto max-w-7xl px-6 pb-14 text-[11px] text-ink/40">
          * 标注项为黑客松演示政策，非真实运营承诺。Shipping cost and delivery estimate
          depend on destination and logistics method.
        </p>
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
