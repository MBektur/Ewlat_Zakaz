import { OrderScene } from "@/components/art/OrderScene";
import { PencilLine, ShieldCheck } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getPricing } from "@/lib/queries";
import { PreorderForm } from "./PreorderForm";
import { PriceTag } from "./PriceTag";

type Props = {
  locale: Locale;
  dict: Dictionary;
  headingLevel?: "h1" | "h2";
};

/** Sağdaki sahne özgün SVG'dir (OrderScene). */
export async function PreorderSection({ locale, dict, headingLevel = "h2" }: Props) {
  const pricing = await getPricing();
  const t = dict.preorder;
  const Heading = headingLevel;

  return (
    <div
      className="relative overflow-hidden rounded-[2.25rem] border border-white/80 shadow-soft"
      style={{ background: "linear-gradient(100deg,#fff4e4 0%,#fcf6ee 34%,#dcebfb 62%,#cde4f9 100%)" }}
    >
      {/* Sağ kolon: üstte fiyat + el yazısı, altta illüstrasyon */}
      <div className="pointer-events-none absolute inset-y-0 end-0 hidden w-[58%] lg:block">
        <OrderScene className="absolute inset-x-0 bottom-0 block h-auto w-full rtl:-scale-x-100" />
        <div className="absolute end-[5%] top-[7%] flex items-start gap-5">
          <div className="rounded-3xl bg-white/85 px-5 py-3 text-center shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">{t.priceLabel}</p>
            <PriceTag pricing={pricing} locale={locale} untilTemplate={t.campaignUntil} className="font-display block text-3xl text-primary" />
            <p className="text-xs font-bold text-body">{t.packageTitle}</p>
          </div>
          <div className="w-[170px] shrink-0 -rotate-6">
            <p className="font-display text-[1.6rem] italic leading-[1.15] text-ink xl:text-[1.85rem]">{t.artText}</p>
            <svg viewBox="0 0 160 14" className="mt-1 w-full text-accent" aria-hidden="true">
              <path d="M3 9c34-6 96-8 154-2" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-5 sm:p-9 lg:w-[56%]">
        <Heading className="font-display flex items-center gap-3 text-3xl text-ink sm:text-4xl">
          <PencilLine className="size-9 shrink-0 text-primary rtl:-scale-x-100" strokeWidth={2.2} />
          {t.title}
        </Heading>
        <p className="mt-3 max-w-md text-base leading-relaxed text-ink/80 sm:text-lg">{t.notice}</p>

        <div className="mt-5 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-white/80 px-4 py-2.5 shadow-soft lg:hidden">
          <span className="text-sm font-bold text-muted">{t.priceLabel}</span>
          <PriceTag pricing={pricing} locale={locale} untilTemplate={t.campaignUntil} className="font-display text-2xl text-primary" />
          <span className="text-sm font-semibold text-body">· {t.packageTitle}</span>
        </div>

        <div className="mt-5">
          <PreorderForm locale={locale} t={t} pricing={pricing} />
        </div>
        <p className="mt-5 flex max-w-xl gap-2.5 text-sm leading-relaxed text-muted">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-green" strokeWidth={2.2} />
          {t.noPayment}
        </p>
      </div>

      {/* Mobil / tablet: sahne formun altında */}
      <div className="pointer-events-none relative lg:hidden">
        <OrderScene className="block h-auto w-full rtl:-scale-x-100" />
        <p className="font-display absolute end-[6%] top-[4%] w-[34%] -rotate-6 text-lg italic leading-tight text-ink sm:text-2xl">{t.artText}</p>
      </div>
    </div>
  );
}
