import type { Locale } from "@/i18n/config";

/** WhatsApp numarası: ülke koduyla, artı ve boşluk olmadan. */
export const WHATSAPP_NUMBER = "905530707350";

/** Ewlat ana sitesi (geçiş linki). */
export const MAIN_SITE_URL = "https://ewlat.org";
export const MAIN_SITE_LABEL = "ewlat.org";

/** Ekranda gösterilen biçim. */
export const WHATSAPP_DISPLAY = "+90 553 070 73 50";

const messages: Record<Locale, string> = {
  tr: "Merhaba, ön sipariş hakkında bilgi almak istiyorum.",
  ug: "ئەسسالامۇئەلەيكۇم، 154 كىتابنى زاكاز قىلىش ھەققىدە ئۇچۇر ئالماقچى ئىدىم.",
};

/** "Click to chat" bağlantısı; mesaj, sohbet açılınca hazır yazılı gelir. */
export function whatsappUrl(locale: Locale, message?: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message ?? messages[locale])}`;
}
