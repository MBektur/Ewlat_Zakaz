import { Languages, Truck } from "lucide-react";
import { PriceTag } from "@/components/preorder/PriceTag";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getPricing } from "@/lib/queries";

/** İnce üst şerit: teslimat, kampanya fiyatı, dil bilgisi. */
export async function Topbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pricing = await getPricing();
  return (
    <div className="bg-primary text-sm font-bold text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-6 px-4 py-2 sm:justify-between sm:px-6">
        <span className="hidden items-center gap-2 md:inline-flex">
          <Truck className="size-4 rtl:-scale-x-100" /> {dict.topbar.ship}
        </span>
        <PriceTag pricing={pricing} locale={locale} template={dict.topbar.offer} />
        <span className="hidden items-center gap-2 md:inline-flex">
          <Languages className="size-4" /> {dict.topbar.lang}
        </span>
      </div>
    </div>
  );
}
