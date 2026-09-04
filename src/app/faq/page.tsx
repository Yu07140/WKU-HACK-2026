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
        a: "Most orders ship within 48 hours. US delivery takes 3–7 business days, UK/EU 5–10 days, Canada 4–8 days. You'll get a tracking link the moment your box leaves the warehouse.",
      },
      {
        q: "Do you ship worldwide?",
        a: "Yes, we ship to 40+ countries. See the dropdown at checkout for exact rates to your country.",
      },
      {
        q: "Is shipping really free over $75?",
        a: "Yep, for US orders only. Everyone else gets a subsidized flat rate that's usually 40–60% below what we actually pay the carrier.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. The second it ships we shoot you an email with a live tracking link. No radio silence.",
      },
    ],
  },
  {
    cat: "Returns & Exchanges",
    icon: RotateCcw,
    items: [
      {
        q: "What's your return policy?",
        a: "30-day wear test. Try them on, walk around, show them off. If they don't work for any reason in the first 30 days, send them back for a full refund. We cover return shipping for US customers.",
      },
      {
        q: "The shoes don't fit. Can I exchange them?",
        a: "Sure. Start an exchange through the link in your order email and we'll send the new size out the next day — no waiting for the return to arrive first.",
      },
      {
        q: "What if something arrives damaged?",
        a: "Email us a photo within 48 hours and we'll ship a replacement free, no questions. We're here to make it right.",
      },
    ],
  },
  {
    cat: "Sizing & Fit",
    icon: Ruler,
    items: [
      {
        q: "Do your shoes run true to size?",
        a: "Most pairs run true to standard US sizing. If you're between sizes or have wide feet, we recommend sizing up a half size. Check our Size Guide page for full US/EU/UK conversion tables.",
      },
      {
        q: "I have wide feet — what should I do?",
        a: "Our Lifestyle and Canvas lines have a naturally roomy toe box and work great for wider feet. Size up half a size on the Running line if you wear thick socks.",
      },
      {
        q: "Can I wash them?",
        a: "Spot clean with a damp cloth and mild soap. Please don't machine-wash or soak them — the glue and structure aren't built for it.",
      },
    ],
  },
  {
    cat: "Duties, Taxes & Customs",
    icon: Globe2,
    items: [
      {
        q: "Will I have to pay customs or import duties?",
        a: "US customers: no duties on footwear under $800 (thanks, de minimis). Customers in the UK, EU, Canada and other countries may see VAT or small import fees at the door — it's their government, not us charging. We display an estimate at checkout.",
      },
      {
        q: "Do you include a commercial invoice?",
        a: "Every international box ships with a detailed commercial invoice reflecting the actual paid value. No surprise fake retail prices on the outside.",
      },
    ],
  },
  {
    cat: "Payment & Security",
    icon: CreditCard,
    items: [
      {
        q: "What payment methods do you accept?",
        a: "Visa, Mastercard, Amex, Discover, PayPal, Apple Pay, and Google Pay. All payments are 256-bit SSL encrypted — we never see your card numbers.",
      },
      {
        q: "Is it safe to enter my card info here?",
        a: "Yes. We use industry-standard PCI-DSS Level 1 compliant processors. If you want even less friction, try Apple Pay or Google Pay at checkout.",
      },
      {
        q: "Where is the discount code box?",
        a: "Right below the subtotal in your cart and again on the checkout page. Pro tip: sign up with your email and STRYDE15 takes 15% off your first pair.",
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
          Can't find what you need? Ping the chat bubble in the bottom right — a real human or
          our AI shopping assistant replies in under a minute.
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
