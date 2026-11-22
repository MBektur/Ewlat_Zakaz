import { Suspense } from "react";
import { ShieldCheck, Truck } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { setName } from "@/lib/format";
import { getCatalog } from "@/lib/queries";
import { PreorderForm, type SetOption } from "./PreorderForm";
import { PreorderFromUrl } from "./PreorderFromUrl";

type Props = {
  locale: Locale;
  dict: Dictionary;
  /** true ise ?set=<slug> parametresindeki seti önceden işaretler. */
  fromUrl?: boolean;
  headingLevel?: "h1" | "h2";
};

export async function PreorderSection({ locale, dict, fromUrl, headingLevel = "h2" }: Props) {
  const { sets } = await getCatalog();
  const options: SetOption[] = sets
    .filter((s) => s.bookIds.length > 0)
    .map((s) => ({ id: s.id, name: setName(s, locale), count: s.bookIds.length, isPlaceholder: s.isPlaceholder }));
  const t = dict.preorder;
  const Heading = headingLevel;
  const formProps = {
    locale,
    t,
    bookCountLabel: dict.catalog.bookCount,
    placeholderSetLabel: dict.catalog.placeholderSet,
    sets: options,
  };
  const slugToId = Object.fromEntries(sets.map((s) => [s.slug, s.id]));

  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
      <div>
        <Heading className="font-display text-3xl tracking-tight text-ink sm:text-4xl">{t.title}</Heading>
        <p className="mt-4 max-w-md leading-relaxed text-body">{t.intro}</p>

        <div className="mt-8 rounded-2xl border border-line bg-soft/70 p-5">
          <div className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface text-primary shadow-soft">
              <Truck className="size-5 rtl:-scale-x-100" strokeWidth={1.6} />
            </span>
            <p className="leading-relaxed text-ink">{t.notice}</p>
          </div>
        </div>

        <p className="mt-5 flex gap-3 text-sm leading-relaxed text-muted">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-green" strokeWidth={1.8} />
          {t.noPayment}
        </p>
      </div>

      <div className="rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-8">
        {fromUrl ? (
          <Suspense fallback={<PreorderForm {...formProps} />}>
            <PreorderFromUrl {...formProps} slugToId={slugToId} />
          </Suspense>
        ) : (
          <PreorderForm {...formProps} />
        )}
      </div>
    </div>
  );
}
