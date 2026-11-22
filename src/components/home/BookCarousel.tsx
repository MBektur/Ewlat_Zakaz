"use client";

import { useRef, useSyncExternalStore } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import { Book3D } from "@/components/book/Book3D";
import { BookCaption } from "@/components/book/BookCaption";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { CatalogBook } from "@/lib/types";
import { bookLabel, fill } from "@/lib/format";

type Props = {
  books: CatalogBook[];
  setNames: Record<number, string>;
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary["carousel"];
  catalogT: Dictionary["catalog"];
};

const subscribe = () => () => {};

/**
 * Swiper sunucuda render edilirken kendi zamanlayıcıları için new Date() çağırır; bu da
 * Cache Components ön-render kuralına aykırıdır. Bu yüzden tarayıcıda bağlanana kadar
 * aynı kitapları statik bir sırayla gösteririz (içerik HTML'de kalır, sıçrama olmaz).
 */
export function BookCarousel(props: Props) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  return mounted ? <SwiperCarousel {...props} /> : <StaticRow {...props} />;
}

function Slide({ book, i, locale, catalogT, setNames }: { book: CatalogBook; i: number } & Pick<Props, "locale" | "catalogT" | "setNames">) {
  const setLabel = book.setId ? setNames[book.setId] : null;
  const title = bookLabel(book, locale).title ?? [setLabel, fill(catalogT.volume, { n: book.position })].filter(Boolean).join(" · ");
  return (
    <div className="flex h-full w-full flex-col rounded-3xl border border-line bg-surface p-3 shadow-soft">
      <div className="flex min-h-[236px] items-end justify-center px-2 pb-3 pt-6">
        <Book3D
          book={book}
          maxWidth={128}
          maxHeight={188}
          alt={title}
          placeholderLabel={catalogT.placeholderBadge}
          priority={i < 4}
        />
      </div>
      <div className="px-1 pb-2 pt-3">
        <BookCaption
          book={book}
          locale={locale}
          setLabel={setLabel}
          untitled={catalogT.untitled}
          volumeLabel={catalogT.volume}
          placeholderBadge={catalogT.placeholderBadge}
        />
      </div>
    </div>
  );
}

function StaticRow({ books, locale, catalogT, setNames }: Props) {
  return (
    <div className="flex justify-center gap-4 overflow-hidden px-4 pb-14">
      {books.slice(0, 5).map((book, i) => (
        <div key={book.id} className="w-[62%] shrink-0 sm:w-[34%] md:w-[26%] lg:w-[19%]">
          <Slide book={book} i={i} locale={locale} catalogT={catalogT} setNames={setNames} />
        </div>
      ))}
    </div>
  );
}

function SwiperCarousel({ books, locale, dir, t, catalogT, setNames }: Props) {
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
        slidesPerView={1.5}
        spaceBetween={16}
        loop={books.length > 4}
        loopAdditionalSlides={4}
        speed={900}
        grabCursor
        keyboard={{ enabled: true }}
        autoplay={{ delay: 2800, disableOnInteraction: false, pauseOnMouseEnter: true }}
        navigation={{ prevEl: `#${uid}-prev`, nextEl: `#${uid}-next` }}
        pagination={{ el: `#${uid}-pagination`, clickable: true }}
        a11y={{ prevSlideMessage: t.prev, nextSlideMessage: t.next, paginationBulletMessage: t.slide.replace("{n}", "{{index}}") }}
        breakpoints={{
          540: { slidesPerView: 2.3, spaceBetween: 16 },
          768: { slidesPerView: 3.2, spaceBetween: 16 },
          1024: { slidesPerView: 4.2, spaceBetween: 16 },
          1280: { slidesPerView: 5, spaceBetween: 16 },
        }}
        // Dokunma / sürükleme sırasında otomatik akış dursun, bırakınca devam etsin
        onTouchStart={(s) => s.autoplay?.pause()}
        onTouchEnd={(s) => s.autoplay?.resume()}
      >
        {books.map((book, i) => (
          <SwiperSlide key={book.id}>
            <Slide book={book} i={i} locale={locale} catalogT={catalogT} setNames={setNames} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Kenar okları (ref: kitapların iki yanında yuvarlak beyaz butonlar) */}
      <button
        id={`${uid}-prev`}
        type="button"
        aria-label={t.prev}
        className="absolute start-1 top-[40%] sm:-start-12 z-10 hidden size-14 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-teal-dark shadow-lift transition hover:scale-105 disabled:opacity-40 sm:flex"
      >
        <PrevIcon className="size-6" strokeWidth={2.4} />
      </button>
      <button
        id={`${uid}-next`}
        type="button"
        aria-label={t.next}
        className="absolute end-1 top-[40%] sm:-end-12 z-10 hidden size-14 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-teal-dark shadow-lift transition hover:scale-105 disabled:opacity-40 sm:flex"
      >
        <NextIcon className="size-6" strokeWidth={2.4} />
      </button>
      <div id={`${uid}-pagination`} className="book-swiper-pagination !static mt-6 flex justify-center" />
    </div>
  );
}
