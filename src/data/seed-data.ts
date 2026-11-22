/**
 * Başlangıç verisi. `npm run db:seed` bunu veri tabanına yazar; DATABASE_URL yoksa (önizleme modu)
 * site doğrudan bu veriyi kullanır.
 *
 * Kaynak: src/data/catalog.generated.json. `scripts/import-covers.ts` üretir (kapak klasöründen
 * 154 kitap, AVIF sıkıştırılmış kapaklar). Kitap adlarını doldurmak için data/kitap-adlari.csv
 * düzenlenip `npm run titles:apply` çalıştırılır.
 *
 * missing_info kodları:
 *   title_tr / title_ug         ad henüz yok
 *   verify_title_tr / _ug       ad var ama doğrulanmalı (kapaktan okundu ya da çevrildi)
 *   verify_topic_tr             Türkçe konu geçici çeviri
 *   thickness_mm                sırt kalınlığı tahmini, gerçek ölçü girilmeli
 *   cover                       kapak dosyası henüz yok
 */
import catalog from "./catalog.generated.json";

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
  coverWidth: number;
  coverHeight: number;
  thicknessMm: number;
  isPlaceholder?: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  missingInfo: string[];
};

export const seedSets = catalog.sets as SeedSet[];
export const seedBooks = catalog.books as SeedBook[];
