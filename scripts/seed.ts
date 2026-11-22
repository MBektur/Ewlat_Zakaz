/**
 * Başlangıç verisini yazar. Slug'a göre günceller (upsert), bu yüzden
 * tekrar çalıştırmak güvenlidir. Ön siparişlere dokunmaz.
 */
import { and, eq, inArray, notInArray, sql } from "drizzle-orm";
import { seedBooks, seedSets } from "../src/data/seed-data";
import { db, pool, schema } from "./lib/db";

async function main() {
  const { sets, books, bookSets } = schema;

  await db.transaction(async (tx) => {
    const setRows = await tx
      .insert(sets)
      .values(seedSets.map((s) => ({ ...s, isPlaceholder: s.isPlaceholder ?? false })))
      .onConflictDoUpdate({
        target: sets.slug,
        set: {
          nameTr: sql`excluded.name_tr`,
          nameUg: sql`excluded.name_ug`,
          descriptionTr: sql`excluded.description_tr`,
          descriptionUg: sql`excluded.description_ug`,
          sortOrder: sql`excluded.sort_order`,
          isPlaceholder: sql`excluded.is_placeholder`,
        },
      })
      .returning({ id: sets.id, slug: sets.slug });
    const setId = new Map(setRows.map((r) => [r.slug, r.id]));

    const bookRows = await tx
      .insert(books)
      .values(
        seedBooks.map((seed) => {
          const { setSlug, position, ...b } = seed;
          void setSlug;
          void position;
          return {
          ...b,
          isPlaceholder: b.isPlaceholder ?? false,
          isFeatured: b.isFeatured ?? false,
          featuredOrder: b.featuredOrder ?? 0,
          };
        }),
      )
      .onConflictDoUpdate({
        target: books.slug,
        set: {
          titleTr: sql`excluded.title_tr`,
          titleUg: sql`excluded.title_ug`,
          topicTr: sql`excluded.topic_tr`,
          topicUg: sql`excluded.topic_ug`,
          coverUrl: sql`excluded.cover_url`,
          coverWidth: sql`excluded.cover_width`,
          coverHeight: sql`excluded.cover_height`,
          thicknessMm: sql`excluded.thickness_mm`,
          isPlaceholder: sql`excluded.is_placeholder`,
          isFeatured: sql`excluded.is_featured`,
          featuredOrder: sql`excluded.featured_order`,
          missingInfo: sql`excluded.missing_info`,
        },
      })
      .returning({ id: books.id, slug: books.slug });
    const bookId = new Map(bookRows.map((r) => [r.slug, r.id]));

    // Eski geçici örnek kayıtlar (seed'de olmayan yer tutucular) silinir
    await tx.delete(books).where(and(eq(books.isPlaceholder, true), notInArray(books.slug, seedBooks.map((b) => b.slug))));
    await tx.delete(sets).where(and(eq(sets.isPlaceholder, true), notInArray(sets.slug, seedSets.map((x) => x.slug))));

    const ids = [...bookId.values()];
    await tx.delete(bookSets).where(inArray(bookSets.bookId, ids));
    await tx.insert(bookSets).values(
      seedBooks.map((b) => ({
        bookId: bookId.get(b.slug)!,
        setId: setId.get(b.setSlug)!,
        position: b.position,
      })),
    );
  });

  const counts = await db.execute<{ set: string; n: number }>(sql`
    select s.name_tr as set, count(bs.book_id)::int as n
    from sets s left join book_sets bs on bs.set_id = s.id
    group by s.id order by s.sort_order`);
  console.log(`✓ ${seedSets.length} set, ${seedBooks.length} kitap yazıldı.`);
  console.table(counts.rows);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
