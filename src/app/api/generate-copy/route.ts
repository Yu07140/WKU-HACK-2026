import { NextResponse } from "next/server";
import { getProductById } from "@/lib/data/catalog";
import { generateCopy, type Platform, type Angle } from "@/lib/ai/copy";

/**
 * POST /api/generate-copy
 * body: { productId, platform: Meta|TikTok|Google, angle: comfort|value|trend|performance }
 * 返回 AI 广告文案（当前规则引擎，模块 B 可替换为 LLM）
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const product = getProductById(body?.productId);
  if (!product) {
    return NextResponse.json({ error: "product not found" }, { status: 400 });
  }
  const platform = (["Meta", "TikTok", "Google"].includes(body?.platform)
    ? body.platform
    : "Meta") as Platform;
  const angle = (["comfort", "value", "trend", "performance"].includes(body?.angle)
    ? body.angle
    : "comfort") as Angle;

  // 模拟生成耗时，让前端有 loading 反馈
  await new Promise((r) => setTimeout(r, 600));

  return NextResponse.json(generateCopy(product, platform, angle));
}
