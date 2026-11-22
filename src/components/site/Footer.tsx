import { localePath } from "@/i18n/paths";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { BrandText, LogoMark } from "./Logo";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="mt-20 bg-teal-dark text-white">
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="block h-8 w-full -translate-y-px text-bg" aria-hidden="true">
        <path d="M0 0h1440v14c-240 24-480 26-720 8S240 2 0 22Z" fill="currentColor" />
      </svg>
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-10 pt-4 sm:px-6 md:grid-cols-[1fr_auto]">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark className="size-14" />
            <BrandText brand={dict.site.brand} className="text-2xl" light />
          </div>
          <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-bold" aria-label={dict.site.brand}>
            <Link href={localePath(locale, "books")} className="text-white/90 hover:text-sun">{dict.nav.books}</Link>
            <Link href={localePath(locale, "preorder")} className="text-white/90 hover:text-sun">{dict.nav.preorder}</Link>
            <Link href={localePath(locale, "privacy")} className="text-white/90 hover:text-sun">{dict.footer.privacy}</Link>
          </nav>
        </div>
        <div className="rounded-3xl bg-white px-6 py-5 text-ink shadow-lift">
          <p className="font-display flex items-center gap-3 text-xl leading-tight">
            <Heart className="size-7 shrink-0 text-primary" fill="currentColor" strokeWidth={0} />
            {dict.footer.tagline}
          </p>
        </div>
      </div>
      {dict.footer.sampleNotice && (
        <p className="border-t border-white/15 px-4 py-4 text-center text-sm text-white/75">{dict.footer.sampleNotice}</p>
      )}
    </footer>
  );
}
