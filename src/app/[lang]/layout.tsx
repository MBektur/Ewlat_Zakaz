import type { Metadata } from "next";
import { Nunito, Lateef } from "next/font/google";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { localeDir, locales } from "@/i18n/config";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import "../globals.css";

const nunito = Nunito({ subsets: ["latin", "latin-ext"], variable: "--font-nunito" });
const lateef = Lateef({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-lateef",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: { default: dict.site.brand, template: `%s · ${dict.site.brand}` },
    description: dict.site.description,
    alternates: { languages: { tr: "/tr", ug: "/ug" } },
  };
}

export default async function SiteLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={localeDir[locale]}
      className={`${nunito.variable} ${lateef.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <Header locale={locale} brand={dict.site.brand} nav={dict.nav} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
