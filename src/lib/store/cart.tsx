"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

interface ApplyResult {
  ok: boolean;
  msg?: string;
}

interface CartCtx {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: string, color: string, size: number) => void;
  updateQty: (productId: string, color: string, size: number, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  /** 当前优惠码（已应用），无则 null */
  promoCode: string | null;
  /** 折扣金额（美元），= subtotal * 0.15 等，无优惠则 0 */
  discount: number;
  /** 应用优惠码。返回 { ok, msg } 供 UI 展示。trim + 大小写不敏感 */
  applyPromo: (code: string) => ApplyResult;
  /** 移除当前优惠码 */
  removePromo: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "stryde-cart-v1";
const VALID_CODE = "STRYDE15";
const DISCOUNT_RATE = 0.15;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);

  // 从 localStorage 恢复
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // 旧格式：纯数组（兼容）
          setItems(parsed);
        } else if (parsed && typeof parsed === "object" && Array.isArray(parsed.items)) {
          setItems(parsed.items);
          if (typeof parsed.promoCode === "string") {
            setPromoCode(parsed.promoCode);
          }
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  // 写回 localStorage（items + promoCode）
  useEffect(() => {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ items, promoCode })
      );
    } catch {
      /* ignore */
    }
  }, [items, promoCode]);

  const value = useMemo<CartCtx>(() => {
    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
    // discount 只基于 subtotal 计算，不叠加 shipping
    const discount =
      promoCode && promoCode === VALID_CODE && items.length > 0
        ? round2(subtotal * DISCOUNT_RATE)
        : 0;

    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal,
      promoCode,
      discount,
      add: (item) =>
        setItems((prev) => {
          const existing = prev.find(
            (x) =>
              x.productId === item.productId &&
              x.color === item.color &&
              x.size === item.size
          );
          if (existing) {
            return prev.map((x) =>
              x === existing ? { ...x, qty: x.qty + item.qty } : x
            );
          }
          return [...prev, item];
        }),
      remove: (productId, color, size) =>
        setItems((prev) =>
          prev.filter(
            (x) => !(x.productId === productId && x.color === color && x.size === size)
          )
        ),
      updateQty: (productId, color, size, qty) =>
        setItems((prev) =>
          prev.map((x) =>
            x.productId === productId && x.color === color && x.size === size
              ? { ...x, qty: Math.max(1, qty) }
              : x
          )
        ),
      clear: () => {
        setItems([]);
        setPromoCode(null);
      },
      applyPromo: (code: string) => {
        const c = (code ?? "").trim().toUpperCase();
        if (c === VALID_CODE) {
          setPromoCode(c);
          return { ok: true, msg: `${VALID_CODE} applied — 15% off your order` };
        }
        return { ok: false, msg: "Invalid promo code." };
      },
      removePromo: () => setPromoCode(null),
    };
  }, [items, promoCode]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
