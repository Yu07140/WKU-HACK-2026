import { hash, compare } from "bcryptjs";
import { randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";

/**
 * 客户账号数据 —— 内存存储（演示用，与 orders 同模式）
 * 密码经 bcrypt 哈希存储，绝不返回明文/哈希；
 * 登录态为服务端随机会话，通过 httpOnly Cookie 下发（跨浏览器/无痕可用）。
 * 生产环境可换成 SQLite/KV，函数接口保持不变。
 */

export interface UserRecord {
  username: string; // 归一化小写，作为唯一键
  displayName: string; // 注册时原始大小写，仅用于展示
  passwordHash: string;
  createdAt: string;
}

interface SessionRecord {
  username: string;
  createdAt: number;
}

export const SESSION_COOKIE = "stryde-user-session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 天

/**
 * 会话 Cookie 选项：httpOnly + 同源 lax；
 * secure 仅在请求本身走 HTTPS 时开启（本地 http 调试可写，线上 https 自动加密）
 */
export function sessionCookieOptions(req: NextRequest) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: req.nextUrl.protocol === "https:",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

// 挂到 globalThis：Next dev 按需重编译/热更新会重新求值模块，
// 直接用模块级 Map 会让不同路由 chunk 各持一份（内存状态分裂）；
// globalThis 单例保证整个进程（含 HMR 后）共享同一份数据
const globalStore = globalThis as unknown as {
  __strydeUsers?: Map<string, UserRecord>;
  __strydeSessions?: Map<string, SessionRecord>;
};

const users: Map<string, UserRecord> =
  globalStore.__strydeUsers ?? new Map();
const sessions: Map<string, SessionRecord> =
  globalStore.__strydeSessions ?? new Map();
globalStore.__strydeUsers = users;
globalStore.__strydeSessions = sessions;

export type AuthErrorCode =
  | "MISSING_FIELDS"
  | "INVALID_USERNAME"
  | "USERNAME_TAKEN"
  | "INVALID_PASSWORD"
  | "INVALID_CREDENTIALS";

export function normalizeUsername(raw: string) {
  return (raw || "").trim().toLowerCase();
}

// 3-20 位，仅字母/数字/下划线
const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

type AuthResult =
  | { ok: true; user: UserRecord }
  | { ok: false; error: AuthErrorCode };

export async function createUser(
  rawUsername: string,
  password: string
): Promise<AuthResult> {
  const username = normalizeUsername(rawUsername);
  if (!username || !password) return { ok: false, error: "MISSING_FIELDS" };
  if (!USERNAME_RE.test(username))
    return { ok: false, error: "INVALID_USERNAME" };
  if (password.length < 6 || password.length > 64)
    return { ok: false, error: "INVALID_PASSWORD" };
  if (users.has(username)) return { ok: false, error: "USERNAME_TAKEN" };

  const passwordHash = await hash(password, 10);
  const user: UserRecord = {
    username,
    displayName: rawUsername.trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.set(username, user);
  return { ok: true, user };
}

export async function verifyLogin(
  rawUsername: string,
  password: string
): Promise<AuthResult> {
  const username = normalizeUsername(rawUsername);
  if (!username || !password) return { ok: false, error: "MISSING_FIELDS" };
  const user = users.get(username);
  if (!user) return { ok: false, error: "INVALID_CREDENTIALS" };
  const matched = await compare(password, user.passwordHash);
  if (!matched) return { ok: false, error: "INVALID_CREDENTIALS" };
  return { ok: true, user };
}

export function createSession(username: string): string {
  const token = randomBytes(32).toString("hex");
  sessions.set(token, { username, createdAt: Date.now() });
  return token;
}

export function getSessionUser(token: string | undefined): UserRecord | null {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(token);
    return null;
  }
  return users.get(session.username) ?? null;
}

export function destroySession(token: string | undefined) {
  if (token) sessions.delete(token);
}

/** 对外安全字段（不含密码哈希） */
export function publicUser(user: UserRecord) {
  return { username: user.displayName, memberSince: user.createdAt };
}
