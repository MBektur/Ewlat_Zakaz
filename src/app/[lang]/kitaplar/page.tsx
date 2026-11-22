import type { Metadata } from "next";
import { Suspense } from "react";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getCatalog, getPricing } from "@/lib/queries";
import { PriceTag } from "@/components/preorder/PriceTag";
import { CatalogBrowser, CatalogFromUrl } from "@/components/catalog/CatalogBrowser";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.catalog.title, description: dict.catalog.subtitle };
}

export default async function CatalogPage() {
  const locale = await getLocale();
  const [dict, catalog, pricing] = await Promise.all([getDictionary(locale), getCatalog(), getPricing()]);
  const props = { catalog, locale, t: dict.catalog };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display title-underline text-4xl text-ink sm:text-5xl">{dict.catalog.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-body">{dict.catalog.subtitle}</p>
        </div>
        <Link
          href={`/${locale}/on-siparis`}
          className="btn-sun inline-flex shrink-0 items-center gap-3 self-start rounded-full px-6 py-3.5 font-extrabold md:self-auto"
        >
          <ShoppingBag className="size-5" strokeWidth={2.2} />
          <span>
            {dict.catalog.preorderAll}
            <PriceTag pricing={pricing} locale={locale} className="ms-2 opacity-80" />
          </span>
        </Link>
      </div>
      <div className="mt-8">
        {/* Statik iskelet filtresiz listeyle gelir; URL'deki filtre istemcide uygulanır. */}
        <Suspense fallback={<CatalogBrowser {...props} />}>
          <CatalogFromUrl {...props} />
        </Suspense>
      </div>
    </div>
  );
}
