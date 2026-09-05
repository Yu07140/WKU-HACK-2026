import Link from "next/link";
import { Truck, Plane, Package, AlertTriangle } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-12">
        <div className="mb-3 text-xs font-bold tracking-[0.2em] text-ink/45">SHIPPING & DELIVERY</div>
        <h1 className="text-4xl font-black md:text-5xl">How we get your boots to you.</h1>
        <p className="mt-3 max-w-xl text-ink/60">
          Orders are packaged and shipped from our Wenzhou factory within 3–5 business days.
          International transit takes an additional 8–15 days depending on destination.
        </p>
      </div>

      {/* ---------- 时效拆解 ---------- */}
      <section className="rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-4 text-lg font-black">Delivery Timeline</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Package size={18} />
            </div>
            <div>
              <div className="font-bold">Processing: 3–5 business days</div>
              <p className="text-sm text-ink/55">
                Every pair is made-to-order. We cut, stitch, and quality-check before it leaves the factory.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Truck size={18} />
            </div>
            <div>
              <div className="font-bold">International transit: 8–15 days</div>
              <p className="text-sm text-ink/55">
                Tracked international line-haul from our Wenzhou facility to major destinations in the US, UK/EU, Canada and Australia.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Plane size={18} />
            </div>
            <div>
              <div className="font-bold">Total: 11–20 business days</div>
              <p className="text-sm text-ink/55">
                Seasonal peaks (Black Friday, holiday) may add 2–3 extra days. We'll email you if your order is delayed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 运费 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-4 text-lg font-black">Shipping Rates</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-ink/5 pb-3">
            <span>United States</span>
            <span className="font-bold">FREE on orders over $75 · $7.90 flat rate under</span>
          </div>
          <div className="flex justify-between border-b border-ink/5 pb-3">
            <span>United Kingdom / EU</span>
            <span className="font-bold">$12.50 flat rate</span>
          </div>
          <div className="flex justify-between border-b border-ink/5 pb-3">
            <span>Canada / Australia</span>
            <span className="font-bold">$14.90 flat rate</span>
          </div>
          <div className="flex justify-between">
            <span>Rest of world</span>
            <span className="font-bold">Calculated at checkout</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-ink/45">
          Flat rates shown above apply at checkout. Rates are estimates based on dimensional weight of the
          boxed product (approx. 1.2 kg/pair incl. shoe box) shipped by standard line-haul. Final carrier
          terms will be confirmed with the supplier before live commercial launch.
        </p>
      </section>

      {/* ---------- 关税诚实披露 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-amber-50 p-6">
        <div className="mb-3 flex items-center gap-2 text-amber-700">
          <AlertTriangle size={18} />
          <h2 className="text-lg font-black">Customs & Duties</h2>
        </div>
        <p className="text-sm leading-relaxed text-amber-800">
          <strong>All orders ship DDU (Delivered Duty Unpaid).</strong> This means customs fees, import taxes,
          and handling charges are <em>not included</em> in your order total. These are charged by your
          local carrier or customs office upon delivery and are the responsibility of the customer.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-amber-800">
          Rates vary by country and order value. To get an estimate, check your country's import threshold
          or contact your local customs office. STRYDE cannot predict or control these fees.
        </p>
      </section>

      {/* ---------- 不可达地区 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-3 text-lg font-black">Where we don't ship</h2>
        <p className="text-sm text-ink/60">
          Due to customs restrictions, we cannot deliver to North Korea, Iran, or Crimea.
          Orders to these regions will be cancelled and refunded automatically.
        </p>
      </section>

      {/* ---------- 联系 ---------- */}
      <section className="mt-8 text-center">
        <p className="text-ink/55">Questions about your order?</p>
        <Link href="mailto:support@stryde.com" className="mt-1 inline-block font-bold text-accent-dark hover:underline">
          support@stryde.com
        </Link>
      </section>
    </div>
  );
}
