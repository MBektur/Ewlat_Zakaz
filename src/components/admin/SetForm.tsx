"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveSet } from "@/lib/actions/admin";
import type { SetRow } from "@/db/schema";
import { Field, btnGhost, btnPrimary, inputCls } from "./ui";

export function SetForm({ set }: { set?: SetRow }) {
  const [state, action, pending] = useActionState(saveSet, null);
  return (
    <form action={action} className="max-w-3xl space-y-5 rounded-2xl bg-surface p-6 shadow-soft">
      {set && <input type="hidden" name="id" value={set.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Set adı (Türkçe)">
          <input name="nameTr" required defaultValue={set?.nameTr} className={inputCls} />
        </Field>
        <Field label="Set adı (Uygurca)">
          <input name="nameUg" defaultValue={set?.nameUg ?? ""} dir="rtl" lang="ug" className={`${inputCls} ug-text`} />
        </Field>
        <Field label="Açıklama (Türkçe)">
          <textarea name="descriptionTr" rows={3} defaultValue={set?.descriptionTr ?? ""} className={inputCls} />
        </Field>
        <Field label="Açıklama (Uygurca)">
          <textarea name="descriptionUg" rows={3} defaultValue={set?.descriptionUg ?? ""} dir="rtl" lang="ug" className={`${inputCls} ug-text`} />
        </Field>
        <Field label="Adres (slug)" hint="Boş bırakılırsa Türkçe addan üretilir. Katalog filtresinde kullanılır.">
          <input name="slug" defaultValue={set?.slug} className={inputCls} />
        </Field>
        <Field label="Sıra" hint="Küçük sayı önce gösterilir.">
          <input name="sortOrder" type="number" defaultValue={set?.sortOrder ?? 0} className={inputCls} />
        </Field>
      </div>
      <label className="inline-flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="isPlaceholder" defaultChecked={set?.isPlaceholder} className="size-4 accent-primary" />
        Geçici örnek set (sitede “geçici” etiketiyle gösterilir)
      </label>
      {state?.error && <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{state.error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Kaydet
        </button>
        <Link href="/admin/setler" className={btnGhost}>Vazgeç</Link>
      </div>
    </form>
  );
}
