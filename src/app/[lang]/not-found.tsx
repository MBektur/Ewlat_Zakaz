import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export default async function NotFound() {
  const locale = await getLocale();
  const t = (await getDictionary(locale)).notFound;
  return (
    <div className="mx-auto max-w-md px-4 py-28 text-center">
      <p className="font-display text-7xl text-line-strong">404</p>
      <h1 className="font-display mt-4 text-3xl text-ink">{t.title}</h1>
      <p className="mt-2 text-body">{t.text}</p>
      <Link href={`/${locale}`} className="mt-6 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-surface">
        {t.back}
      </Link>
    </div>
  );
}
