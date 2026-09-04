import Link from "next/link";
import {
  Truck,
  RotateCcw,
  Ruler,
  Globe2,
  CreditCard,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { BRAND } from "@/lib/data/brand";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `FAQ — ${BRAND.name} Help Center`,
  description:
    "Shipping, returns, sizing, duties, and payment — everything you need before you click checkout.",
};

type QA = { q: string; a: string };

const FAQS: Array<{ cat: string; icon: any; accent?: boolean; items: QA[] }> = [
  {
    cat: "Shipping & Delivery",
    icon: Truck,
    items: [
      {
        q: "How long does shipping take?",
        a: "Final shipping cost and delivery estimate depend on destination and logistics method. Shipping options and an estimated delivery window are shown at checkout. This is a demo store — actual carriers and timelines are not yet verified.",
      },
      {
        q: "Do you ship internationally?",
        a: "International shipping options are shown at checkout where available. Final shipping cost and delivery estimate depend on destination and logistics method.",
      },
      {
        q: "Is there free shipping?",
        a: "Free-shipping thresholds (if any) are displayed at checkout. Final shipping cost and delivery estimate depend on destination and logistics method.",
      },
      {
        q: "Can I track my order?",
        a: "When your order ships you'll receive a shipping confirmation with tracking information, where available.",
      },
    ],
  },
  {
    cat: "Returns & Exchanges",
    icon: RotateCcw,
    items: [
      {
        q: "What's your return policy?",
        a: "This is a hackathon demo store. Return and exchange policies for production would be finalized before real sales begin. For now, any return shown on the site is demo content and not a verified operational commitment.",
      },
      {
        q: "The shoes don't fit. Can I exchange them?",
        a: "Exchange availability and process would be confirmed before real sales. Please refer to the Size Guide to find your size before ordering.",
      },
      {
        q: "What if something arrives damaged?",
        a: "Contact customer support with photos of the item and packaging. Resolution (replacement or refund) would be handled per the finalized return policy.",
      },
    ],
  },
  {
    cat: "Sizing & Fit",
    icon: Ruler,
    items: [
      {
        q: "What size should I get?",
        a: "STRYDE footwear lists EU sizes (supplier spec). Use the Size Guide to convert EU to US / UK / CM and measure your foot length. We do not guarantee a specific fit — sizing preference is personal.",
      },
      {
        q: "Do your shoes run true to size?",
        a: "We don't make fit guarantees. Please measure your foot and use the Size Guide conversion table to pick the closest EU size.",
      },
      {
        q: "Can I wash them?",
        a: "Spot clean with a damp cloth and mild soap. We don't recommend machine-washing or soaking footwear.",
      },
    ],
  },
  {
    cat: "Duties, Taxes & Customs",
    icon: Globe2,
    items: [
      {
        q: "Will I have to pay customs or import duties?",
        a: "Import duties and taxes may depend on the destination country's rules. Any estimates shown at checkout are indicative — final charges are determined by customs authorities. This is a demo store and customs handling is not yet verified.",
      },
    ],
  },
  {
    cat: "Payment & Security",
    icon: CreditCard,
    items: [
      {
        q: "What payment methods do you accept?",
        a: "Payment methods accepted at checkout are determined by the payment gateway. This is a demo store — the list of supported methods and security certifications have not been verified for production.",
      },
      {
        q: "Is it safe to enter my card info here?",
        a: "In production, card payments would be processed by a PCI-compliant payment processor. This is a demo prototype — do not enter real payment information.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      {/* ---------- HERO ---------- */}
      <div className="mb-14 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-bold tracking-wider text-ink/70">
          <MessageCircle size={13} className="text-accent" />
          HELP CENTER
        </div>
        <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
          Questions?
          <br />
          <span className="text-accent">We've got answers.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-ink/55">
          Can't find what you need? Ping the chat bubble in the bottom right.
        </p>
        <p className="mx-auto mt-3 max-w-xl text-xs text-ink/40">
          Note: shipping, return, and payment policies below are demo content for the hackathon
          prototype — not verified operational commitments.
        </p>
      </div>

      {/* ---------- 5 个分类 ---------- */}
      <div className="space-y-14">
        {FAQS.map(({ cat, icon: Icon, items }) => (
          <section key={cat} id={cat.toLowerCase().replace(/[^a-z]+/g, "-")}>
            <div className="mb-5 flex items-center gap-3">
              <div className="inline-flex rounded-xl bg-accent/10 p-2 text-accent">
                <Icon size={20} />
              </div>
              <h2 className="text-2xl font-black">{cat}</h2>
            </div>
            <div className="divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-white">
              {items.map(({ q, a }) => (
                <details
                  key={q}
                  className="group p-6 open:bg-paper/50 first:rounded-t-3xl last:rounded-b-3xl"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-bold">
                    <span>{q}</span>
                    <span className="text-accent text-xl transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-ink/65 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ---------- CTA ---------- */}
      <section className="mt-20 rounded-3xl bg-ink p-10 text-center text-paper md:p-14">
        <h2 className="text-3xl font-black md:text-4xl">Still not sure?</h2>
        <p className="mx-auto mt-3 max-w-lg text-paper/60">
          Chat with us directly or read the size guide before you buy. We'd rather get you into
          the right pair on the first try.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/size-guide">
            <Button size="lg" variant="primary">
              Size Guide <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline">
              Browse shoes
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
