import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  verifyLogin,
  createSession,
  publicUser,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/data/users";

export async function POST(req: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  const result = await verifyLogin(body.username ?? "", body.password ?? "");
  if (!result.ok) {
    const status = result.error === "INVALID_CREDENTIALS" ? 401 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  const token = createSession(result.user.username);
  const res = NextResponse.json({ user: publicUser(result.user) });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(req));
  return res;
}
