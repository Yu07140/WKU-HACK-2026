"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/store/lang";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { t } = useLang();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError(t("Enter a valid email to unlock 15% off.", "请输入有效邮箱以解锁 85 折优惠。"));
      return;
    }
    setError("");
    router.push("/products?discount=STRYDE15");
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row">
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (error) setError("");
        }}
        placeholder="you@email.com"
        className="h-12 flex-1 rounded-full border border-paper/20 bg-paper/10 px-5 text-sm text-paper placeholder:text-paper/40 outline-none focus:border-paper/50"
      />
      <Button type="submit" size="lg">
        {t("GET 15% OFF", "立享 85 折")}
      </Button>
      {error && <p className="w-full text-left text-xs text-amber-300">{error}</p>}
    </form>
  );
}
