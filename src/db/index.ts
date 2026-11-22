import "server-only";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type Db = NodePgDatabase<typeof schema>;
const globalForDb = globalThis as unknown as { drizzleDb?: Db };

/** Bağlantı ilk kullanımda kurulur; DATABASE_URL olmayan (önizleme) modda içe aktarma hata vermez. */
function getDb(): Db {
  if (globalForDb.drizzleDb) return globalForDb.drizzleDb;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL tanımlı değil. .env.example dosyasına bakın.");
  }
  globalForDb.drizzleDb = drizzle(new Pool({ connectionString, max: 10 }), { schema, casing: "snake_case" });
  return globalForDb.drizzleDb;
}

export const db = new Proxy({} as Db, {
  get(_target, prop) {
    const real = getDb() as unknown as Record<string | symbol, unknown>;
    const value = real[prop];
    return typeof value === "function" ? (value as (...a: unknown[]) => unknown).bind(real) : value;
  },
});
export { schema };
