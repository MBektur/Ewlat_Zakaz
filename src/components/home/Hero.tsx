import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Book3D } from "@/components/book/Book3D";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { bookLabel } from "@/lib/format";
import type { CatalogBook } from "@/lib/types";

export function Hero({ locale, dict, books }: { locale: Locale; dict: Dictionary; books: CatalogBook[] }) {
  const t = dict.hero;
  const [a, b, c] = books;
  const alt = (book: CatalogBook) => bookLabel(book, locale).title ?? dict.catalog.untitled;

  return (
    <section className="relative overflow-hidden">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pb-24 lg:pt-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 text-sm text-body">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            {t.eyebrow}
          </p>
          <h1 className="font-display mt-6 max-w-xl text-[2.6rem] leading-[1.05] tracking-tight text-ink sm:text-6xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-body">{t.subtitle}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/on-siparis`}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-medium text-surface shadow-lift transition-colors hover:bg-primary-dark"
            >
              {t.ctaPreorder}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
            </Link>
            <Link
              href={`/${locale}/kitaplar`}
              className="inline-flex items-center rounded-full border border-line-strong bg-surface/70 px-6 py-3.5 font-medium text-ink transition-colors hover:bg-surface"
            >
              {t.ctaBrowse}
            </Link>
          </div>
        </div>

        {a && (
          <div className="relative mx-auto flex h-[320px] w-full max-w-[520px] items-end justify-center sm:h-[400px]" aria-hidden="false">
            {/* Yumuşak kemer zemin */}
            <div className="absolute inset-x-6 bottom-0 top-6 rounded-t-[999px] bg-soft" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 h-10 rounded-[50%] bg-line/50 blur-xl" aria-hidden="true" />
            <div className="relative flex items-end gap-2 pb-6 sm:gap-4">
              {b && (
                <div className="hidden translate-y-2 sm:block">
                  <Book3D book={b} maxWidth={150} maxHeight={210} alt={alt(b)} priority />
                </div>
              )}
              <div className="relative z-10">
                <Book3D book={a} maxWidth={200} maxHeight={280} alt={alt(a)} priority />
              </div>
              {c && (
                <div className="translate-y-2">
                  <Book3D book={c} maxWidth={150} maxHeight={210} alt={alt(c)} priority />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
