/**
 * Başlangıç verisi. `npm run db:seed` bu dosyayı veritabanına yazar.
 *
 * Bundan sonra kitaplar ve setler /admin panelinden ya da
 * `npm run import:books` (CSV) ile yönetilir. Bu dosya yalnızca ilk kurulum içindir.
 *
 * missing_info kodları:
 *   title_tr          Türkçe kitap adı henüz yok
 *   verify_title_ug   Uygurca ad kapaktan okundu, doğrulanmalı
 *   verify_topic_tr   Türkçe konu adı geçici çeviri, doğrulanmalı
 *   thickness_mm      Sırt kalınlığı tahmini, gerçek ölçü girilmeli
 *   cover             Gerçek kapak görseli yok
 *   title             Kitap adı yok
 */

export type SeedSet = {
  slug: string;
  nameTr: string;
  nameUg: string | null;
  descriptionTr?: string;
  descriptionUg?: string;
  sortOrder: number;
  isPlaceholder?: boolean;
};

export type SeedBook = {
  slug: string;
  setSlug: string;
  position: number;
  titleTr: string | null;
  titleUg: string | null;
  topicTr?: string | null;
  topicUg?: string | null;
  coverUrl: string | null;
  /** Gerçek kapakta 0 bırakılabilir: seed görsel dosyasından okur. Yer tutucuda mm cinsinden oran. */
  coverWidth: number;
  coverHeight: number;
  thicknessMm: number;
  isPlaceholder?: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  missingInfo: string[];
};

export const seedSets: SeedSet[] = [
  {
    slug: "ayetlerle-dini-degerler",
    nameTr: "Ayetlerle Dini Değerler",
    nameUg: "ئايەتلەر ئارقىلىق مۇسۇلمانلىقنى ئۆگىنەيلى",
    descriptionTr: "Her kitapta bir değer: aile, çalışkanlık, sağlıklı beslenme, kitap sevgisi ve daha fazlası.",
    sortOrder: 1,
  },
  {
    slug: "ornek-set-a",
    nameTr: "Örnek Set A (geçici)",
    nameUg: "ئۈلگە توپلام A (ۋاقىتلىق)",
    descriptionTr: "Geçici örnek set. Gerçek set bilgileri geldiğinde silinecek.",
    sortOrder: 90,
    isPlaceholder: true,
  },
  {
    slug: "ornek-set-b",
    nameTr: "Örnek Set B (geçici)",
    nameUg: "ئۈلگە توپلام B (ۋاقىتلىق)",
    descriptionTr: "Geçici örnek set. Farklı kitap ölçülerini göstermek için kare formatlı.",
    sortOrder: 91,
    isPlaceholder: true,
  },
];

// Ayetlerle Dini Değerler: 10 gerçek kapak (sRGB'ye çevrildi).
// Uygurca adlar ve konular kapaklardan okundu.
// coverWidth/coverHeight seed sırasında görsel dosyasının kendisinden okunur.
const ayetler: Array<[titleUg: string, topicUg: string, topicTr: string]> = [
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

const realBooks: SeedBook[] = ayetler.map(([titleUg, topicUg, topicTr], i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    slug: `ayetlerle-dini-degerler-${n}`,
    setSlug: "ayetlerle-dini-degerler",
    position: i + 1,
    titleTr: null,
    titleUg,
    topicTr,
    topicUg,
    coverUrl: `/covers/ayetlerle-dini-degerler/${n}.jpg`,
    coverWidth: 0,
    coverHeight: 0,
    thicknessMm: 4,
    isFeatured: true,
    featuredOrder: i + 1,
    missingInfo: ["title_tr", "verify_title_ug", "verify_topic_tr", "thickness_mm"],
  };
});

function placeholders(
  setSlug: string,
  count: number,
  size: { w: number; h: number; mm: number },
): SeedBook[] {
  return Array.from({ length: count }, (_, i) => ({
    slug: `${setSlug}-${String(i + 1).padStart(2, "0")}`,
    setSlug,
    position: i + 1,
    titleTr: null,
    titleUg: null,
    coverUrl: null,
    coverWidth: size.w,
    coverHeight: size.h,
    thicknessMm: size.mm,
    isPlaceholder: true,
    missingInfo: ["title", "cover", "thickness_mm"],
  }));
}

export const seedBooks: SeedBook[] = [
  ...realBooks,
  // A5 dikey (148×210 mm)
  ...placeholders("ornek-set-a", 12, { w: 148, h: 210, mm: 6 }),
  // Kare (200×200 mm), daha kalın
  ...placeholders("ornek-set-b", 4, { w: 200, h: 200, mm: 10 }),
];
