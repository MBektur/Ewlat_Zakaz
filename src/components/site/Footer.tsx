import { localePath } from "@/i18n/paths";
import Link from "next/link";
import { ArrowUpRight, Globe, Heart, Mail, MessageCircle, Phone } from "lucide-react";
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

type SocialKey = (typeof SOCIAL_LINKS)[number]["key"];

const SOCIAL_BG: Record<SocialKey, string> = {
  youtube: "bg-[#ff0000]",
  x: "bg-[#111]",
  facebook: "bg-[#1877f2]",
  instagram: "bg-[linear-gradient(135deg,#f09433,#dc2743,#bc1888)]",
  linkedin: "bg-[#0a66c2]",
};

function SocialGlyph({ name }: { name: SocialKey }) {
  const common = { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;
  switch (name) {
    case "youtube":
      return (
        <svg {...common} className="size-5">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common} className="size-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common} className="size-5">
          <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8.4v3h2.6V21z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2.2" className="size-5">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} className="size-5">
          <path d="M4 9h3.2v11H4zM5.6 4a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zM10 9h3.1v1.5c.4-.8 1.5-1.8 3.2-1.8 3.4 0 4 2.2 4 5.1V20h-3.2v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H10z" />
        </svg>
      );
  }
}

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="mt-24 bg-[#0f5c54] text-white">
      {/* Dalga geçişi */}
      <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="block h-10 w-full -translate-y-px text-bg" aria-hidden="true">
        <path d="M0 0h1440v20C1200 52 960 56 720 44S240 12 0 36Z" fill="currentColor" />
      </svg>

      {/* Ana içerik */}
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-4 sm:px-6">

        {/* ── Üst satır: logo + sosyal ── */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center">
          {/* Logo + tagline */}
          <div className="flex items-center gap-4">
            <LogoMark className="size-16 ring-2 ring-white/25 shadow-lg" />
            <div>
              <BrandText brand={dict.site.brand} className="text-2xl" light />
              <p className="mt-1 flex items-center gap-1.5 text-sm text-white/70">
                <Heart className="size-3.5 shrink-0 text-[#f5b335]" fill="currentColor" strokeWidth={0} />
                {dict.footer.tagline}
              </p>
            </div>
          </div>

          {/* Sosyal ikonlar */}
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                className={`flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-transform hover:scale-110 hover:brightness-110 ${SOCIAL_BG[s.key]}`}
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
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white transition-transform hover:scale-110 hover:brightness-110"
            >
              <MessageCircle className="size-5" fill="currentColor" strokeWidth={0} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* ── Orta ızgara: nav + iletişim ── */}
        <div className="mt-8 grid gap-8 sm:grid-cols-2 md:grid-cols-3">

          {/* Sayfalar */}
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-widest text-white/40">{dict.nav.books}</p>
            <nav className="flex flex-col gap-3" aria-label={dict.site.brand}>
              <Link
                href={localePath(locale, "books")}
                className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
              >
                <span className="size-1.5 rounded-full bg-[#f5b335] transition-transform group-hover:scale-125" />
                {dict.nav.books}
              </Link>
              <Link
                href={localePath(locale, "preorder")}
                className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
              >
                <span className="size-1.5 rounded-full bg-[#f5b335] transition-transform group-hover:scale-125" />
                {dict.nav.preorder}
              </Link>
              <Link
                href={localePath(locale, "privacy")}
                className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
              >
                <span className="size-1.5 rounded-full bg-[#f5b335] transition-transform group-hover:scale-125" />
                {dict.footer.privacy}
              </Link>
            </nav>
          </div>

          {/* İletişim */}
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-widest text-white/40">{dict.footer.contact}</p>
            <div className="flex flex-col gap-3">
              <a
                href={whatsappUrl(locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm font-semibold text-white/80 transition hover:text-white"
              >
                <Phone className="size-4 shrink-0 text-[#f5b335]" strokeWidth={2} />
                <span dir="ltr">{WHATSAPP_DISPLAY}</span>
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2.5 text-sm font-semibold text-white/80 transition hover:text-white"
              >
                <Mail className="size-4 shrink-0 text-[#f5b335]" strokeWidth={2} />
                <span dir="ltr">{CONTACT_EMAIL}</span>
              </a>
              <a
                href={NET_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm font-semibold text-white/80 transition hover:text-white"
              >
                <Globe className="size-4 shrink-0 text-[#f5b335]" strokeWidth={2} />
                <span dir="ltr">{NET_SITE_LABEL}</span>
              </a>
            </div>
          </div>

          {/* Ana site CTA */}
          <div className="flex flex-col justify-between gap-4">
            <p className="text-xs font-black uppercase tracking-widest text-white/40">{dict.footer.mainSite}</p>
            <a
              href={MAIN_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 self-start rounded-2xl border border-white/15 bg-white/8 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/14"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f5b335]/20">
                <Globe className="size-4 text-[#f5b335]" strokeWidth={2.2} />
              </span>
              <span>
                <span className="block text-white/60 text-xs">{dict.footer.mainSite}</span>
                <span dir="ltr" className="text-[#f5b335]">{MAIN_SITE_LABEL}</span>
              </span>
              <ArrowUpRight className="size-4 text-white/40 transition group-hover:text-white rtl:-scale-x-100" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Alt çubuk ── */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-white/40 sm:flex-row sm:px-6">
          {dict.footer.sampleNotice && (
            <p>{dict.footer.sampleNotice}</p>
          )}
          <p className="flex items-center gap-1">
            Made with <Heart className="size-3 text-[#f5b335]" fill="currentColor" strokeWidth={0} /> for Uyghur children
          </p>
        </div>
      </div>
    </footer>
  );
}
