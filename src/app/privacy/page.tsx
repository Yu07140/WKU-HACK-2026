"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useLang } from "@/lib/store/lang";

export default function PrivacyPage() {
  const { t } = useLang();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-12">
        <div className="mb-3 text-xs font-bold tracking-[0.2em] text-ink/45">
          {t("PRIVACY POLICY", "隐私政策")}
        </div>
        <h1 className="text-4xl font-black md:text-5xl">{t("How we handle your data.", "我们如何处理你的数据。")}</h1>
        <p className="mt-3 max-w-xl text-ink/60">
          {t(
            "We collect only what we need to run your order. We don't sell your information. Ever.",
            "我们只收集处理订单所需的信息。绝不出售你的信息。"
          )}
        </p>
      </div>

      <section className="rounded-3xl border border-ink/10 bg-white p-6 space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-base font-black">{t("1. What we collect", "1. 我们收集什么")}</h2>
          <p className="mt-1 text-ink/65">
            {t(
              "When you place an order, we collect: your name, email address, shipping address, and payment details. We also collect basic website analytics (pages visited, device type) to improve the site.",
              "下单时，我们会收集：你的姓名、电子邮箱、收货地址与支付信息。我们还会收集基础网站分析数据（访问页面、设备类型）以改进网站。"
            )}
          </p>
        </div>

        <div>
          <h2 className="text-base font-black">{t("2. How we use it", "2. 我们如何使用")}</h2>
          <p className="mt-1 text-ink/65">
            {t(
              "We use your information to: process and ship your order, send order updates and tracking numbers, respond to your support emails, and send marketing emails (you can unsubscribe anytime).",
              "我们使用你的信息用于：处理并发货订单、发送订单更新与运单号、回复你的售后邮件，以及发送营销邮件（你可随时退订）。"
            )}
          </p>
        </div>

        <div>
          <h2 className="text-base font-black">{t("3. What we don't do", "3. 我们不做的事")}</h2>
          <p className="mt-1 text-ink/65">
            {t(
              "We do not sell, rent, or trade your personal information with third parties. We do not store your full credit card number — payments are processed securely through our payment provider.",
              "我们不会向第三方出售、出租或交换你的个人信息。我们不会存储你的完整银行卡号——支付由我们的支付服务商安全处理。"
            )}
          </p>
        </div>

        <div>
          <h2 className="text-base font-black">{t("4. Where it's stored", "4. 数据存储位置")}</h2>
          <p className="mt-1 text-ink/65">
            {t(
              "Your data is stored on secure servers in the United States. We use HTTPS encryption for all website traffic and follow industry-standard security practices.",
              "你的数据存储在美国的安全服务器上。所有网站流量均使用 HTTPS 加密，并遵循行业标准安全实践。"
            )}
          </p>
        </div>

        <div>
          <h2 className="text-base font-black">{t("5. Your rights", "5. 你的权利")}</h2>
          <p className="mt-1 text-ink/65">
            {t(
              "You can request a copy of your data, ask us to update it, or request deletion at any time.",
              "你可以随时要求获取数据副本、要求更正或删除。"
            )}{" "}
            {t("Just email", "只需发送邮件至")}{" "}
            <Link href="mailto:privacy@stryde.com" className="text-accent-dark font-bold hover:underline">
              privacy@stryde.com
            </Link>
            {t(".", "。")}
          </p>
        </div>

        <div>
          <h2 className="text-base font-black">{t("6. Cookies", "6. Cookie")}</h2>
          <p className="mt-1 text-ink/65">
            {t(
              "We use essential cookies to keep your cart saved between visits. We don't use third-party tracking cookies or ad retargeting cookies.",
              "我们使用必要的 Cookie 在访问之间保存你的购物车。我们不使用第三方追踪 Cookie 或广告重定向 Cookie。"
            )}
          </p>
        </div>

        <div>
          <h2 className="text-base font-black">{t("7. Changes to this policy", "7. 政策变更")}</h2>
          <p className="mt-1 text-ink/65">
            {t(
              "If we update this policy, we'll post the new version on this page and update the date below.",
              "如我们更新本政策，会在本页面发布新版本并更新下方日期。"
            )}
          </p>
        </div>
      </section>

      <div className="mt-10 flex items-center justify-center gap-2 text-sm text-ink/55">
        <ShieldCheck size={16} className="text-sage" />
        <span>{t("Last updated: September 2026", "最后更新：2026 年 9 月")}</span>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-accent-dark font-bold hover:underline">
          {t("← Back to home", "← 返回首页")}
        </Link>
      </div>
    </div>
  );
}
