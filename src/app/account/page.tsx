"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, ShoppingBag, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/store/lang";

interface MeResponse {
  user: { username: string; memberSince: string } | null;
}

export default function AccountPage() {
  const { t } = useLang();
  const [user, setUser] = useState<MeResponse["user"]>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (data: MeResponse) => {
        if (cancelled) return;
        if (!data.user) {
          // 会话失效（服务端重启/冷启动后内存清空但 cookie 仍在）：
          // 先登出清掉失效 cookie，再整页跳转登录页，避免与 middleware 互相弹回
          try {
            await fetch("/api/auth/logout", { method: "POST" });
          } catch {
            // 忽略网络异常，跳转优先
          }
          window.location.assign("/account/login?redirect=%2Faccount");
          return;
        }
        setUser(data.user);
      })
      .catch(() => {
        if (!cancelled) window.location.assign("/account/login?redirect=%2Faccount");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.assign("/");
    }
  }

  if (loading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center py-32 text-ink/40">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  const memberSince = new Date(user.memberSince).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:py-20">
      <h1 className="text-3xl font-black tracking-tight text-ink">
        {t("My Account", "我的账户")}
      </h1>
      <p className="mt-2 text-sm text-ink/50">
        {t("Signed in and ready to stride.", "已登录，随时出发。")}
      </p>

      <div className="mt-8 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <User size={26} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-black text-ink">{user.username}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/40">
              {t("Member since", "注册于")} {memberSince}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/products" className="flex-1">
            <Button size="lg" className="w-full">
              <ShoppingBag size={18} />
              {t("Continue shopping", "继续购物")}
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={logout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <LogOut size={18} />
                {t("Log out", "退出登录")}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-ink/[0.03] px-4 py-3 text-xs leading-relaxed text-ink/50">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-accent" />
        <p>
          {t(
            "Demo build: accounts live in server memory and passwords are bcrypt-hashed. Data resets on redeploy, just like demo orders.",
            "演示环境：账号保存在服务端内存中，密码经 bcrypt 哈希加密。重新部署后数据会清空，与演示订单相同。"
          )}
        </p>
      </div>
    </div>
  );
}
