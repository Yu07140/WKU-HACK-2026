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

PRIMARY PRODUCT (Cargo Pool D: Traditional Men's Boots)
Factory SKU: 14534-H
Factory price: RMB 98 / pair
Domestic control-price reference: RMB 148 / pair
Upper: Microfiber | Lining: Microfiber | Outsole: Rubber
Sizes: EU 38–46
Sandbox retail: $119 (landed cost x brand multiplier ~3.0, guide 2.0-3.5)

BRAND-DECIDED POLICIES (team-confirmed, not supplier specs)
- 30-Day Guarantee: first pair covered (STRYDE commercial policy)
- 15% first-pair promotion: confirmed (code STRYDE15)
- Retail: sandbox $119 (final confirmed with carrier quotes)
- Duties: DDU (customer pays import duties on delivery)

OPERATIONAL ESTIMATES (demo)
- Lead time: production 3-5 business days + international transit 8-15 days (estimate)
- Shipping: free over $75 (US), else $7.90 flat; UK/EU $12.50, CA/AU $14.90

COLD-START PLAN (Proposed)
Channels: Meta + TikTok | Budget: $150 | Audience: US men 25-45 business-casual
Creatives: 3 hooks from Studio Creative Matrix | KPI: CTR >=1.5%, ATC >=8%, first order in 24h

PROOF
- Supply chain: real factory SKU, supplier-verified material & size
- Asset provenance: factory photography as product reference; AI used only for campaign concepts
- Transaction: sandbox test orders vs real customer orders clearly separated
- Data: simulated demo data labeled; actual results start from zero

TBC (not yet verified)
- MOQ, US/UK/CM size conversion, final retail price, real campaign results`;

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
        <h1 className="text-4xl font-black tracking-tight md:text-6xl">
          FROM FACTORY SKU
          <br />
          TO MARKET SIGNAL.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-ink/60">
          AI compresses the path to market. It does not replace the truth of the product.
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
          <div className="mt-4 rounded-xl bg-cream p-4 text-xs leading-relaxed text-ink/65">
            <div className="mb-1.5 font-bold tracking-wide text-ink/50">PRICING LOGIC (sandbox)</div>
            Landed cost = factory ¥98 (≈$13.6) + international freight + packaging + payment fee +
            returns reserve ≈ <strong>$38–42</strong>. Sandbox retail{" "}
            <strong>$119</strong> = landed cost × brand multiplier{" "}
            <strong>~3.0</strong> (category guide: 2.0–3.5). Final price confirmed with carrier quotes.
          </div>
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
                    alt="Factory Original"
                    size="square"
                    className="h-full w-full"
                  />
                )}
              </div>
              <div className="mt-2 text-center text-xs font-bold">FACTORY ORIGINAL</div>
              <div className="mt-0.5 text-center text-[11px] text-ink/50">SKU 14534-H · Real supplier photography</div>
            </div>
            <div>
              <div className="aspect-square overflow-hidden rounded-2xl border border-accent/30 bg-cream">
                {hero && (
                  <ProductImage
                    src="/creative/14534-h/commute-campaign.jpg"
                    prompt={hero.creativePresets?.ad ?? hero.imagePrompt}
                    alt="AI-Assisted Campaign Creative"
                    size="square"
                    className="h-full w-full"
                  />
                )}
              </div>
              <div className="mt-2 text-center text-xs font-bold text-accent-dark">AI-ASSISTED CAMPAIGN CREATIVE</div>
              <div className="mt-0.5 text-center text-[11px] text-ink/50">Concept Visual</div>
            </div>
          </div>
          <p className="mt-4 text-xs text-ink/55 leading-relaxed">
            The factory product remains the source of truth. AI accelerates background,
            composition and campaign exploration — not the sellable product itself.
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
              { label: "PLAN · COLD-START (Proposed)", desc: "Channels: Meta + TikTok. Budget: $150 ($100 Meta / $50 TikTok). Audience: US men 25–45, business-casual & commute interests. Creatives: 3 hooks from Studio Creative Matrix (TIKTOK / INSTAGRAM / META). KPI: CTR ≥1.5%, add-to-cart ≥8%, first paid order within 24h." },
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

      {/* ---------- ONE SKU. MULTIPLE GROWTH LEVERS. ---------- */}
      <div className="mt-12 rounded-3xl border border-ink/10 bg-white p-7">
        <div className="mb-6">
          <div className="text-xs font-bold tracking-[0.3em] text-ink/40">
            BUSINESS SYSTEM
          </div>
          <h2 className="mt-2 text-2xl font-black">ONE SKU. MULTIPLE GROWTH LEVERS.</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink/55">
            STRYDE extends one real footwear SKU into a complete system without introducing
            additional footwear inventory lines.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {[
            { name: "CORE", sku: "14534-H", role: "TRANSACTION", status: "LIVE" },
            { name: "DUO", sku: "14534-H × 2", role: "AOV", status: "BUNDLE" },
            { name: "CLIPS", sku: "—", role: "PERSONALIZATION", status: "IN DEVELOPMENT" },
            { name: "CARE 01", sku: "—", role: "FUTURE REPEAT", status: "IN DEVELOPMENT" },
            { name: "AI SYSTEM", sku: "Creative + Agent + Dashboard", role: "ACQUISITION → CONVERSION → LEARNING", status: "LIVE" },
          ].map((g) => (
            <div key={g.name} className="rounded-2xl border border-ink/10 bg-cream p-5">
              <div className="text-xs font-black tracking-[0.2em] text-ink/40">{g.name}</div>
              <div className="mt-1 text-sm font-bold">{g.sku}</div>
              <div className="mt-3 text-[11px] font-bold tracking-wide text-accent-dark">
                {g.role}
              </div>
              <div className="mt-2 text-[10px] font-semibold text-ink/45">{g.status}</div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs leading-relaxed text-ink/55">
          Only SKU 14534-H is currently transaction-ready. STRYDE CLIPS and CARE 01 remain
          extensions with supplier validation pending. STRYDE CLIPS extend one real
          footwear SKU into a personalization system without introducing another footwear
          inventory line.
        </p>

        {/* Flow visualization */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-bold">
          {["REAL SKU", "AI CREATIVE", "CUSTOMER ACQUISITION", "AI SHOPPING AGENT", "CONVERSION", "DUO / AOV", "FUTURE PERSONALIZATION + REPEAT", "DATA FEEDBACK LOOP"].map(
            (step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded-md bg-ink px-2.5 py-1.5 text-paper">{step}</span>
                {i < arr.length - 1 && <span className="text-ink/30">→</span>}
              </span>
            )
          )}
        </div>
      </div>

      {/* ---------- WHY THIS SKU? ---------- */}
      <div className="mt-6 rounded-3xl border border-ink/10 bg-white p-7">
        <div className="mb-5">
          <div className="text-xs font-bold tracking-[0.3em] text-ink/40">SELECTION RATIONALE</div>
          <h2 className="mt-2 text-2xl font-black">WHY THIS SKU?</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink/55">
            14534-H was selected for commercial readiness rather than whichever simulated concept
            scored highest creatively.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Complete product assets (supplier photography)",
            "Verified factory pricing (RMB 98 / pair)",
            "Clear material specification (microfiber upper & lining, rubber outsole)",
            "Simple size range (EU 38–46)",
            "Fastest path to a verifiable transaction test",
          ].map((r) => (
            <div key={r} className="flex items-start gap-2 rounded-xl bg-cream p-4 text-sm text-ink/70">
              <span className="mt-0.5 text-accent">✓</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- TBC list ---------- */}
      <div className="mt-10 rounded-3xl border border-ink/10 bg-cream p-7">
        <h2 className="text-xl font-black">Not yet verified — TBC</h2>
        <div className="mt-4 grid gap-2 text-sm text-ink/65 md:grid-cols-2">
          {[
            "MOQ — supplier confirmation required",
            "Production lead time — demo assumption 3–5 business days, pending supplier confirmation",
            "International shipping rates & transit — demo flat rates, pending carrier quotes",
            "US / UK / CM size conversion — pending supplier confirmation",
            "Final overseas retail price — sandbox $119, final after landed-cost confirmation",
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
