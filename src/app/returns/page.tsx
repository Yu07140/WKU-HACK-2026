import Link from "next/link";
import { RotateCcw, Mail, PackageCheck, ArrowRight } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-12">
        <div className="mb-3 text-xs font-bold tracking-[0.2em] text-ink/45">
          RETURNS & EXCHANGES
        </div>
        <h1 className="text-4xl font-black md:text-5xl">30-Day Guarantee.</h1>
        <p className="mt-3 max-w-xl text-ink/60">
          Try STRYDE with confidence. Your first pair is covered by our 30-day
          guarantee.
        </p>
      </div>

      {/* ---------- 核心承诺 ---------- */}
      <section className="rounded-3xl bg-ink p-8 text-paper text-center">
        <RotateCcw size={40} className="mx-auto text-accent" />
        <h2 className="mt-4 text-2xl font-black md:text-3xl">
          30-DAY GUARANTEE
        </h2>
        <p className="mt-2 max-w-md mx-auto text-paper/70">
          Shop with confidence — if it isn&apos;t right, let us know within 30
          days of delivery and we&apos;ll take care of you.
        </p>
      </section>

      {/* ---------- 如何开始 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-4 text-lg font-black">How to start a return</h2>
        <div className="space-y-4 text-sm">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper text-xs font-black">
              1
            </div>
            <p className="text-ink/70">
              <Mail size={14} className="mr-1 inline text-accent-dark" />
              <strong>Email us.</strong> Send your order number and the reason
              to{" "}
              <Link
                href="mailto:returns@stryde.com"
                className="font-bold text-accent-dark hover:underline"
              >
                returns@stryde.com
              </Link>{" "}
              within 30 days of delivery.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper text-xs font-black">
              2
            </div>
            <p className="text-ink/70">
              <PackageCheck size={14} className="mr-1 inline text-accent-dark" />
              <strong>We confirm the next steps.</strong> Once your return is
              approved, we&apos;ll reply with what to do next.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper text-xs font-black">
              3
            </div>
            <p className="text-ink/70">
              <strong>We handle the rest.</strong> After your pair arrives back
              and is inspected, your refund will be processed to the original
              payment method.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- 换货 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-3 text-lg font-black">Exchanges</h2>
        <p className="text-sm text-ink/70">
          If the fit isn&apos;t right, email{" "}
          <Link
            href="mailto:returns@stryde.com"
            className="font-bold text-accent-dark hover:underline"
          >
            returns@stryde.com
          </Link>{" "}
          within your 30-day window and we&apos;ll help you get the right size.
          Measure your foot with our size guide before reordering.
        </p>
      </section>

      {/* ---------- 还没下单 ---------- */}
      <section className="mt-12 text-center">
        <p className="text-ink/55">Still deciding on size?</p>
        <Link
          href="/size-guide"
          className="mt-1 inline-flex items-center gap-1 font-bold text-accent-dark hover:underline"
        >
          See our size guide <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
