import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { localePath } from "@/i18n/paths";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { setName } from "@/lib/format";
import type { Catalog } from "@/lib/types";

const bars = ["bg-primary text-white", "bg-accent text-ink", "bg-teal-dark text-white"];

/** Setten eşit aralıklı k kapak seçer (ilk k tanesi değil), böylece büyük setin çeşitliliği görünür. */
function sample<T>(items: T[], k: number): T[] {
  if (items.length <= k) return items;
  return Array.from({ length: k }, (_, i) => items[Math.round((i * (items.length - 1)) / (k - 1))]);
}

/** Koleksiyon kutucukları: yalnızca kataloğa götürür (sipariş koleksiyonun tamamı içindir). */
export function SetTiles({ locale, dict, catalog }: { locale: Locale; dict: Dictionary; catalog: Catalog }) {
  const byId = new Map(catalog.books.map((b) => [b.id, b]));
  const sets = catalog.sets.filter((s) => s.bookIds.length > 0);
  // "50 kitap" → sayı büyük, sözcük küçük yazılır (her dilde aynı şablondan)
  const unit = dict.catalog.bookCount.replace("{n}", "").trim();

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sets.map((set, i) => {
        const withCover = set.bookIds.map((id) => byId.get(id)).filter((b) => b?.coverUrl);
        const landscape = (withCover[0]?.coverWidth ?? 0) > (withCover[0]?.coverHeight ?? 1);
        // Yatay kapaklar geniştir: daha az ve daha alçak göster, kutucuk hep tek satır kalsın
        const covers = sample(withCover, landscape ? 3 : 5);
        const thumbH = landscape ? 82 : 108;
        return (
          <li key={set.id}>
            <Link
              href={localePath(locale, "books", `?set=${set.slug}`)}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-soft shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
            >
              {/* Kitap sayısı: köşede belirgin rozet */}
              <span className="absolute end-3 top-3 z-10 inline-flex items-baseline gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-white shadow-soft">
                <b className="font-display text-xl leading-none">{set.bookIds.length}</b>
                <span className="text-xs font-bold">{unit}</span>
              </span>

              <div className="flex h-40 items-center justify-center px-5 pb-3 pt-10">
                {covers.length > 0 ? (
                  covers.map((b, n) => (
                    <div
                      key={b!.id}
                      className="relative shrink-0 overflow-hidden rounded-md shadow-lift ring-1 ring-black/5 transition group-hover:-translate-y-1"
                      style={{
                        height: thumbH,
                        width: Math.round((thumbH * b!.coverWidth) / b!.coverHeight),
                        marginInlineStart: n === 0 ? 0 : -18,
                        transform: `rotate(${(n - (covers.length - 1) / 2) * 3}deg)`,
                        zIndex: n,
                      }}
                    >
                      <Image src={b!.coverUrl!} alt="" fill sizes="120px" className="object-cover" />
                    </div>
                  ))
                ) : (
                  <span className="flex size-16 items-center justify-center rounded-2xl bg-white/70 text-muted">
                    <BookOpen className="size-8" strokeWidth={1.6} />
                  </span>
                )}
              </div>

              <div className={`mt-auto px-5 py-3.5 text-center ${bars[i % bars.length]}`}>
                <p className="text-lg font-extrabold leading-tight">{setName(set, locale)}</p>
                {set.isPlaceholder && <p className="text-sm font-semibold opacity-90">{dict.catalog.placeholderSet}</p>}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
