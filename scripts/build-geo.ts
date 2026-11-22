/**
 * Ülke → eyalet/bölge → şehir listelerini public/geo/ altına ülke başına küçük bir JSON olarak yazar.
 * Tarayıcı seçilen ülkenin dosyasını çeker; sunucu da doğrulama için aynı dosyayı okur.
 * `npm run dev` ve `npm run build` öncesinde otomatik çalışır; dosyalar varsa atlanır (--force ile yenilenir).
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { City, Country, State } from "country-state-city";

const out = "public/geo";
if (!process.argv.includes("--force") && existsSync(`${out}/countries.json`)) {
  console.log("geo: dosyalar mevcut, atlandı");
  process.exit(0);
}
mkdirSync(out, { recursive: true });

const countries = Country.getAllCountries();
writeFileSync(`${out}/countries.json`, JSON.stringify(countries.map((c) => ({ code: c.isoCode, name: c.name }))));

/** Paketteki bilinen yazım hataları (ülke → eski ad → doğru ad). */
const FIXES: Record<string, Record<string, string>> = { TR: { Istanbul: "İstanbul" } };

let total = 0;
for (const c of countries) {
  const collator = new Intl.Collator(c.isoCode === "TR" ? "tr" : undefined);
  const states = State.getStatesOfCountry(c.isoCode)
    .map((s) => ({
      code: s.isoCode,
      name: FIXES[c.isoCode]?.[s.name] ?? s.name,
      cities: [...new Set(City.getCitiesOfState(c.isoCode, s.isoCode).map((x) => x.name))].sort(collator.compare),
    }))
    .sort((a, b) => collator.compare(a.name, b.name));
  writeFileSync(`${out}/${c.isoCode}.json`, JSON.stringify({ states }));
  total += states.length;
}
console.log(`geo: ${countries.length} ülke, ${total} bölge yazıldı → ${out}/`);
