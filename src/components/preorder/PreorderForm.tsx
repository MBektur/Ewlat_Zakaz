"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { CheckCircle2, Loader2, MapPin, Minus, NotebookPen, Phone, Plus, Send, User } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { createPreorder } from "@/lib/actions/preorder";
import { fill } from "@/lib/format";
import { formatTry } from "@/lib/pricing";
import type { PreorderField, PreorderState } from "@/lib/preorder-schema";
import type { Pricing } from "@/lib/types";
import { useActivePrice } from "./usePrice";

type Props = {
  locale: Locale;
  t: Dictionary["preorder"];
  pricing: Pricing;
};

const initial: PreorderState = { status: "idle" };
const MAX_QTY = 20;

/** "Yeni talep" seçilince form durumu sıfırlansın diye iç formu yeniden mount eder. */
export function PreorderForm(props: Props) {
  const [round, setRound] = useState(0);
  return <PreorderFormInner key={round} {...props} onAgain={() => setRound((r) => r + 1)} />;
}

function PreorderFormInner({ locale, t, pricing, onAgain }: Props & { onAgain: () => void }) {
  const [state, action, pending] = useActionState(createPreorder, initial);
  const values = state.status === "error" ? state.values : undefined;
  const [quantity, setQuantity] = useState(values?.quantity ?? 1);
  const { price } = useActivePrice(pricing);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-3xl border border-success/25 bg-success/5 p-6 sm:p-8">
        <CheckCircle2 className="size-10 text-success" strokeWidth={1.8} />
        <h3 className="font-display mt-4 text-2xl text-ink">{t.successTitle}</h3>
        <p className="mt-2 leading-relaxed text-body">
          {fill(t.successText, {
            name: state.name,
            phone: state.phone,
            quantity: state.quantity,
            total: formatTry(state.total, locale),
          })}
        </p>
        <button
          type="button"
          onClick={onAgain}
          className="mt-6 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-bold text-body hover:border-line-strong hover:text-ink"
        >
          {t.another}
        </button>
      </div>
    );
  }

  const errors = state.status === "error" ? state.fieldErrors : {};
  const formError = state.status === "error" ? state.formError : undefined;
  // Hata sonrası React formu sıfırlar; girilen değerleri geri yüklemek için yeniden bağla
  const formKey = state.status === "error" ? JSON.stringify(values) : "fresh";

  return (
    <form key={formKey} action={action} noValidate className="space-y-3.5" aria-busy={pending}>
      <input type="hidden" name="locale" value={locale} />
      {/* Bot tuzağı: kullanıcıdan ve ekran okuyucudan gizli */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="fullName" label={t.fullName} error={errors.fullName && t.errors.fullName}>
          <IconInput icon={<User />}>
            <input
              id="fullName"
              name="fullName"
              autoComplete="name"
              required
              maxLength={120}
              placeholder={t.fullName}
              defaultValue={values?.fullName}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              className={inputClass}
            />
          </IconInput>
        </Field>

        <Field id="phone" label={t.phone} error={errors.phone && t.errors.phone}>
          <IconInput icon={<Phone />}>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              required
              maxLength={30}
              placeholder="05xx xxx xx xx"
              defaultValue={values?.phone}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={`${inputClass} rtl:text-right`}
            />
          </IconInput>
        </Field>
      </div>

      <Field id="address" label={t.address} error={errors.address && t.errors.address}>
        <IconInput icon={<MapPin />} top>
          <textarea
            id="address"
            name="address"
            autoComplete="street-address"
            required
            rows={2}
            maxLength={600}
            placeholder={t.address}
            defaultValue={values?.address}
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? "address-error" : undefined}
            className={`${inputClass} resize-y`}
          />
        </IconInput>
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-2xl bg-white p-1 shadow-[0_2px_8px_-2px_rgb(27_50_99/0.12)]" role="group" aria-label={t.quantity}>
          <StepButton label="−" disabled={quantity <= 1} onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            <Minus className="size-4" />
          </StepButton>
          <input
            id="quantity"
            name="quantity"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_QTY}
            value={quantity}
            aria-label={t.quantity}
            onChange={(e) => setQuantity(Math.min(MAX_QTY, Math.max(1, Number(e.target.value) || 1)))}
            className="w-11 bg-transparent text-center text-lg font-extrabold text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <StepButton label="+" disabled={quantity >= MAX_QTY} onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))}>
            <Plus className="size-4" />
          </StepButton>
        </div>
        <p className="text-sm leading-tight text-body">
          <span className="block">{t.quantity}</span>
          <span className="font-extrabold text-ink">
            {t.total}: <span className="text-primary">{formatTry(price * quantity, locale)}</span>
          </span>
        </p>
        {errors.quantity && <ErrorText id="quantity-error">{t.errors.quantity}</ErrorText>}
      </div>

      <Field id="note" label={t.note} error={errors.note && t.errors.note}>
        <IconInput icon={<NotebookPen />}>
          <input id="note" name="note" maxLength={1000} placeholder={t.note} defaultValue={values?.note} className={inputClass} />
        </IconInput>
      </Field>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-body">
          <input
            type="checkbox"
            name="consent"
            defaultChecked={values?.consent}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-1 size-4 shrink-0 accent-primary"
          />
          <span>
            {t.consent}{" "}
            <Link href={`/${locale}/gizlilik`} target="_blank" className="font-bold text-primary underline underline-offset-2">
              {t.consentLink}
            </Link>
          </span>
        </label>
        {errors.consent && <ErrorText id="consent-error">{t.errors.consent}</ErrorText>}
      </div>

      {formError && (
        <p role="alert" className="rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {t.errors[formError]}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-blue inline-flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 text-lg font-extrabold transition disabled:opacity-70 sm:w-auto sm:min-w-[300px]"
      >
        {pending ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5 rtl:-scale-x-100" />}
        {pending ? t.submitting : t.submit}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-2xl border border-white bg-white py-3 pe-4 ps-11 text-ink placeholder:text-muted/80 shadow-[0_2px_8px_-2px_rgb(27_50_99/0.12)] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 aria-[invalid=true]:border-danger/60";

function IconInput({ icon, top, children }: { icon: React.ReactNode; top?: boolean; children: React.ReactNode }) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute start-4 text-muted [&>svg]:size-[18px] ${top ? "top-3.5" : "top-1/2 -translate-y-1/2"}`}
      >
        {icon}
      </span>
      {children}
    </div>
  );
}

function StepButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-10 items-center justify-center rounded-xl bg-soft text-primary transition hover:bg-sky disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Field({ id, label, error, children }: { id: PreorderField; label: string; error?: string | false; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={id === "quantity" ? "mb-1.5 block text-sm font-bold text-ink" : "sr-only"}>
        {label}
      </label>
      {children}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-sm font-semibold text-danger">
      {children}
    </p>
  );
}
