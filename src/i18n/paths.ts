import type { Locale } from "./config";

/**
 * Sayfa adresleri dile göre yerelleştirilir: Türkçede /tr/kitaplar, /tr/on-siparis;
 * Uygurcada (Latin yazımıyla) /ug/kitablar, /ug/zakaz. Dosya yapısı Türkçe adlarda kalır;
 * Uygurca adresler src/proxy.ts içinde yeniden yazılır (rewrite).
 */
export const routes = {
  books: { tr: "kitaplar", ug: "kitablar" },
  preorder: { tr: "on-siparis", ug: "zakaz" },
  privacy: { tr: "gizlilik", ug: "mexpiyetlik" },
} as const;

export type Route = keyof typeof routes;

/** localePath("ug", "preorder") → "/ug/zakaz". search: "?set=..." gibi ek. */
export function localePath(locale: Locale, route?: Route, search = "") {
  return `/${locale}${route ? `/${routes[route][locale]}` : ""}${search}`;
}

/** Dil değiştirirken geçerli yolu karşı dildeki karşılığına çevirir: /tr/kitaplar → /ug/kitablar. */
export function switchPath(pathname: string, to: Locale) {
  const [, , segment, ...rest] = pathname.split("/");
  if (!segment) return `/${to}`;
  const route = (Object.keys(routes) as Route[]).find((r) => Object.values(routes[r]).includes(segment as never));
  const mapped = route ? routes[route][to] : segment;
  return `/${[to, mapped, ...rest].join("/")}`;
}

/** Uygurca adres → dosya yapısındaki (Türkçe) ad, ve tersi. */
export const ugToInternal: Record<string, string> = Object.fromEntries(
  (Object.keys(routes) as Route[]).map((r) => [routes[r].ug, routes[r].tr]),
);
export const internalToUg: Record<string, string> = Object.fromEntries(
  (Object.keys(routes) as Route[]).map((r) => [routes[r].tr, routes[r].ug]),
);
