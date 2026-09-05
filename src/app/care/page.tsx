import Link from "next/link";
import { ArrowRight, ShieldCheck, Package, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ECOSYSTEM, STATUS } from "@/lib/data/brand";

const ROLES = [
  { icon: ShieldCheck, label: "CARE", desc: "Keep the 14534-H looking its best." },
  { icon: Package, label: "STORE", desc: "A home for your pair between wears." },
  { icon: Plane, label: "TRAVEL", desc: "Built for the way you move." },
];

export default function CarePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      {/* ---------- HERO ---------- */}
      <div className="mb-14 border-b border-ink/10 pb-10">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <div className="text-xs font-bold tracking-[0.3em] text-ink/40">
            THE STRYDE SYSTEM
          </div>
          <span className="rounded-full bg-ink/90 px-3 py-1 text-[11px] font-black tracking-wider text-paper">
            {STATUS.comingSoon}
          </span>
          <span className="rounded-full bg-ink/10 px-3 py-1 text-[11px] font-bold tracking-wider text-ink/60">
            {STATUS.inDevelopment}
          </span>
        </div>
        <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
          {ECOSYSTEM.care}
        </h1>
        <p className="mt-4 text-2xl font-bold tracking-wide text-ink/70">STRYDE CARE 01</p>
        <p className="mt-5 max-w-xl text-lg text-ink/60">
          A future extension of the STRYDE footwear system — in development.
          Care, storage and travel solutions designed around the 14534-H.
        </p>
      </div>

      {/* ---------- SYSTEM ROLES ---------- */}
      <section className="mb-20">
        <div className="mb-8">
          <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
            POSSIBLE ROLES
          </div>
          <h2 className="text-3xl font-black md:text-4xl">Built around the system.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {ROLES.map((r) => (
            <div
              key={r.label}
              className="rounded-3xl border border-ink/10 bg-white p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink/5 text-ink">
                <r.icon size={22} />
              </div>
              <h3 className="mt-5 text-xl font-black tracking-wide">{r.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{r.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink/40">
          Roles shown at a high level — specific products, materials and timing will be shared as
          CARE 01 develops.
        </p>
      </section>

      {/* ---------- HONEST DISCLOSURE ---------- */}
      <section className="mb-16 rounded-3xl border border-ink/10 bg-cream p-8">
        <div className="text-xs font-bold tracking-[0.25em] text-ink/50">
          {STATUS.inDevelopment}
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
          CARE 01 is in development as a future extension of the STRYDE footwear system. No
          specific products, materials or pricing are announced yet — when it&apos;s ready, it
          will be designed around the real 14534-H.
        </p>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-3xl rounded-3xl bg-ink p-10 text-center text-paper md:p-14">
        <h2 className="text-3xl font-black leading-tight md:text-4xl">
          START WITH THE BOOT.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-paper/60">
          The 14534-H is available now. CARE 01 joins the system when it&apos;s ready.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products/mono-boot">
            <Button size="lg">
              SHOP THE BOOT <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline" className="border-paper/30 text-paper hover:bg-paper/10">
              EXPLORE THE SYSTEM
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
