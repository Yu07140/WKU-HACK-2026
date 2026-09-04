import Link from "next/link";
import { ArrowRight, Factory, Truck, RotateCcw, Heart, Award, Leaf } from "lucide-react";
import { BRAND, BRAND_STORY } from "@/lib/data/brand";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `About Us — ${BRAND.name}`,
  description:
    "18 years making shoes for the world's biggest brands. Now factory-direct to you. Same lasts, same materials, half the price.",
};

export default function AboutPage() {
  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-bold tracking-wider text-ink/70">
              <Factory size={13} className="text-accent" />
              EST. 2008 · WENZHOU CHINA
            </div>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
              From a factory floor
              <br />
              to your <span className="text-accent">front door.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink/65">
              For 18 years we've made sneakers for brands you'd recognize on any street in New
              York or London. Same lasts, same materials, same hands — but with their logo on
              the box and their markup on the tag. Today we're cutting out the middle.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/products">
                <Button size="lg">
                  Shop the Collection <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
          <ProductImage
            prompt="wide aerial photo of a modern shoe factory production line in Wenzhou China, workers assembling sneakers on conveyors, warm natural light through skylights, photorealistic documentary style"
            alt="STRYDE factory in Wenzhou"
            size="landscape_4_3"
            className="aspect-[4/3] rounded-3xl shadow-2xl"
          />
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

      {/* ---------- 三个 Why ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-black">Why {BRAND.name} wins</h2>
          <p className="mt-3 text-ink/55">
            We built this brand so you never have to pay for someone else's billboard again.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Factory,
              title: "Factory-direct pricing",
              desc: "No importers. No distributors. No retail rent. The same pair that retails for $200+ goes straight from our floor to you at half.",
            },
            {
              icon: Award,
              title: "Same 18-year quality",
              desc: "Same lasts, same leather, same stitching crews that make $200+ sneakers. We don't build a second-tier line for ourselves.",
            },
            {
              icon: Leaf,
              title: "Less waste. More care.",
              desc: "38% recycled materials in every upper. Zero deadstock seasons — AI tells us what to make before we make it.",
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

      {/* ---------- 承诺 ---------- */}
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 md:grid-cols-4">
          {[
            [Truck, "Free shipping", "on orders over $75"],
            [RotateCcw, "30-day wear test", "doesn't fit? send it back"],
            [Heart, "Loved by 7.5k+", "4.7 / 5 average rating"],
            [Factory, "Made by us", "not 3 middlemen later"],
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
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-4xl font-black leading-tight md:text-5xl">
          Enough labels.
          <br />
          <span className="text-accent">Time for the good stuff.</span>
        </h2>
        <p className="mt-5 text-ink/55 max-w-xl mx-auto">
          Put our 18 years to the test. Free shipping, 30 days to decide, and a team in
          Wenzhou that actually gives a damn.
        </p>
        <div className="mt-8">
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
