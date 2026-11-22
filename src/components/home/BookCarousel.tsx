"use client";

import Link from "next/link";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import { Book3D } from "@/components/book/Book3D";
import { BookCaption } from "@/components/book/BookCaption";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { CatalogBook } from "@/lib/types";
import { bookLabel } from "@/lib/format";

type Props = {
  books: CatalogBook[];
  setNames: Record<number, string>;
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary["carousel"];
  catalogT: Dictionary["catalog"];
};

export function BookCarousel({ books, setNames, locale, dir, t, catalogT }: Props) {
  const swiperRef = useRef<SwiperType | null>(null);
  const uid = "featured";
  // RTL'de "önceki" sağda, "sonraki" solda olur; ikonları da buna göre çevir
  const PrevIcon = dir === "rtl" ? ChevronRight : ChevronLeft;
  const NextIcon = dir === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <div className="relative">
      <Swiper
        key={dir}
        dir={dir}
        className="book-swiper"
        modules={[Autoplay, Navigation, Pagination, Keyboard, A11y]}
        onSwiper={(s) => (swiperRef.current = s)}
        slidesPerView={1.25}
        centeredSlides
        spaceBetween={16}
        loop={books.length > 4}
        speed={900}
        grabCursor
        keyboard={{ enabled: true }}
        autoplay={{ delay: 2800, disableOnInteraction: false, pauseOnMouseEnter: true }}
        navigation={{ prevEl: `#${uid}-prev`, nextEl: `#${uid}-next` }}
        pagination={{ el: `#${uid}-pagination`, clickable: true, dynamicBullets: books.length > 7 }}
        a11y={{ prevSlideMessage: t.prev, nextSlideMessage: t.next, paginationBulletMessage: t.slide.replace("{n}", "{{index}}") }}
        breakpoints={{
          480: { slidesPerView: 2, centeredSlides: false, spaceBetween: 20 },
          1024: { slidesPerView: 3, centeredSlides: false, spaceBetween: 32 },
        }}
        // Dokunma / sürükleme sırasında otomatik akış dursun, bırakınca devam etsin
        onTouchStart={(s) => s.autoplay?.pause()}
        onTouchEnd={(s) => s.autoplay?.resume()}
      >
        {books.map((book, i) => (
          <SwiperSlide key={book.id}>
            <div className="flex w-full flex-col items-center gap-5 pb-2 pt-6">
              <Book3D
                book={book}
                maxWidth={210}
                maxHeight={290}
                alt={bookLabel(book, locale).title ?? catalogT.untitled}
                placeholderLabel={catalogT.placeholderBadge}
                priority={i < 3}
              />
              <div className="max-w-[16rem]">
                <BookCaption
                  book={book}
                  locale={locale}
                  setLabel={book.setId ? setNames[book.setId] : null}
                  untitled={catalogT.untitled}
                  volumeLabel={catalogT.volume}
                  placeholderBadge={catalogT.placeholderBadge}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            id={`${uid}-prev`}
            type="button"
            aria-label={t.prev}
            className="flex size-11 items-center justify-center rounded-full border border-line bg-surface text-body shadow-soft transition hover:border-line-strong hover:text-ink disabled:opacity-40"
          >
            <PrevIcon className="size-5" />
          </button>
          <button
            id={`${uid}-next`}
            type="button"
            aria-label={t.next}
            className="flex size-11 items-center justify-center rounded-full border border-line bg-surface text-body shadow-soft transition hover:border-line-strong hover:text-ink disabled:opacity-40"
          >
            <NextIcon className="size-5" />
          </button>
        </div>
        <div id={`${uid}-pagination`} className="book-swiper-pagination !static flex !w-auto justify-center" />
        <Link
          href={`/${locale}/kitaplar`}
          className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-medium text-body shadow-soft transition hover:border-line-strong hover:text-ink"
        >
          {t.viewAll}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
