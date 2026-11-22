"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookCopy, ExternalLink, Layers, LogOut, Settings, ShoppingBag } from "lucide-react";
import { logout } from "@/lib/actions/admin";

const links = [
  { href: "/admin", label: "Siparişler", icon: ShoppingBag, exact: true },
  { href: "/admin/kitaplar", label: "Kitaplar", icon: BookCopy },
  { href: "/admin/setler", label: "Setler", icon: Layers },
  { href: "/admin/ayarlar", label: "Fiyat & ayarlar", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap items-center gap-1">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-body hover:bg-soft aria-[current=page]:bg-primary aria-[current=page]:text-white"
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
      <span className="mx-1 hidden h-6 w-px bg-line sm:block" />
      <Link href="/tr" target="_blank" className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-body hover:bg-soft">
        <ExternalLink className="size-4" />
        Siteyi gör
      </Link>
      <form action={logout}>
        <button type="submit" className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-body hover:bg-soft">
          <LogOut className="size-4" />
          Çıkış
        </button>
      </form>
    </nav>
  );
}
