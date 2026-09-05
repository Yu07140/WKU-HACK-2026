"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/lib/data/brand";

const ADMIN_PASSWORD = "stryde2026";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (password === ADMIN_PASSWORD) {
      document.cookie = `stryde-admin-token=${ADMIN_PASSWORD}; path=/; samesite=lax`;
      const redirect = params.get("redirect") || "/admin";
      router.push(redirect);
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-black tracking-[0.18em] text-white">
          {BRAND.name}<span className="text-accent">.</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">Admin Console</p>
      </div>

      <form
        onSubmit={submit}
        className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
            管理密码
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter password"
              className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-600"
              autoFocus
            />
          </div>
          {error && (
            <p className="mt-2 text-xs font-semibold text-red-400">
              密码错误，请重试
            </p>
          )}
        </div>

        <Button size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "进入后台"
          )}
        </Button>
      </form>

      <button
        onClick={() => router.push("/")}
        className="mt-4 w-full text-center text-xs text-slate-500 hover:text-slate-300"
      >
        ← 返回独立站
      </button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0e14] px-6">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
