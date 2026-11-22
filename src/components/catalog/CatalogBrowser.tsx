"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Search, X } from "lucide-react";

const INITIAL_LIMIT = 10;
import { Book3D, bookSize } from "@/components/book/Book3D";
import { BookCaption } from "@/components/book/BookCaption";
import { BookModal } from "@/components/book/BookModal";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { bookLabel, fill, setName } from "@/lib/format";
import type { Catalog, CatalogBook, CatalogSet } from "@/lib/types";

type Props = {
  catalog: Catalog;
  locale: Locale;
  t: Dictionary["catalog"];
  initialSet?: string;
  initialQuery?: string;
};

/** URL'deki ?set= ve ?q= değerleriyle başlar ve tarayıcı parametrelerindeki değişiklikleri izler. */
export function CatalogFromUrl(props: Props) {
  const params = useSearchParams();
  const set = params.get("set") ?? props.initialSet ?? "";
  const q = params.get("q") ?? props.initialQuery ?? "";
  return <CatalogBrowser {...props} initialSet={set} initialQuery={q} />;
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
}: Props) {
  const [activeSet, setActiveSet] = useState(initialSet);
  const [query, setQuery] = useState(initialQuery);
  const [openId, setOpenId] = useState<number | null>(null);
  // Her set için görüntülenen kitap sayısı; key = set.id
  const [limits, setLimits] = useState<Record<number, number>>({});

  // initialSet veya initialQuery prop'u dışarıdan değiştiğinde render anında senkronize et
  const [prevInitialSet, setPrevInitialSet] = useState(initialSet);
  if (prevInitialSet !== initialSet) {
    setPrevInitialSet(initialSet);
    setActiveSet(initialSet);
  }

  const [prevInitialQuery, setPrevInitialQuery] = useState(initialQuery);
  if (prevInitialQuery !== initialQuery) {
    setPrevInitialQuery(initialQuery);
    setQuery(initialQuery);
  }

  // Tarayıcı geri/ileri düğmelerinde URL'deki parametreleri state'e yansıt
  useEffect(() => {
    const handlePopState = () => {
      const sp = new URLSearchParams(window.location.search);
      setActiveSet(sp.get("set") ?? "");
      setQuery(sp.get("q") ?? "");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const booksById = useMemo(() => new Map(catalog.books.map((b) => [b.id, b])), [catalog.books]);
  const sets = useMemo(() => catalog.sets.filter((s) => s.bookIds.length > 0), [catalog.sets]);

  // URL'yi sayfa yenilemeden güncelle (paylaşılabilir filtre linkleri)
  function syncUrl(nextSet: string, nextQuery: string, replace = false) {
    const params = new URLSearchParams(window.location.search);
    if (nextSet) {
      params.set("set", nextSet);
    } else {
      params.delete("set");
    }
    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    } else {
      params.delete("q");
    }
    const qs = params.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    if (replace) {
      window.history.replaceState(null, "", newUrl);
    } else {
      window.history.pushState(null, "", newUrl);
    }
  }

  const activeNorm = activeSet.trim().toLowerCase();

  const groups = useMemo(() => {
    const q = normalize(query.trim());
    const matches = (book: CatalogBook, setLabel: string) => {
      if (!q) return true;
      return [book.titleTr, book.titleUg, book.topicTr, book.topicUg, setLabel]
        .filter(Boolean)
        .some((v) => normalize(v!).includes(q));
    };
    const matchesSet = (s: CatalogSet) => {
      if (!activeNorm) return true;
      return s.slug.toLowerCase() === activeNorm || String(s.id) === activeNorm;
    };
    return sets
      .filter(matchesSet)
      .map((s) => {
        const label = setName(s, locale);
        const otherLabel = locale === "ug" ? s.nameTr : (s.nameUg ?? "");
        const books = s.bookIds
          .map((id) => booksById.get(id))
          .filter((b): b is CatalogBook => !!b && (matches(b, label) || (!!otherLabel && normalize(otherLabel).includes(q))));
        return { set: s, label, books };
      })
      .filter((g) => g.books.length > 0);
  }, [sets, activeNorm, query, locale, booksById]);

  const total = groups.reduce((n, g) => n + g.books.length, 0);
  const filtered = !!activeNorm || !!query.trim();

  // URL'deki set'e göre sekme başlığını güncelle
  useEffect(() => {
    if (activeNorm) {
      const match = sets.find((s) => s.slug.toLowerCase() === activeNorm || String(s.id) === activeNorm);
      if (match) {
        document.title = `${setName(match, locale)} · ${t.title}`;
        return;
      }
    }
    document.title = `${t.title} · ${locale === "ug" ? "ئەۋلاد كىتاب" : "Evlat Kitap"}`;
  }, [activeNorm, sets, locale, t.title]);

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
                syncUrl(activeSet, e.target.value, true);
              }}
              placeholder={t.search}
              className="w-full rounded-full border border-line bg-surface py-2.5 pe-4 ps-10 text-ink outline-none transition placeholder:text-muted/80 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t.allSets}>
            {[
              { id: 0, slug: "", label: t.allSets, count: catalog.books.length },
              ...sets.map((s) => ({ id: s.id, slug: s.slug, label: setName(s, locale), count: s.bookIds.length })),
            ].map((chip) => {
              const isSelected = chip.slug
                ? activeNorm === chip.slug.toLowerCase() || activeNorm === String(chip.id)
                : !activeNorm;
              return (
                <button
                  key={chip.slug || "all"}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setActiveSet(chip.slug);
                    syncUrl(chip.slug, query, false);
                  }}
                  className="rounded-full border border-line bg-surface px-3.5 py-2 text-sm text-body transition hover:border-line-strong hover:text-ink aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-surface"
                >
                  {chip.label}
                  <span className="ms-1.5 opacity-60">{chip.count}</span>
                </button>
              );
            })}
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
                syncUrl("", "", false);
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
          {groups.map(({ set, label, books }, gIdx) => {
            const limit = limits[set.id] ?? INITIAL_LIMIT;
            const visible = books.slice(0, limit);
            const remaining = books.length - visible.length;
            const allShown = remaining <= 0;

            return (
            <section
              key={set.id}
              aria-labelledby={`set-${set.id}`}
              style={{ contentVisibility: "auto", containIntrinsicSize: "0 460px" }}
            >
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
                {visible.map((book, bookIdx) => (
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
                        priority={gIdx === 0 && bookIdx < 4}
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
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setLimits((prev) => ({ ...prev, [set.id]: (prev[set.id] ?? INITIAL_LIMIT) + INITIAL_LIMIT }))
                    }
                    className="btn-coral group inline-flex items-center gap-2.5 rounded-full px-7 py-3 text-sm font-extrabold transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <ChevronDown className="size-4.5 transition-transform group-hover:translate-y-0.5" strokeWidth={2.8} />
                    <span>{t.loadMore}</span>
                    <span className="rounded-full bg-black/15 px-2 py-0.5 text-xs font-black text-white">
                      +{Math.min(remaining, INITIAL_LIMIT)}
                    </span>
                  </button>
                  {remaining > INITIAL_LIMIT && (
                    <button
                      type="button"
                      onClick={() => setLimits((prev) => ({ ...prev, [set.id]: books.length }))}
                      className="inline-flex items-center gap-1.5 rounded-full border-2 border-line-strong bg-surface px-5 py-2.5 text-sm font-bold text-ink shadow-soft transition hover:border-primary hover:text-primary active:scale-95"
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
