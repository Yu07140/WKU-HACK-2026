import Link from "next/link";
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
            A footwear brand built for the way your day moves.
          </p>
        </div>
        <FooterCol
          title="Shop"
          links={[
            ["The 14534-H Boot", "/products/mono-boot"],
            ["Size Guide", "/size-guide"],
          ]}
        />
        <FooterCol
          title="Support"
          links={[
            ["Size Guide", "/size-guide"],
            ["Shipping & Delivery", "/shipping"],
            ["Returns & Exchanges", "/returns"],
            ["FAQ", "/faq"],
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            ["Our Story", "/about"],
            ["Proof Mode", "/proof"],
            ["Studio", "/studio"],
            ["Contact", "/faq"],
          ]}
        />
      </div>
      <div className="border-t border-paper/10 py-5 text-center text-xs text-paper/40">
        © 2026 {BRAND.name}. STAND UP. STAND OUT.
        <span className="mt-1 block text-paper/50">
          Demo store — pricing, shipping, returns and review data are not verified operational
          commitments until live commercial launch.
        </span>
        <Link
          href="/admin"
          className="mt-2 inline-block rounded-md border border-paper/20 px-3 py-1 text-xs font-bold text-paper/60 transition hover:border-paper/40 hover:text-paper"
        >
          Admin
        </Link>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: Array<[label: string, href: string]>;
}) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-bold tracking-wider">{title}</h4>
      <ul className="space-y-2.5 text-sm text-paper/60">
        {links.map(([label, href]) => (
          <li key={label + href}>
            <Link
              href={href}
              className="transition hover:text-paper hover:underline underline-offset-4"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
