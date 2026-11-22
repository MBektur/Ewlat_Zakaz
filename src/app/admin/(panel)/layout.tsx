import { Suspense } from "react";
import { LogoMark } from "@/components/site/Logo";
import { AdminNav } from "@/components/admin/AdminNav";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-9" />
            <span className="font-display text-lg">Yönetim</span>
          </div>
          <div className="sm:ms-auto">
            <Suspense fallback={null}>
              <AdminNav />
            </Suspense>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
