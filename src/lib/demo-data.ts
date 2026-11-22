import { seedBooks, seedSets } from "@/data/seed-data";
import type { Catalog, CatalogBook, Pricing } from "./types";

/** Veri tabanı yokken katalog, seed verisinden kurulur (kimlikler sıraya göre verilir). */
export function demoCatalog(): Catalog {
  const sets = [...seedSets]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s, i) => ({
      id: i + 1,
      slug: s.slug,
      nameTr: s.nameTr,
      nameUg: s.nameUg,
      descriptionTr: s.descriptionTr ?? null,
      descriptionUg: s.descriptionUg ?? null,
      isPlaceholder: !!s.isPlaceholder,
      bookIds: [] as number[],
    }));
  const setId = new Map(sets.map((s) => [s.slug, s.id]));

  const books: CatalogBook[] = seedBooks.map((b, i) => ({
    id: i + 1,
    slug: b.slug,
    titleTr: b.titleTr,
    titleUg: b.titleUg,
    topicTr: b.topicTr ?? null,
    topicUg: b.topicUg ?? null,
    coverUrl: b.coverUrl,
    // Gerçek kapaklar 900×1292 px olarak hazırlandı (seed 0 bırakır, dosyadan okur)
    coverWidth: b.coverWidth || 900,
    coverHeight: b.coverHeight || 1292,
    thicknessMm: b.thicknessMm,
    isPlaceholder: !!b.isPlaceholder,
    setId: setId.get(b.setSlug) ?? null,
    position: b.position,
  }));

  for (const set of sets) {
    set.bookIds = books
      .filter((b) => b.setId === set.id)
      .sort((a, b) => a.position - b.position)
      .map((b) => b.id);
  }
  return { sets, books };
}

export function demoFeatured(): CatalogBook[] {
  const catalog = demoCatalog();
  return seedBooks
    .map((b, i) => ({ seed: b, book: catalog.books[i] }))
    .filter(({ seed }) => seed.isFeatured)
    .sort((a, b) => (a.seed.featuredOrder ?? 0) - (b.seed.featuredOrder ?? 0))
    .map(({ book }) => book);
}

export const demoPricing: Pricing = {
  campaignPriceTry: 8500,
  campaignEndsAt: null,
  regularPriceTry: null,
  preordersOpen: true,
};
