import { BRAND } from "@/lib/data/brand";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="text-xl font-black tracking-[0.18em]">
            {BRAND.name}
            <span className="text-accent">.</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-paper/60">{BRAND.slogan}</p>
          <p className="mt-4 text-xs text-paper/40">
            Factory-direct footwear · Designed in Wenzhou, worn worldwide.
          </p>
        </div>
        <FooterCol
          title="Shop"
          links={["Running", "Lifestyle", "Canvas", "Sandals", "New Arrivals"]}
        />
        <FooterCol
          title="Support"
          links={["Size Guide", "Shipping & Delivery", "Returns & Exchanges", "Track Order", "FAQ"]}
        />
        <FooterCol
          title="Company"
          links={["Our Factory Story", "Sustainability", "Wholesale", "Contact"]}
        />
      </div>
      <div className="border-t border-paper/10 py-5 text-center text-xs text-paper/40">
        © 2026 {BRAND.name}. WKU HACK 2026 · AI-Powered D2C Footwear Sprint Demo
        <span className="mt-1 block text-paper/50">
          Hackathon prototype — product data, reviews, ratings, orders and dashboard metrics are
          simulated demo data. Pricing for supplier SKUs (11295-J / 14534-H / 53125-J) is a demo
          placeholder, not a verified retail price.
        </span>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-bold tracking-wider">{title}</h4>
      <ul className="space-y-2.5 text-sm text-paper/60">
        {links.map((l) => (
          <li key={l} className="cursor-pointer transition hover:text-paper">
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}
