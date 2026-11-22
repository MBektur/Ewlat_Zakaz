import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill, setName } from "@/lib/format";
import type { Catalog } from "@/lib/types";

export function SetsOverview({ locale, dict, catalog }: { locale: Locale; dict: Dictionary; catalog: Catalog }) {
  const byId = new Map(catalog.books.map((b) => [b.id, b]));
  const sets = catalog.sets.filter((s) => s.bookIds.length > 0);

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sets.map((set) => {
        const covers = set.bookIds
          .map((id) => byId.get(id))
          .filter((b) => b?.coverUrl)
          .slice(0, 3);
        const description = locale === "ug" ? set.descriptionUg : set.descriptionTr;
        return (
          <li key={set.id}>
            <Link
              href={`/${locale}/kitaplar?set=${set.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex h-28 items-end gap-2 rounded-xl bg-soft px-4 pb-0 pt-4">
                {covers.length > 0 ? (
                  covers.map((b, i) => (
                    <div
                      key={b!.id}
                      className="relative overflow-hidden rounded-t-[3px] shadow-soft"
                      style={{ width: 54, aspectRatio: `${b!.coverWidth} / ${b!.coverHeight}`, transform: `translateY(${i % 2 ? 6 : 0}px)` }}
                    >
                      <Image src={b!.coverUrl!} alt="" fill sizes="54px" className="object-cover" />
                    </div>
                  ))
                ) : (
                  <span className="mb-4 rounded-full border border-dashed border-line-strong px-3 py-1 text-xs text-muted">
                    {dict.catalog.placeholderSet}
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-medium leading-snug text-ink">{setName(set, locale)}</h3>
              <p className="mt-1 text-sm text-muted">{fill(dict.catalog.bookCount, { n: set.bookIds.length })}</p>
              {description && locale === "tr" && <p className="mt-2 text-sm leading-relaxed text-body">{description}</p>}
              {description && locale === "ug" && <p className="mt-2 leading-relaxed text-body">{description}</p>}
              <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-primary">
                {dict.carousel.viewAll}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
