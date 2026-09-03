import { NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/data/catalog";

export async function GET() {
  return NextResponse.json(
    PRODUCTS.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      category: p.category,
      heatScore: p.heatScore,
      trend: p.trend,
    }))
  );
}
