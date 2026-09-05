"use client";

import Link from "next/link";
import { Truck, Plane, Package, AlertTriangle } from "lucide-react";
import { useLang } from "@/lib/store/lang";

export default function ShippingPage() {
  const { t } = useLang();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-12">
        <div className="mb-3 text-xs font-bold tracking-[0.2em] text-ink/45">
          {t("SHIPPING & DELIVERY", "配送与物流")}
        </div>
        <h1 className="text-4xl font-black md:text-5xl">
          {t("How we get your boots to you.", "我们如何把靴子送到你手中。")}
        </h1>
        <p className="mt-3 max-w-xl text-ink/60">
          {t(
            "Orders are packaged and shipped from our Wenzhou factory within 3–5 business days. International transit takes an additional 8–15 days depending on destination.",
            "订单将在 3–5 个工作日内于温州工厂包装发货。国际运输视目的地另需 8–15 天。"
          )}
        </p>
      </div>

      {/* ---------- 时效拆解 ---------- */}
      <section className="rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-4 text-lg font-black">{t("Delivery Timeline", "配送时效")}</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Package size={18} />
            </div>
            <div>
              <div className="font-bold">{t("Processing: 3–5 business days", "处理：3–5 个工作日")}</div>
              <p className="text-sm text-ink/55">
                {t(
                  "Every pair is made-to-order. We cut, stitch, and quality-check before it leaves the factory.",
                  "每一双均为按单制作。出厂前经过裁剪、缝制与质检。"
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Truck size={18} />
            </div>
            <div>
              <div className="font-bold">{t("International transit: 8–15 days", "国际运输：8–15 天")}</div>
              <p className="text-sm text-ink/55">
                {t(
                  "Tracked international line-haul from our Wenzhou facility to major destinations in the US, UK/EU, Canada and Australia.",
                  "从温州工厂发出的可追踪国际干线，直达美国、英国/欧盟、加拿大和澳大利亚等主要目的地。"
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Plane size={18} />
            </div>
            <div>
              <div className="font-bold">{t("Total: 11–20 business days", "总计：11–20 个工作日")}</div>
              <p className="text-sm text-ink/55">
                {t(
                  "Seasonal peaks (Black Friday, holiday) may add 2–3 extra days. We'll email you if your order is delayed.",
                  "旺季高峰（黑色星期五、节假日）可能额外增加 2–3 天。如订单延误，我们会邮件通知你。"
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 运费 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-4 text-lg font-black">{t("Shipping Rates", "运费标准")}</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-ink/5 pb-3">
            <span>{t("United States", "美国")}</span>
            <span className="font-bold">
              {t("FREE on orders over $75 · $7.90 flat rate under", "满 $75 免运费 · 不足 $75 收 $7.90")}
            </span>
          </div>
          <div className="flex justify-between border-b border-ink/5 pb-3">
            <span>{t("United Kingdom / EU", "英国 / 欧盟")}</span>
            <span className="font-bold">{t("$12.50 flat rate", "$12.50 统一运费")}</span>
          </div>
          <div className="flex justify-between border-b border-ink/5 pb-3">
            <span>{t("Canada / Australia", "加拿大 / 澳大利亚")}</span>
            <span className="font-bold">{t("$14.90 flat rate", "$14.90 统一运费")}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("Rest of world", "其他地区")}</span>
            <span className="font-bold">{t("Calculated at checkout", "结算时计算")}</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-ink/45">
          {t(
            "Flat rates shown above apply at checkout. Rates are estimates based on dimensional weight of the boxed product (approx. 1.2 kg/pair incl. shoe box) shipped by standard line-haul. Final carrier terms will be confirmed with the supplier before live commercial launch.",
            "上述统一运费在结算时生效。运费为估算值，按整箱产品的体积重量计算（含鞋盒约 1.2 千克/双），经标准干线运输。最终承运条款将在正式商用前与供应商确认。"
          )}
        </p>
      </section>

      {/* ---------- 关税诚实披露 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-amber-50 p-6">
        <div className="mb-3 flex items-center gap-2 text-amber-700">
          <AlertTriangle size={18} />
          <h2 className="text-lg font-black">{t("Customs & Duties", "关税与税费")}</h2>
        </div>
        <p className="text-sm leading-relaxed text-amber-800">
          <strong>
            {t("All orders ship DDU (Delivered Duty Unpaid).", "所有订单均以 DDU（未完税交货）方式发出。")}
          </strong>{" "}
          {t("This means customs fees, import taxes, and handling charges are", "即关税、进口税费与手续费")}{" "}
          <em>{t("not included", "均不包含")}</em>{" "}
          {t(
            "in your order total. These are charged by your local carrier or customs office upon delivery and are the responsibility of the customer.",
            "在订单总额中。这些费用由当地承运商或海关在配送时收取，需由客户自行承担。"
          )}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-amber-800">
          {t(
            "Rates vary by country and order value. To get an estimate, check your country's import threshold or contact your local customs office. STRYDE cannot predict or control these fees.",
            "税率因国家与订单金额而异。如需估算，请查询你所在国家的进口免税额度或联系当地海关。STRYDE 无法预测或控制这些费用。"
          )}
        </p>
      </section>

      {/* ---------- 不可达地区 ---------- */}
      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
        <h2 className="mb-3 text-lg font-black">{t("Where we don't ship", "暂不配送的地区")}</h2>
        <p className="text-sm text-ink/60">
          {t(
            "Due to customs restrictions, we cannot deliver to North Korea, Iran, or Crimea. Orders to these regions will be cancelled and refunded automatically.",
            "受海关限制，我们无法配送至朝鲜、伊朗或克里米亚地区。发往这些地区的订单将被自动取消并退款。"
          )}
        </p>
      </section>

      {/* ---------- 联系 ---------- */}
      <section className="mt-8 text-center">
        <p className="text-ink/55">{t("Questions about your order?", "对订单有疑问？")}</p>
        <Link
          href="mailto:support@stryde.com"
          className="mt-1 inline-block font-bold text-accent-dark hover:underline"
        >
          support@stryde.com
        </Link>
      </section>
    </div>
  );
}
