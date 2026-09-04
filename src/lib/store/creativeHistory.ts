"use client";

import { useCallback, useEffect, useState } from "react";

/* ------------------------------------------------------------------
 * Creative History —— 素材工坊生成历史
 * 仅使用 localStorage，保留最近 20 条，刷新不丢失，无需数据库
 * ------------------------------------------------------------------ */

export interface CreativeRecord {
  id: string;
  productId: string;
  productName: string;
  sku?: string;
  /** 真实参考图（供应商实拍） */
  refImage?: string;
  /** 生成结果图片 URL（AIGC） */
  url: string;
  prompt: string;
  styleId: string;
  styleLabel: string;
  /** 画幅比例，如 "1:1" */
  aspect: string;
  /** 创意矩阵场景下记录平台 */
  platform?: string;
  timestamp: number;
}

const KEY = "stryde-creative-history-v1";
const MAX = 20;

function load(): CreativeRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CreativeRecord[]) : [];
  } catch {
    return [];
  }
}

function persist(list: CreativeRecord[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    /* 存储满等异常忽略 */
  }
}

export function useCreativeHistory() {
  const [records, setRecords] = useState<CreativeRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setRecords(load());
    setLoaded(true);
  }, []);

  const add = useCallback((rec: Omit<CreativeRecord, "id" | "timestamp">) => {
    setRecords((prev) => {
      const next = [
        { ...rec, id: `ch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, timestamp: Date.now() },
        ...prev,
      ].slice(0, MAX);
      persist(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setRecords([]);
    persist([]);
  }, []);

  return { records, add, clear, loaded };
}

/**
 * 安全下载图片：fetch blob → objectURL → <a download>
 * CORS 失败时返回 false，由调用方降级为「打开原图」
 */
export async function downloadImage(url: string, filename: string): Promise<boolean> {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return false;
    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objUrl), 3000);
    return true;
  } catch {
    return false;
  }
}
