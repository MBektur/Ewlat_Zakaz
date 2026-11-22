import { Loader2 } from "lucide-react";

export function PageTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 className="font-display text-3xl">{title}</h1>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex items-center gap-2 py-16 text-muted">
      <Loader2 className="size-5 animate-spin" /> Yükleniyor…
    </div>
  );
}

export const inputCls =
  "w-full rounded-xl border border-line bg-surface px-3 py-2.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";
export const btnPrimary = "btn-blue inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold text-body hover:border-line-strong hover:text-ink";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}
