import type { Metadata } from "next";
import { Suspense } from "react";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getCatalog } from "@/lib/queries";
import { CatalogBrowser, CatalogFromUrl } from "@/components/catalog/CatalogBrowser";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.catalog.title, description: dict.catalog.subtitle };
}

export default async function CatalogPage() {
  const locale = await getLocale();
  const [dict, catalog] = await Promise.all([getDictionary(locale), getCatalog()]);
  const props = { catalog, locale, t: dict.catalog };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
      <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">{dict.catalog.title}</h1>
      <p className="mt-3 text-lg text-body">{dict.catalog.subtitle}</p>
      <div className="mt-8">
        {/* Statik iskelet filtresiz listeyle gelir; URL'deki filtre istemcide uygulanır. */}
        <Suspense fallback={<CatalogBrowser {...props} />}>
          <CatalogFromUrl {...props} />
        </Suspense>
      </div>
    </div>
  );
}
