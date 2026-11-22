"use server";

import { and, eq, ne } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db, schema } from "@/db";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { deleteMediaByUrl, storeCover } from "@/lib/media";
import { CATALOG_TAG, SETTINGS_TAG } from "@/lib/queries";
import { slugify } from "@/lib/slug";

export type FormResult = { ok?: boolean; error?: string; message?: string } | null;

const str = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
};
const optStr = (fd: FormData, key: string) => str(fd, key) || null;
const bool = (fd: FormData, key: string) => fd.get(key) === "on";

// ───────────── Oturum ─────────────

export async function login(_prev: FormResult, fd: FormData): Promise<FormResult> {
  if (!checkPassword(str(fd, "password"))) {
    await new Promise((r) => setTimeout(r, 800)); // kaba kuvvet denemelerini yavaşlat
    return { error: "Şifre hatalı." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ───────────── Siparişler ─────────────

const statusSchema = z.enum(schema.preorderStatus.enumValues);

export async function updatePreorderStatus(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const status = statusSchema.parse(fd.get("status"));
  await db.update(schema.preorders).set({ status }).where(eq(schema.preorders.id, id));
}

export async function updatePreorderNote(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  await db.update(schema.preorders).set({ adminNote: optStr(fd, "adminNote") }).where(eq(schema.preorders.id, id));
}

export async function deletePreorder(fd: FormData) {
  await requireAdmin();
  await db.delete(schema.preorders).where(eq(schema.preorders.id, Number(fd.get("id"))));
}

// ───────────── Ayarlar (fiyat) ─────────────

/** "2026-12-31" → o günün sonu, İstanbul saatiyle. */
function endOfDayIstanbul(date: string) {
  return new Date(`${date}T23:59:59+03:00`);
}

export async function saveSettings(_prev: FormResult, fd: FormData): Promise<FormResult> {
  await requireAdmin();
  const parsed = z
    .object({
      campaignPriceTry: z.coerce.number().int().min(1).max(1_000_000),
      campaignEndsAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal("")),
      regularPriceTry: z.union([z.literal(""), z.coerce.number().int().min(1).max(1_000_000)]),
    })
    .safeParse({
      campaignPriceTry: str(fd, "campaignPriceTry"),
      campaignEndsAt: str(fd, "campaignEndsAt"),
      regularPriceTry: str(fd, "regularPriceTry"),
    });
  if (!parsed.success) return { error: "Lütfen fiyatları tam sayı (TL) ve tarihi geçerli girin." };
  const d = parsed.data;

  await db
    .insert(schema.settings)
    .values({ id: 1 })
    .onConflictDoNothing();
  await db
    .update(schema.settings)
    .set({
      campaignPriceTry: d.campaignPriceTry,
      campaignEndsAt: d.campaignEndsAt ? endOfDayIstanbul(d.campaignEndsAt) : null,
      regularPriceTry: d.regularPriceTry === "" ? null : d.regularPriceTry,
      preordersOpen: bool(fd, "preordersOpen"),
    })
    .where(eq(schema.settings.id, 1));
  updateTag(SETTINGS_TAG);
  return { ok: true, message: "Ayarlar kaydedildi." };
}

// ───────────── Setler ─────────────

export async function saveSet(_prev: FormResult, fd: FormData): Promise<FormResult> {
  await requireAdmin();
  const id = Number(fd.get("id")) || null;
  const nameTr = str(fd, "nameTr");
  if (nameTr.length < 2) return { error: "Türkçe set adı gerekli." };
  const slug = slugify(str(fd, "slug") || nameTr);
  const clash = await db
    .select({ id: schema.sets.id })
    .from(schema.sets)
    .where(id ? and(eq(schema.sets.slug, slug), ne(schema.sets.id, id)) : eq(schema.sets.slug, slug));
  if (clash.length) return { error: `"${slug}" adresi başka bir sette kullanılıyor.` };

  const values = {
    slug,
    nameTr,
    nameUg: optStr(fd, "nameUg"),
    descriptionTr: optStr(fd, "descriptionTr"),
    descriptionUg: optStr(fd, "descriptionUg"),
    sortOrder: Number(str(fd, "sortOrder")) || 0,
    isPlaceholder: bool(fd, "isPlaceholder"),
  };
  if (id) await db.update(schema.sets).set(values).where(eq(schema.sets.id, id));
  else await db.insert(schema.sets).values(values);
  updateTag(CATALOG_TAG);
  redirect("/admin/setler");
}

export async function deleteSet(fd: FormData) {
  await requireAdmin();
  // Kitaplar silinmez, yalnızca bu setle bağları kalkar
  await db.delete(schema.sets).where(eq(schema.sets.id, Number(fd.get("id"))));
  updateTag(CATALOG_TAG);
}

// ───────────── Kitaplar ─────────────

export async function saveBook(_prev: FormResult, fd: FormData): Promise<FormResult> {
  await requireAdmin();
  const id = Number(fd.get("id")) || null;
  const existing = id
    ? (await db.select().from(schema.books).where(eq(schema.books.id, id)))[0]
    : undefined;
  if (id && !existing) return { error: "Kitap bulunamadı." };

  const titleTr = optStr(fd, "titleTr");
  const titleUg = optStr(fd, "titleUg");
  const thicknessMm = Number(str(fd, "thicknessMm").replace(",", "."));
  if (!Number.isFinite(thicknessMm) || thicknessMm < 1 || thicknessMm > 80) {
    return { error: "Sırt kalınlığı 1–80 mm arasında olmalı." };
  }

  let cover = existing
    ? { url: existing.coverUrl, width: existing.coverWidth, height: existing.coverHeight }
    : { url: null as string | null, width: 148, height: 210 };
  const file = fd.get("cover");
  const replacingCover = file instanceof File && file.size > 0;
  if (replacingCover) {
    if (!file.type.startsWith("image/")) return { error: "Kapak bir görsel dosyası olmalı." };
    try {
      const stored = await storeCover(file);
      cover = { url: stored.url, width: stored.width, height: stored.height };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Kapak işlenemedi." };
    }
  } else if (bool(fd, "removeCover")) {
    cover = { url: null, width: 148, height: 210 };
  }

  // Eksik bilgi işaretleri: temel alanlar otomatik, "doğrulanmalı" işaretleri admin onaylayınca kalkar
  const verified = bool(fd, "verified");
  const kept = (existing?.missingInfo ?? []).filter(
    (m) => m.startsWith("verify_") && !verified,
  );
  const missingInfo = [
    ...kept,
    ...(!titleTr ? ["title_tr"] : []),
    ...(!titleUg ? ["title_ug"] : []),
    ...(!cover.url ? ["cover"] : []),
    ...(existing?.missingInfo.includes("thickness_mm") && existing.thicknessMm === thicknessMm && !verified
      ? ["thickness_mm"]
      : []),
  ];

  const values = {
    titleTr,
    titleUg,
    topicTr: optStr(fd, "topicTr"),
    topicUg: optStr(fd, "topicUg"),
    coverUrl: cover.url,
    coverWidth: cover.width,
    coverHeight: cover.height,
    thicknessMm,
    isFeatured: bool(fd, "isFeatured"),
    featuredOrder: Number(str(fd, "featuredOrder")) || 0,
    isVisible: bool(fd, "isVisible"),
    isPlaceholder: !titleTr && !titleUg && !cover.url,
    missingInfo,
  };

  const setId = Number(fd.get("setId")) || null;
  const position = Number(str(fd, "position")) || 0;

  await db.transaction(async (tx) => {
    let bookId = id;
    if (bookId) {
      await tx.update(schema.books).set(values).where(eq(schema.books.id, bookId));
    } else {
      const base = slugify(titleTr ?? "") || "kitap";
      const [row] = await tx
        .insert(schema.books)
        .values({ ...values, slug: `${base}-${Date.now().toString(36)}` })
        .returning({ id: schema.books.id });
      bookId = row.id;
    }
    // Bu ekranda kitap tek bir sete bağlanır
    await tx.delete(schema.bookSets).where(eq(schema.bookSets.bookId, bookId));
    if (setId) await tx.insert(schema.bookSets).values({ bookId, setId, position });
  });

  if (replacingCover || bool(fd, "removeCover")) await deleteMediaByUrl(existing?.coverUrl);
  updateTag(CATALOG_TAG);
  redirect("/admin/kitaplar");
}

export async function deleteBook(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const [book] = await db.delete(schema.books).where(eq(schema.books.id, id)).returning();
  await deleteMediaByUrl(book?.coverUrl);
  updateTag(CATALOG_TAG);
}
