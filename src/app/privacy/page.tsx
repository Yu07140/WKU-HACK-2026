import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-12">
        <div className="mb-3 text-xs font-bold tracking-[0.2em] text-ink/45">PRIVACY POLICY</div>
        <h1 className="text-4xl font-black md:text-5xl">How we handle your data.</h1>
        <p className="mt-3 max-w-xl text-ink/60">
          We collect only what we need to run your order. We don't sell your information. Ever.
        </p>
      </div>

      <section className="rounded-3xl border border-ink/10 bg-white p-6 space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-base font-black">1. What we collect</h2>
          <p className="mt-1 text-ink/65">
            When you place an order, we collect: your name, email address, shipping address, and payment details.
            We also collect basic website analytics (pages visited, device type) to improve the site.
          </p>
        </div>

        <div>
          <h2 className="text-base font-black">2. How we use it</h2>
          <p className="mt-1 text-ink/65">
            We use your information to: process and ship your order, send order updates and tracking numbers,
            respond to your support emails, and send marketing emails (you can unsubscribe anytime).
          </p>
        </div>

        <div>
          <h2 className="text-base font-black">3. What we don't do</h2>
          <p className="mt-1 text-ink/65">
            We do not sell, rent, or trade your personal information with third parties. We do not store your
            full credit card number — payments are processed securely through our payment provider.
          </p>
        </div>

        <div>
          <h2 className="text-base font-black">4. Where it's stored</h2>
          <p className="mt-1 text-ink/65">
            Your data is stored on secure servers in the United States. We use HTTPS encryption for all
            website traffic and follow industry-standard security practices.
          </p>
        </div>

        <div>
          <h2 className="text-base font-black">5. Your rights</h2>
          <p className="mt-1 text-ink/65">
            You can request a copy of your data, ask us to update it, or request deletion at any time.
            Just email <Link href="mailto:privacy@stryde.com" className="text-accent-dark font-bold hover:underline">privacy@stryde.com</Link>.
          </p>
        </div>

        <div>
          <h2 className="text-base font-black">6. Cookies</h2>
          <p className="mt-1 text-ink/65">
            We use essential cookies to keep your cart saved between visits. We don't use third-party
            tracking cookies or ad retargeting cookies.
          </p>
        </div>

        <div>
          <h2 className="text-base font-black">7. Changes to this policy</h2>
          <p className="mt-1 text-ink/65">
            If we update this policy, we'll post the new version on this page and update the date below.
          </p>
        </div>
      </section>

      <div className="mt-10 flex items-center justify-center gap-2 text-sm text-ink/55">
        <ShieldCheck size={16} className="text-sage" />
        <span>Last updated: September 2026</span>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-accent-dark font-bold hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
