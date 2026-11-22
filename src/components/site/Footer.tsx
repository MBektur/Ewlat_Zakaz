import { localePath } from "@/i18n/paths";
import Link from "next/link";
import { ArrowUpRight, Heart, MessageCircle } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { MAIN_SITE_LABEL, MAIN_SITE_URL, WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/contact";
import { BrandText, LogoMark } from "./Logo";

const linkClass = "inline-flex items-center gap-2 text-white/90 transition hover:text-sun";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="mt-16 bg-teal-dark text-white">
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="block h-8 w-full -translate-y-px text-bg" aria-hidden="true">
        <path d="M0 0h1440v14c-240 24-480 26-720 8S240 2 0 22Z" fill="currentColor" />
      </svg>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-48 pt-2 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
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
        </div>
      </div>

      {dict.footer.sampleNotice && (
        <p className="border-t border-white/15 px-4 py-4 text-center text-sm text-white/75">{dict.footer.sampleNotice}</p>
      )}
    </footer>
  );
}
