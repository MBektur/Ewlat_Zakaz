"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Globe, Menu, X } from "lucide-react";
import { localeLabel, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LogoMark } from "./Logo";

type Props = {
  locale: Locale;
  brand: string;
  nav: Dictionary["nav"];
};

export function Header({ locale, brand, nav }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const other: Locale = locale === "tr" ? "ug" : "tr";
  const rest = pathname.replace(/^\/(tr|ug)(?=\/|$)/, "");
  const switchHref = `/${other}${rest}`;

  // Sayfa değişince mobil menüyü kapat
  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { href: `/${locale}`, label: nav.home, exact: true },
    { href: `/${locale}/kitaplar`, label: nav.books },
    { href: `/${locale}/on-siparis`, label: nav.preorder },
  ];
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:h-[72px] sm:px-6">
        <Link href={`/${locale}`} className="flex shrink-0 items-center gap-2.5" aria-label={brand}>
          <LogoMark />
          <span className="font-display text-lg font-semibold tracking-tight text-ink">{brand}</span>
        </Link>

        <nav className="ms-auto hidden items-center gap-1 md:flex" aria-label={nav.home}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href, l.exact) ? "page" : undefined}
              className="rounded-full px-4 py-2 text-[0.95em] text-body transition-colors hover:bg-soft hover:text-ink aria-[current=page]:bg-soft aria-[current=page]:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href={switchHref}
          hrefLang={other}
          lang={other}
          className="ms-auto inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-body shadow-soft transition-colors hover:border-line-strong hover:text-ink md:ms-2"
          aria-label={`${nav.language}: ${localeLabel[other]}`}
        >
          <Globe className="size-4" strokeWidth={1.6} />
          <span className={other === "ug" ? "ug-text leading-none" : ""}>{localeLabel[other]}</span>
        </Link>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full text-body hover:bg-soft md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? nav.closeMenu : nav.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-line/70 bg-bg px-4 pb-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href, l.exact) ? "page" : undefined}
              className="block rounded-xl px-3 py-3 text-body aria-[current=page]:bg-soft aria-[current=page]:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
