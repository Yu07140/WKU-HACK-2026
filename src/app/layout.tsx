import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/store/cart";
import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { AgentWidget } from "@/components/agent/AgentWidget";
import { BRAND } from "@/lib/data/brand";

export const metadata: Metadata = {
  title: `${BRAND.name} — Factory-Direct Footwear, AI-Powered DTC Brand`,
  description:
    "STRYDE: one real factory SKU (14534-H) turned into a market-ready DTC product with AI in a 24-hour sprint. Microfiber, rubber outsole, EU 38–46.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <SiteHeader />
          <main className="min-h-screen">{children}</main>
          <SiteFooter />
          <AgentWidget />
        </CartProvider>
      </body>
    </html>
  );
}
