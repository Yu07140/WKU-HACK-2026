import Link from "next/link";
import {
  Truck,
  RotateCcw,
  Ruler,
  Globe2,
  CreditCard,
  MessageCircle,
  ArrowRight,
  Layers,
} from "lucide-react";
import { BRAND } from "@/lib/data/brand";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `FAQ — ${BRAND.name} Help Center`,
  description:
    "Shipping, returns, sizing, material, duties, and payment — honest answers for the STRYDE 14534-H demo store.",
};

type QA = { q: string; a: string };

const FAQS: Array<{ cat: string; icon: any; accent?: boolean; items: QA[] }> = [
  {
    cat: "Shipping & Delivery",
    icon: Truck,
    items: [
      {
        q: "How long does shipping take?",
        a: "International shipping cost and delivery estimate depend on the destination and logistics method. Final terms will be confirmed before live commercial launch.",
      },
      {
        q: "Do you ship internationally?",
        a: "International shipping options will be shown at checkout where available. Final shipping cost and delivery estimate depend on the destination and logistics method.",
      },
      {
        q: "Is there free shipping?",
        a: "Any free-shipping threshold (if offered) would be displayed at checkout. Final terms will be confirmed before live commercial launch.",
      },
    ],
  },
  {
    cat: "Returns & Exchanges",
    icon: RotateCcw,
    items: [
      {
        q: "What's your return policy?",
        a: "Return and exchange terms are part of the competition fulfillment plan and must be confirmed before live commercial launch.",
      },
      {
        q: "The shoes don't fit. Can I exchange them?",
        a: "Exchange availability and process must be confirmed before live commercial launch. Please use the Size Guide to find your size before ordering.",
      },
    ],
  },
  {
    cat: "Sizing & Fit",
    icon: Ruler,
    items: [
      {
        q: "What size should I get?",
        a: "14534-H is supplied in EU sizes 38–46. Use the measurement guide and confirm your size before ordering.",
      },
      {
        q: "Can I wash them?",
        a: "Spot clean with a damp cloth and mild soap. We don't recommend machine-washing or soaking footwear.",
      },
    ],
  },
  {
    cat: "Material",
    icon: Layers,
    items: [
      {
        q: "What is 14534-H made of?",
        a: "The official supplier specification lists a microfiber upper and microfiber lining with a rubber outsole. It is not genuine leather.",
      },
      {
        q: "Is this genuine leather?",
        a: "No. The official supplier specification lists a microfiber upper.",
      },
    ],
  },
  {
    cat: "Duties, Taxes & Customs",
    icon: Globe2,
    items: [
      {
        q: "Will I have to pay customs or import duties?",
        a: "Import duties and taxes may depend on the destination country's rules. Final charges are determined by customs authorities. Customs handling for live sales has not yet been verified.",
      },
    ],
  },
  {
    cat: "Payment",
    icon: CreditCard,
    items: [
      {
        q: "What payment methods do you accept?",
        a: "Payment methods accepted at checkout are determined by the payment gateway. This is a demo store — supported methods have not been verified for production.",
      },
      {
        q: "Is it safe to enter my card info here?",
        a: "This is a demo prototype. Please do not enter real payment information. In production, payments would be processed by a secure payment provider.",
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
          <span className="text-accent">Honest answers.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-ink/55">
          Can't find what you need? Ping the chat bubble in the bottom right.
        </p>
        <p className="mx-auto mt-3 max-w-xl text-xs text-ink/40">
          This is a demo store. Shipping, return, and payment terms are not
          verified operational commitments.
        </p>
      </div>

      {/* ---------- 分类 ---------- */}
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
          Read the size guide or check the proof mode before you buy.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/size-guide">
            <Button size="lg" variant="primary">
              Size Guide <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/proof">
            <Button size="lg" variant="outline">
              Proof Mode
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
