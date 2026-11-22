import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { localeDir } from "@/i18n/config";
import { getCatalog, getFeaturedBooks, getPricing } from "@/lib/queries";
import { Hero } from "@/components/home/Hero";
import { BookCarousel } from "@/components/home/BookCarousel";
import { Features } from "@/components/home/Features";
import { PreorderSection } from "@/components/preorder/PreorderSection";

export default async function HomePage() {
  const locale = await getLocale();
  const [dict, featured, catalog, pricing] = await Promise.all([
    getDictionary(locale),
    getFeaturedBooks(),
    getCatalog(),
    getPricing(),
  ]);
  // Carousel için seçim yapılmadıysa katalogdaki ilk kitapları göster
  const carouselBooks = featured.length > 0 ? featured : catalog.books.slice(0, 9);

  return (
    <>
      <Hero locale={locale} dict={dict} pricing={pricing} books={carouselBooks.filter((b) => b.coverUrl).slice(0, 3)} />

      {/* Dalgalı üst kenarlı kitap paneli (referans: hero'nun üstüne biner) */}
      <section className="relative z-10 -mt-11" aria-labelledby="featured-title">
        <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="block h-11 w-full text-bg" aria-hidden="true">
          <path d="M0 48V30C170 0 330-6 560 16s420 28 640 6c110-11 190-17 240-12V48Z" fill="currentColor" />
        </svg>
        <div className="bg-bg pb-4">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <h2 id="featured-title" className="font-display flex items-center gap-2.5 text-2xl text-ink sm:gap-3 sm:text-4xl">
                <BookOpen className="size-7 shrink-0 text-primary sm:size-9" strokeWidth={2.2} />
                <span className="title-underline">{dict.carousel.title}</span>
              </h2>
              <Link
                href={`/${locale}/kitaplar`}
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line-strong bg-surface/80 px-3.5 py-2 text-sm font-bold text-ink shadow-soft transition hover:border-primary hover:text-primary sm:gap-1.5 sm:px-5 sm:py-2.5 sm:text-base"
              >
                {dict.carousel.viewAll}
                <ChevronRight className="size-4 rtl:-scale-x-100" strokeWidth={2.6} />
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-2 max-w-[1500px] overflow-hidden">
            <BookCarousel books={carouselBooks} locale={locale} dir={localeDir[locale]} t={dict.carousel} catalogT={dict.catalog} />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        <Features items={dict.features} />
      </section>

      <section id="on-siparis" className="mx-auto mt-14 max-w-6xl scroll-mt-8 px-4 sm:px-6">
        <PreorderSection locale={locale} dict={dict} />
      </section>
    </>
  );
}
