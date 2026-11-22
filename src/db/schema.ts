import {
  boolean,
  customType,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "bytea";
  },
});

/** Kitap setleri (ör. "Ayetlerle Dini Değerler" – 10 kitap). */
export const sets = pgTable("sets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: text().notNull().unique(),
  nameTr: text("name_tr").notNull(),
  nameUg: text("name_ug"),
  descriptionTr: text("description_tr"),
  descriptionUg: text("description_ug"),
  sortOrder: integer("sort_order").notNull().default(0),
  isPlaceholder: boolean("is_placeholder").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Kitaplar. Kapak oranı cover_width / cover_height'tan, sırt kalınlığı
 * thickness_mm'den hesaplanır; böylece her kitap kendi gerçek ölçüsünde görünür.
 */
export const books = pgTable(
  "books",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    slug: text().notNull().unique(),
    titleTr: text("title_tr"),
    titleUg: text("title_ug"),
    topicTr: text("topic_tr"),
    topicUg: text("topic_ug"),
    coverUrl: text("cover_url"),
    coverWidth: integer("cover_width").notNull().default(148),
    coverHeight: integer("cover_height").notNull().default(210),
    thicknessMm: real("thickness_mm").notNull().default(6),
    isPlaceholder: boolean("is_placeholder").notNull().default(false),
    isFeatured: boolean("is_featured").notNull().default(false),
    featuredOrder: integer("featured_order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    /** Eksik ya da doğrulanması gereken alanlar (ör. "title_tr", "verify_title_ug"). */
    missingInfo: text("missing_info").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("books_featured_idx").on(t.isFeatured, t.featuredOrder)],
);

/** Kitap ↔ set (çoka-çok). position: kitabın set içindeki sırası. */
export const bookSets = pgTable(
  "book_sets",
  {
    bookId: integer("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    setId: integer("set_id")
      .notNull()
      .references(() => sets.id, { onDelete: "cascade" }),
    position: integer().notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.bookId, t.setId] }), index("book_sets_set_idx").on(t.setId)],
);

export const preorderStatus = pgEnum("preorder_status", [
  "new",
  "contacted",
  "confirmed",
  "shipped",
  "cancelled",
]);

export const preorders = pgTable(
  "preorders",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    fullName: text("full_name").notNull(),
    phone: text().notNull(),
    address: text().notNull(),
    note: text(),
    locale: text().notNull(),
    status: preorderStatus().notNull().default("new"),
    /** Kaç takım (tüm koleksiyon) istendiği. */
    quantity: integer().notNull().default(1),
    /** Sipariş anındaki takım fiyatı (TL). Kampanya bitse de kayıttaki fiyat değişmez. */
    unitPriceTry: integer("unit_price_try").notNull(),
    adminNote: text("admin_note"),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
    /** Hız sınırı için IP'nin tuzlu özeti (ham IP saklanmaz). */
    ipHash: text("ip_hash"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("preorders_created_idx").on(t.createdAt),
    index("preorders_ip_idx").on(t.ipHash, t.createdAt),
  ],
);

/**
 * Site ayarları (tek satır). Fiyat ve kampanya tarihi admin panelinden değişir.
 * Kampanya bitiş tarihi geçince regular_price_try (varsa) geçerli olur.
 */
export const settings = pgTable("settings", {
  id: integer().primaryKey().default(1),
  campaignPriceTry: integer("campaign_price_try").notNull().default(8500),
  campaignEndsAt: timestamp("campaign_ends_at", { withTimezone: true }),
  regularPriceTry: integer("regular_price_try"),
  /** false ise form yeni sipariş kabul etmez. */
  preordersOpen: boolean("preorders_open").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/** Admin panelinden yüklenen kapak görselleri. /media/[id] üzerinden sunulur. */
export const media = pgTable("media", {
  id: text().primaryKey(),
  contentType: text("content_type").notNull(),
  width: integer().notNull(),
  height: integer().notNull(),
  byteSize: integer("byte_size").notNull(),
  data: bytea().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SetRow = typeof sets.$inferSelect;
export type BookRow = typeof books.$inferSelect;
export type PreorderRow = typeof preorders.$inferSelect;
export type SettingsRow = typeof settings.$inferSelect;
export type PreorderStatus = (typeof preorderStatus.enumValues)[number];
