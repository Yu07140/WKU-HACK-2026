"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/** 支持的币种（固定 mock 汇率，以 USD 为基准） */
export const CURRENCIES = [
  { code: "USD", symbol: "$", rate: 1.0, label: "USD" },
  { code: "EUR", symbol: "€", rate: 0.92, label: "EUR" },
  { code: "GBP", symbol: "£", rate: 0.79, label: "GBP" },
  { code: "CAD", symbol: "CA$", rate: 1.36, label: "CAD" },
  { code: "CNY", symbol: "¥", rate: 7.24, label: "CNY" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

const STORAGE_KEY = "stryde-currency";

interface CurrencyCtx {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  /** 把 USD 金额格式化为当前币种字符串 */
  formatPrice: (usdAmount: number) => string;
  /** 当前币种汇率（相对 USD） */
  rate: number;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyCtx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  // 初始化从 localStorage 读
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (saved && CURRENCIES.some((c) => c.code === saved)) {
        setCurrencyState(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* ignore */
    }
  };

  const cur = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

  const formatPrice = (usdAmount: number): string => {
    if (!isFinite(usdAmount)) return `${cur.symbol}0.00`;
    const converted = usdAmount * cur.rate;
    // CNY / JPY 类不显示小数，其他显示 2 位
    const decimals = cur.code === "CNY" ? 0 : 2;
    const formatted = converted.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${cur.symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, formatPrice, rate: cur.rate, symbol: cur.symbol }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyCtx {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // 兜底：没有 Provider 时返回 USD，避免 SSR 崩溃
    return {
      currency: "USD",
      setCurrency: () => {},
      formatPrice: (n: number) => `$${n.toFixed(2)}`,
      rate: 1,
      symbol: "$",
    };
  }
  return ctx;
}
