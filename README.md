# STRYDE — Step Beyond.

**An AI-powered D2C footwear brand built from a real factory catalog in a single sprint.**

WKU HACK 2026 · *24-Hour Cross-Border Sprint: AI-Powered D2C Footwear Brand & Fast Monetization* (极限出海 · 24 小时实战营)

## Live Demo

| Deployment | URL | Notes |
| --- | --- | --- |
| **Primary (China-accessible)** | [wku-hack-2026-stryde.edgeone.dev](https://wku-hack-2026-stryde.edgeone.dev) | Tencent EdgeOne global edge — fast and reachable from mainland China |
| Mirror (International) | [wku-hack-2026.vercel.app](https://wku-hack-2026.vercel.app) | Vercel — backup deployment |

The storefront runs a full commerce loop (browse → cart → checkout → order visible in the admin dashboard). The admin backend is password-protected and can be reached via the **Admin** button in the footer.

---

## 1. The Challenge

Traditional footwear manufacturing belts in China possess world-class prototyping and production capacity, yet they have long been constrained by four structural bottlenecks on the retail side:

1. **No direct-to-consumer channel expertise** — factories are accustomed to B2B marketplaces and platform reselling, not building brand assets on independent overseas storefronts.
2. **Slow brand incubation** — the traditional path from molding, photography, and site-building to advertising takes weeks or months.
3. **Expensive overseas marketing assets** — a single usable set of model photography, short videos, and landing pages is costly and slow to iterate.
4. **Slow product-selection feedback** — teams cannot tell which colorway, silhouette, or market will pay first.

The competition compresses all four problems into 24 hours. Each team selects **one primary catalog** from four real footwear supply chains (3D-printed footwear, POD print-on-demand customization, RO-silhouette high-tops, and traditional men's boots — all with verified specifications, pricing, lead times, and physical samples), and must complete a full leap:

> **Select catalog → Establish brand → Launch storefront → Generate assets → Cold-start advertising → Close a real transaction.**

This is not a concept demo. The deliverable is a cross-border business that can be explained, ordered, and fulfilled. Judging (100 points) weights: **Real Commerce Loop (30) · Brand & Selection (20) · AI Productivity (20) · Supply-Chain Match (15) · Global Presentation & Pitch (15)**.

## 2. Our Track — RO-Silhouette High-Top Casual Boots (Lanhe International)

STRYDE is built on **Track C**: the RO-silhouette high-top catalog supplied by **Lanhe International**, an OEM/ODM footwear manufacturer.

| Supply-chain fact | Detail |
| --- | --- |
| Manufacturer | Lanhe International (OEM / ODM footwear) |
| Category | Casual Boots (high-top) |
| Construction | Cold Bonding (冷粘) |
| Materials | PU leather; select canvas variants |
| Catalog | 19 colorways; main series **Model 5919-5** offered in 10 colorways (Black, Black Patent, Black Canvas, Black Snake, Beige, Denim, Orange, Pink, Yellow, Rose Red), plus 9 extended silhouettes (5830 Gold, 9525 Laser/Holographic, 5960, 5922, 5925, 5970, 8058, 8801, 8013) |
| Visual assets | Multi-angle product photography at EU 37/41 per colorway (321 structure drawings) |
| Live inventory | Wenzhou warehouse — **8,454 pairs on hand** across EU 35–45, 48-hour dispatch |
| MOQ / lead time | 300 pairs / ~25 days production + international shipping |

The RO silhouette — chunky platform high-top, blunt toe, wide lacing — is an established fashion code in overseas niche markets. Our strategy follows the catalog's intended play: **visual and tonal premium for a niche fashion DTC audience**, not a price war. Per competition rules, the brand identity is fully original (no third-party trademarks), and materials are disclosed honestly (PU leather is never presented as genuine leather).

## 3. What We Built

STRYDE ("Step Beyond.") is a complete, deployable DTC operation for the North American 22–35 urban commuter audience — storefront, AI content pipeline, growth console, and transaction loop in a single Next.js application.

### 3.1 Storefront (Consumer-Facing)

- **Home** — brand positioning, hero product, trust signals (free-shipping threshold, 30-day wear test, labeled demo metrics).
- **Product listing & detail pages** — 13 listings spanning the Lanhe catalog plus a cross-track winter extension (supplier boots 11295-J / 14534-H / 53125-J, EU 38–46). Every detail page carries the real factory model number, construction, materials, sizes, MOQ, lead time, and demo-marked pricing.
- **Per-size warehouse availability** — the PDP queries a live Wenzhou stock table (24 SKU-colors × EU 35–45) and renders per-size pair counts that update as the shopper switches colorways.
- **Size guide** — EU/US conversion with per-model size systems.
- **Cart & checkout** — full purchase flow; orders stream into the operations console in real time.

### 3.2 AI Creative Studio (`/studio`)

- **Scene generator** — product-level prompt presets (studio / street / flat-lay / advertising) render campaign-grade imagery from the factory's white-background photos.
- **Copy generator** — platform-aware ad copy across Meta / TikTok / Google with structured hooks and hashtags.
- **Creative matrix** — cross-platform × cross-angle campaign combinations in one pass.
- **Video script generator** — shot-by-shot short-video scripts for cold-start advertising.

### 3.3 AI Shopping Agent

A conversational shopping assistant (floating widget) with streaming replies, catalog retrieval, size/logistics Q&A, and product-card recommendations — designed with an LLM-first architecture and a deterministic fallback, so the demo never fails offline.

### 3.4 Growth Console (`/admin`)

- **Funnel & KPI overview** — impressions → clicks → orders → ROAS.
- **Campaign management** — cold-start ad sets with channel, budget, audience, creative, and success metrics.
- **Live order feed** — every checkout lands here instantly, closing the transaction loop.
- **AI-assisted product selection** — heat scoring across the catalog.

## 4. AI Usage & Technical Honesty

Per the competition's disclosure rules:

- **Real factory photography** — Lanhe's actual product photos (extracted from the official *Lanhe Product Collection 2026* catalog and the 37/41 structure-drawing set) are used as primary product imagery across listing, detail, and cart pages.
- **AI-generated imagery** — scene, campaign, and hero visuals produced by text-to-image models are confined to the Creative Studio and clearly derived from prompt presets; they never replace factory product photos on the PDP.
- **Demo pricing** — supplier data does not include MSRP; all retail prices are marked as demo values derived from the landing-cost framework (factory price + international freight + payment fees + ad spend reserve + returns reserve, × brand multiple).
- **No fabricated capabilities** — production lead time (MOQ 300, ~25 days + shipping) and material composition (PU leather / canvas) are stated as-is; no "ship in 24 hours" claims; no third-party trademarks anywhere.

## 5. Technology

- **Next.js 15** (App Router, Route Handlers) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (token-based theming) · **lucide-react**
- Deployed on **Vercel** (CI on every push)
- **AI layer** — unified text-to-image wrapper (`lib/ai/image.ts`), copy engine (`lib/ai/copy.ts`), and intent-routed shopping agent (`lib/ai/agent.ts`), each architected as swappable LLM endpoints with offline fallbacks
- **State** — React context cart persisted to `localStorage`; in-memory order book for the live demo loop

## 6. Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
```

| Surface | Route | Purpose |
| --- | --- | --- |
| Storefront | `/` | Home, product listing, PDP, cart, checkout |
| Size guide | `/size-guide` | EU/US conversion, per-model size systems |
| Warehouse stock | `/stock` | Full Wenzhou inventory table (24 SKU-colors, EU 35–45) |
| AI Creative Studio | `/studio` | Scene images, ad copy, creative matrix, video scripts |
| AI Shopping Agent | floating widget | Streaming chat, product retrieval, sizing & logistics Q&A |
| Growth Console | `/admin` | Funnel, campaigns, orders, product selection |

**Demo script (3-minute pitch):** `/studio` — generate campaign imagery and ad copy from the factory catalog → `/admin/campaigns` — launch a cold-start ad set → `/` — browse as a consumer, consult the AI agent, add to cart, check out → `/admin/orders` — watch the order land in real time → `/admin` — funnel and ROAS.

## 7. Repository Structure

```
src/
├── app/
│   ├── page.tsx                # Home
│   ├── products/               # Listing + PDP
│   ├── cart/ checkout/         # Transaction loop
│   ├── size-guide/ stock/      # Size conversion + warehouse inventory
│   ├── studio/                 # AI Creative Studio
│   ├── admin/                  # Growth console (overview/campaigns/orders)
│   └── api/                    # agent / copy / orders / products routes
├── components/
│   ├── store/                  # Storefront components (Header, PDPView, ProductCard…)
│   ├── studio/                 # Creative Studio components
│   ├── agent/                  # AI agent chat widget
│   ├── admin/                  # Console panels
│   └── ui/                     # Shared primitives (Button, ProductImage, …)
└── lib/
    ├── types.ts                # Global data model
    ├── data/                   # Catalog / stock / orders / campaigns / brand kit
    ├── ai/                     # Image wrapper, copy engine, shopping agent
    └── store/cart.tsx          # Cart state (localStorage)
```

## 8. Team & Scope

A four-person team, split by module with contract-first boundaries: **Storefront & Transaction Loop**, **AI Creative Studio**, **Growth Console & Analytics**, and **AI Agent & Data Layer**. Shared primitives (`components/ui/`, `lib/types.ts`, `lib/data/`) are maintained jointly; modules communicate through `/api/*` route handlers.

## 9. Roadmap

- [ ] Wire the copy engine and shopping agent to a production LLM (DeepSeek) with server-side key management
- [ ] Persist orders and campaigns (SQLite / Vercel KV) beyond the in-memory demo book
- [ ] Stripe test-mode payments and buyer-show AIGC gallery
- [ ] Agent-driven campaign launcher (recommendation → ad creative in one click)
- [ ] Virtual try-on: mapping EU 37/41 factory photos onto customer uploads

---

*Built in a single sprint at WKU HACK 2026. All supplier facts (model numbers, construction, materials, MOQ, warehouse stock) come from the official competition catalog; anything simulated is labeled as such.*
