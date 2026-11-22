"use client";

import { useSyncExternalStore } from "react";
import { activePrice, type ActivePrice } from "@/lib/pricing";
import type { Pricing } from "@/lib/types";

const subscribe = () => () => {};

/**
 * Geçerli fiyat zamana bağlı (kampanya bitişi), bu yüzden tarayıcıda hesaplanır.
 * Sunucu render'ında kampanya fiyatı gösterilir; sipariş kaydında fiyat sunucuda yeniden hesaplanır.
 */
export function useActivePrice(pricing: Pricing): ActivePrice {
  const now = useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 60_000),
    () => 0,
  );
  if (now === 0) {
    const endsAt = pricing.campaignEndsAt ? new Date(pricing.campaignEndsAt) : null;
    return { price: pricing.campaignPriceTry, isCampaign: !!endsAt, endsAt };
  }
  return activePrice(pricing, new Date(now * 60_000));
}
