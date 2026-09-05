"use client";

import Link from "next/link";
import { RotateCcw, Mail, PackageCheck, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/store/lang";

export default function ReturnsPage() {
  const { t } = useLang();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-12">
        <div className="mb-3 text-xs font-bold tracking-[0.2em] text-ink/45">
          {t("RETURNS & EXCHANGES", "退货与换货")}
        </div>
        <h1 className="text-4xl font-black md:text-5xl">
          {t("30-Day Guarantee.", "30 天保障。")}
        </h1>
        <p className="mt-3 max-w-xl text-ink/60">
          {t(
            "Try STRYDE with confidence. Your first pair is covered by our 30-day guarantee.",
            "放心尝试 STRYDE。你的第一双鞋享有 30 天保障。"
          )}
        </p>
      </div>

      {/* ---------- 核心承诺 ---------- */}
      <section className="rounded-3xl bg-ink p-8 text-paper text-center">
        <RotateCcw size={40} className="mx-auto text-accent" />
        <h2 className="mt-4 text-2xl font-black md:text-3xl">
          {t("30-DAY GUARANTEE", "30 天保障")}
        </h2>
        <p className="mt-2 max-w-md mx-auto text-paper/70">
          {t(
            "Shop with confidence — if it isn't right, let us know within 30 days of delivery and we'll take care of you.",
            "放心购买——如果不合适，在签收后 30 天内告诉我们，我们会为你处理好。"
          )}
        </p>
      </section>

      {/* ---------- 如何开始 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-4 text-lg font-black">
          {t("How to start a return", "如何申请退货")}
        </h2>
        <div className="space-y-4 text-sm">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper text-xs font-black">
              1
            </div>
            <p className="text-ink/70">
              <Mail size={14} className="mr-1 inline text-accent-dark" />
              <strong>{t("Email us.", "发送邮件。")}</strong>{" "}
              {t("Send your order number and the reason to", "请将订单号和退货原因发送至")}{" "}
              <Link
                href="mailto:returns@stryde.com"
                className="font-bold text-accent-dark hover:underline"
              >
                returns@stryde.com
              </Link>{" "}
              {t("within 30 days of delivery.", "（签收后 30 天内）。")}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper text-xs font-black">
              2
            </div>
            <p className="text-ink/70">
              <PackageCheck size={14} className="mr-1 inline text-accent-dark" />
              <strong>{t("We confirm the next steps.", "我们确认后续步骤。")}</strong>{" "}
              {t(
                "Once your return is approved, we'll reply with what to do next.",
                "退货申请通过后，我们会回复具体操作指引。"
              )}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper text-xs font-black">
              3
            </div>
            <p className="text-ink/70">
              <strong>{t("We handle the rest.", "剩下的交给我们。")}</strong>{" "}
              {t(
                "After your pair arrives back and is inspected, your refund will be processed to the original payment method.",
                "鞋子寄回并验收后，退款将按原支付方式退回。"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- 换货 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-3 text-lg font-black">{t("Exchanges", "换货")}</h2>
        <p className="text-sm text-ink/70">
          {t(
            "If the fit isn't right, email",
            "如果尺码不合适，请发邮件至"
          )}{" "}
          <Link
            href="mailto:returns@stryde.com"
            className="font-bold text-accent-dark hover:underline"
          >
            returns@stryde.com
          </Link>{" "}
          {t(
            "within your 30-day window and we'll help you get the right size. Measure your foot with our size guide before reordering.",
            "（30 天保障期内），我们会帮你换到合适的尺码。重新下单前请先用尺码指南测量脚长。"
          )}
        </p>
      </section>

      {/* ---------- 还没下单 ---------- */}
      <section className="mt-12 text-center">
        <p className="text-ink/55">{t("Still deciding on size?", "还在犹豫尺码？")}</p>
        <Link
          href="/size-guide"
          className="mt-1 inline-flex items-center gap-1 font-bold text-accent-dark hover:underline"
        >
          {t("See our size guide", "查看尺码指南")} <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
