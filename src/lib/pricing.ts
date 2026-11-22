import type { Pricing } from "./types";

export type ActivePrice = {
  price: number;
  /** Kampanya fiyatı geçerli ve bitiş tarihi var mı? */
  isCampaign: boolean;
  endsAt: Date | null;
};

/**
 * Kampanya bitiş tarihi geçtiyse ve normal fiyat girilmişse normal fiyat geçerli olur.
 * Normal fiyat girilmemişse kampanya fiyatı geçerli kalır (fiyat sessizce değişmesin).
 */
export function activePrice(p: Pricing, now: Date): ActivePrice {
  const endsAt = p.campaignEndsAt ? new Date(p.campaignEndsAt) : null;
  const expired = !!endsAt && now > endsAt;
  if (expired && p.regularPriceTry) {
    return { price: p.regularPriceTry, isCampaign: false, endsAt: null };
  }
  return { price: p.campaignPriceTry, isCampaign: !!endsAt && !expired, endsAt: expired ? null : endsAt };
}

export function formatTry(amount: number, locale: "tr" | "ug") {
  const n = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(amount);
  return locale === "ug" ? `${n} TL` : `${n} TL`;
}

export function formatDate(date: Date, locale: "tr" | "ug") {
  return new Intl.DateTimeFormat(locale === "ug" ? "ug" : "tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  }).format(date);
}
