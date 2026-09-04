import { agentReply } from "@/lib/ai/agent";

/**
 * POST /api/agent —— AI 导购 Agent（流式输出）
 * body: { message: string }
 * 响应：逐行 JSON 流
 *   {"type":"text","v":"token"}
 *   {"type":"products","v":[{slug,name,price,rating,imagePrompt}]}
 *
 * 模块 C 升级路径：把 agentReply 换成 LLM function-calling，
 * 工具 = searchProducts / getSizingAdvice / getShippingInfo（见 lib/ai/agent.ts）
 */
export async function POST(req: Request) {
  const { message } = await req.json().catch(() => ({ message: "" }));
  const reply = agentReply(String(message || ""));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // 模拟流式 token 输出（接入真实 LLM 时直接转发其 stream）
      const tokens = reply.text.match(/\S+\s*/g) ?? [reply.text];
      for (const tk of tokens) {
        controller.enqueue(
          encoder.encode(JSON.stringify({ type: "text", v: tk }) + "\n")
        );
        await new Promise((r) => setTimeout(r, 28));
      }
      if (reply.products?.length) {
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              type: "products",
              v: reply.products.map((p) => ({
                id: p.id,
                slug: p.slug,
                name: p.name,
                price: p.price,
                rating: p.rating,
                imagePrompt: p.imagePrompt,
              })),
            }) + "\n"
          )
        );
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8" },
  });
}
