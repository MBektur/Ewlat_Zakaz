import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { PreorderSection } from "@/components/preorder/PreorderSection";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.preorder.title, description: dict.preorder.notice };
}

export default async function PreorderPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
      <PreorderSection locale={locale} dict={dict} fromUrl headingLevel="h1" />
    </div>
  );
}
