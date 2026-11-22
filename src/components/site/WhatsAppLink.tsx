import { MessageCircle } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { whatsappUrl } from "@/lib/contact";

type Props = {
  locale: Locale;
  label: string;
  /** Hazır yazılı mesaj (verilmezse dile göre varsayılan kullanılır). */
  message?: string;
};

/** Sağ altta (RTL'de sol altta) sabit duran WhatsApp butonu: tıklayınca sohbet açılır (click to chat). */
export function WhatsAppFloat({ locale, label, message }: Props) {
  return (
    <a
      href={whatsappUrl(locale, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="fixed bottom-4 end-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:scale-105 hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:bottom-6 sm:end-6"
    >
      <MessageCircle className="size-7" aria-hidden="true" fill="currentColor" strokeWidth={0} />
    </a>
  );
}
