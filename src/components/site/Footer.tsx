import { FooterScene } from "@/components/art/FooterScene";
import { LeafCluster } from "@/components/art/Leaves";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { BrandText, LogoMark } from "./Logo";

/** Alt bilgi sahnesi özgün SVG'dir (FooterScene). */
export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="relative mt-16 min-h-[180px] overflow-hidden bg-gradient-to-b from-[#daebfd] to-[#c4e2fc]">
      {/* Üstte dalgalı geçiş (sayfa zemininden alt bilgiye) */}
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="relative z-10 block h-8 w-full text-bg" aria-hidden="true">
        <path d="M0 0h1440v14c-220 22-440 24-700 6S250 4 0 22Z" fill="currentColor" />
      </svg>

      <LeafCluster className="pointer-events-none absolute bottom-2 start-0 hidden h-28 w-auto sm:block rtl:-scale-x-100" />
      <FooterScene className="pointer-events-none absolute bottom-0 end-0 hidden h-[92%] w-auto sm:block rtl:-scale-x-100" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-5 px-4 pb-8 pt-4 sm:flex-row sm:items-center sm:px-6 sm:pb-10">
        <Link href={`/${locale}`} className="flex items-center gap-3" aria-label={dict.site.brand}>
          <LogoMark className="size-14" />
          <BrandText brand={dict.site.brand} className="text-2xl" />
        </Link>
        <div className="hidden h-14 w-px bg-ink/70 sm:mx-6 sm:block" aria-hidden="true" />
        <div>
          <p className="flex items-center gap-3 text-lg font-extrabold leading-tight text-ink">
            <Heart className="size-8 shrink-0 text-danger" strokeWidth={1.8} />
            {dict.footer.tagline}
          </p>
          <p className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted sm:ms-11">
            <Link href={`/${locale}/gizlilik`} className="hover:text-ink">{dict.footer.privacy}</Link>
            {dict.footer.sampleNotice && <span>{dict.footer.sampleNotice}</span>}
          </p>
        </div>
      </div>
    </footer>
  );
}
