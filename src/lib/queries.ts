import "server-only";
import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, schema } from "@/db";
import { demoCatalog, demoFeatured, demoPricing } from "./demo-data";
import { isDemo } from "./demo";
import type { Catalog, CatalogBook, CatalogSet, Pricing } from "./types";

/** Admin değişikliklerinden sonra updateTag(CATALOG_TAG) ile tazelenir. */
export const CATALOG_TAG = "catalog";
export const SETTINGS_TAG = "settings";

/** Görünür bütün setler ve kitaplar. Katalog, carousel ve form bu tek sorgudan beslenir. */
export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  if (isDemo()) return demoCatalog();

  const { sets, books, bookSets } = schema;

  const [setRows, bookRows, links] = await Promise.all([
    db.select().from(sets).orderBy(asc(sets.sortOrder), asc(sets.id)),
    db.select().from(books).where(eq(books.isVisible, true)).orderBy(asc(books.id)),
    db.select().from(bookSets).orderBy(asc(bookSets.setId), asc(bookSets.position)),
  ]);

  const visibleIds = new Set(bookRows.map((b) => b.id));
  const firstLink = new Map<number, { setId: number; position: number }>();
  const setOrder = new Map(setRows.map((s, i) => [s.id, i]));
  for (const l of links) {
    const current = firstLink.get(l.bookId);
    // Birden fazla setteyse, sıralamada önce gelen seti esas al.
    if (!current || setOrder.get(l.setId)! < setOrder.get(current.setId)!) {
      firstLink.set(l.bookId, { setId: l.setId, position: l.position });
    }
  }

  const catalogBooks: CatalogBook[] = bookRows.map((b) => ({
    id: b.id,
    slug: b.slug,
    titleTr: b.titleTr,
    titleUg: b.titleUg,
    topicTr: b.topicTr,
    topicUg: b.topicUg,
    coverUrl: b.coverUrl,
    coverWidth: b.coverWidth,
    coverHeight: b.coverHeight,
    thicknessMm: b.thicknessMm,
    isPlaceholder: b.isPlaceholder,
    setId: firstLink.get(b.id)?.setId ?? null,
    position: firstLink.get(b.id)?.position ?? 0,
  }));

  const catalogSets: CatalogSet[] = setRows.map((s) => ({
    id: s.id,
    slug: s.slug,
    nameTr: s.nameTr,
    nameUg: s.nameUg,
    descriptionTr: s.descriptionTr,
    descriptionUg: s.descriptionUg,
    isPlaceholder: s.isPlaceholder,
    bookIds: links.filter((l) => l.setId === s.id && visibleIds.has(l.bookId)).map((l) => l.bookId),
  }));

  return { sets: catalogSets, books: catalogBooks };
}

/** Ana sayfa carousel'i: admin'de "carousel'de göster" işaretli kitaplar. */
export async function getFeaturedBooks(): Promise<CatalogBook[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  if (isDemo()) return demoFeatured();

  const { books } = schema;
  const featured = await db
    .select({ id: books.id })
    .from(books)
    .where(eq(books.isFeatured, true))
    .orderBy(asc(books.featuredOrder), asc(books.id));

  const catalog = await getCatalog();
  const byId = new Map(catalog.books.map((b) => [b.id, b]));
  return featured.map((f) => byId.get(f.id)).filter((b): b is CatalogBook => !!b);
}

/** Fiyat ve kampanya ayarları. Admin değiştirince updateTag(SETTINGS_TAG). */
export async function getPricing(): Promise<Pricing> {
  "use cache";
  cacheLife("hours");
  cacheTag(SETTINGS_TAG);
  return readPricing();
}

/** Önbelleksiz okuma (sipariş kaydında güncel fiyat için). */
export async function readPricing(): Promise<Pricing> {
  if (isDemo()) return demoPricing;
  const [row] = await db.select().from(schema.settings).where(eq(schema.settings.id, 1));
  return {
    campaignPriceTry: row?.campaignPriceTry ?? 8500,
    campaignEndsAt: row?.campaignEndsAt?.toISOString() ?? null,
    regularPriceTry: row?.regularPriceTry ?? null,
    preordersOpen: row?.preordersOpen ?? true,
  };
}
