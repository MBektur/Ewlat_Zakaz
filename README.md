# Uygurca Çocuk Kitapları: Katalog ve Ön Sipariş

Next.js 16 (App Router, Cache Components) + PostgreSQL (Drizzle) + Tailwind 4 + Swiper.
Türkçe (`/tr`) ve Arap harfli Uygurca (`/ug`, RTL). Ön sipariş **tüm koleksiyon için tek paket** (kitap/set seçimi yok).

## Kurulum
```bash
npm install
cp .env.example .env.local      # DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET (openssl rand -hex 32)
createdb ewlat_kitap            # ya da docker compose up -d
npm run db:migrate
npm run db:seed                 # 10 gerçek kapak + geçici örnek kitaplar
npm run dev
```
Yönetim paneli: `/admin` (şifre: `ADMIN_PASSWORD`). Siparişler, kitaplar, setler, fiyat ve kampanya tarihi buradan yönetilir.

## 154 kitabı içe aktarma
1. `data/kitaplar-sablon.csv` şablonunu doldurun (ad, set, sıra, kapak dosyası, kalınlık).
2. `npm run import:books -- kitaplar.csv --covers <kapak-klasörü> --dry-run` (deneme)
3. `--dry-run` olmadan çalıştırın. Kitap sayısı, set dağılımı ve eksik bilgiler raporlanır.

Kapaklar sRGB'ye çevrilir; 3D kitabın oranı görselin gerçek piksel ölçüsünden gelir.

## İllüstrasyonlar
Hero sahnesi, sipariş kartı manzarası (kutu + cami), footer silueti ve yapraklar özgün SVG'dir:
`src/components/art/` (HeroScene, OrderScene, FooterScene, Leaves). Renkler ve şekiller doğrudan düzenlenebilir.
Hero'daki kitaplar katalogdaki "carousel'de göster" işaretli ilk üç kapaktır.

## Komutlar
`npm run lint` · `npm run typecheck` · `npm run build` · `npm run db:studio`
