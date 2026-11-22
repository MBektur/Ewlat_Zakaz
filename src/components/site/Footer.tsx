import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LogoMark } from "./Logo";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="mt-24 border-t border-line bg-soft/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <LogoMark className="size-10" />
          <div>
            <p className="font-display text-lg font-semibold text-ink">{dict.site.brand}</p>
            <p className="text-sm text-muted">{dict.footer.tagline}</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-body">
          <Link href={`/${locale}/kitaplar`} className="hover:text-ink">{dict.nav.books}</Link>
          <Link href={`/${locale}/on-siparis`} className="hover:text-ink">{dict.nav.preorder}</Link>
          <Link href={`/${locale}/gizlilik`} className="hover:text-ink">{dict.footer.privacy}</Link>
        </nav>
      </div>
      {dict.footer.sampleNotice && (
        <p className="border-t border-line/70 px-4 py-3 text-center text-sm text-muted">
          {dict.footer.sampleNotice}
        </p>
      )}
    </footer>
  );
}
