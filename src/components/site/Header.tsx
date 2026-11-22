"use client";

import { localePath, switchPath } from "@/i18n/paths";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe, House, Menu, X } from "lucide-react";
import { locales, localeLabel, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { BrandText, LogoMark } from "./Logo";

type Props = {
  locale: Locale;
  brand: string;
  nav: Dictionary["nav"];
};

export function Header({ locale, brand, nav }: Props) {
  const pathname = usePathname();
  // Menü hangi sayfada açıldıysa yalnızca orada açık kalır; sayfa değişince kendiliğinden kapanır
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  const links = [
    { href: `/${locale}`, label: nav.home, exact: true, icon: true },
    { href: localePath(locale, "books"), label: nav.books },
    { href: localePath(locale, "preorder"), label: nav.preorder },
  ];
  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href={`/${locale}`} className="flex shrink-0 items-center gap-2.5" aria-label={brand}>
          <LogoMark />
          <BrandText brand={brand} />
        </Link>

        <nav className="ms-auto hidden items-center gap-1 md:flex" aria-label={nav.home}>
          {links.map((l) => {
            const active = isActive(l.href, l.exact);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-bold text-ink transition hover:bg-soft aria-[current=page]:bg-soft aria-[current=page]:text-primary"
              >
                {l.icon && <House className="size-4" strokeWidth={2.4} />}
                {l.label}
              </Link>
            );
          })}
        </nav>

        <LanguageMenu locale={locale} pathname={pathname} label={nav.language} />

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full bg-surface text-ink shadow-soft md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? nav.closeMenu : nav.openMenu}
          onClick={() => setOpenOn(open ? null : pathname)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="absolute inset-x-4 top-full rounded-3xl bg-surface p-3 shadow-lift md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href, l.exact) ? "page" : undefined}
              className="block rounded-2xl px-4 py-3 font-bold text-ink aria-[current=page]:bg-soft aria-[current=page]:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function LanguageMenu({ locale, pathname, label }: { locale: Locale; pathname: string; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative ms-auto md:ms-3">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${label}: ${localeLabel[locale]}`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 font-bold text-ink shadow-soft transition hover:shadow-lift"
      >
        <Globe className="size-[18px] text-ink" strokeWidth={2} />
        <span className={locale === "ug" ? "ug-text leading-none" : ""}>{localeLabel[locale]}</span>
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2.4} />
      </button>
      {open && (
        <div role="menu" className="absolute end-0 top-full mt-2 min-w-40 rounded-2xl bg-surface p-1.5 shadow-lift">
          {locales.map((l) => (
            <Link
              key={l}
              role="menuitem"
              href={switchPath(pathname, l)}
              hrefLang={l}
              lang={l}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 font-bold text-ink hover:bg-soft"
            >
              <span className={l === "ug" ? "ug-text" : ""}>{localeLabel[l]}</span>
              {l === locale && <Check className="size-4 text-primary" strokeWidth={2.6} />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
