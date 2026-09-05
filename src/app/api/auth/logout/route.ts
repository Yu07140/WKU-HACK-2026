import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  destroySession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/data/users";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  destroySession(token);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(req), maxAge: 0 });
  return res;
}
