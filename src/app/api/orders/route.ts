import { NextResponse } from "next/server";
import { addOrder, getOrders } from "@/lib/data/orders";
import { getProductById } from "@/lib/data/catalog";
import type { OrderChannel } from "@/lib/types";

/** GET /api/orders — 交易看板数据源 */
export async function GET() {
  return NextResponse.json(getOrders());
}

/**
 * POST /api/orders — 结账提交（交易闭环）
 * body: { customer, email, country, items: [{productId, productName, color, size, qty, amount}], channel? }
 * 演示环境：一单含多件时拆成多条订单记录，方便看板统计
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.customer || !body?.items?.length) {
    return NextResponse.json({ error: "invalid order" }, { status: 400 });
  }

  const channel: OrderChannel = body.channel ?? "direct";
  const created = body.items.map(
    (it: {
      productId: string;
      productName: string;
      color: string;
      size: number;
      qty: number;
      amount: number;
    }) => {
      const p = getProductById(it.productId);
      return addOrder({
        customer: body.customer,
        email: body.email ?? "guest@stryde.demo",
        country: body.country ?? "United States",
        productId: it.productId,
        productName: it.productName ?? p?.name ?? "Unknown",
        color: it.color ?? p?.colors[0]?.name ?? "-",
        size: it.size ?? p?.sizes[0] ?? 9,
        qty: it.qty ?? 1,
        amount: it.amount ?? p?.price ?? 0,
        channel,
        // 履约单字段 —— 可直发供应商接单（赛题推单最小数据模型）
        factory_sku: p?.sku,
        size_eu: it.size ?? p?.sizes[0],
        shipping_method: "standard",
        promised_sla: "Production 3–5 business days + international transit 8–15 days",
      });
    }
  );

  return NextResponse.json({ ok: true, order: created[0], id: created[0].id });
}
