"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { User, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useLang } from "@/lib/store/lang";

const ERROR_TEXT: Record<string, { en: string; cn: string }> = {
  MISSING_FIELDS: { en: "Please enter username and password", cn: "请输入账号和密码" },
  INVALID_CREDENTIALS: { en: "Incorrect username or password", cn: "账号或密码错误" },
  NETWORK: { en: "Network error, please try again", cn: "网络错误，请重试" },
};

function safeRedirect(raw: string | null) {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/account";
}

function LoginForm() {
  const params = useSearchParams();
  const { t } = useLang();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "INVALID_CREDENTIALS");
        setLoading(false);
        return;
      }
      // 整页跳转，确保站点头部登录态同步刷新
      window.location.assign(safeRedirect(params.get("redirect")));
    } catch {
      setError("NETWORK");
      setLoading(false);
    }
  }

  const err = error ? ERROR_TEXT[error] : null;

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-black tracking-tight text-ink">
          {t("Welcome back", "欢迎回来")}
        </h1>
        <p className="mt-2 text-sm text-ink/50">
          {t("Sign in to your STRYDE account", "登录你的 STRYDE 账户")}
        </p>
      </div>

      <form
        onSubmit={submit}
        className="space-y-5 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <Label>{t("Username", "账号")}</Label>
          <div className="relative">
            <User
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <Input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null);
              }}
              placeholder={t("Enter username", "输入账号")}
              className="pl-10"
              autoComplete="username"
              autoFocus
            />
          </div>
        </div>

        <div>
          <Label>{t("Password", "密码")}</Label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder={t("Enter password", "输入密码")}
              className="pl-10"
              autoComplete="current-password"
            />
          </div>
          {err && (
            <p className="mt-2 text-xs font-semibold text-red-600">
              {t(err.en, err.cn)}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : t("Sign in", "登录")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/50">
        {t("New to STRYDE?", "还没有账户？")}{" "}
        <Link href="/account/register" className="font-bold text-accent hover:underline">
          {t("Create an account", "立即注册")}
        </Link>
      </p>
    </div>
  );
}

export default function AccountLoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-paper px-4 py-16">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
