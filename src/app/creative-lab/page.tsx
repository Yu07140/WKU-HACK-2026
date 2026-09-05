import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { PRODUCTS, getProductById } from "@/lib/data/catalog";
import { ProductCard } from "@/components/store/ProductCard";
import { Button } from "@/components/ui/button";

export default function CreativeLabPage() {
  const hero = getProductById("boot-14534-h");
  // Everything except the real 14534-H lives here as sprint exploration.
  const concepts = PRODUCTS.filter((p) => p.id !== hero?.id);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      {/* ---------- HERO ---------- */}
      <div className="mb-14 border-b border-ink/10 pb-10">
        <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
          SPRINT EXPLORATION
        </div>
        <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
          CREATIVE LAB
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/60">
          Footwear directions explored during the 24-hour sprint. These are concept studies and
          are not part of the official STRYDE 14534-H collection.
        </p>
      </div>

      {/* ---------- CONTEXT NOTE ---------- */}
      <div className="mb-10 rounded-2xl border border-ink/10 bg-cream p-6">
        <div className="text-xs font-bold tracking-[0.2em] text-ink/50">WHY THIS PAGE EXISTS</div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">
          STRYDE's commercial launch is built around one real, transaction-ready boot — the 14534-H.
          The styles below were explored during the sprint to test creative direction and are
          preserved here for reference. They are not available for order.
        </p>
        <Link
          href="/products/mono-boot"
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-ink underline underline-offset-2"
        >
          <ArrowLeft size={15} /> Shop the 14534-H
        </Link>
      </div>

      {/* ---------- CONCEPT GRID ---------- */}
      <section>
        <div className="mb-6 text-xs font-bold tracking-[0.3em] text-ink/40">
          EXPLORED DIRECTIONS
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {concepts.map((p) => (
            <ProductCard key={p.id} product={p} concept />
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mt-16 mx-auto max-w-3xl rounded-3xl bg-ink p-10 text-center text-paper md:p-14">
        <h2 className="text-3xl font-black leading-tight md:text-4xl">
          THE OFFER IS ONE BOOT.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-paper/60">
          The 14534-H — a clean black ankle boot for the way your day moves.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products/mono-boot">
            <Button size="lg">
              SHOP THE BOOT <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline" className="border-paper/30 text-paper hover:bg-paper/10">
              THE STRYDE SYSTEM
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
