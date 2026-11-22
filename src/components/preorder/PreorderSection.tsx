import { Check, MessageCircle, PencilLine, ShieldCheck } from "lucide-react";
import { ParcelArt } from "@/components/art/ParcelArt";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { whatsappUrl } from "@/lib/contact";
import { getCountryList } from "@/lib/geo";
import { getPricing } from "@/lib/queries";
import { PreorderForm } from "./PreorderForm";
import { PriceTag } from "./PriceTag";

type Props = { locale: Locale; dict: Dictionary; headingLevel?: "h1" | "h2" };

/** İki net kolon: solda form, sağda fiyat ve paket özeti. Hiçbir görsel formun üstüne binmez. */
export async function PreorderSection({ locale, dict, headingLevel = "h2" }: Props) {
  const [pricing, countries] = await Promise.all([getPricing(), getCountryList(locale)]);
  const t = dict.preorder;
  const Heading = headingLevel;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[2rem] border border-line bg-surface p-5 shadow-soft sm:p-9">
        <Heading className="font-display flex items-center gap-3 text-3xl text-ink sm:text-4xl">
          <PencilLine className="size-8 shrink-0 text-primary rtl:-scale-x-100" strokeWidth={2.2} />
          {t.title}
        </Heading>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-body">{t.notice}</p>
        <div className="mt-6">
          <PreorderForm locale={locale} t={t} pricing={pricing} countries={countries} />
        </div>
        <p className="mt-5 flex max-w-xl gap-2.5 text-sm leading-relaxed text-muted">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-green" strokeWidth={2.2} />
          {t.noPayment}
        </p>
      </div>

      <aside className="relative flex flex-col overflow-hidden rounded-[2rem] bg-teal-dark text-white">
        <div className="flex flex-1 flex-col p-7 sm:p-9">
          <p className="text-sm font-extrabold uppercase tracking-wider text-sun">{t.priceLabel}</p>
          <PriceTag pricing={pricing} locale={locale} untilTemplate={t.campaignUntil} className="font-display mt-1 block text-5xl text-sun sm:text-6xl" />
          <p className="mt-4 text-xl font-extrabold">{t.packageTitle}</p>
          <p className="mt-1 leading-relaxed text-white/80">{t.packageText}</p>

          <ParcelArt className="mx-auto my-6 block h-auto w-full max-w-[260px]" />

          <p className="font-display text-2xl leading-snug">{t.artText}</p>
          <ul className="mt-5 space-y-2.5 text-white/90">
            {dict.features.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <Check className="mt-0.5 size-5 shrink-0 text-sun" strokeWidth={3} />
                <span>
                  <span className="font-bold">{f.title}</span>
                  <span className="text-white/70"> · {f.text}</span>
                </span>
              </li>
            ))}
          </ul>

          {/* WhatsApp iletişim: kutunun altında, form kolonuyla aynı hizada kalır. */}
          <div className="mt-auto border-t border-white/20 pt-7">
            <p className="text-lg font-extrabold">{t.whatsappTitle}</p>
            <p className="mt-1 leading-relaxed text-white/80">{t.whatsappText}</p>
            <a
              href={whatsappUrl(locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex max-w-full items-center gap-3 rounded-full bg-white py-2.5 pe-6 ps-2.5 font-extrabold text-ink shadow-lift transition hover:bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                <MessageCircle className="size-6" aria-hidden="true" fill="currentColor" strokeWidth={0} />
              </span>
              <span>{dict.site.whatsapp}</span>
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
