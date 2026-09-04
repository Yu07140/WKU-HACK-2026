import Link from "next/link";
import { ArrowRight, Award, Factory, RotateCcw } from "lucide-react";
import { PRODUCTS, getProduct } from "@/lib/data/catalog";
import { BRAND } from "@/lib/data/brand";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const featured = [...PRODUCTS].sort((a, b) => b.heatScore - a.heatScore).slice(0, 4);
  // catalog 已被替换为组委会真实货盘，slug 全部变更，直接取第一款
  const heroProduct = PRODUCTS[0];
  const heroColor = heroProduct.colors[0];

  return (
    <div>
      {/* =========================================================
          SECTION 1 — HERO
         ========================================================= */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:gap-16 md:py-24">
          <div className="animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-[11px] font-black tracking-[0.2em] text-ink/70">
              <Factory size={13} className="text-accent" />
              FACTORY-BORN. STREET-READY.
            </div>
            <h1 className="text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
              Stand Taller.
              <br />
              <span className="text-accent">Stand Out.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink/65">
              Bold silhouettes built by hands with 18 years of shoemaking experience —
              factory-direct, thoughtfully priced, and made to turn heads.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/products">
                <Button size="lg">
                  SHOP THE COLLECTION <ArrowRight size={16} />
                </Button>
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-ink/70 transition hover:text-ink"
              >
                OUR STORY
              </Link>
            </div>
          </div>

          <div className="relative">
            <ProductImage
              prompt={heroColor.imagePrompt + ", cinematic advertising photo, floating mid-air with soft dynamic shadows, warm cream studio background, premium streetwear campaign, dramatic studio light"}
              alt={`${heroProduct.name} — featured pair`}
              size="portrait_4_3"
              className="aspect-[4/5] rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 2 — BEST SELLERS
         ========================================================= */}
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-black md:text-4xl">
                THE PAIRS EVERYONE&apos;S TALKING ABOUT
              </h2>
              <p className="mt-2 text-ink/55">Statement shoes made to be noticed.</p>
            </div>
            <Link
              href="/products"
              className="hidden items-center gap-1 text-sm font-bold sm:flex"
            >
              VIEW ALL <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-8 flex sm:hidden">
            <Link href="/products" className="mx-auto text-sm font-bold">
              VIEW ALL →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3 — WHY STRYDE / TRUST STRIP
         ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Award,
              big: "18 YEARS",
              small: "Shoemaking Experience",
              desc: "Our team has been crafting footwear for brands around the world since 2008.",
            },
            {
              icon: Factory,
              big: "FACTORY DIRECT",
              small: "Fewer Middlemen",
              desc: "We cut out the importers and distributors — what you see is what you get.",
            },
            {
              icon: RotateCcw,
              big: "30-DAY",
              small: "Try-On & Easy Returns",
              desc: "Wear them out. If they don't fit, send them back on us.",
            },
          ].map(({ icon: Icon, big, small, desc }) => (
            <div
              key={big}
              className="rounded-3xl border border-ink/10 bg-white p-7 transition hover:border-accent/30 hover:shadow-md"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-accent/10 p-3 text-accent">
                <Icon size={24} />
              </div>
              <div className="text-3xl font-black tracking-tight">{big}</div>
              <div className="mt-1 text-sm font-bold text-accent-dark">{small}</div>
              <p className="mt-4 text-sm leading-relaxed text-ink/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 4 — BRAND STORY
         ========================================================= */}
      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <ProductImage
            prompt="wide documentary photo of a modern shoe factory assembly line in Wenzhou China, skilled workers crafting sneakers, warm natural light from skylights, photorealistic, respectful and human"
            alt="18 years of shoemaking"
            size="landscape_4_3"
            className="aspect-[4/3] rounded-3xl"
          />
          <div>
            <div className="mb-4 text-[11px] font-black tracking-[0.25em] text-accent">
              18 YEARS BEHIND EVERY PAIR
            </div>
            <h2 className="text-3xl font-black leading-snug md:text-4xl">
              Why this new brand comes with old-school credibility.
            </h2>
            <div className="mt-6 space-y-4 text-paper/75 leading-relaxed">
              <p>
                For 18 years, our team in Wenzhou has been making footwear for brands around
                the world — same lasts, same leathers, same hands.
              </p>
              <p>
                STRYDE brings that manufacturing experience directly to you: bold design,
                thoughtful construction, and fewer layers between the factory and your closet.
              </p>
            </div>
            <Link href="/about">
              <Button variant="primary" size="lg" className="mt-8">
                DISCOVER OUR STORY <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 5 — FINAL CTA
         ========================================================= */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h2 className="text-4xl font-black leading-tight md:text-5xl">
          READY TO FIND YOUR PAIR?
        </h2>
        <p className="mt-4 text-lg text-ink/55">
          Bold silhouettes. Built to move.
        </p>
        <div className="mt-9">
          <Link href="/products">
            <Button size="lg">
              SHOP ALL SHOES <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
