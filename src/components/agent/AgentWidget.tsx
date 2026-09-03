"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { MiniProductCard } from "@/components/store/ProductCard";
import type { Product } from "@/lib/types";

interface Msg {
  role: "user" | "ai";
  text: string;
  products?: Pick<Product, "slug" | "name" | "price" | "rating" | "imagePrompt">[];
}

const SUGGESTIONS = [
  "I need shoes for daily running",
  "推荐一双百搭休闲鞋",
  "What's your size guide?",
  "Any discount for first order?",
];

const WELCOME =
  "Hey! 我是 STRYDE AI 导购 👟 可以帮你按场景挑鞋、解答尺码/物流/退换，还能报新人折扣。今天想找什么鞋？";

export function AgentWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "ai", text: WELCOME }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || typing) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: content }]);
    setTyping(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
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
      setMsgs((m) => [...m, { role: "ai", text: "导购服务开小差了，请稍后再试 🙏" }]);
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
          {/* 头部 */}
          <div className="flex items-center gap-3 bg-ink px-5 py-4 text-paper">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
              <Sparkles size={17} />
            </span>
            <div>
              <div className="text-sm font-black">STRYDE AI 导购</div>
              <div className="flex items-center gap-1.5 text-xs text-paper/60">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Online · 秒级响应
              </div>
            </div>
          </div>

          {/* 消息区 */}
          <div ref={bodyRef} className="thin-scroll flex-1 space-y-4 overflow-y-auto bg-paper p-4">
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
                    <MiniProductCard key={p.slug} product={p} />
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

          {/* 建议问题 */}
          {msgs.length <= 1 && (
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

          {/* 输入区 */}
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
              placeholder="问点什么... e.g. running shoes"
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
