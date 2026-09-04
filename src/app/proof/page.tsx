"use client";

import Link from "next/link";
import {
  Factory,
  ImageIcon,
  ShoppingCart,
  BarChart3,
  Sparkles,
  ArrowRight,
  MessageCircle,
  LayoutDashboard,
  Copy,
} from "lucide-react";
import { getProductById } from "@/lib/data/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";

const JUDGE_SUMMARY = `STRYDE — WKU HACK 2026
ONE REAL SKU. 24 HOURS. ONE GLOBAL TEST.

PRIMARY PRODUCT
Factory SKU: 14534-H
Factory price: RMB 98 / pair
Domestic control-price reference: RMB 148 / pair
Upper: Microfiber | Lining: Microfiber | Outsole: Rubber
Sizes: EU 38–46

PROOF
- Supply chain: real factory SKU, supplier-verified material & size
- Asset provenance: factory photography as product reference; AI used only for campaign concepts
- Transaction: sandbox test orders vs real customer orders clearly separated
- Data: simulated demo data labeled; actual results start from zero

TBC (not yet verified)
- MOQ, production lead time, international shipping, US/UK/CM size conversion,
  final overseas retail price, real return policy, real campaign results`;

export default function ProofPage() {
  const hero = getProductById("boot-14534-h");

  function copySummary() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(JUDGE_SUMMARY);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* ---------- HERO ---------- */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-bold tracking-wider text-accent-dark">
          <BarChart3 size={13} /> JUDGE / EVIDENCE MODE
        </div>
        <h1 className="text-5xl font-black tracking-tight md:text-6xl">
          Proof Mode
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-ink/55">
          Every claim on STRYDE is traceable to a real factory SKU or explicitly labeled as
          simulated. This page is built for judges to verify the story quickly.
        </p>
      </div>

      {/* ---------- Quick buttons ---------- */}
      <div className="mb-14 flex flex-wrap justify-center gap-3">
        <Link href="/products/mono-boot">
          <Button size="lg"><ShoppingCart size={18} /> SHOP 14534-H</Button>
        </Link>
        <Link href="/studio">
          <Button size="lg" variant="outline"><Sparkles size={18} /> OPEN AI STUDIO</Button>
        </Link>
        <Link href="/">
          <Button size="lg" variant="outline"><MessageCircle size={18} /> TRY AI AGENT</Button>
        </Link>
        <Link href="/admin">
          <Button size="lg" variant="outline"><LayoutDashboard size={18} /> VIEW GROWTH DASHBOARD</Button>
        </Link>
        <Button size="lg" variant="outline" onClick={copySummary}>
          <Copy size={18} /> EXPORT JUDGE SUMMARY
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* A. SUPPLY CHAIN PROOF */}
        <div className="rounded-3xl border border-ink/10 bg-white p-7">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-accent/10 p-3 text-accent"><Factory size={22} /></div>
            <h2 className="text-xl font-black">A · Supply Chain Proof</h2>
          </div>
          <dl className="space-y-2.5 text-sm">
            <Row label="Factory SKU" value="14534-H" />
            <Row label="Factory price" value="RMB 98 / pair" />
            <Row label="Domestic control-price reference" value="RMB 148 / pair" />
            <Row label="Size range" value="EU 38–46" />
            <Row label="Upper" value="Microfiber" />
            <Row label="Lining" value="Microfiber" />
            <Row label="Outsole" value="Rubber" />
          </dl>
        </div>

        {/* B. ASSET PROVENANCE */}
        <div className="rounded-3xl border border-ink/10 bg-white p-7">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-accent/10 p-3 text-accent"><ImageIcon size={22} /></div>
            <h2 className="text-xl font-black">B · Asset Provenance</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="aspect-square overflow-hidden rounded-2xl border border-ink/10">
                {hero && (
                  <ProductImage
                    src={hero.heroImage ?? hero.image}
                    prompt={hero.imagePrompt}
                    alt="Factory original"
                    size="square"
                    className="h-full w-full"
                  />
                )}
              </div>
              <div className="mt-2 text-center text-xs font-bold">FACTORY ORIGINAL</div>
            </div>
            <div>
              <div className="aspect-square overflow-hidden rounded-2xl border border-accent/30 bg-cream">
                {hero && (
                  <ProductImage
                    src={hero.heroImage ?? hero.image}
                    prompt={hero.creativePresets?.ad ?? hero.imagePrompt}
                    alt="AI creative"
                    size="square"
                    className="h-full w-full"
                  />
                )}
              </div>
              <div className="mt-2 text-center text-xs font-bold text-accent-dark">AI-GENERATED CREATIVE</div>
            </div>
          </div>
          <p className="mt-4 text-xs text-ink/55 leading-relaxed">
            The product reference is factory photography. AI is used for campaign concept
            generation and workflow acceleration — not to invent a sellable SKU.
          </p>
        </div>

        {/* C. TRANSACTION PROOF */}
        <div className="rounded-3xl border border-ink/10 bg-white p-7">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-accent/10 p-3 text-accent"><ShoppingCart size={22} /></div>
            <h2 className="text-xl font-black">C · Transaction Proof</h2>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-4">
              <div className="text-sm font-bold text-amber-700">SANDBOX TEST ORDER</div>
              <div className="mt-1 text-xs text-ink/55">
                Hackathon checkout demo. Used to validate the storefront flow. Not a real purchase.
              </div>
            </div>
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <div className="text-sm font-bold text-green-700">REAL CUSTOMER ORDER</div>
              <div className="mt-1 text-xs text-ink/55">
                A genuine customer purchase. Never mixed with sandbox test records.
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-ink/55">
            The factory fulfillment record supports: order_id, brand_sku, factory_sku,
            size_eu, size_us, gender, color_or_print_id, qty, ship_to_country,
            shipping_method, promised_sla, customer_note.
          </p>
        </div>

        {/* D. DATA PROOF */}
        <div className="rounded-3xl border border-ink/10 bg-white p-7">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-accent/10 p-3 text-accent"><BarChart3 size={22} /></div>
            <h2 className="text-xl font-black">D · Data Proof</h2>
          </div>
          <div className="space-y-2">
            {[
              { label: "PLAN", desc: "Planned campaign budget, audience, KPI targets." },
              { label: "SIMULATED DEMO DATA", desc: "Dashboard workflow demonstration — not real campaign results." },
              { label: "ACTUAL RESULT", desc: "Starts from actual recorded data only. No live campaign data yet." },
            ].map((d) => (
              <div key={d.label} className="rounded-xl border border-ink/10 bg-cream p-4">
                <div className="text-sm font-bold">{d.label}</div>
                <div className="mt-1 text-xs text-ink/55">{d.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- TBC list ---------- */}
      <div className="mt-10 rounded-3xl border border-ink/10 bg-cream p-7">
        <h2 className="text-xl font-black">Not yet verified — TBC</h2>
        <div className="mt-4 grid gap-2 text-sm text-ink/65 md:grid-cols-2">
          {[
            "MOQ — supplier confirmation required",
            "Production / fulfillment lead time — organizer/supplier confirmation required",
            "International shipping cost & delivery time — destination & logistics method required",
            "US / UK / CM size conversion — pending supplier confirmation",
            "Real return policy — to be confirmed before live sales",
            "Final overseas retail price — TBC after logistics / payment / return reserve",
            "Real campaign results — no live campaigns yet",
          ].map((t) => (
            <div key={t} className="flex gap-2">
              <span className="text-accent">•</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link href="/products/mono-boot">
          <Button size="lg">
            Return to 14534-H <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-ink/5 pb-2">
      <dt className="text-ink/50">{label}</dt>
      <dd className="font-bold text-ink/80">{value}</dd>
    </div>
  );
}
