import { localePath } from "@/i18n/paths";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Sparkle } from "@/components/art/HeroDecor";
import { PriceTag } from "@/components/preorder/PriceTag";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Pricing } from "@/lib/types";

/** Kampanya banner'ı: fiyat ve bitiş tarihi (admin'den) burada da görünür. */
export function Banner({ locale, dict, pricing }: { locale: Locale; dict: Dictionary; pricing: Pricing }) {
  const t = dict.banner;
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-9 text-white sm:px-10">
      <svg viewBox="0 0 200 200" className="pointer-events-none absolute -start-10 -top-12 size-56 opacity-20" aria-hidden="true">
        <circle cx="100" cy="100" r="100" fill="#fff" />
      </svg>
      <svg viewBox="0 0 200 200" className="pointer-events-none absolute -bottom-16 -end-10 size-64 opacity-15" aria-hidden="true">
        <circle cx="100" cy="100" r="100" fill="#ffc94d" />
      </svg>
      <Sparkle className="pointer-events-none absolute end-[44%] top-6 hidden size-6 sm:block" color="#ffc94d" />

      <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          {/* Üst üste kitap yığını */}
          <svg viewBox="0 0 120 110" className="hidden h-24 w-auto shrink-0 sm:block" aria-hidden="true">
            <rect x="14" y="74" width="92" height="26" rx="5" fill="#0eb7a6" />
            <rect x="14" y="74" width="92" height="7" rx="3" fill="#2a9d8f" />
            <rect x="22" y="48" width="88" height="26" rx="5" fill="#ffc94d" transform="rotate(-5 66 61)" />
            <rect x="22" y="48" width="88" height="7" rx="3" fill="#ffe08a" transform="rotate(-5 66 61)" />
            <rect x="12" y="22" width="84" height="26" rx="5" fill="#fff" transform="rotate(4 54 35)" />
            <rect x="12" y="22" width="84" height="7" rx="3" fill="#fde8d4" transform="rotate(4 54 35)" />
            <path d="m84 8 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="#ffc94d" />
          </svg>
          <div>
            <h2 className="font-display text-3xl leading-tight sm:text-5xl">{t.title}</h2>
            <p className="mt-2 flex flex-wrap items-baseline gap-x-3 text-lg font-bold sm:text-2xl">
              <span>{t.text}</span>
              <PriceTag pricing={pricing} locale={locale} untilTemplate={dict.preorder.campaignUntil} className="font-display text-4xl text-sun sm:text-5xl" />
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <span className="-rotate-3 rounded-2xl bg-teal-dark px-4 py-2 text-sm font-extrabold shadow-soft">{t.badge}</span>
          <Link
            href={localePath(locale, "preorder")}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-lg font-extrabold text-primary shadow-lift transition hover:bg-soft"
          >
            {t.cta}
            <ArrowRight className="size-5 rtl:-scale-x-100" strokeWidth={2.6} />
          </Link>
        </div>
      </div>
    </div>
  );
}
