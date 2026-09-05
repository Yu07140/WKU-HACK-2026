"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

/** 邮件订阅引流：/products?discount=STRYDE15 → 显示横幅并把优惠码存入 localStorage，进购物车自动应用 */
export function PromoBanner() {
  const params = useSearchParams();
  const discountCode = params.get("discount");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (discountCode === "STRYDE15") {
      try {
        localStorage.setItem("stryde-pending-promo", discountCode);
      } catch {
        /* ignore */
      }
      setVisible(true);
    }
  }, [discountCode]);

  if (!visible) return null;

  return (
    <div className="mt-6 flex items-center gap-2 rounded-2xl bg-accent/10 px-4 py-3 text-sm font-semibold text-accent">
      <span className="text-base">🎉</span>
      15% off your order — code <span className="font-black">STRYDE15</span> will
      apply automatically at checkout.
    </div>
  );
}
