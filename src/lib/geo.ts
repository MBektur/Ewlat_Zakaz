import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";

import type { CountryOption, GeoState } from "./geo-types";

export type { CountryOption, GeoState };
export type GeoCountry = { states: GeoState[] };

const GEO_DIR = path.join(process.cwd(), "public", "geo");
const cache = new Map<string, GeoCountry>();

/** Sunucu tarafı doğrulama için ülkenin bölge/şehir listesi (public/geo/XX.json). */
export async function loadGeo(country: string): Promise<GeoCountry | null> {
  if (!/^[A-Z]{2}$/.test(country)) return null;
  const hit = cache.get(country);
  if (hit) return hit;
  try {
    const data = JSON.parse(await readFile(path.join(GEO_DIR, `${country}.json`), "utf8")) as GeoCountry;
    cache.set(country, data);
    return data;
  } catch {
    return null;
  }
}

const POPULAR = ["TR", "KZ", "KG", "UZ", "DE", "NL", "SE", "NO", "FI", "US", "CA", "AU", "SA", "AE"];

/** Ülke listesi, arayüz diline göre adlandırılmış; yaygın ülkeler başta. */
export async function getCountryList(locale: "tr" | "ug") {
  "use cache";
  cacheLife("max");
  const raw = JSON.parse(await readFile(path.join(GEO_DIR, "countries.json"), "utf8")) as CountryOption[];
  const names = new Intl.DisplayNames([locale], { type: "region" });
  const label = (c: CountryOption) => {
    try {
      const n = names.of(c.code);
      return n && n !== c.code ? n : c.name;
    } catch {
      return c.name;
    }
  };
  const all = raw.map((c) => ({ code: c.code, name: label(c) }));
  const popular = POPULAR.map((code) => all.find((c) => c.code === code)).filter((c): c is CountryOption => !!c);
  const collator = new Intl.Collator(locale === "ug" ? "ar" : "tr");
  const rest = all.filter((c) => !POPULAR.includes(c.code)).sort((a, b) => collator.compare(a.name, b.name));
  return { popular, rest };
}

/** public/geo dosyaları sunucuda okunabiliyor mu? (Okunamıyorsa sunucu doğrulaması gevşer, istemci listeleri yine zorunlu kılar.) */
export async function geoDataAvailable() {
  try {
    await readFile(path.join(GEO_DIR, "countries.json"), "utf8");
    return true;
  } catch {
    return false;
  }
}
