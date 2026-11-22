import "server-only";
import { and, asc, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db, schema } from "@/db";
import type { PreorderStatus } from "@/db/schema";

export const statusLabels: Record<PreorderStatus, string> = {
  new: "Yeni",
  contacted: "Arandı",
  confirmed: "Onaylandı",
  shipped: "Gönderildi",
  cancelled: "İptal",
};

export async function listPreorders(filter: { status?: string; q?: string }) {
  const { preorders } = schema;
  const where: SQL[] = [];
  if (filter.status && filter.status in statusLabels) {
    where.push(eq(preorders.status, filter.status as PreorderStatus));
  }
  if (filter.q) {
    const like = `%${filter.q}%`;
    where.push(or(ilike(preorders.fullName, like), ilike(preorders.phone, like), ilike(preorders.address, like))!);
  }
  return db
    .select()
    .from(preorders)
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(preorders.createdAt));
}

export async function preorderStats() {
  const [row] = await db
    .select({
      orders: sql<number>`count(*) filter (where ${schema.preorders.status} <> 'cancelled')::int`,
      sets: sql<number>`coalesce(sum(${schema.preorders.quantity}) filter (where ${schema.preorders.status} <> 'cancelled'), 0)::int`,
      amount: sql<number>`coalesce(sum(${schema.preorders.quantity} * ${schema.preorders.unitPriceTry}) filter (where ${schema.preorders.status} <> 'cancelled'), 0)::int`,
      fresh: sql<number>`count(*) filter (where ${schema.preorders.status} = 'new')::int`,
    })
    .from(schema.preorders);
  return row;
}

export async function listBooksAdmin() {
  const { books, bookSets, sets } = schema;
  return db
    .select({
      book: books,
      setId: bookSets.setId,
      position: bookSets.position,
      setName: sets.nameTr,
      setOrder: sets.sortOrder,
    })
    .from(books)
    .leftJoin(bookSets, eq(bookSets.bookId, books.id))
    .leftJoin(sets, eq(sets.id, bookSets.setId))
    .orderBy(asc(sets.sortOrder), asc(bookSets.position), asc(books.id));
}

export async function getBookAdmin(id: number) {
  const [row] = await db
    .select({ book: schema.books, setId: schema.bookSets.setId, position: schema.bookSets.position })
    .from(schema.books)
    .leftJoin(schema.bookSets, eq(schema.bookSets.bookId, schema.books.id))
    .where(eq(schema.books.id, id));
  return row;
}

export async function listSetsAdmin() {
  const { sets, bookSets } = schema;
  return db
    .select({
      set: sets,
      bookCount: sql<number>`count(${bookSets.bookId})::int`,
    })
    .from(sets)
    .leftJoin(bookSets, eq(bookSets.setId, sets.id))
    .groupBy(sets.id)
    .orderBy(asc(sets.sortOrder), asc(sets.id));
}

export async function getSetAdmin(id: number) {
  const [row] = await db.select().from(schema.sets).where(eq(schema.sets.id, id));
  return row;
}
