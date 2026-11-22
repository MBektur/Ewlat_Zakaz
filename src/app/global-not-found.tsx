import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-fraunces" });
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = { title: "404 · Ewlat Kitap" };

export default function GlobalNotFound() {
  return (
    <html lang="tr" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh items-center justify-center px-4">
        <main className="max-w-md text-center">
          <p className="font-display text-7xl text-line-strong">404</p>
          <h1 className="font-display mt-4 text-3xl text-ink">Sayfa bulunamadı</h1>
          <p className="mt-2 text-body">Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.</p>
          <p className="mt-6 flex justify-center gap-3">
            <a href="/tr" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-surface">
              Ana sayfa
            </a>
            <a href="/ug" lang="ug" dir="rtl" className="ug-text rounded-full border border-line bg-surface px-5 py-2 text-body">
              باش بەت
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
