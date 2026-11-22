import { localePath } from "@/i18n/paths";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getCatalog, getPricing } from "@/lib/queries";
import { PriceTag } from "@/components/preorder/PriceTag";
import { CatalogFromUrl } from "@/components/catalog/CatalogBrowser";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return [{ lang: "tr" }, { lang: "ug" }];
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { lang } = await props.params;
  const locale = (lang === "tr" ? "tr" : "ug") as Locale;
  const dict = await getDictionary(locale);
  return { title: dict.catalog.title, description: dict.catalog.subtitle };
}

export default async function CatalogPage(props: PageProps) {
  const { lang } = await props.params;
  const locale = (lang === "tr" ? "tr" : "ug") as Locale;
  const [dict, catalog, pricing] = await Promise.all([getDictionary(locale), getCatalog(), getPricing()]);
  const baseProps = { catalog, locale, t: dict.catalog };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display title-underline text-4xl text-ink sm:text-5xl">{dict.catalog.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-body">{dict.catalog.subtitle}</p>
        </div>
        <Link
          href={localePath(locale, "preorder")}
          className="btn-coral inline-flex shrink-0 items-center gap-3 self-start rounded-full px-6 py-3.5 font-extrabold md:self-auto"
        >
          <ShoppingBag className="size-5" strokeWidth={2.2} />
          <span>
            {dict.catalog.preorderAll}
            <PriceTag pricing={pricing} locale={locale} className="ms-2 opacity-80" />
          </span>
        </Link>
      </div>
      <div className="mt-8">
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogFromUrl {...baseProps} />
        </Suspense>
      </div>
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="border-b border-line/70 pb-5">
        <div className="h-10 w-full max-w-md rounded-full bg-soft" />
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-9 w-28 rounded-full bg-soft" />
          ))}
        </div>
      </div>
      <div className="pt-10">
        <div className="mb-6 h-7 w-48 rounded bg-soft" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-soft" />
          ))}
        </div>
      </div>
    </div>
  );
}
