import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PASSWORD = "stryde2026";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("stryde-admin-token")?.value;

  // 旧路径 /stock 重定向到 /admin/stock（随后走 admin 鉴权）
  if (req.nextUrl.pathname === "/stock") {
    return NextResponse.redirect(new URL("/admin/stock", req.url));
  }

  // 已登录 → 放行
  if (token === ADMIN_PASSWORD) {
    return NextResponse.next();
  }

  // 未登录 → 跳登录页
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/stock"],
};
