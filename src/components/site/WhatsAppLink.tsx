import { MessageCircle } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { whatsappUrl } from "@/lib/contact";

type Props = {
  locale: Locale;
  label: string;
  /** Hazır yazılı mesaj (verilmezse dile göre varsayılan kullanılır). */
  message?: string;
  className?: string;
};

/** WhatsApp'ta sohbet açan bağlantı (click to chat). */
export function WhatsAppLink({ locale, label, message, className = "" }: Props) {
  return (
    <a
      href={whatsappUrl(locale, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] ${className}`}
    >
      <MessageCircle className="size-5 shrink-0" aria-hidden="true" />
      {label}
    </a>
  );
}
