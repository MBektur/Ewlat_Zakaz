import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

// NOT: Bu metin bir taslaktır. Yayına almadan önce veri sorumlusu bilgileri
// (unvan, adres, iletişim) eklenmeli ve hukuki açıdan gözden geçirilmelidir.

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.privacy.title, robots: { index: false } };
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.privacy;
  return (
    <article className="mx-auto max-w-2xl px-4 pt-12 sm:px-6 sm:pt-16">
      <h1 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">{t.title}</h1>
      <div className="mt-8 space-y-7">
        {t.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-medium text-ink">{s.heading}</h2>
            <p className="mt-2 leading-relaxed text-body">{s.text}</p>
          </section>
        ))}
      </div>
      <Link href={`/${locale}/on-siparis`} className="mt-10 inline-block text-sm font-medium text-primary hover:underline">
        {t.back}
      </Link>
    </article>
  );
}
