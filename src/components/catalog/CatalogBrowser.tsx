"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Search, X } from "lucide-react";

const INITIAL_LIMIT = 10;
import { Book3D, bookSize } from "@/components/book/Book3D";
import { BookCaption } from "@/components/book/BookCaption";
import { BookModal } from "@/components/book/BookModal";
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

/** Setteki en uzun kitabın yüksekliği: kısa (yatay) kitapların altında gereksiz boşluk kalmaz, alt yazılar hizalı durur. */
const rowHeight = (books: CatalogBook[]) =>
  Math.max(...books.map((b) => bookSize(b.coverHeight / b.coverWidth, b.thicknessMm, 128, 180).height)) + 14;

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
  const [openId, setOpenId] = useState<number | null>(null);
  // Her set için görüntülenen kitap sayısı; key = set.id
  const [limits, setLimits] = useState<Record<number, number>>({});

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

  // Pencere: kitabın setindeki TÜM kitaplar gezilir (filtreden bağımsız)
  const openBook = openId != null ? booksById.get(openId) : undefined;
  const openSet = openBook ? catalog.sets.find((x) => x.id === openBook.setId) : undefined;
  const openSiblings = openSet ? openSet.bookIds.map((id) => booksById.get(id)).filter((x): x is CatalogBook => !!x) : openBook ? [openBook] : [];

  return (
    <div>
      <div className="border-b border-line/70 pb-5">
        <div className="flex flex-col gap-4">
          <label className="relative block w-full max-w-md">
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
          <div className="flex flex-wrap gap-2" role="group" aria-label={t.allSets}>
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
                  className="rounded-full border border-line bg-surface px-3.5 py-2 text-sm text-body transition hover:border-line-strong hover:text-ink aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-surface"
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
          {groups.map(({ set, label, books }) => {
            const limit = limits[set.id] ?? INITIAL_LIMIT;
            const visible = books.slice(0, limit);
            const remaining = books.length - visible.length;
            const allShown = remaining <= 0;

            return (
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
              </div>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
                {visible.map((book) => (
                  <li key={book.id} className="relative flex flex-col items-center rounded-2xl border border-line bg-surface px-2 pb-4 pt-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                    {/* Tüm kartı kaplayan görünmez düğme: tıklayınca ayrıntı penceresi açılır */}
                    <button
                      type="button"
                      onClick={() => setOpenId(book.id)}
                      aria-label={`${t.open}: ${bookLabel(book, locale).title ?? `${label} · ${fill(t.volume, { n: book.position })}`}`}
                      className="absolute inset-0 z-10 cursor-zoom-in rounded-2xl"
                    />
                    <div className="flex items-end" style={{ minHeight: rowHeight(books) }}>
                      <Book3D
                        book={book}
                        maxWidth={128}
                        maxHeight={180}
                        alt={bookLabel(book, locale).title ?? `${label} · ${fill(t.volume, { n: book.position })}`}
                        placeholderLabel={t.placeholderBadge}
                      />
                    </div>
                    <div className="mt-3 w-full border-t border-line/70 pt-3">
                      <BookCaption
                        book={book}
                        locale={locale}
                        untitled={t.untitled}
                        volumeLabel={t.volume}
                        placeholderBadge={t.placeholderBadge}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              {/* Daha fazla yükle */}
              {!allShown && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setLimits((prev) => ({ ...prev, [set.id]: (prev[set.id] ?? INITIAL_LIMIT) + INITIAL_LIMIT }))
                    }
                    className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-surface px-6 py-2.5 text-sm font-extrabold text-primary transition hover:bg-primary hover:text-white"
                  >
                    <ChevronDown className="size-4" strokeWidth={2.5} />
                    {t.loadMore}
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary group-hover:bg-white/20">
                      +{Math.min(remaining, INITIAL_LIMIT)}
                    </span>
                  </button>
                  {remaining > INITIAL_LIMIT && (
                    <button
                      type="button"
                      onClick={() => setLimits((prev) => ({ ...prev, [set.id]: books.length }))}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-sm font-bold text-body transition hover:border-line-strong hover:text-ink"
                    >
                      {fill(t.showAll, { n: books.length })}
                    </button>
                  )}
                </div>
              )}
            </section>
            );
          })}
        </div>
      )}
      {openBook && (
        <BookModal
          key={openSet?.id ?? "x"}
          book={openBook}
          siblings={openSiblings}
          setLabel={openSet ? setName(openSet, locale) : null}
          locale={locale}
          t={t}
          onSelect={setOpenId}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
