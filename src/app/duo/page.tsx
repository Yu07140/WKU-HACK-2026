"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Check } from "lucide-react";
import { getProductById } from "@/lib/data/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cart";
import { ECOSYSTEM } from "@/lib/data/brand";

const EU_SIZES = [38, 39, 40, 41, 42, 43, 44, 45, 46];

export default function DuoPage() {
  const product = getProductById("boot-14534-h")!;
  const { add } = useCart();
  const [size1, setSize1] = useState<number | null>(null);
  const [size2, setSize2] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  const color = product.colors[0];
  const image = color.realImage ?? color.image ?? product.heroImage ?? product.image;

  function handleAddDuo() {
    if (!size1 || !size2) return;
    const base = {
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      color: color.name,
      sizeSystem: product.sizeSystem,
      price: product.price,
      imagePrompt: color.imagePrompt,
      image,
      realImage: image,
    };
    if (size1 === size2) {
      add({ ...base, size: size1, qty: 2 });
    } else {
      add({ ...base, size: size1, qty: 1 });
      add({ ...base, size: size2, qty: 1 });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  const same = size1 !== null && size1 === size2;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      {/* ---------- HERO ---------- */}
      <div className="mb-14 border-b border-ink/10 pb-10">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <div className="text-xs font-bold tracking-[0.3em] text-ink/40">
            THE STRYDE SYSTEM
          </div>
          <span className="rounded-full bg-ink/90 px-3 py-1 text-[11px] font-black tracking-wider text-paper">
            BUNDLE
          </span>
        </div>
        <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
          {ECOSYSTEM.duo.split("\n").map((l, i) => (
            <span key={i}>
              {l}
              {i === 0 && <br />}
            </span>
          ))}
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink/60">
          One for the workweek. One for everything after. Build a two-pair rotation using the same
          real 14534-H — choose each EU size separately.
        </p>
      </div>

      {/* ---------- CONFIGURATOR ---------- */}
      <section className="mb-16 grid gap-10 md:grid-cols-2">
        {/* Two pairs visual */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((n) => (
            <div key={n} className="relative overflow-hidden rounded-3xl bg-cream">
              <ProductImage
                src={image}
                prompt={color.imagePrompt}
                alt={`STRYDE 14534-H — Pair ${n}`}
                size="portrait_4_3"
                className="aspect-[4/5] w-full"
              />
              <div className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-black tracking-wider text-paper">
                PAIR {n}
              </div>
            </div>
          ))}
        </div>

        {/* Size selectors */}
        <div className="flex flex-col">
          <div className="text-xs font-bold tracking-[0.2em] text-accent">SKU 14534-H × 2</div>
          <h2 className="mt-2 text-2xl font-black">Build your rotation</h2>

          <SizeSelector
            label="PAIR ONE"
            value={size1}
            onChange={setSize1}
          />
          <SizeSelector
            label="PAIR TWO"
            value={size2}
            onChange={setSize2}
          />

          {same && (
            <p className="mt-3 text-xs text-ink/50">
              Same size — both pairs will be added as a single quantity-2 line.
            </p>
          )}
          {size1 && size2 && !same && (
            <p className="mt-3 text-xs text-ink/50">
              Different sizes — two separate cart lines will be created.
            </p>
          )}

          <div className="mt-6 rounded-2xl bg-cream p-4 text-xs leading-relaxed text-ink/55">
            Bundle savings will be finalized after launch-cost validation.
          </div>

          <Button
            size="lg"
            className="mt-6 w-full"
            onClick={handleAddDuo}
            disabled={!size1 || !size2}
          >
            {added ? (
              <>
                <Check size={18} /> Added to bag
              </>
            ) : (
              <>
                <ShoppingBag size={18} /> {size1 && size2 ? "ADD DUO TO BAG" : "Select both sizes"}
              </>
            )}
          </Button>
          {added && (
            <Link
              href="/cart"
              className="mt-3 text-center text-sm font-bold text-ink underline underline-offset-2"
            >
              View bag &amp; checkout →
            </Link>
          )}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-3xl rounded-3xl bg-ink p-10 text-center text-paper md:p-14">
        <h2 className="text-3xl font-black leading-tight md:text-4xl">STAND UP. STAND OUT.</h2>
        <p className="mx-auto mt-4 max-w-xl text-paper/60">
          Two pairs. One rotation. Built on the real 14534-H.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
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

function SizeSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (n: number) => void;
}) {
  return (
    <div className="mt-6">
      <div className="mb-2 text-sm font-bold">
        {label}: <span className="font-normal text-ink/60">EU {value ?? "—"}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {EU_SIZES.map((s) => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`h-11 w-14 rounded-xl border text-sm font-bold transition ${
              value === s
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 bg-white hover:border-ink/60"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
