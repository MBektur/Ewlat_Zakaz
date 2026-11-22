import type { Locale } from "@/i18n/config";
import { bookLabel, fill } from "@/lib/format";
import type { CatalogBook } from "@/lib/types";

type Props = {
  book: CatalogBook;
  locale: Locale;
  setLabel?: string | null;
  untitled: string;
  volumeLabel: string;
  placeholderBadge: string;
  align?: "center" | "start";
};

/** Kitabın altındaki ad / konu / set satırları. Eksik bilgi uydurulmaz. */
export function BookCaption({ book, locale, setLabel, untitled, volumeLabel, placeholderBadge, align = "center" }: Props) {
  const label = bookLabel(book, locale);
  const alignClass = align === "center" ? "text-center items-center" : "text-start items-start";
  return (
    <div className={`flex flex-col gap-1 ${alignClass}`}>
      {label.title ? (
        <p
          className={`leading-snug text-ink ${label.titleIsUg && locale === "tr" ? "ug-text" : "font-medium"}`}
          dir={label.titleIsUg ? "rtl" : undefined}
          lang={label.titleIsUg ? "ug" : undefined}
        >
          {label.title}
        </p>
      ) : book.isPlaceholder ? (
        <p className="text-sm italic text-muted">{untitled}</p>
      ) : null}
      <p className="text-sm text-muted">
        {[label.topic, setLabel, book.position ? fill(volumeLabel, { n: book.position }) : null]
          .filter(Boolean)
          .join(" · ")}
      </p>
      {book.isPlaceholder && (
        <span className="mt-1 rounded-full border border-dashed border-line-strong px-2.5 py-0.5 text-xs text-muted">
          {placeholderBadge}
        </span>
      )}
    </div>
  );
}
