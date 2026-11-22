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

## Önizleme modu (veri tabanı olmadan, ör. Vercel)
`DATABASE_URL` tanımlı değilse site veri tabanı olmadan açılır: kitaplar ve fiyat `src/data/seed-data.ts`'ten gelir,
sipariş formu çalışır ama kaydetmez ("önizleme" uyarısı gösterir), admin paneli kapalıdır.
Vercel'e yüklemek için ortam değişkeni gerekmez: projeyi içe aktarın, Build Command olarak `npm run build` (varsayılan) kalsın.

## Katalog (154 kitap) ve kapaklar
Katalog Ewlat Yayınları ilanındaki liste: 8 seri (145 kitap) + 3 atlas + 6 tekil kitap = 154, 10 set.
- `npm run covers:import -- <kapak-klasörü>`: kapak klasöründen (yalnızca Uygurca kapaklar) kataloğu üretir.
  Her kapak sRGB'ye çevrilir, en uzun kenarı 600 px'e küçültülür, AVIF (kalite 38) olarak `public/covers/` altına yazılır
  (kaynak 516 MB → 2 MB). PDF kapaklardan (atlaslar, Doppa Diyarı) ön kapak kırpılır (ghostscript gerekir: `brew install ghostscript`).
  Çıktı: `src/data/catalog.generated.json`. Türkçe baskı kapakları ve tanıtım görselleri kullanılmaz.
- **Kitap adlarını doldurma:** `data/kitap-adlari.csv` dosyasını (Excel'de açılır) doldurun, sonra `npm run titles:apply`
  ve veri tabanı için `npm run db:seed`. Doldurduğunuz alan "doğrulandı" sayılır. Admin panelinden de tek tek girilebilir.
- Kapağı henüz olmayan 5 tekil kitap "geçici kapak" olarak görünür; kapaklar gelince admin panelinden yüklenir.
- `npm run import:books -- dosya.csv`: ileride yeni kitapları CSV ile toplu eklemek için (kapaklar veri tabanına yazılır).

## Tasarım
Oyuncu ama okunaklı bir stil: şeftali/krem zemin, mercan + teal + hardal, yuvarlak renkli kartlar. Renk ve yazı tipi
ayarları `src/app/globals.css` içindeki `@theme` bloğunda. Dekoratif SVG'ler `src/components/art/` altında
(yapraklar, yıldızlar, kitap lekesi, kargo kutusu). Hiçbir dekor metnin ya da kapakların üstüne binmez.
Hero'daki kitaplar katalogdaki "carousel'de göster" işaretli ilk üç kapaktır.

## Komutlar
`npm run lint` · `npm run typecheck` · `npm run build` · `npm run db:studio`
