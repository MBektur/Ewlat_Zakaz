import { localePath } from "@/i18n/paths";
import Link from "next/link";
import { ArrowRight, Heart, Languages, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { BookBlob, SideLeaf, Sparkle } from "@/components/art/HeroDecor";
import { Book3D } from "@/components/book/Book3D";
import { PriceTag } from "@/components/preorder/PriceTag";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { bookLabel, fill } from "@/lib/format";
import type { CatalogBook, Pricing } from "@/lib/types";

type Props = { locale: Locale; dict: Dictionary; pricing: Pricing; books: CatalogBook[]; setNames: Record<number, string> };

/** Yan yana duran üç gerçek kapak. Üst üste binmez; ortadaki biraz büyük. */
function Trio({ books, locale, dict, size, setNames }: { books: CatalogBook[]; locale: Locale; dict: Dictionary; size: "sm" | "lg"; setNames: Record<number, string> }) {
  const [a, b, c] = books;
  const alt = (book: CatalogBook) =>
    bookLabel(book, locale).title ?? [book.setId ? setNames[book.setId] : null, fill(dict.catalog.volume, { n: book.position })].filter(Boolean).join(" · ");
  const big = size === "lg" ? { w: 192, h: 280 } : { w: 116, h: 168 };
  const small = size === "lg" ? { w: 140, h: 204 } : { w: 86, h: 126 };
  return (
    <div className="flex items-end justify-center gap-2 sm:gap-3">
      {b && <Book3D book={b} maxWidth={small.w} maxHeight={small.h} alt={alt(b)} priority />}
      {a && <Book3D book={a} maxWidth={big.w} maxHeight={big.h} alt={alt(a)} priority />}
      {c && <Book3D book={c} maxWidth={small.w} maxHeight={small.h} alt={alt(c)} priority />}
    </div>
  );
}

const chipIcons = [Languages, ShieldCheck, Truck];

export function Hero({ locale, dict, pricing, books, setNames }: Props) {
  const t = dict.hero;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#ffecd9] to-[#fff8f0]">
      <SideLeaf className="pointer-events-none absolute start-0 bottom-0 hidden w-24 xl:block rtl:-scale-x-100" tone="coral" />
      <SideLeaf className="pointer-events-none absolute end-0 bottom-0 hidden w-24 xl:block rtl:-scale-x-100" tone="teal" />
      <Sparkle className="pointer-events-none absolute start-[44%] top-10 hidden size-5 lg:block" color="#2a9d8f" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pb-20 lg:pt-14">
        <div>
          <h1 className="font-display text-[2.7rem] leading-[1.05] sm:text-6xl">
            <span className="block text-primary">{t.title1}</span>
            <span className="block text-teal-dark">{t.title2}</span>
          </h1>
          <p className="mt-6 max-w-lg text-xl font-bold leading-snug text-ink sm:text-2xl">
            <span className="title-underline me-2 text-[1.3em] font-black text-primary">{t.highlight}</span>
            {t.subtitle}
          </p>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-body">{t.subtitle2}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={localePath(locale, "preorder")}
              className="btn-coral group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-lg font-extrabold transition"
            >
              <ShoppingCart className="size-5 rtl:-scale-x-100" strokeWidth={2.4} />
              {t.ctaPreorder}
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2.4} />
            </Link>
            <Link
              href={localePath(locale, "books")}
              className="inline-flex items-center rounded-full border-2 border-teal-dark bg-surface px-7 py-3 text-lg font-extrabold text-teal-dark transition hover:bg-teal-dark hover:text-white"
            >
              {t.ctaBrowse}
            </Link>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-body">
            {t.chips.map((chip, i) => {
              const Icon = chipIcons[i % chipIcons.length];
              return (
                <li key={chip} className="flex items-center gap-2">
                  <Icon className="size-5 text-teal-dark rtl:-scale-x-100" strokeWidth={2} />
                  {chip}
                </li>
              );
            })}
          </ul>
          <PriceTag
            pricing={pricing}
            locale={locale}
            template={t.priceBadge}
            untilTemplate={dict.preorder.campaignUntil}
            className="mt-6 inline-block rounded-2xl border border-line-strong bg-surface px-4 py-2.5 text-base font-extrabold text-ink"
          />
        </div>

        <div className="relative mx-auto aspect-[520/470] w-full max-w-[500px]">
          <BookBlob className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-x-0 bottom-[10%] hidden sm:block">
            <Trio books={books} locale={locale} dict={dict} size="lg" setNames={setNames} />
          </div>
          <div className="absolute inset-x-0 bottom-[10%] sm:hidden">
            <Trio books={books} locale={locale} dict={dict} size="sm" setNames={setNames} />
          </div>
          {/* Konuşma balonu: kitapların üstünde, köşede; hiçbir kapağa binmez */}
          <div className="absolute end-0 top-0 flex size-[31%] min-h-[104px] min-w-[104px] -rotate-6 flex-col items-center justify-center rounded-full bg-teal-dark p-3 text-center text-white shadow-soft">
            <span className="font-display text-[0.95rem] leading-tight sm:text-xl">{t.bubble}</span>
            <Heart className="mt-1 size-4 text-sun" fill="currentColor" strokeWidth={0} />
          </div>
        </div>
      </div>
    </section>
  );
}
