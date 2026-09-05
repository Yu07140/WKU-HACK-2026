"use client";

import Link from "next/link";
import { RotateCcw, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/store/lang";

export default function ReturnsPage() {
  const { t } = useLang();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-12">
        <div className="mb-3 text-xs font-bold tracking-[0.2em] text-ink/45">
          {t("RETURNS & EXCHANGES", "退货与换货")}
        </div>
        <h1 className="text-4xl font-black md:text-5xl">{t("30-day try-on guarantee.", "30 天试穿保障。")}</h1>
        <p className="mt-3 max-w-xl text-ink/60">
          {t(
            "Wear them around the house. If they don't fit, send them back. No questions asked.",
            "可以先在家试穿。不合适就寄回来，无需说明理由。"
          )}
        </p>
      </div>

      {/* ---------- 核心承诺 ---------- */}
      <section className="rounded-3xl bg-ink p-8 text-paper text-center">
        <RotateCcw size={40} className="mx-auto text-accent" />
        <h2 className="mt-3 text-2xl font-black md:text-3xl">{t("Not loving them?", "不满意？")}</h2>
        <p className="mt-2 text-paper/70">
          {t(
            "Full refund within 30 days. Free return shipping on your first order.",
            "30 天内全额退款。首单退货免运费。"
          )}
        </p>
      </section>

      {/* ---------- 什么可以退 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-4 text-lg font-black">{t("What can be returned", "可退货商品")}</h2>
        <div className="space-y-3">
          {[
            t("Unworn shoes in original packaging", "未穿着、原包装完好的鞋"),
            t(
              "Shoes worn indoors for fit-testing only — no outdoor use, no scuffs",
              "仅在室内试穿过的鞋——无户外使用、无磨损"
            ),
            t("Items with all tags still attached", "吊牌完整的商品"),
            t("Accidentally ordered the wrong size or color", "误拍错尺码或颜色"),
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
        <h2 className="mb-4 text-lg font-black">{t("What cannot be returned", "不可退货商品")}</h2>
        <div className="space-y-3">
          {[
            t(
              "Shoes worn outdoors — once soles touch pavement, we can't resell them",
              "户外穿着过的鞋——鞋底接触地面后便无法再售"
            ),
            t("Clearance / final sale items", "清仓 / 最终售出商品"),
            t("Shoes with visible scuffs, dirt, or damage from wear", "有明显磨损、污渍或穿着损坏的鞋"),
          ].map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <XCircle size={17} className="mt-0.5 shrink-0 text-accent" />
              <span className="text-sm text-ink/70">{item}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl bg-accent/5 p-4 text-xs leading-relaxed text-accent-dark">
          <strong>{t("Why the strict outdoor-wear rule?", "为什么对户外穿着要求严格？")}</strong>{" "}
          {t(
            "We're a small, focused footwear brand, not a chain store. Every returned pair that can't be resold gets recycled — it hurts us and the planet. We appreciate your honesty.",
            "我们是一个小而专注的鞋履品牌，不是连锁商店。每双无法再售的退货鞋都会被回收——这对我们和地球都是损失。感谢你的诚信。"
          )}
        </div>
      </section>

      {/* ---------- 退货流程 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-4 text-lg font-black">{t("How to return", "退货流程")}</h2>
        <div className="space-y-4 text-sm">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper text-xs font-black">1</div>
            <p>
              <strong>{t("Email us.", "邮件联系我们。")}</strong>{" "}
              {t("Send your order number and reason for return to", "请在签收后 30 天内，将订单号和退货原因发送至")}{" "}
              <Link href="mailto:returns@stryde.com" className="text-accent-dark font-bold hover:underline">
                returns@stryde.com
              </Link>{" "}
              {t("within 30 days of delivery.", "。")}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper text-xs font-black">2</div>
            <p>
              <strong>{t("We send a prepaid label.", "我们寄出预付面单。")}</strong>{" "}
              {t(
                "Once approved, you'll get a free shipping label via email — no cost to you.",
                "审核通过后，我们会通过邮件发送免费快递面单——你无需承担任何费用。"
              )}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper text-xs font-black">3</div>
            <p>
              <strong>{t("Pack and ship.", "打包寄出。")}</strong>{" "}
              {t(
                "Put the shoes back in their original box, tape the label over the old address, and drop it off.",
                "把鞋放回原包装盒，将面单贴在原地址标签上，然后交给快递点。"
              )}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper text-xs font-black">4</div>
            <p>
              <strong>{t("Refund in 7–10 days.", "7–10 天内退款。")}</strong>{" "}
              {t(
                "Once we receive and inspect the return, your refund goes back to your original payment method.",
                "我们收到并验收退货后，退款将原路退回你的付款账户。"
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
            "Need a different size or color? Start a return, then place a new order. It's faster and guarantees the pair you want is actually in stock. Email",
            "需要其他尺码或颜色？发起退货后重新下单即可，这样更快，也能确保你想要的款式有货。如需帮助，请发邮件至"
          )}{" "}
          <Link href="mailto:returns@stryde.com" className="text-accent-dark font-bold hover:underline">
            returns@stryde.com
          </Link>{" "}
          {t("if you need help.", "。")}
        </p>
      </section>

      {/* ---------- 残次品 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-3 text-lg font-black">{t("Defective or damaged items", "残次或破损商品")}</h2>
        <p className="text-sm text-ink/70">
          {t(
            "Got a factory defect, wrong item, or damaged packaging? Let us know within 48 hours of delivery — we'll replace it free of charge, no return necessary.",
            "收到工厂瑕疵、错发商品或包装破损？请在签收后 48 小时内告知我们——我们将免费补发，无需退货。"
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
