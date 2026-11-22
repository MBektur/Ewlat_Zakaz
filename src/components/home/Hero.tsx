import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { HeroScene } from "@/components/art/HeroScene";
import { LeafCluster } from "@/components/art/Leaves";
import { Book3D } from "@/components/book/Book3D";
import { PriceTag } from "@/components/preorder/PriceTag";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { bookLabel } from "@/lib/format";
import type { CatalogBook, Pricing } from "@/lib/types";

type Props = { locale: Locale; dict: Dictionary; pricing: Pricing; books: CatalogBook[] };

/** Çayırda duran üç gerçek kapaklı 3D kitap. Ortadaki daha büyük. */
function BookTrio({ books, locale, dict, compact }: { books: CatalogBook[]; locale: Locale; dict: Dictionary; compact?: boolean }) {
  const [a, b, c] = books;
  const alt = (book: CatalogBook) => bookLabel(book, locale).title ?? dict.catalog.untitled;
  const big = compact ? { w: 124, h: 178 } : { w: 215, h: 305 };
  const small = compact ? { w: 92, h: 132 } : { w: 160, h: 228 };
  return (
    <div className="flex items-end justify-center gap-2 sm:gap-4">
      {b && (
        <div className="translate-y-2">
          <Book3D book={b} maxWidth={small.w} maxHeight={small.h} alt={alt(b)} priority />
        </div>
      )}
      {a && (
        <div className="relative z-10">
          <Book3D book={a} maxWidth={big.w} maxHeight={big.h} alt={alt(a)} priority />
        </div>
      )}
      {c && (
        <div className="translate-y-2">
          <Book3D book={c} maxWidth={small.w} maxHeight={small.h} alt={alt(c)} priority />
        </div>
      )}
    </div>
  );
}

export function Hero({ locale, dict, pricing, books }: Props) {
  const t = dict.hero;
  return (
    <section className="relative -mt-20 overflow-hidden bg-gradient-to-b from-[#c4e4fc] via-[#e2f0fc] to-[#eef6fd] pt-20 sm:-mt-24 sm:pt-24 lg:min-h-[615px]">
      <HeroScene className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block rtl:-scale-x-100" />
      <LeafCluster className="pointer-events-none absolute start-0 top-[84px] hidden w-14 lg:block rtl:-scale-x-100" />
      {/* Masaüstü: kitaplar sağda, çayırın üstünde */}
      <div className="pointer-events-none absolute bottom-[68px] end-[7%] hidden lg:block">
        <BookTrio books={books} locale={locale} dict={dict} />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6 lg:pb-28 lg:pt-14">
        <div className="max-w-[34rem]">
          <h1 className="font-display relative text-[2.5rem] leading-[1.08] text-ink sm:text-[3.5rem]">
            {t.title}
            <Rays className="absolute -top-5 end-0 hidden w-12 text-accent sm:block rtl:-scale-x-100" />
          </h1>
          <p className="mt-6 text-xl font-bold leading-snug text-ink sm:text-[1.6rem]">
            <span className="title-underline me-2 text-[1.4em] font-black text-primary">{t.highlight}</span>
            {t.subtitle}
          </p>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-body">{t.subtitle2}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`/${locale}/on-siparis`}
              className="btn-sun group inline-flex items-center gap-3 rounded-full px-8 py-4 text-lg font-extrabold transition"
            >
              <ShoppingCart className="size-6 rtl:-scale-x-100" strokeWidth={2.2} />
              {t.ctaPreorder}
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2.4} />
            </Link>
            <PriceTag
              pricing={pricing}
              locale={locale}
              template={t.priceBadge}
              untilTemplate={dict.preorder.campaignUntil}
              className="rounded-2xl bg-surface/85 px-4 py-2.5 text-base font-extrabold text-ink shadow-soft"
            />
          </div>
        </div>
      </div>

      {/* Mobil / tablet: sahne ve kitaplar metnin altında */}
      <div className="relative mx-auto mt-4 w-full max-w-[600px] lg:hidden">
        <HeroScene variant="compact" className="pointer-events-none block h-auto w-full rtl:-scale-x-100" />
        <div className="pointer-events-none absolute inset-x-0 bottom-[14%]">
          <BookTrio books={books} locale={locale} dict={dict} compact />
        </div>
      </div>
    </section>
  );
}

function Rays({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M10 30 4 34M16 20l-4-8M28 16l2-9M38 22l7-5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
