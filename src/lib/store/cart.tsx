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

interface CartCtx {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: string, color: string, size: number) => void;
  updateQty: (productId: string, color: string, size: number, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "stryde-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartCtx>(() => {
    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.qty * i.price, 0),
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
      clear: () => setItems([]),
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
