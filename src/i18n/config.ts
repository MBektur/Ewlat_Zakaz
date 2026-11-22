export const locales = ["tr", "ug"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

export const hasLocale = (value: string | undefined): value is Locale =>
  !!value && (locales as readonly string[]).includes(value);

export const localeDir: Record<Locale, "ltr" | "rtl"> = { tr: "ltr", ug: "rtl" };

export const localeLabel: Record<Locale, string> = {
  tr: "Türkçe",
  ug: "ئۇيغۇرچە",
};
