/**
 * 154 kitabı CSV'den içe aktarır.
 *
 *   npm run import:books -- <dosya.csv> [--covers <klasör>] [--dry-run]
 *
 * Şablon: data/kitaplar-sablon.csv (ayraç ; ya da , olabilir)
 * Sütunlar: set_slug, set_ad_tr, set_ad_ug, sira, ad_tr, ad_ug, konu_tr, konu_ug,
 *           kapak_dosyasi (covers klasörüne göre yol), kalinlik_mm, carousel (evet/boş)
 *
 * Kurallar (yönerge): adlar ve set eşleşmeleri değiştirilmez, eksikler uydurulmaz,
 * missing_info ile işaretlenir. Kitap kimliği set_slug + sıra'dır; tekrar çalıştırmak
 * aynı kitabı günceller. Kapaklar sRGB'ye çevrilip veritabanına yazılır, ölçüler
 * dosyanın kendisinden okunur.
 */
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { eq, sql } from "drizzle-orm";
import sharp from "sharp";
import { db, pool, schema } from "./lib/db";
import { slugify } from "../src/lib/slug";

type Row = Record<string, string>;

const args = process.argv.slice(2);
const csvPath = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--covers");
const coversDir = args.includes("--covers") ? args[args.indexOf("--covers") + 1] : path.dirname(csvPath ?? ".");
const dryRun = args.includes("--dry-run");

const get = (r: Row, ...keys: string[]) => {
  for (const k of keys) if (r[k]?.trim()) return r[k].trim();
  return "";
};

async function processCover(file: string) {
  const { data, info } = await sharp(file)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .toColorspace("srgb")
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

async function main() {
  if (!csvPath || !existsSync(csvPath)) {
    console.error("Kullanım: npm run import:books -- <dosya.csv> [--covers <klasör>] [--dry-run]");
    process.exit(1);
  }
  const rows: Row[] = parse(readFileSync(csvPath), {
    columns: (h: string[]) => h.map((c) => c.trim().toLowerCase()),
    delimiter: [";", ","],
    bom: true,
    skip_empty_lines: true,
    trim: true,
  });

  const problems: string[] = [];
  const missingReport: string[] = [];
  const seen = new Set<string>();
  let written = 0;

  for (const [i, r] of rows.entries()) {
    const line = i + 2;
    const setSlug = slugify(get(r, "set_slug") || get(r, "set_ad_tr"));
    const position = Number(get(r, "sira"));
    if (!setSlug) {
      problems.push(`Satır ${line}: set bilgisi yok, atlandı.`);
      continue;
    }
    if (!Number.isInteger(position) || position < 1) {
      problems.push(`Satır ${line}: geçersiz sıra "${get(r, "sira")}", atlandı.`);
      continue;
    }
    const slug = `${setSlug}-${String(position).padStart(2, "0")}`;
    if (seen.has(slug)) {
      problems.push(`Satır ${line}: ${setSlug} setinde ${position}. sıra iki kez var, atlandı.`);
      continue;
    }
    seen.add(slug);

    const titleTr = get(r, "ad_tr") || null;
    const titleUg = get(r, "ad_ug") || null;
    const thicknessRaw = get(r, "kalinlik_mm").replace(",", ".");
    const thicknessMm = thicknessRaw ? Number(thicknessRaw) : NaN;
    const coverRel = get(r, "kapak_dosyasi");
    const coverFile = coverRel ? path.resolve(coversDir, coverRel) : "";

    const missing: string[] = [];
    if (!titleTr) missing.push("title_tr");
    if (!titleUg) missing.push("title_ug");
    if (!coverRel) missing.push("cover");
    else if (!existsSync(coverFile)) {
      missing.push("cover");
      problems.push(`Satır ${line}: kapak dosyası bulunamadı: ${coverRel}`);
    }
    if (!Number.isFinite(thicknessMm)) missing.push("thickness_mm");
    if (missing.length) missingReport.push(`${slug}: ${missing.join(", ")}`);

    if (dryRun) {
      written++;
      continue;
    }

    // Set: yoksa oluştur, adlar CSV'de varsa güncelle
    const setNameTr = get(r, "set_ad_tr") || setSlug;
    const [set] = await db
      .insert(schema.sets)
      .values({ slug: setSlug, nameTr: setNameTr, nameUg: get(r, "set_ad_ug") || null })
      .onConflictDoUpdate({
        target: schema.sets.slug,
        set: {
          nameTr: get(r, "set_ad_tr") ? setNameTr : sql`${schema.sets.nameTr}`,
          nameUg: get(r, "set_ad_ug") ? get(r, "set_ad_ug") : sql`${schema.sets.nameUg}`,
          isPlaceholder: false,
        },
      })
      .returning({ id: schema.sets.id });

    let cover: { url: string; width: number; height: number } | null = null;
    if (coverFile && existsSync(coverFile)) {
      const img = await processCover(coverFile);
      const id = randomBytes(12).toString("hex");
      await db.insert(schema.media).values({
        id,
        contentType: "image/jpeg",
        width: img.width,
        height: img.height,
        byteSize: img.data.length,
        data: img.data,
      });
      cover = { url: `/media/${id}`, width: img.width, height: img.height };
    }

    const [old] = await db.select({ coverUrl: schema.books.coverUrl }).from(schema.books).where(eq(schema.books.slug, slug));
    const values = {
      slug,
      titleTr,
      titleUg,
      topicTr: get(r, "konu_tr") || null,
      topicUg: get(r, "konu_ug") || null,
      coverUrl: cover?.url ?? old?.coverUrl ?? null,
      ...(cover ? { coverWidth: cover.width, coverHeight: cover.height } : {}),
      thicknessMm: Number.isFinite(thicknessMm) ? thicknessMm : 6,
      isPlaceholder: false,
      isFeatured: /^(evet|e|x|1|true|yes)$/i.test(get(r, "carousel")),
      featuredOrder: position,
      missingInfo: cover || old?.coverUrl ? missing.filter((m) => m !== "cover") : missing,
    };
    const [book] = await db
      .insert(schema.books)
      .values(values)
      .onConflictDoUpdate({ target: schema.books.slug, set: values })
      .returning({ id: schema.books.id });

    await db.delete(schema.bookSets).where(eq(schema.bookSets.bookId, book.id));
    await db.insert(schema.bookSets).values({ bookId: book.id, setId: set.id, position });
    if (cover && old?.coverUrl?.startsWith("/media/")) {
      await db.delete(schema.media).where(eq(schema.media.id, old.coverUrl.slice(7)));
    }
    written++;
  }

  console.log(`\n${dryRun ? "[DENEME] " : ""}CSV satırı: ${rows.length}, işlenen kitap: ${written}`);
  if (!dryRun) {
    const dist = await db.execute<{ set: string; kitap: number }>(sql`
      select s.name_tr as set, count(bs.book_id)::int as kitap
      from sets s left join book_sets bs on bs.set_id = s.id
      group by s.id order by s.sort_order, s.id`);
    const [{ total }] = (await db.execute<{ total: number }>(sql`select count(*)::int as total from books where is_visible`)).rows;
    console.log(`Veritabanındaki görünür kitap sayısı: ${total}`);
    console.table(dist.rows);
    console.log("Not: Sitedeki önbellek en geç 1 saat içinde yenilenir; hemen görmek için admin'de herhangi bir kitabı kaydedin.");
  }
  if (missingReport.length) {
    console.log(`\nEksik bilgisi olan ${missingReport.length} kitap:`);
    for (const m of missingReport) console.log("  - " + m);
  }
  if (problems.length) {
    console.log(`\nSorunlar (${problems.length}):`);
    for (const p of problems) console.log("  ! " + p);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
