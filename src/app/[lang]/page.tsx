import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { localeDir } from "@/i18n/config";
import { getCatalog, getFeaturedBooks } from "@/lib/queries";
import { setName } from "@/lib/format";
import { Hero } from "@/components/home/Hero";
import { BookCarousel } from "@/components/home/BookCarousel";
import { Features } from "@/components/home/Features";
import { SetsOverview } from "@/components/home/SetsOverview";
import { PreorderSection } from "@/components/preorder/PreorderSection";

export default async function HomePage() {
  const locale = await getLocale();
  const [dict, featured, catalog] = await Promise.all([getDictionary(locale), getFeaturedBooks(), getCatalog()]);
  const setNames = Object.fromEntries(catalog.sets.map((s) => [s.id, setName(s, locale)]));
  // Carousel boşsa (henüz seçim yapılmadıysa) katalogdaki ilk kitapları göster
  const carouselBooks = featured.length > 0 ? featured : catalog.books.slice(0, 9);

  return (
    <>
      <Hero locale={locale} dict={dict} books={carouselBooks.filter((b) => b.coverUrl).slice(0, 3)} />

      <section className="mx-auto max-w-6xl px-4 sm:px-6" aria-labelledby="featured-title">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="featured-title" className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
              {dict.carousel.title}
            </h2>
            <p className="mt-2 text-body">{dict.carousel.subtitle}</p>
          </div>
        </div>
        <div className="mt-6 overflow-hidden px-1 sm:overflow-visible">
          <BookCarousel
            books={carouselBooks}
            setNames={setNames}
            locale={locale}
            dir={localeDir[locale]}
            t={dict.carousel}
            catalogT={dict.catalog}
          />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <Features items={dict.features} />
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6" aria-labelledby="sets-title">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 id="sets-title" className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
            {dict.catalog.allSets}
          </h2>
          <Link href={`/${locale}/kitaplar`} className="text-sm font-medium text-primary hover:underline">
            {dict.carousel.viewAll}
          </Link>
        </div>
        <SetsOverview locale={locale} dict={dict} catalog={catalog} />
      </section>

      <section id="on-siparis" className="mx-auto mt-24 max-w-6xl scroll-mt-24 px-4 sm:px-6">
        <PreorderSection locale={locale} dict={dict} />
      </section>
    </>
  );
}
