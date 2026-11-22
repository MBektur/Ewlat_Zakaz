/**
 * data/kitap-adlari.csv içindeki kitap adlarını src/data/catalog.generated.json dosyasına işler.
 *
 *   npm run titles:apply        sonra: npm run db:seed   (veri tabanını güncellemek için)
 *
 * Sütunlar: set_slug;sira;ad_tr;ad_ug;konu_tr;konu_ug
 * Yalnızca DOLU hücreler işlenir; girdiğiniz değer "doğrulandı" sayılır ve ilgili uyarı işaretini kaldırır.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

const FILE = "src/data/catalog.generated.json";
const catalog = JSON.parse(readFileSync(FILE, "utf8")) as {
  sets: unknown[];
  books: Array<Record<string, unknown> & { slug: string; setSlug: string; position: number; missingInfo: string[] }>;
};
const rows: Array<Record<string, string>> = parse(readFileSync("data/kitap-adlari.csv"), {
  columns: (h: string[]) => h.map((c) => c.trim().toLowerCase()),
  delimiter: [";", ","],
  bom: true,
  skip_empty_lines: true,
  trim: true,
});

const drop = (b: { missingInfo: string[] }, ...codes: string[]) => (b.missingInfo = b.missingInfo.filter((m) => !codes.includes(m)));
let changed = 0;
for (const r of rows) {
  const b = catalog.books.find((x) => x.setSlug === r.set_slug && x.position === Number(r.sira));
  if (!b) {
    console.warn(`! Bulunamadı: ${r.set_slug} #${r.sira}`);
    continue;
  }
  if (r.ad_tr) { b.titleTr = r.ad_tr; drop(b, "title_tr", "verify_title_tr"); changed++; }
  if (r.ad_ug) { b.titleUg = r.ad_ug; drop(b, "title_ug", "verify_title_ug"); changed++; }
  if (r.konu_tr) { b.topicTr = r.konu_tr; drop(b, "verify_topic_tr"); changed++; }
  if (r.konu_ug) { b.topicUg = r.konu_ug; changed++; }
}
writeFileSync(FILE, JSON.stringify(catalog, null, 1) + "\n");
console.log(`${changed} alan güncellendi. Veri tabanı için: npm run db:seed`);
