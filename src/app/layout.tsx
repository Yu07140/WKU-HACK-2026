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
    "STRYDE: from white-label shoe factory to global DTC brand. Premium sneakers at factory prices. Free shipping & 30-day trial.",
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
