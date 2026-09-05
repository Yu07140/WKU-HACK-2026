"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email to unlock 15% off.");
      return;
    }
    setError("");
    router.push("/products?discount=STRYDE15");
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-5 flex max-w-md flex-col gap-2 sm:flex-row">
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
        GET 15% OFF
      </Button>
      {error && <p className="w-full text-left text-xs text-amber-300">{error}</p>}
    </form>
  );
}
