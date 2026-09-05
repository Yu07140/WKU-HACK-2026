"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/** Homepage email capture — launch updates only. No discount claims. */
export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email to join the list.");
      return;
    }
    setError("");
    setJoined(true);
  }

  if (joined) {
    return (
      <p className="mx-auto mt-5 max-w-md text-sm font-bold tracking-wider text-paper">
        YOU&apos;RE ON THE LIST — WATCH YOUR INBOX.
      </p>
    );
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
        aria-label="Email address"
        className="h-12 flex-1 rounded-full border border-paper/20 bg-paper/10 px-5 text-sm text-paper placeholder:text-paper/40 outline-none focus:border-paper/50"
      />
      <Button type="submit" size="lg">
        JOIN THE LIST
      </Button>
      {error && <p className="w-full text-left text-xs text-amber-300">{error}</p>}
    </form>
  );
}
