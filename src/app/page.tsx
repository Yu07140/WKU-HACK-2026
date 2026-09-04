import Link from "next/link";
import { ArrowRight, Truck, RotateCcw, Factory, Star } from "lucide-react";
import { PRODUCTS } from "@/lib/data/catalog";
import { BRAND, BRAND_STORY } from "@/lib/data/brand";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { PLACEHOLDER_MODE } from "@/lib/utils";

export default function HomePage() {
  const featured = [...PRODUCTS].sort((a, b) => b.heatScore - a.heatScore).slice(0, 4);

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 md:grid-cols-2 md:py-20">
          <div className="animate-fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-bold tracking-wider text-ink/70">
              <Factory size={13} className="text-accent" />
              FACTORY DIRECT · NO MIDDLEMEN
            </div>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
              walk past
              <br />
              the <span className="text-accent">markup.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink/65">
              {BRAND.name} 把代工 18 年的鞋厂直接开到你面前——同样的产线、同样的材料，
              一半的价格。AI 设计、AI 素材、48 小时发货。
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/products">
                <Button size="lg">
                  Shop the Drop <ArrowRight size={18} />
                </Button>
              </Link>
              <Link
                href="/studio"
                className="flex items-center gap-2 text-sm font-bold underline decoration-accent decoration-2 underline-offset-4"
              >
                看看 AI 怎么 60 小时造出一个品牌 →
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-8 text-sm text-ink/60">
              <div className="flex items-center gap-2">
                <Truck size={17} className="text-accent" /> Free shipping over $75
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={17} className="text-accent" /> 30-day wear test
              </div>
              <div className="flex items-center gap-2">
                <Star size={17} className="text-accent" fill="currentColor" /> 4.7/5 · 7.5k reviews
              </div>
            </div>
          </div>

          <div className="relative">
            <ProductImage
              prompt="cinematic advertising photo of a single vermilion red knit running sneaker floating mid-air with dynamic orange energy ribbons, warm cream background, premium sportswear campaign, dramatic studio light"
              alt="STRYDE hero shoe"
              size="portrait_4_3"
              className="aspect-[4/5] rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-ink px-5 py-4 text-paper shadow-xl md:block">
              <div className="text-2xl font-black text-accent">{PLACEHOLDER_MODE ? "$???" : "$89"}</div>
              <div className="text-xs text-paper/60">{PLACEHOLDER_MODE ? "vs. $??? brand markup" : "vs. $210 brand markup"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 价值条 ---------- */}
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 md:grid-cols-4">
          {[
            ["18 年", "同一产线代工国际大牌"],
            ["38%", "鞋面含回收材料"],
            ["48h", "美国本土发货时效"],
            ["60h", "AI 完成品牌冷启动"],
          ].map(([big, small]) => (
            <div key={big}>
              <div className="text-3xl font-black text-accent">{big}</div>
              <div className="mt-1 text-sm text-ink/55">{small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 热卖 ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black">This Week&apos;s Heat 🔥</h2>
            <p className="mt-1 text-ink/55">AI 选款模型按广告点击、加购与搜索热度实时排序</p>
          </div>
          <Link href="/products" className="hidden items-center gap-1 text-sm font-bold sm:flex">
            View all <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ---------- 品牌故事（工厂 → DTC） ---------- */}
      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <ProductImage
            prompt="wide photo of a modern shoe factory assembly line with workers making sneakers, warm industrial lighting, documentary style, photorealistic"
            alt="shoe factory"
            size="landscape_4_3"
            className="aspect-[4/3] rounded-3xl"
          />
          <div>
            <div className="mb-3 text-xs font-bold tracking-[0.2em] text-accent">
              FROM WHITE-LABEL TO WORLDWIDE
            </div>
            <h2 className="text-3xl font-black leading-snug md:text-4xl">
              白牌鞋厂，也可以有自己的名字。
            </h2>
            <div className="mt-6 space-y-3 text-paper/70">
              {BRAND_STORY.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <Link href="/admin">
              <Button variant="primary" size="lg" className="mt-8">
                查看品牌增长实时看板 <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- 邮件订阅 ---------- */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-3xl font-black">Get $15 off your first pair</h2>
        <p className="mt-3 text-ink/55">
          订阅上新与专属折扣。新客码 <span className="font-bold text-accent">STRYDE15</span>
        </p>
        <form className="mx-auto mt-7 flex max-w-md gap-3" action="/products">
          <input
            type="email"
            required
            placeholder="you@email.com"
            className="h-12 flex-1 rounded-full border border-ink/20 bg-white px-5 text-sm outline-none focus:border-accent"
          />
          <Button type="submit" size="md" className="h-12">
            Claim
          </Button>
        </form>
      </section>
    </div>
  );
}
