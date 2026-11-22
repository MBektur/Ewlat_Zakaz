import { localePath } from "@/i18n/paths";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { CONTACT_EMAIL, whatsappUrl } from "@/lib/contact";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  return { title: dict.privacy.title, robots: { index: false } };
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.privacy;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      {/* ── Üst Başlık & Güven Rozeti ── */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-teal-dark/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-teal-dark">
          <ShieldCheck className="size-4" strokeWidth={2.4} />
          <span>{locale === "ug" ? "مەخپىيەتلىك كاپالىتى" : "Güvenlik & Gizlilik"}</span>
        </span>
        <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
          {t.title}
        </h1>
        {t.subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-body sm:text-lg">
            {t.subtitle}
          </p>
        )}
      </div>

      {/* ── Ana İçerik Kartı ── */}
      <div className="mt-10 rounded-[2.5rem] border border-line bg-surface p-6 shadow-soft sm:p-12">
        <div className="space-y-6">
          {t.sections.map((s, index) => (
            <section
              key={s.heading}
              className="relative rounded-2xl border border-line/60 bg-[#fffdfa] p-5 sm:p-7 transition hover:border-line-strong hover:shadow-soft"
            >
              <div className="flex items-start gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-teal-dark text-sm font-extrabold text-white shadow-soft">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h2 className="font-display text-xl font-extrabold text-ink sm:text-2xl">
                    {s.heading}
                  </h2>
                  <p className="mt-2 text-base leading-relaxed text-body">
                    {s.text}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* ── İletişim & Güvence Kutusu ── */}
        <div className="mt-10 rounded-2xl border border-teal-dark/20 bg-gradient-to-br from-[#f0f9f8] to-[#e6f4f2] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-lg font-extrabold text-teal-dark sm:text-xl">
                {t.contactTitle}
              </h3>
              <p className="mt-1 text-sm text-body">
                {t.contactText}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={whatsappUrl(locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-extrabold text-white shadow-soft transition hover:bg-[#20ba5a]"
              >
                <MessageCircle className="size-4 fill-current" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-full border border-teal-dark/30 bg-white px-5 py-2.5 text-sm font-extrabold text-teal-dark shadow-soft transition hover:bg-teal-dark hover:text-white"
              >
                <Mail className="size-4" strokeWidth={2.2} />
                <span>{CONTACT_EMAIL}</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Geri Dön Butonu ── */}
        <div className="mt-10 flex justify-center border-t border-line pt-8">
          <Link
            href={localePath(locale, "preorder")}
            className="btn-coral inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-base font-extrabold shadow-lift transition"
          >
            <ArrowLeft className="size-5 rtl:rotate-180" strokeWidth={2.4} />
            <span>{t.back}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
