/**
 * Önizleme (demo) modu: DATABASE_URL tanımlı değilse site veri tabanı olmadan çalışır.
 * Kitaplar ve fiyat src/data/seed-data.ts'ten gelir, sipariş formu kayıt yapmaz, admin paneli kapalıdır.
 * Vercel'de yalnızca görmek için idealdir.
 */
export const isDemo = () => !process.env.DATABASE_URL;
