/**
 * Başlangıç verisini yazar. Slug'a göre günceller (upsert), bu yüzden
 * tekrar çalıştırmak güvenlidir. Ön siparişlere dokunmaz.
 */
import path from "node:path";
import { inArray, sql } from "drizzle-orm";
import sharp from "sharp";
import { seedBooks, seedSets } from "../src/data/seed-data";
import { db, pool, schema } from "./lib/db";

/** public/ altındaki kapak dosyasının gerçek piksel ölçüsü. */
async function coverDimensions(coverUrl: string) {
  const file = path.join(process.cwd(), "public", coverUrl);
  const meta = await sharp(file).metadata();
  if (!meta.width || !meta.height) throw new Error(`Ölçü okunamadı: ${file}`);
  // EXIF döndürmesi varsa (90°/270°) en ve boy yer değiştirir
  const rotated = (meta.orientation ?? 1) >= 5;
  return rotated ? { w: meta.height, h: meta.width } : { w: meta.width, h: meta.height };
}

async function main() {
  const { sets, books, bookSets } = schema;

  for (const b of seedBooks) {
    if (!b.coverUrl) continue;
    const { w, h } = await coverDimensions(b.coverUrl);
    b.coverWidth = w;
    b.coverHeight = h;
  }

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
