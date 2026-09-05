import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/store/cart";
import { CurrencyProvider } from "@/lib/store/currency";
import { LangProvider } from "@/lib/store/lang";
import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { AgentWidget } from "@/components/agent/AgentWidget";
import { BRAND } from "@/lib/data/brand";

export const metadata: Metadata = {
  title: `${BRAND.name} — Stand Up. Stand Out.`,
  description:
    "STRYDE — clean, modern footwear built for the way your day moves. The 14534-H black ankle boot in EU 38–46, microfiber upper, rubber outsole.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LangProvider>
          <CurrencyProvider>
            <CartProvider>
              <SiteHeader />
              <main className="min-h-screen">{children}</main>
              <SiteFooter />
              <AgentWidget />
            </CartProvider>
          </CurrencyProvider>
        </LangProvider>
      </body>
    </html>
  );
}
