"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import { saveSettings } from "@/lib/actions/admin";
import type { Pricing } from "@/lib/types";
import { Field, btnPrimary, inputCls } from "./ui";

/** ISO tarih → İstanbul saatine göre "YYYY-MM-DD" (date input için). */
function toDateInput(iso: string | null) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(new Date(iso));
}

export function SettingsForm({ pricing }: { pricing: Pricing }) {
  const [state, action, pending] = useActionState(saveSettings, null);
  return (
    <form action={action} className="max-w-2xl space-y-5 rounded-2xl bg-surface p-6 shadow-soft">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ön sipariş (kampanya) fiyatı — TL" hint="Tüm koleksiyon, bir takım.">
          <input name="campaignPriceTry" type="number" min={1} required defaultValue={pricing.campaignPriceTry} className={inputCls} />
        </Field>
        <Field label="Kampanya bitiş tarihi" hint="O günün sonuna kadar (İstanbul saati). Boşsa süresiz.">
          <input name="campaignEndsAt" type="date" defaultValue={toDateInput(pricing.campaignEndsAt)} className={inputCls} />
        </Field>
        <Field label="Kampanya sonrası fiyat — TL" hint="Boşsa tarih geçse de kampanya fiyatı geçerli kalır.">
          <input name="regularPriceTry" type="number" min={1} defaultValue={pricing.regularPriceTry ?? ""} className={inputCls} />
        </Field>
      </div>
      <label className="inline-flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="preordersOpen" defaultChecked={pricing.preordersOpen} className="size-4 accent-primary" />
        Ön sipariş formu açık (kapatılırsa form yeni sipariş kabul etmez)
      </label>
      <p className="rounded-xl bg-soft px-4 py-3 text-sm text-body">
        Fiyat her siparişe o anki değeriyle yazılır. Sonradan fiyatı değiştirmek eski siparişleri etkilemez.
      </p>
      {state?.error && <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{state.error}</p>}
      {state?.ok && (
        <p className="flex items-center gap-2 text-sm font-semibold text-success">
          <CheckCircle2 className="size-4" /> {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        Kaydet
      </button>
    </form>
  );
}
