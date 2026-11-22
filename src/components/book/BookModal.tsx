"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ChevronLeft, ChevronRight, ShoppingBag, X } from "lucide-react";
import { Book3D } from "@/components/book/Book3D";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import type { Dictionary } from "@/i18n/dictionaries";
import { bookLabel, fill } from "@/lib/format";
import type { CatalogBook } from "@/lib/types";

type Props = {
  book: CatalogBook;
  /** Kitabın bulunduğu setin tüm kitapları (küçük resim şeridi ve gezinme bunlar üzerinden). */
  siblings: CatalogBook[];
  setLabel: string | null;
  locale: Locale;
  t: Dictionary["catalog"];
  onSelect: (id: number) => void;
  onClose: () => void;
};

/** Kitap ayrıntı penceresi (yerel <dialog>): Esc ve dışına tıklama ile kapanır, ok tuşlarıyla gezilir. */
export function BookModal({ book, siblings, setLabel, locale, t, onSelect, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(6);
  const index = Math.max(0, siblings.findIndex((b) => b.id === book.id));
  const total = siblings.length;
  const selectAt = (i: number) => {
    const target = siblings[i];
    if (target) onSelect(target.id);
  };
  const onPrev = index > 0 ? () => selectAt(index - 1) : undefined;
  const onNext = index < total - 1 ? () => selectAt(index + 1) : undefined;
  const rtl = locale === "ug";
  const label = bookLabel(book, locale);
  const otherTitle = locale === "tr" ? book.titleUg : book.titleTr;
  const title = label.title ?? [setLabel, fill(t.volume, { n: book.position })].filter(Boolean).join(" · ");

  useEffect(() => {
    const dlg = ref.current;
    if (dlg && !dlg.open) dlg.showModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Küçük resim şeridindeki sütun sayısı (yukarı/aşağı ok bir satır atlar)
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measure = () => setCols(Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(" ").length));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    return () => ro.disconnect();
  }, []);

  // Etkin küçük resim görünür kalsın
  useEffect(() => {
    gridRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [book.id]);

  // Sol/sağ: önceki/sonraki (RTL'de tersi). Yukarı/aşağı: bir satır geri/ileri.
  function onKeyDown(e: React.KeyboardEvent) {
    const step = { ArrowLeft: rtl ? 1 : -1, ArrowRight: rtl ? -1 : 1, ArrowUp: -cols, ArrowDown: cols }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    const next = Math.min(total - 1, Math.max(0, index + step));
    if (next !== index) selectAt(next);
  }

  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;
  const navBtn = "flex size-11 items-center justify-center rounded-full border border-line-strong bg-surface text-ink shadow-soft transition hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-35";

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto max-h-[92dvh] w-[min(94vw,980px)] overflow-hidden rounded-[2rem] bg-surface p-0 text-ink shadow-lift backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div className="relative grid max-h-[92dvh] overflow-y-auto md:grid-cols-[minmax(280px,0.9fr)_1fr]">
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="absolute end-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-surface/90 text-ink shadow-soft transition hover:bg-soft"
        >
          <X className="size-5" strokeWidth={2.4} />
        </button>

        <div className="flex items-end justify-center bg-gradient-to-b from-soft to-[#ffe9d6] px-6 pb-6 pt-12">
          <Book3D key={book.id} book={book} maxWidth={260} maxHeight={340} alt={title} placeholderLabel={t.placeholderBadge} priority binding={rtl ? "right" : "right"} />
        </div>

        <div className="flex flex-col p-6 pt-14 sm:p-8 sm:pt-14">
          {setLabel && (
            <p className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-extrabold text-primary">{setLabel}</p>
          )}
          <h2
            className={`mt-3 text-2xl leading-snug sm:text-3xl ${label.titleIsUg ? "ug-text" : "font-display"}`}
            dir={label.titleIsUg ? "rtl" : undefined}
            lang={label.titleIsUg ? "ug" : undefined}
          >
            {label.title ?? <span className="text-muted">{title}</span>}
          </h2>
          {otherTitle && label.title && otherTitle !== label.title && (
            <p className={`mt-1 text-lg text-body ${locale === "tr" ? "ug-text" : ""}`} dir={locale === "tr" ? "rtl" : undefined}>
              {otherTitle}
            </p>
          )}

          <dl className="mt-5 space-y-2.5 text-sm">
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 font-bold text-muted">{t.setLabel}</dt>
              <dd className="font-semibold text-ink">
                {setLabel ?? "—"} · {fill(t.volume, { n: book.position })}
              </dd>
            </div>
            {label.topic && (
              <div className="flex gap-3">
                <dt className="w-16 shrink-0 font-bold text-muted">{t.topicLabel}</dt>
                <dd className="font-semibold text-ink">{label.topic}</dd>
              </div>
            )}
          </dl>
          {book.isPlaceholder && <p className="mt-4 text-sm italic text-muted">{t.untitled}</p>}

          <div className="mt-auto pt-6">
            <p className="text-sm text-muted">{t.modalHint}</p>
            <Link
              href={localePath(locale, "preorder")}
              className="btn-coral mt-3 inline-flex items-center gap-2 rounded-full px-6 py-3 font-extrabold"
            >
              <ShoppingBag className="size-5" strokeWidth={2.4} />
              {t.preorderAll}
            </Link>

            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <button type="button" onClick={onPrev} disabled={!onPrev} aria-label={t.prevBook} className={navBtn}>
                <PrevIcon className="size-5" strokeWidth={2.6} />
              </button>
              <span dir="ltr" className="text-sm font-bold text-muted">{fill(t.position, { n: index + 1, total })}</span>
              <button type="button" onClick={onNext} disabled={!onNext} aria-label={t.nextBook} className={navBtn}>
                <NextIcon className="size-5" strokeWidth={2.6} />
              </button>
            </div>
          </div>
        </div>

        {/* Setin tüm kitapları: pencerenin tam genişliğinde, 40–50 kitap kaydırmadan (masaüstünde) sığar */}
        {total > 1 && (
          <div className="border-t border-line/60 bg-soft px-4 py-4 sm:px-6 md:col-span-2">
            <div
              ref={gridRef}
              role="group"
              aria-label={setLabel ?? undefined}
              className="grid max-h-[210px] grid-cols-[repeat(auto-fill,minmax(38px,44px))] justify-center gap-1.5 overflow-y-auto p-1 md:max-h-[320px]"
            >
              {siblings.map((b, i) => {
                const active = b.id === book.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => selectAt(i)}
                    aria-current={active ? "true" : undefined}
                    aria-label={`${bookLabel(b, locale).title ?? fill(t.volume, { n: b.position })}`}
                    className={`relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-md bg-white transition ${
                      active ? "ring-2 ring-primary ring-offset-2 ring-offset-soft" : "opacity-75 hover:opacity-100"
                    }`}
                  >
                    {b.coverUrl ? (
                      <Image src={b.coverUrl} alt="" fill sizes="64px" className="object-contain" />
                    ) : (
                      <span className="text-xs font-bold text-muted">{b.position}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Alt bilgi: klavye ile gezinme ipucu (dokunmatik ekranlarda gizli) */}
        {total > 1 && (
          <div className="sticky bottom-0 hidden items-center justify-center gap-3 border-t border-line bg-surface px-4 py-3 text-sm text-muted md:col-span-2 md:flex">
            <span dir="ltr" className="flex items-center gap-1" aria-hidden="true">
              {[ArrowUp, ArrowDown, ArrowLeft, ArrowRight].map((Icon, i) => (
                <kbd key={i} className="flex size-7 items-center justify-center rounded-md border border-line-strong bg-soft text-ink shadow-[0_1px_0_rgb(0_0_0/0.12)]">
                  <Icon className="size-4" strokeWidth={2.6} />
                </kbd>
              ))}
            </span>
            <span className="font-semibold">{t.keyHint}</span>
          </div>
        )}
      </div>
    </dialog>
  );
}
