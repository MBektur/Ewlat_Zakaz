import { localePath } from "@/i18n/paths";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { localeDir } from "@/i18n/config";
import { getCatalog, getFeaturedBooks, getPricing } from "@/lib/queries";
import { setName } from "@/lib/format";
import { Banner } from "@/components/home/Banner";
import { BookCarousel } from "@/components/home/BookCarousel";
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { SectionTitle } from "@/components/home/SectionTitle";
import { SetTiles } from "@/components/home/SetTiles";
import { Steps } from "@/components/home/Steps";
import { PreorderSection } from "@/components/preorder/PreorderSection";
import { YoutubeEmbed } from "@/components/home/YoutubeEmbed";
import { VideoIntroModal } from "@/components/home/VideoIntroModal";

export default async function HomePage() {
  const locale = await getLocale();
  const [dict, featured, catalog, pricing] = await Promise.all([
    getDictionary(locale),
    getFeaturedBooks(),
    getCatalog(),
    getPricing(),
  ]);
  // Carousel için seçim yapılmadıysa katalogdaki ilk kitapları göster
  const setNames = Object.fromEntries(catalog.sets.map((s) => [s.id, setName(s, locale)]));
  const byId = new Map(catalog.books.map((b) => [b.id, b]));
  const siblingsBySet = Object.fromEntries(
    catalog.sets.map((x) => [x.id, x.bookIds.map((id) => byId.get(id)).filter((b): b is NonNullable<typeof b> => !!b)]),
  );
  const carouselBooks = featured.length > 0 ? featured : catalog.books.slice(0, 9);

  return (
    <>
      {/* İlk ziyarette otomatik tanıtım video modalı */}
      <VideoIntroModal
        videoId="pnGYSoKbVoI"
        title={dict.video.title}
        closeLabel={dict.video.modalClose}
        skipLabel={dict.video.modalSkip}
      />
      <Hero locale={locale} dict={dict} pricing={pricing} setNames={setNames} books={carouselBooks.filter((b) => b.coverUrl).slice(0, 3)} />

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6" aria-labelledby="featured-title">
        <SectionTitle id="featured-title">{dict.carousel.title}</SectionTitle>
        <div className="mt-8 overflow-hidden sm:px-14">
          <BookCarousel books={carouselBooks} setNames={setNames} siblingsBySet={siblingsBySet} locale={locale} dir={localeDir[locale]} t={dict.carousel} catalogT={dict.catalog} />
        </div>
        <div className="mt-2 text-center">
          <Link
            href={localePath(locale, "books")}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-teal-dark bg-surface px-6 py-2.5 font-extrabold text-teal-dark transition hover:bg-teal-dark hover:text-white"
          >
            {dict.carousel.viewAll}
            <ChevronRight className="size-4 rtl:-scale-x-100" strokeWidth={3} />
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6" aria-labelledby="tiles-title">
        <SectionTitle id="tiles-title">{dict.tiles.title}</SectionTitle>
        <div className="mt-8">
          <SetTiles locale={locale} dict={dict} catalog={catalog} />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6" aria-labelledby="why-title">
        <SectionTitle id="why-title">{dict.why.title}</SectionTitle>
        <div className="mt-10">
          <Features items={dict.features} />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <Banner locale={locale} dict={dict} pricing={pricing} />
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <Steps how={dict.how} />
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6" aria-labelledby="video-title">
        <SectionTitle id="video-title">{dict.video.sectionTitle}</SectionTitle>
        <div className="mt-10">
          <YoutubeEmbed
            videoId="pnGYSoKbVoI"
            title={dict.video.title}
            caption={dict.video.caption}
          />
        </div>
      </section>

      <section id="on-siparis" className="mx-auto mt-20 max-w-6xl scroll-mt-24 px-4 sm:px-6">
        <PreorderSection locale={locale} dict={dict} />
      </section>
    </>
  );
}
