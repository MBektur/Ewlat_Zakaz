// İstemci ve sunucu arasında paylaşılan, serileştirilebilir veri tipleri.

export type CatalogBook = {
  id: number;
  slug: string;
  titleTr: string | null;
  titleUg: string | null;
  topicTr: string | null;
  topicUg: string | null;
  coverUrl: string | null;
  coverWidth: number;
  coverHeight: number;
  thicknessMm: number;
  isPlaceholder: boolean;
  /** Kitabın ait olduğu ilk set ve o setteki sırası (gösterim için). */
  setId: number | null;
  position: number;
};

export type CatalogSet = {
  id: number;
  slug: string;
  nameTr: string;
  nameUg: string | null;
  descriptionTr: string | null;
  descriptionUg: string | null;
  isPlaceholder: boolean;
  /** Setteki kitapların id'leri, set içi sıraya göre. */
  bookIds: number[];
};

export type Catalog = {
  sets: CatalogSet[];
  books: CatalogBook[];
};

export type Pricing = {
  campaignPriceTry: number;
  /** ISO tarih; null ise kampanya süresiz. */
  campaignEndsAt: string | null;
  regularPriceTry: number | null;
  preordersOpen: boolean;
};
