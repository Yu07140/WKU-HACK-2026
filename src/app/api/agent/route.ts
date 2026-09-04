import { agentReply } from "@/lib/ai/agent";
import { getProduct } from "@/lib/data/catalog";

/**
 * POST /api/agent —— AI 导购 Agent（流式输出）
 * body: { message: string, lastRecommendedSlugs?: string[] }
 *   message: 用户最新输入（必填，异常兜底 ""）
 *   lastRecommendedSlugs: 客户端从上一轮 AI 回复的商品卡里提取的 slug 列表（可选，
 *     用于 agentReply 解析 "which one / 那双" 这类指代问句，做多轮上下文过滤）
 *
 * 响应：逐行 JSON 流（协议不变，前端 AgentWidget 零修改即可消费）
 *   {"type":"text","v":"token"}
 *   {"type":"products","v":[{slug,name,price,rating,imagePrompt}]}
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const message = String(body?.message ?? "");

  // 多轮上下文：客户端传来上一轮推荐商品的 slugs，还原成 Product 对象（跳过失效 slug）
  const rawSlugs = Array.isArray((body as any).lastRecommendedSlugs)
    ? ((body as any).lastRecommendedSlugs as string[])
    : [];
  const lastProducts = rawSlugs
    .map((slug) => getProduct(String(slug)))
    .filter((p): p is NonNullable<typeof p> => !!p);

  const reply = agentReply(message, { lastProducts });

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
