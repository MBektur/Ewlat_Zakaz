"use client";

import type { Locale } from "@/i18n/config";
import { fill } from "@/lib/format";
import { formatDate, formatTry } from "@/lib/pricing";
import type { Pricing } from "@/lib/types";
import { useActivePrice } from "./usePrice";

type Props = {
  pricing: Pricing;
  locale: Locale;
  template?: string;
  untilTemplate?: string;
  className?: string;
};

/** "8.500 TL" ya da şablonla "Tüm koleksiyon 8.500 TL"; kampanya tarihi varsa altına ekler. */
export function PriceTag({ pricing, locale, template, untilTemplate, className }: Props) {
  const { price, isCampaign, endsAt } = useActivePrice(pricing);
  const text = formatTry(price, locale);
  return (
    <span className={className}>
      {template ? fill(template, { price: text }) : text}
      {untilTemplate && isCampaign && endsAt && (
        <span className="block text-sm font-semibold opacity-80">
          {fill(untilTemplate, { date: formatDate(endsAt, locale) })}
        </span>
      )}
    </span>
  );
}
