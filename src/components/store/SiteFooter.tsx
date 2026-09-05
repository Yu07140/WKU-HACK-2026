"use client";

import Link from "next/link";
import { BRAND } from "@/lib/data/brand";
import { useLang } from "@/lib/store/lang";

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="mt-24 border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="text-xl font-black tracking-[0.18em]">
            {BRAND.name}
            <span className="text-accent">.</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-paper/60">{BRAND.slogan}</p>
          <p className="mt-4 text-xs text-paper/40">
            {t(
              "A footwear brand built for the way your day moves.",
              "一个为你一天中每个时刻而生的鞋履品牌。"
            )}
          </p>
        </div>
        <FooterCol
          title={t("Shop", "选购")}
          links={[
            [t("The 14534-H Boot", "14534-H 靴"), "/products/mono-boot"],
            [t("Size Guide", "尺码指南"), "/size-guide"],
          ]}
        />
        <FooterCol
          title={t("Support", "售后服务")}
          links={[
            [t("Size Guide", "尺码指南"), "/size-guide"],
            [t("Shipping & Delivery", "配送与时效"), "/shipping"],
            [t("Returns & Exchanges", "退货与换货"), "/returns"],
            [t("FAQ", "常见问题"), "/faq"],
          ]}
        />
        <FooterCol
          title={t("Company", "关于我们")}
          links={[
            [t("Our Story", "品牌故事"), "/about"],
            [t("Proof Mode", "证明模式"), "/proof"],
            [t("Studio", "工坊"), "/studio"],
            [t("Contact", "联系我们"), "/faq"],
          ]}
        />
      </div>
      <div className="border-t border-paper/10 py-5 text-center text-xs text-paper/40">
        © 2026 {BRAND.name}. {t("STAND UP. STAND OUT.", "站起来。出众。")}
        <span className="mt-1 block text-paper/50">
          {t(
            "Demo store — pricing, shipping, returns and review data are not verified operational commitments until live commercial launch.",
            "演示商店——在正式商用上线前，价格、配送、退货与评价数据均非经验证的运营承诺。"
          )}
        </span>
        <Link
          href="/admin"
          className="mt-2 inline-block rounded-md border border-paper/20 px-3 py-1 text-xs font-bold text-paper/60 transition hover:border-paper/40 hover:text-paper"
        >
          {t("Admin", "管理后台")}
        </Link>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: Array<[label: string, href: string]>;
}) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-bold tracking-wider">{title}</h4>
      <ul className="space-y-2.5 text-sm text-paper/60">
        {links.map(([label, href]) => (
          <li key={label + href}>
            <Link
              href={href}
              className="transition hover:text-paper hover:underline underline-offset-4"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
