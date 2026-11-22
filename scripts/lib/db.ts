// Komut satırı script'leri için DB bağlantısı (Next.js dışında çalışır).
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../../src/db/schema";

try {
  process.loadEnvFile(".env.local");
} catch {
  // Ortam değişkenleri doğrudan verilmiş olabilir.
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL tanımlı değil.");
  process.exit(1);
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema, casing: "snake_case" });
export { schema };
