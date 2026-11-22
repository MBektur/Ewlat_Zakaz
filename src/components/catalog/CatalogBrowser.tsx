"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Book3D } from "@/components/book/Book3D";
import { BookCaption } from "@/components/book/BookCaption";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { bookLabel, fill, setName } from "@/lib/format";
import type { Catalog, CatalogBook } from "@/lib/types";

type Props = {
  catalog: Catalog;
  locale: Locale;
  t: Dictionary["catalog"];
};

/** URL'deki ?set= ve ?q= değerleriyle başlar. */
export function CatalogFromUrl(props: Props) {
  const params = useSearchParams();
  return <CatalogBrowser {...props} initialSet={params.get("set") ?? ""} initialQuery={params.get("q") ?? ""} />;
}

const normalize = (s: string) =>
  s
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i");

export function CatalogBrowser({
  catalog,
  locale,
  t,
  initialSet = "",
  initialQuery = "",
}: Props & { initialSet?: string; initialQuery?: string }) {
  const [activeSet, setActiveSet] = useState(initialSet);
  const [query, setQuery] = useState(initialQuery);

  const booksById = useMemo(() => new Map(catalog.books.map((b) => [b.id, b])), [catalog.books]);
  const sets = useMemo(() => catalog.sets.filter((s) => s.bookIds.length > 0), [catalog.sets]);

  // URL'yi sayfa yenilemeden güncelle (paylaşılabilir filtre linkleri)
  function syncUrl(nextSet: string, nextQuery: string) {
    const params = new URLSearchParams();
    if (nextSet) params.set("set", nextSet);
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }

  const groups = useMemo(() => {
    const q = normalize(query.trim());
    const matches = (book: CatalogBook, setLabel: string) => {
      if (!q) return true;
      return [book.titleTr, book.titleUg, book.topicTr, book.topicUg, setLabel]
        .filter(Boolean)
        .some((v) => normalize(v!).includes(q));
    };
    return sets
      .filter((s) => !activeSet || s.slug === activeSet)
      .map((s) => {
        const label = setName(s, locale);
        const otherLabel = locale === "ug" ? s.nameTr : (s.nameUg ?? "");
        const books = s.bookIds
          .map((id) => booksById.get(id))
          .filter((b): b is CatalogBook => !!b && (matches(b, label) || (!!otherLabel && normalize(otherLabel).includes(q))));
        return { set: s, label, books };
      })
      .filter((g) => g.books.length > 0);
  }, [sets, activeSet, query, locale, booksById]);

  const total = groups.reduce((n, g) => n + g.books.length, 0);
  const filtered = !!activeSet || !!query.trim();

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 border-b border-line/70 bg-bg/90 px-4 py-4 backdrop-blur-md sm:top-[72px] sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative block lg:w-80">
            <span className="sr-only">{t.searchLabel}</span>
            <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                syncUrl(activeSet, e.target.value);
              }}
              placeholder={t.search}
              className="w-full rounded-full border border-line bg-surface py-2.5 pe-4 ps-10 text-ink outline-none transition placeholder:text-muted/80 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0 lg:pb-0" role="group" aria-label={t.allSets}>
            {[{ slug: "", label: t.allSets, count: catalog.books.length }, ...sets.map((s) => ({ slug: s.slug, label: setName(s, locale), count: s.bookIds.length }))].map(
              (chip) => (
                <button
                  key={chip.slug || "all"}
                  type="button"
                  aria-pressed={activeSet === chip.slug}
                  onClick={() => {
                    setActiveSet(chip.slug);
                    syncUrl(chip.slug, query);
                  }}
                  className="shrink-0 whitespace-nowrap rounded-full border border-line bg-surface px-3.5 py-2 text-sm text-body transition hover:border-line-strong hover:text-ink aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-surface"
                >
                  {chip.label}
                  <span className="ms-1.5 opacity-60">{chip.count}</span>
                </button>
              ),
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 text-sm text-muted" aria-live="polite">
          {fill(t.results, { n: total })}
          {filtered && (
            <button
              type="button"
              onClick={() => {
                setActiveSet("");
                setQuery("");
                syncUrl("", "");
              }}
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-primary hover:bg-soft"
            >
              <X className="size-3.5" />
              {t.clear}
            </button>
          )}
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="py-24 text-center text-body">{t.empty}</p>
      ) : (
        <div className="space-y-16 pt-10">
          {groups.map(({ set, label, books }) => (
            <section key={set.id} aria-labelledby={`set-${set.id}`}>
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line pb-3">
                <h2 id={`set-${set.id}`} className="font-display text-2xl tracking-tight text-ink">
                  {label}
                  <span className="ms-3 align-middle text-sm font-normal text-muted">
                    {fill(t.bookCount, { n: set.bookIds.length })}
                  </span>
                  {set.isPlaceholder && (
                    <span className="ms-2 rounded-full border border-dashed border-line-strong px-2.5 py-0.5 align-middle text-xs font-normal text-muted">
                      {t.placeholderSet}
                    </span>
                  )}
                </h2>
                <Link href={`/${locale}/on-siparis?set=${set.slug}`} className="text-sm font-medium text-primary hover:underline">
                  {t.preorderSet}
                </Link>
              </div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {books.map((book) => (
                  <li key={book.id} className="flex flex-col items-center gap-3">
                    <Book3D
                      book={book}
                      maxWidth={128}
                      maxHeight={180}
                      alt={bookLabel(book, locale).title ?? t.untitled}
                      placeholderLabel={t.placeholderBadge}
                    />
                    <BookCaption
                      book={book}
                      locale={locale}
                      untitled={t.untitled}
                      volumeLabel={t.volume}
                      placeholderBadge={t.placeholderBadge}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
