/**
 * Kapak klasöründen (Downloads/kapaklar) 154 kitaplık kataloğu üretir.
 *
 *   npx tsx scripts/import-covers.ts [kaynak-klasör]
 *
 * - Yalnızca UYGURCA kapakları alır (Türkçe baskı kapakları ve tanıtım görselleri kullanılmaz).
 * - Her kapağı sRGB'ye çevirir, en uzun kenarı 800 px'e küçültür, AVIF (kalite 45) olarak
 *   public/covers/<set>/<NN>.avif yazar. Oran korunur, 3D kitap bu orandan çizilir.
 * - PDF kapaklarını (atlaslar, Doppa Diyarı) ghostscript ile görsele çevirip ön kapağı kırpar.
 * - Sonucu src/data/catalog.generated.json dosyasına yazar (db:seed ve önizleme modu bunu kullanır).
 * Liste, Ewlat Yayınları ilanındaki 154 kitaplık dökümdür (145 seri + 3 atlas + 6 tekil kitap).
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const SRC = process.argv[2] ?? path.join(os.homedir(), "Downloads", "kapaklar");
const OUT_DIR = "public/covers";
const MAX_SIDE = 800;
const AVIF_QUALITY = 45;

type Book = {
  slug: string;
  setSlug: string;
  position: number;
  titleTr: string | null;
  titleUg: string | null;
  topicTr: string | null;
  topicUg: string | null;
  coverUrl: string | null;
  coverWidth: number;
  coverHeight: number;
  thicknessMm: number;
  isPlaceholder: boolean;
  isFeatured: boolean;
  featuredOrder: number;
  missingInfo: string[];
};
type SetDef = { slug: string; nameTr: string; nameUg: string; descriptionTr: string; descriptionUg: string; sortOrder: number };

// ───────────── Setler (ad ve açıklama: ilan metni) ─────────────
const sets: SetDef[] = [
  { slug: "mini-masallar", nameTr: "Mini Masallar", nameUg: "سەبىيلەر ئۈچۈن مەسەللەر", descriptionTr: "50 kısımlık resimli kitapçık. Küçük çocuklarda ahlak ve fazilet geliştirmeye yönelik içerikler.", descriptionUg: "50 قىسىملىق رەسىملىك كىتابچە بولۇپ، سەبىي بالىلاردا ئەخلاق-پەزىلەت يېتىلدۈرۈشكە دائىر مەزمۇنلار سۆزلەنگەن.", sortOrder: 1 },
  { slug: "hikayelerle-dini-degerler", nameTr: "Hikayelerle Dini Değerler", nameUg: "ھېكايىلەر ئارقىلىق مۇسۇلمانلىقنى ئۆگىنەيلى", descriptionTr: "10 kısımlık resimli kitapçık.", descriptionUg: "10 قىسىملىق رەسىملىك كىتابچە.", sortOrder: 2 },
  { slug: "kirk-hadis-kirk-hikaye", nameTr: "Kırk Hadis 40 Hikâye", nameUg: "قىرىق ھەدىس 40 ھېكايە", descriptionTr: "40 kısımlık resimli hikâyeler.", descriptionUg: "40 قىسىملىق رەسىملىك ھېكايىلەر.", sortOrder: 3 },
  { slug: "ayetlerle-dini-degerler", nameTr: "Ayetlerle Dini Değerler", nameUg: "ئايەتلەر ئارقىلىق مۇسۇلمانلىقنى ئۆگىنەيلى", descriptionTr: "10 kısımlık resimli kitapçık.", descriptionUg: "10 قىسىملىق رەسىملىك كىتابچە.", sortOrder: 4 },
  { slug: "peygamberimizin-hayati", nameTr: "Peygamberimizin Hayatı", nameUg: "پەيغەمبىرىمىزنىڭ ھاياتى", descriptionTr: "10 kısımlık resimli siyer kitabı.", descriptionUg: "10 قىسىملىق رەسىملىك سىيرەت كىتابى.", sortOrder: 5 },
  { slug: "allahi-merak-ediyorum", nameTr: "Allah'ı Merak Ediyorum", nameUg: "ئاللاھنى بىلگۈم بار", descriptionTr: "Çocuklar için hazırlanmış 5 kısımlık resimli okuma kitabı.", descriptionUg: "سەبىيلەر ئۈچۈن تۈزۈلگەن 5 قىسىملىق رەسىملىك ئوقۇشلۇق.", sortOrder: 6 },
  { slug: "hadis-bahcesi", nameTr: "Hadis Bahçesi", nameUg: "ھەدىس باغچىسى", descriptionTr: "10 kısımlık resimli kitapçık.", descriptionUg: "10 قىسىملىق رەسىملىك كىتابچە.", sortOrder: 7 },
  { slug: "caylak-ile-filozof", nameTr: "Çaylak ile Filozof", nameUg: "گۆدەكجان بىلەن پەيلاسوپ", descriptionTr: "Genç ve ergenlerin düşünce pınarını açan 10 kısımlık kitap.", descriptionUg: "ياش-ئۆسمۈرلەرنىڭ تەپەككۇر بۇلىقىنى ئاچىدىغان 10 قىسىملىق كىتاب.", sortOrder: 8 },
  { slug: "atlas-kitaplari", nameTr: "Atlas Kitapları", nameUg: "ئاتلاس كىتابلىرى", descriptionTr: "Üç parça atlas kitap.", descriptionUg: "3 پارچە ئاتلاس كىتاب.", sortOrder: 9 },
  { slug: "tek-kitaplar", nameTr: "Tek Kitaplar", nameUg: "يەككە كىتابلار", descriptionTr: "Tek ciltlik kitaplar.", descriptionUg: "يەككە كىتابلار.", sortOrder: 10 },
];

// ───────────── Yardımcılar ─────────────
const nfc = (s: string) => s.normalize("NFC");
const listDir = (rel: string) => readdirSync(path.join(SRC, rel)).filter((f) => !f.startsWith("."));
/** macOS dosya adları NFD olabilir; eşleştirme NFC üzerinden yapılır. */
function findFile(rel: string, name: string) {
  const hit = listDir(rel).find((f) => nfc(f) === nfc(name));
  if (!hit) throw new Error(`Dosya bulunamadı: ${rel}/${name}`);
  return path.join(SRC, rel, hit);
}
const pad = (n: number) => String(n).padStart(2, "0");

let originalBytes = 0;
let outBytes = 0;
const report: string[] = [];

async function writeCover(input: string | Buffer, setSlug: string, position: number) {
  const rel = `${setSlug}/${pad(position)}.avif`;
  const abs = path.join(OUT_DIR, rel);
  mkdirSync(path.dirname(abs), { recursive: true });
  const { data, info } = await sharp(input, { failOn: "none" })
    .rotate()
    .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
    .toColorspace("srgb")
    .avif({ quality: AVIF_QUALITY, effort: 7 })
    .toBuffer({ resolveWithObject: true });
  writeFileSync(abs, data);
  outBytes += data.length;
  if (typeof input === "string") originalBytes += statSync(input).size;
  return { coverUrl: `/covers/${rel}`, coverWidth: info.width, coverHeight: info.height };
}

function blank(setSlug: string, position: number): Book {
  return {
    slug: `${setSlug}-${pad(position)}`,
    setSlug,
    position,
    titleTr: null,
    titleUg: null,
    topicTr: null,
    topicUg: null,
    coverUrl: null,
    coverWidth: 148,
    coverHeight: 210,
    thicknessMm: 4,
    isPlaceholder: false,
    isFeatured: false,
    featuredOrder: 0,
    missingInfo: ["title_tr", "title_ug", "thickness_mm"],
  };
}

/** Dosya adı kuralı: ilk kitap sonekiz, 2–9 ve 10 sayı soneklidir (…_01, …_012, …_0110). */
const numbered = (base: string, n: number) => `${base}${n === 1 ? "" : n}.jpg`;

const books: Book[] = [];

async function addSeries(setSlug: string, count: number, resolve: (n: number) => { rel: string; name: string }, opts: { thicknessMm: number }) {
  for (let n = 1; n <= count; n++) {
    const { rel, name } = resolve(n);
    const file = findFile(rel, name);
    const b = blank(setSlug, n);
    Object.assign(b, await writeCover(file, setSlug, n), { thicknessMm: opts.thicknessMm });
    books.push(b);
  }
  report.push(`${setSlug}: ${count} kapak`);
}

/** PDF'in ilk sayfasını görsele çevirir. Uygurca kitaplarda ön kapak SOL yarıdadır (sırt ortada). */
function renderPdf(pdf: string) {
  const tmp = path.join(os.tmpdir(), `kapak-${process.pid}-${Math.random().toString(36).slice(2)}.png`);
  execFileSync("gs", ["-q", "-dNOPAUSE", "-dBATCH", "-sDEVICE=png16m", "-r150", "-dFirstPage=1", "-dLastPage=1", `-sOutputFile=${tmp}`, pdf]);
  const buf = readFileSync(tmp);
  rmSync(tmp);
  return buf;
}
async function frontFromPdf(pdf: string, box: { x0: number; x1: number; y0: number; y1: number }) {
  const png = renderPdf(pdf);
  originalBytes += statSync(pdf).size;
  const m = await sharp(png).metadata();
  const left = Math.round(box.x0 * m.width!);
  const top = Math.round(box.y0 * m.height!);
  const width = Math.round((box.x1 - box.x0) * m.width!);
  const height = Math.round((box.y1 - box.y0) * m.height!);
  return sharp(png).extract({ left, top, width, height }).png().toBuffer();
}

// ───────────── Seriler ─────────────
async function main() {
  rmSync(OUT_DIR, { recursive: true, force: true });

  // 1) Mini Masallar: 5 klasör × 10, dosya adı kuralı klasöre göre değişir
  const miniGroups = [
    { rel: "Mini Masallar/1-10", base: "MiniMasallar kapak_UYGURCA" },
    { rel: "Mini Masallar/11-20", base: "MiniMasallar kapak_UYGURCA_11-20" },
    { rel: "Mini Masallar/21-30", base: "MiniMasallar kapak_UYGURCA_21-30" },
    { rel: "Mini Masallar/31-40", base: "MiniMasallar kapak_UYGURCA_31-40" },
    { rel: "Mini Masallar/41-50", base: "MiniMasallar kapak_UYGURCA_41-50" },
  ];
  await addSeries("mini-masallar", 50, (n) => {
    const g = miniGroups[Math.floor((n - 1) / 10)];
    return { rel: g.rel, name: numbered(g.base, ((n - 1) % 10) + 1) };
  }, { thicknessMm: 3 });

  await addSeries("hikayelerle-dini-degerler", 10, (n) => ({ rel: "HİKAYELERLE DİNİ DEĞERLER SETİ", name: numbered("HikayelerleDin kapak_01", n) }), { thicknessMm: 4 });

  // 3) Kırk Hadis: dosya adı "NN AD.jpg" (yatay kapaklar)
  {
    const rel = "3.40Hedis_Degerler/ON_KAPAK_RESİM";
    const files = listDir(rel);
    for (let n = 1; n <= 40; n++) {
      const name = files.find((f) => f.startsWith(`${pad(n)} `));
      if (!name) throw new Error(`Kırk Hadis ${n}. kapak yok`);
      const file = path.join(SRC, rel, name);
      const b = blank("kirk-hadis-kirk-hikaye", n);
      Object.assign(b, await writeCover(file, "kirk-hadis-kirk-hikaye", n), { thicknessMm: 3 });
      books.push(b);
    }
    report.push("kirk-hadis-kirk-hikaye: 40 kapak");
  }

  // 4) Ayetlerle Dini Değerler: Uygurca adlar kapaklardan okundu (doğrulanmalı)
  const ayetler: Array<[string, string, string]> = [
    ["خانقىز خۇشتار", "ئائىلە", "Aile"],
    ["قاپلان قاغان", "تىرىشچانلىق", "Çalışkanlık"],
    ["ھەرە تاتلىقجان", "ساغلام ئوزۇقلىنىش", "Sağlıklı beslenme"],
    ["ئېيىقچاق، توشقانچاق ۋە كىرپىچاق", "ئاداۋەت", "Düşmanlık"],
    ["ئىنوت ئىمىن", "توسالغۇسىز ھايات", "Engelsiz yaşam"],
    ["توشقان تولۇنئاي", "تۈزۈمگە بويسۇنۇش", "Kurallara uymak"],
    ["جەرەن ئەلانۇر", "كىتاب سۆيگۈسى", "Kitap sevgisi"],
    ["ئاغمىخان ئاۋارە", "كۆيۈمچان بولۇش", "Şefkatli olmak"],
    ["قاپلان قاسىم", "مۇھىتنى ئاسراش", "Çevreyi korumak"],
    ["پاقىجان كۈركۈر", "تەمكىن بولۇش", "Ağırbaşlı olmak"],
  ];
  await addSeries("ayetlerle-dini-degerler", 10, (n) => ({ rel: "ayetlerle dini degerler", name: numbered("ayetlerle din kapak_01", n) }), { thicknessMm: 4 });
  for (const b of books.filter((x) => x.setSlug === "ayetlerle-dini-degerler")) {
    const [ug, topicUg, topicTr] = ayetler[b.position - 1];
    Object.assign(b, { titleUg: ug, topicUg, topicTr, missingInfo: ["title_tr", "verify_title_ug", "verify_topic_tr", "thickness_mm"] });
  }

  await addSeries("peygamberimizin-hayati", 10, (n) => ({ rel: "PeygamberimizinHayati", name: `peygamberimizin hayati kapaklar aldi${n === 1 ? "" : n}.jpg` }), { thicknessMm: 5 });

  // 6) Allah'ı Merak Ediyorum: ad sonekleri değişken, numara "_N_Kapak" içinde
  for (let n = 1; n <= 5; n++) {
    const rel = "Allahi_Merak_Ediyorum_UYGURCA_MATBAA_SON";
    const name = listDir(rel).find((f) => new RegExp(`_${n}_Kapak`).test(nfc(f)));
    if (!name) throw new Error(`Allah'ı Merak Ediyorum ${n}. kapak yok`);
    const b = blank("allahi-merak-ediyorum", n);
    Object.assign(b, await writeCover(path.join(SRC, rel, name), "allahi-merak-ediyorum", n), { thicknessMm: 4 });
    books.push(b);
  }
  report.push("allahi-merak-ediyorum: 5 kapak");

  await addSeries("hadis-bahcesi", 10, (n) => ({ rel: "Hadis Bahcesi", name: `HadisBahçesi kapak_01${n === 1 ? "" : n}.jpg` }), { thicknessMm: 4 });

  // 8) Çaylak ile Filozof: "…_N_Kapak_Uygurca00.jpg" (Ç/C karışık)
  for (let n = 1; n <= 10; n++) {
    const rel = "caylak";
    const name = listDir(rel).find((f) => new RegExp(`_${n}_Kapak`).test(nfc(f)));
    if (!name) throw new Error(`Çaylak ${n}. kapak yok`);
    const b = blank("caylak-ile-filozof", n);
    Object.assign(b, await writeCover(path.join(SRC, rel, name), "caylak-ile-filozof", n), { thicknessMm: 12 });
    books.push(b);
  }
  report.push("caylak-ile-filozof: 10 kapak");

  // 9) Atlaslar: PDF sıvama kapaklardan ön kapak (sol yarı)
  const atlases = [
    { pdf: "KURAN_ATLASI_KAPAK/KURAN_ATLASI_KAPAK.pdf", box: { x0: 0.026, x1: 0.489, y0: 0.03, y1: 0.97 }, tr: "Kur'an Atlası", ug: "قۇرئان كەرىم ئاتلىسى" },
    { pdf: "ISLAM MEDENIYETI ATLASI_DUS DEGIRMENI/islam Medeniyeti Atlasi Kapak Sivama_Uygurca_SON.pdf", box: { x0: 0.028, x1: 0.4925, y0: 0.035, y1: 0.965 }, tr: "İslam Medeniyeti Atlası", ug: "ئىسلام مەدەنىيىتى ئاتلىسى" },
    { pdf: "TDKA_KAPAK_Uygurca_SON/TDKA_KAPAK_Uygurca_SON.pdf", box: { x0: 0.012, x1: 0.485, y0: 0.03, y1: 0.97 }, tr: "Türk Dünyası Kültür Atlası", ug: "تۈرك دۇنياسى مەدەنىيەت ئاتلىسى" },
  ];
  for (const [i, a] of atlases.entries()) {
    const png = await frontFromPdf(path.join(SRC, a.pdf), a.box);
    const b = blank("atlas-kitaplari", i + 1);
    Object.assign(b, await writeCover(png, "atlas-kitaplari", i + 1), { thicknessMm: 14, titleTr: a.tr, titleUg: a.ug, missingInfo: ["verify_title_tr", "thickness_mm"] });
    books.push(b);
  }
  report.push("atlas-kitaplari: 3 kapak (PDF)");

  // 10) Tek kitaplar: ilan sırası. Yalnızca Doppa Diyarı'nın kapak dosyası var, kalanlar kapaksız.
  const singles: Array<{ tr: string | null; ug: string; pdf?: string }> = [
    { tr: "Allah'ın Güzel İsimleri (99 Esmaül Hüsna)", ug: "ئاللاھنىڭ گۈزەل ئىسىملىرى (99 ئەسمائۇل ھۇسنا)" },
    { tr: "Müslüman Biz, Uygur Biz", ug: "مۇسۇلمان بىز، ئۇيغۇر بىز" },
    { tr: null, ug: "تەقۋالىق سۈلكەتلىرى" },
    { tr: "Doppa Diyarı", ug: "دوپپا دىيارى", pdf: "Guzelyar/Doppa_Diyari/buku doppaland indesign-Uygurca-kapak.pdf" },
    { tr: "Bu Yurtlar Bizimdi", ug: "بۇ يۇرتلار بىزنىڭ ئىدى" },
    { tr: "Nil'in Kızı", ug: "نىلنىڭ قىزى" },
  ];
  for (const [i, s] of singles.entries()) {
    const b = blank("tek-kitaplar", i + 1);
    Object.assign(b, { titleTr: s.tr, titleUg: s.ug, thicknessMm: 6 });
    b.missingInfo = [...(s.tr ? ["verify_title_tr"] : ["title_tr"]), "thickness_mm"];
    if (s.pdf) {
      const png = await frontFromPdf(path.join(SRC, s.pdf), { x0: 0.012, x1: 0.495, y0: 0.02, y1: 0.98 });
      Object.assign(b, await writeCover(png, "tek-kitaplar", i + 1));
    } else {
      b.isPlaceholder = true; // kapak dosyası henüz yok
      b.missingInfo.push("cover");
    }
    books.push(b);
  }
  report.push("tek-kitaplar: 6 kitap (1 kapak, 5 kapaksız)");

  // Ana sayfa carousel'i: her seriden bir kapak (ilk üçü hero'da görünür)
  const featured = ["ayetlerle-dini-degerler-01", "hadis-bahcesi-01", "hikayelerle-dini-degerler-01", "peygamberimizin-hayati-01", "mini-masallar-01", "caylak-ile-filozof-01", "kirk-hadis-kirk-hikaye-01", "allahi-merak-ediyorum-01", "atlas-kitaplari-01", "atlas-kitaplari-02", "tek-kitaplar-04"];
  featured.forEach((slug, i) => {
    const b = books.find((x) => x.slug === slug);
    if (!b) throw new Error(`Öne çıkan kitap yok: ${slug}`);
    b.isFeatured = true;
    b.featuredOrder = i + 1;
  });

  // Kapaklardan okunan Uygurca başlıklar (data/ug-basliklar.json); doğrulanana kadar "verify_title_ug" işaretli
  if (existsSync("data/ug-basliklar.json")) {
    const titles = JSON.parse(readFileSync("data/ug-basliklar.json", "utf8")) as Record<string, Record<string, string>>;
    for (const b of books) {
      const t = titles[b.setSlug]?.[String(b.position)];
      if (t && !b.titleUg) {
        b.titleUg = t;
        b.missingInfo = [...b.missingInfo.filter((m) => m !== "title_ug"), "verify_title_ug"];
      }
    }
  }

  writeFileSync("src/data/catalog.generated.json", JSON.stringify({ sets, books }, null, 1) + "\n");

  console.log(report.join("\n"));
  console.log(`\nToplam: ${sets.length} set, ${books.length} kitap (${books.filter((b) => b.coverUrl).length} kapaklı)`);
  console.log(`Boyut: ${(originalBytes / 1e6).toFixed(0)} MB (kaynak) → ${(outBytes / 1e6).toFixed(2)} MB (AVIF), ${(100 - (outBytes / originalBytes) * 100).toFixed(1)}% küçüldü`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
