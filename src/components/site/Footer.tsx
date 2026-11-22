import { localePath } from "@/i18n/paths";
import Link from "next/link";
import { ArrowUpRight, Globe, Heart, Mail, MessageCircle } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  CONTACT_EMAIL,
  MAIN_SITE_LABEL,
  MAIN_SITE_URL,
  NET_SITE_LABEL,
  NET_SITE_URL,
  SOCIAL_LINKS,
  WHATSAPP_DISPLAY,
  whatsappUrl,
} from "@/lib/contact";
import { BrandText, LogoMark } from "./Logo";

const linkClass = "inline-flex items-center gap-2 text-white/90 transition hover:text-sun";

type SocialKey = (typeof SOCIAL_LINKS)[number]["key"];

/** Marka ikonlarının arka planı (lucide'da marka ikonu yok). */
const SOCIAL_BG: Record<SocialKey, string> = {
  youtube: "bg-[#ff0000]",
  x: "bg-black",
  facebook: "bg-[#1877f2]",
  instagram: "bg-[linear-gradient(45deg,#f09433,#dc2743,#bc1888)]",
  linkedin: "bg-[#0a66c2]",
};

/** Marka ikonları: tek renk, 24'lük viewBox. */
function SocialGlyph({ name }: { name: SocialKey }) {
  const common = { viewBox: "0 0 24 24", className: "size-5", fill: "currentColor", "aria-hidden": true } as const;
  switch (name) {
    case "youtube":
      return (
        <svg {...common} className="size-6">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8.4v3h2.6V21z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M4 9h3.2v11H4zM5.6 4a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zM10 9h3.1v1.5c.4-.8 1.5-1.8 3.2-1.8 3.4 0 4 2.2 4 5.1V20h-3.2v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H10z" />
        </svg>
      );
  }
}

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="mt-16 bg-teal-dark text-white">
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="block h-8 w-full -translate-y-px text-bg" aria-hidden="true">
        <path d="M0 0h1440v14c-240 24-480 26-720 8S240 2 0 22Z" fill="currentColor" />
      </svg>

      {/* Alt boşluk: sabit kaydırma/WhatsApp grubu mobil ve tablette içeriğin üstüne gelebilir; geniş ekranda kenarda kaldığı için boşluk azaltılır. */}
      <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 pb-10 pt-2 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] md:pb-12">
        {/* Marka */}
        <div>
          <div className="flex items-center gap-3">
            <LogoMark className="size-14 ring-2 ring-white/30" />
            <BrandText brand={dict.site.brand} className="text-2xl" light />
          </div>
          <p className="font-display mt-4 flex items-center gap-2.5 text-lg leading-snug text-white/90">
            <Heart className="size-5 shrink-0 text-sun" fill="currentColor" strokeWidth={0} />
            {dict.footer.tagline}
          </p>
        </div>

        {/* Sayfalar */}
        <nav className="flex flex-col gap-2.5 font-bold" aria-label={dict.site.brand}>
          <Link href={localePath(locale, "books")} className={linkClass}>{dict.nav.books}</Link>
          <Link href={localePath(locale, "preorder")} className={linkClass}>{dict.nav.preorder}</Link>
          <Link href={localePath(locale, "privacy")} className={linkClass}>{dict.footer.privacy}</Link>
        </nav>

        {/* İletişim ve ana site */}
        <div className="flex flex-col items-start gap-3 font-bold">
          <p className="text-sm uppercase tracking-wide text-white/60">{dict.footer.contact}</p>
          <a href={whatsappUrl(locale)} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <MessageCircle className="size-5 shrink-0" aria-hidden="true" />
            <span dir="ltr">{WHATSAPP_DISPLAY}</span>
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            <Mail className="size-5 shrink-0" aria-hidden="true" />
            <span dir="ltr">{CONTACT_EMAIL}</span>
          </a>
          <a href={NET_SITE_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <Globe className="size-5 shrink-0" aria-hidden="true" />
            <span dir="ltr">{NET_SITE_LABEL}</span>
          </a>
          <a
            href={MAIN_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-white transition hover:bg-white/22"
          >
            {dict.footer.mainSite}
            <span dir="ltr" className="text-sun">{MAIN_SITE_LABEL}</span>
            <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </a>

          {/* Sosyal medya */}
          <div className="mt-1 flex flex-nowrap gap-2">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                className={`flex size-10 shrink-0 items-center justify-center rounded-full text-white ring-2 ring-white/20 transition hover:scale-105 hover:ring-white/50 ${SOCIAL_BG[s.key]}`}
              >
                <SocialGlyph name={s.key} />
              </a>
            ))}
            <a
              href={whatsappUrl(locale)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white ring-2 ring-white/20 transition hover:scale-105 hover:ring-white/50"
            >
              <MessageCircle className="size-5" aria-hidden="true" fill="currentColor" strokeWidth={0} />
            </a>
          </div>
        </div>
      </div>

      {dict.footer.sampleNotice && (
        <p className="border-t border-white/15 px-4 py-4 text-center text-sm text-white/75">{dict.footer.sampleNotice}</p>
      )}
    </footer>
  );
}
