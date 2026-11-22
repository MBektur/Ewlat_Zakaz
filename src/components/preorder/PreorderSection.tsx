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

      <aside className="relative flex flex-col overflow-hidden rounded-[2rem] border border-line bg-surface p-6 shadow-soft sm:p-8">
        {/* Fiyat & Paket Vurgu Alanı */}
        <div className="rounded-2xl border border-line bg-gradient-to-b from-[#fff6ed] to-[#fedec1]/35 p-6">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary">
            {t.priceLabel}
          </span>
          <PriceTag
            pricing={pricing}
            locale={locale}
            untilTemplate={t.campaignUntil}
            className="font-display mt-2 block text-4xl font-extrabold text-ink sm:text-5xl"
          />
          <p className="mt-3 text-lg font-extrabold text-ink">{t.packageTitle}</p>
          <p className="mt-1 text-sm leading-relaxed text-body">{t.packageText}</p>
        </div>

        {/* Kargo Görseli */}
        <div className="my-6 flex items-center justify-center rounded-2xl border border-line/60 bg-soft/30 p-4">
          <ParcelArt className="h-auto w-full max-w-[230px]" />
        </div>

        {/* Özellikler Başlığı */}
        <p className="font-display text-2xl font-extrabold leading-snug text-ink">{t.artText}</p>

        {/* Özellik Listesi */}
        <ul className="mt-4 space-y-3">
          {dict.features.map((f) => (
            <li key={f.title} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-dark/10 text-teal-dark">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              <span className="text-sm leading-snug">
                <span className="font-bold text-ink">{f.title}</span>
                <span className="text-muted"> · {f.text}</span>
              </span>
            </li>
          ))}
        </ul>

        {/* WhatsApp İletişim */}
        <div className="mt-auto border-t border-line pt-6">
          <p className="text-base font-extrabold text-ink">{t.whatsappTitle}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{t.whatsappText}</p>
          <a
            href={whatsappUrl(locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-5 py-3 font-extrabold text-white shadow-soft transition hover:bg-[#20ba5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
          >
            <MessageCircle className="size-5 fill-current" aria-hidden="true" />
            <span>{dict.site.whatsapp}</span>
          </a>
        </div>
      </aside>
    </div>
  );
}
