import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getSessionUser,
  publicUser,
  SESSION_COOKIE,
} from "@/lib/data/users";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const user = getSessionUser(token);
  return NextResponse.json({ user: user ? publicUser(user) : null });
}
