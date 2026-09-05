import Link from "next/link";
import { RotateCcw, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-12">
        <div className="mb-3 text-xs font-bold tracking-[0.2em] text-ink/45">RETURNS & EXCHANGES</div>
        <h1 className="text-4xl font-black md:text-5xl">30-day try-on guarantee.</h1>
        <p className="mt-3 max-w-xl text-ink/60">
          Wear them around the house. If they don't fit, send them back. No questions asked.
        </p>
      </div>

      {/* ---------- 核心承诺 ---------- */}
      <section className="rounded-3xl bg-ink p-8 text-paper text-center">
        <RotateCcw size={40} className="mx-auto text-accent" />
        <h2 className="mt-3 text-2xl font-black md:text-3xl">Not loving them?</h2>
        <p className="mt-2 text-paper/70">
          Full refund within 30 days. Free return shipping on your first order.
        </p>
      </section>

      {/* ---------- 什么可以退 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-4 text-lg font-black">What can be returned</h2>
        <div className="space-y-3">
          {[
            "Unworn shoes in original packaging",
            "Shoes worn indoors for fit-testing only — no outdoor use, no scuffs",
            "Items with all tags still attached",
            "Accidentally ordered the wrong size or color",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-sage" />
              <span className="text-sm text-ink/70">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 什么不能退 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-4 text-lg font-black">What cannot be returned</h2>
        <div className="space-y-3">
          {[
            "Shoes worn outdoors — once soles touch pavement, we can't resell them",
            "Clearance / final sale items",
            "Shoes with visible scuffs, dirt, or damage from wear",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <XCircle size={17} className="mt-0.5 shrink-0 text-accent" />
              <span className="text-sm text-ink/70">{item}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl bg-accent/5 p-4 text-xs leading-relaxed text-accent-dark">
          <strong>Why the strict outdoor-wear rule?</strong> We're a small, focused footwear brand, not a chain store.
          Every returned pair that can't be resold gets recycled — it hurts us and the planet. We appreciate
          your honesty.
        </div>
      </section>

      {/* ---------- 退货流程 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-4 text-lg font-black">How to return</h2>
        <div className="space-y-4 text-sm">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper text-xs font-black">1</div>
            <p><strong>Email us.</strong> Send your order number and reason for return to <Link href="mailto:returns@stryde.com" className="text-accent-dark font-bold hover:underline">returns@stryde.com</Link> within 30 days of delivery.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper text-xs font-black">2</div>
            <p><strong>We send a prepaid label.</strong> Once approved, you'll get a free shipping label via email — no cost to you.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper text-xs font-black">3</div>
            <p><strong>Pack and ship.</strong> Put the shoes back in their original box, tape the label over the old address, and drop it off.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper text-xs font-black">4</div>
            <p><strong>Refund in 7–10 days.</strong> Once we receive and inspect the return, your refund goes back to your original payment method.</p>
          </div>
        </div>
      </section>

      {/* ---------- 换货 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-3 text-lg font-black">Exchanges</h2>
        <p className="text-sm text-ink/70">
          Need a different size or color? Start a return, then place a new order. It's faster and guarantees
          the pair you want is actually in stock. Email <Link href="mailto:returns@stryde.com" className="text-accent-dark font-bold hover:underline">returns@stryde.com</Link> if you need help.
        </p>
      </section>

      {/* ---------- 残次品 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-3 text-lg font-black">Defective or damaged items</h2>
        <p className="text-sm text-ink/70">
          Got a factory defect, wrong item, or damaged packaging? Let us know within 48 hours of delivery —
          we'll replace it free of charge, no return necessary.
        </p>
      </section>

      {/* ---------- 还没下单 ---------- */}
      <section className="mt-12 text-center">
        <p className="text-ink/55">Still deciding on size?</p>
        <Link href="/size-guide" className="mt-1 inline-flex items-center gap-1 font-bold text-accent-dark hover:underline">
          See our size guide <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
