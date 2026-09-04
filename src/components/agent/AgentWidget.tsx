"use client";

<<<<<<< Updated upstream
import Link from "next/link";
=======
>>>>>>> Stashed changes
import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { MiniProductCard } from "@/components/store/ProductCard";
import { AGENT_PERSONA } from "@/lib/ai/agent";
import type { Product } from "@/lib/types";

/* =================================================================
 * 聊天记录持久化 key —— 刷新后上下文（聊天内容 + 上轮推荐商品）尽量保留
 * 用单一 key 存储完整 msgs 数组（已经包含 products 就是 last AI 推荐的卡片）
 * ================================================================= */
const MSGS_STORAGE_KEY = "stryde_agent_msgs_v1";
const PROACTIVE_DELAY_MS = 30_000; // 30 秒

interface Msg {
  role: "user" | "ai";
  text: string;
  /** 允许 id（SSE 新增）+ 其他展示字段 */
  products?: (Pick<Product, "id" | "slug" | "name" | "price" | "rating" | "imagePrompt"> & {
    image?: string;
  })[];
}

<<<<<<< Updated upstream
const SUGGESTIONS = [
  "Show me your best-selling boots",
  "推荐一双百搭黑色靴子",
  "What's your size guide?",
  "Any discount for first order?",
];

const WELCOME =
  "Hey! 我是 STRYDE AI 导购 👟 可以帮你按风格挑靴子、解答尺码/物流/退换，还能报新人折扣。今天想找什么鞋？";
=======
const WELCOME = AGENT_PERSONA.welcome;
const SUGGESTIONS: string[] = [...AGENT_PERSONA.suggestions];

/** 从 msgs 提取「最近一次 AI 回复的商品卡 slugs」—— 传给 /api/agent 做多轮上下文 */
function extractLastRecommendedSlugs(msgs: Msg[]): string[] {
  for (let i = msgs.length - 1; i >= 0; i--) {
    const m = msgs[i];
    if (m.role === "ai" && m.products && m.products.length > 0) {
      return m.products.map((p) => p.slug);
    }
  }
  return [];
}

/** 安全地从 localStorage 读取 msgs（JSON parse 异常兜底默认值） */
function loadMsgs(): Msg[] {
  if (typeof window === "undefined") return [{ role: "ai", text: WELCOME }];
  try {
    const raw = window.localStorage.getItem(MSGS_STORAGE_KEY);
    if (!raw) return [{ role: "ai", text: WELCOME }];
    const parsed = JSON.parse(raw) as Msg[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [{ role: "ai", text: WELCOME }];
    return parsed.filter(
      (m) =>
        m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "ai") &&
        typeof m.text === "string"
    );
  } catch {
    return [{ role: "ai", text: WELCOME }];
  }
}
>>>>>>> Stashed changes

export function AgentWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(() => loadMsgs());
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  /* ---------- msgs 变更 → 写入 localStorage（持久化聊天记录） ---------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(MSGS_STORAGE_KEY, JSON.stringify(msgs));
    } catch {
      /* 存储满或隐私模式忽略，不影响 UI */
    }
  }, [msgs]);

  /* ---------- 任何 msgs / typing / open 变更 → 自动滚到底 ---------- */
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  /* ---------- 30 秒主动搭话：仅 open + 用户未发任何消息 + 历史里还没有主动消息时触发 ---------- */
  const userHasSpoken = useMemo(() => msgs.some((m) => m.role === "user"), [msgs]);
  const proactiveAlreadySent = useMemo(
    () => msgs.some((m) => m.role === "ai" && m.text === AGENT_PERSONA.proactive),
    [msgs]
  );
  useEffect(() => {
    if (!open || userHasSpoken || proactiveAlreadySent) return;
    const timerId = setTimeout(() => {
      setMsgs((prev) => [...prev, { role: "ai", text: AGENT_PERSONA.proactive }]);
      // 注意：不额外 set flag，靠 proactiveAlreadySent（msgs 变更后上面的 useMemo 会重新判定）天然去重
    }, PROACTIVE_DELAY_MS);
    return () => clearTimeout(timerId);
  }, [open, userHasSpoken, proactiveAlreadySent]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || typing) return;

    // 用户一发消息就取消待触发的主动搭话（本次会话不再重复）
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: content }]);
    setTyping(true);

    try {
      // 发请求前根据"当前最新 msgs（用户消息刚插入，取插入前的记录）"取上轮推荐 slugs
      const lastRecommendedSlugs = extractLastRecommendedSlugs(msgs);

      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, lastRecommendedSlugs }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let aiText = "";
      let products: Msg["products"];

      // 先插入空的 AI 气泡，流式往里填
      setMsgs((m) => [...m, { role: "ai", text: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const evt = JSON.parse(line);
          if (evt.type === "text") {
            aiText += evt.v;
            setMsgs((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { role: "ai", text: aiText };
              return copy;
            });
          } else if (evt.type === "products") {
            products = evt.v;
          }
        }
      }
      if (products?.length) {
        setMsgs((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "ai", text: aiText, products };
          return copy;
        });
      }
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "ai", text: "Oops, Mia's taking a quick coffee break ☕ — try again in a sec!" },
      ]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition hover:scale-105"
        aria-label="Open AI shopping assistant"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[540px] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-2xl animate-fade-up">
          {/* 头部（title/status 统一来自 AGENT_PERSONA） */}
          <div className="flex items-center gap-3 bg-ink px-5 py-4 text-paper">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
              <Sparkles size={17} />
            </span>
            <div>
              <div className="text-sm font-black">{AGENT_PERSONA.headerTitle}</div>
              <div className="flex items-center gap-1.5 text-xs text-paper/60">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                {AGENT_PERSONA.headerStatus}
              </div>
            </div>
          </div>

          {/* 消息区 */}
          <div
            ref={bodyRef}
            className="thin-scroll flex-1 space-y-4 overflow-y-auto bg-paper p-4"
          >
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm text-paper"
                      : "max-w-[92%] rounded-2xl rounded-bl-md border border-ink/10 bg-white px-4 py-2.5 text-sm text-ink/85"
                  }
                >
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                  {m.products?.map((p) => (
                    <div key={p.slug} className="space-y-1.5">
                      <MiniProductCard product={p} />
                      {/* Agent 专属：推荐商品 → 跳素材工坊一键生成广告创意
                          作为 MiniProductCard 的兄弟节点，避免嵌套 <Link>。
                          不传 slug，传 studio 内部使用的 productId（= Product.id）。 */}
                      {p.id && (
                        <Link
                          href={`/studio?productId=${encodeURIComponent(p.id)}`}
                          className="group flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-accent/40 bg-accent/5 px-2.5 py-1.5 text-[11px] font-bold text-accent-dark transition hover:border-accent hover:bg-accent hover:text-white"
                        >
                          <Sparkles size={12} className="transition group-hover:rotate-45" />
                          Generate Ad Creative
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {typing && msgs[msgs.length - 1]?.role === "user" && (
              <div className="flex gap-1.5 px-2 pt-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="typing-dot h-2 w-2 rounded-full bg-ink/40"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 建议问题（只在 msgs 里只有欢迎态 / 欢迎 + 主动搭话 且 用户未发消息 时显示） */}
          {msgs.filter((m) => m.role !== "ai" || m.text === WELCOME).length <= 1 &&
            !userHasSpoken && (
              <div className="flex flex-wrap gap-1.5 border-t border-ink/10 bg-white px-3 pt-3">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/70 transition hover:border-accent hover:text-accent-dark"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

          {/* 输入区（占位符统一来自 AGENT_PERSONA） */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-ink/10 bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
<<<<<<< Updated upstream
              placeholder="问点什么... e.g. black boots"
=======
              placeholder={AGENT_PERSONA.inputPlaceholder}
>>>>>>> Stashed changes
              className="h-10 flex-1 rounded-full bg-paper px-4 text-sm outline-none placeholder:text-ink/40"
            />
            <button
              type="submit"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition hover:bg-accent-dark"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
