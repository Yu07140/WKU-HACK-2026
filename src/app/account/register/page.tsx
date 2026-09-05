"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { User, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useLang } from "@/lib/store/lang";

const ERROR_TEXT: Record<string, { en: string; cn: string }> = {
  MISSING_FIELDS: { en: "Please fill in all fields", cn: "请填写所有字段" },
  INVALID_USERNAME: {
    en: "Username must be 3-20 characters (letters, numbers, underscore)",
    cn: "账号需为 3-20 位字母、数字或下划线",
  },
  USERNAME_TAKEN: { en: "This username is already taken", cn: "该账号已被注册" },
  INVALID_PASSWORD: { en: "Password must be 6-64 characters", cn: "密码长度需为 6-64 位" },
  PASSWORD_MISMATCH: { en: "Passwords do not match", cn: "两次输入的密码不一致" },
  NETWORK: { en: "Network error, please try again", cn: "网络错误，请重试" },
};

function RegisterForm() {
  const { t } = useLang();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("PASSWORD_MISMATCH");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "MISSING_FIELDS");
        setLoading(false);
        return;
      }
      // 注册成功即登录，整页跳转确保头部状态刷新
      window.location.assign("/account");
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
          {t("Create your account", "创建账户")}
        </h1>
        <p className="mt-2 text-sm text-ink/50">
          {t("Just a username and password — no email or phone needed", "只需账号和密码，无需邮箱或手机号")}
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
              placeholder={t("3-20 chars, letters / numbers / _", "3-20 位字母、数字或下划线")}
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
              placeholder={t("At least 6 characters", "至少 6 位字符")}
              className="pl-10"
              autoComplete="new-password"
            />
          </div>
        </div>

        <div>
          <Label>{t("Confirm password", "确认密码")}</Label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <Input
              type="password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setError(null);
              }}
              placeholder={t("Re-enter password", "再次输入密码")}
              className="pl-10"
              autoComplete="new-password"
            />
          </div>
          {err && (
            <p className="mt-2 text-xs font-semibold text-red-600">
              {t(err.en, err.cn)}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            t("Create account", "注册并登录")
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/50">
        {t("Already have an account?", "已有账户？")}{" "}
        <Link href="/account/login" className="font-bold text-accent hover:underline">
          {t("Sign in", "去登录")}
        </Link>
      </p>
    </div>
  );
}

export default function AccountRegisterPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-paper px-4 py-16">
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
