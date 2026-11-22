import type { Metadata } from "next";
import { Fredoka, Nunito, Lateef } from "next/font/google";
import "../globals.css";

const fredoka = Fredoka({ subsets: ["latin", "latin-ext"], variable: "--font-fredoka" });
const nunito = Nunito({ subsets: ["latin", "latin-ext"], variable: "--font-nunito" });
const lateef = Lateef({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-lateef" });

export const metadata: Metadata = {
  title: { default: "Yönetim", template: "%s · Yönetim" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${fredoka.variable} ${nunito.variable} ${lateef.variable}`}>
      <body className="min-h-dvh bg-bg text-ink">{children}</body>
    </html>
  );
}
