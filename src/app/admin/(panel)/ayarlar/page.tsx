import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { readPricing } from "@/lib/queries";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Loading, PageTitle } from "@/components/admin/ui";

export const metadata = { title: "Fiyat & ayarlar" };

export default function SettingsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Settings />
    </Suspense>
  );
}

async function Settings() {
  await requireAdmin();
  const pricing = await readPricing();
  return (
    <>
      <PageTitle title="Fiyat & ayarlar" />
      <SettingsForm pricing={pricing} />
    </>
  );
}
