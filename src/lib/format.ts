import type { Locale } from "@/i18n/config";
import type { CatalogBook, CatalogSet } from "./types";

/** "{n} kitap" gibi şablonları doldurur. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

export function setName(set: Pick<CatalogSet, "nameTr" | "nameUg">, locale: Locale) {
  return locale === "ug" ? (set.nameUg ?? set.nameTr) : set.nameTr;
}

export type BookLabel = {
  /** Gösterilecek ana başlık; yoksa null (arayüz "adı henüz eklenmedi" der). */
  title: string | null;
  /** Başlık Arap harfli Uygurca mı? (RTL ve Lateef fontu için) */
  titleIsUg: boolean;
  topic: string | null;
};

/**
 * Türkçe arayüzde Türkçe ad yoksa Uygurca adı gösterir (uydurma çeviri yapmaz).
 * Uygurca arayüzde Uygurca ad yoksa Türkçe ada düşer.
 */
export function bookLabel(book: CatalogBook, locale: Locale): BookLabel {
  if (locale === "ug") {
    return {
      title: book.titleUg ?? book.titleTr,
      titleIsUg: !!book.titleUg,
      topic: book.topicUg ?? book.topicTr,
    };
  }
  return {
    title: book.titleTr ?? book.titleUg,
    titleIsUg: !book.titleTr && !!book.titleUg,
    topic: book.topicTr ?? book.topicUg,
  };
}
