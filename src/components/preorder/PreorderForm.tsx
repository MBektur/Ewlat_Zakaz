"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { CheckCircle2, Loader2, MapPin, NotebookPen, Phone, Send, User } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { createPreorder } from "@/lib/actions/preorder";
import { fill } from "@/lib/format";
import type { PreorderField, PreorderState } from "@/lib/preorder-schema";

export type SetOption = { id: number; name: string; count: number; isPlaceholder: boolean };

type Props = {
  locale: Locale;
  t: Dictionary["preorder"];
  bookCountLabel: string;
  placeholderSetLabel: string;
  sets: SetOption[];
  defaultSetIds?: number[];
};

const initial: PreorderState = { status: "idle" };

/** "Yeni talep" seçilince form durumu sıfırlansın diye iç formu yeniden mount eder. */
export function PreorderForm(props: Props) {
  const [round, setRound] = useState(0);
  return <PreorderFormInner key={round} {...props} onAgain={() => setRound((r) => r + 1)} />;
}

function PreorderFormInner(props: Props & { onAgain: () => void }) {
  const [state, action, pending] = useActionState(createPreorder, initial);

  if (state.status === "success") {
    return <SuccessCard t={props.t} name={state.name} phone={state.phone} onAgain={props.onAgain} />;
  }

  const values = state.status === "error" ? state.values : undefined;
  const errors = state.status === "error" ? state.fieldErrors : {};
  const formError = state.status === "error" ? state.formError : undefined;
  // Hata sonrası React formu sıfırlar; girilen değerleri geri yüklemek için yeniden bağla
  const formKey = state.status === "error" ? JSON.stringify(values) : "fresh";

  return (
    <form key={formKey} action={action} noValidate className="space-y-5" aria-busy={pending}>
      <input type="hidden" name="locale" value={props.locale} />
      {/* Bot tuzağı: ekran okuyucu ve kullanıcıdan gizli */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <Field id="fullName" label={props.t.fullName} error={errors.fullName && props.t.errors.fullName} icon={<User />}>
        <input
          id="fullName"
          name="fullName"
          autoComplete="name"
          required
          maxLength={120}
          defaultValue={values?.fullName}
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          className={inputClass}
        />
      </Field>

      <Field
        id="phone"
        label={props.t.phone}
        hint={props.t.phoneHint}
        error={errors.phone && props.t.errors.phone}
        icon={<Phone />}
      >
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
          aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
          className={`${inputClass} rtl:text-right`}
        />
      </Field>

      <Field
        id="address"
        label={props.t.address}
        hint={props.t.addressHint}
        error={errors.address && props.t.errors.address}
        icon={<MapPin />}
      >
        <textarea
          id="address"
          name="address"
          autoComplete="street-address"
          required
          rows={3}
          maxLength={600}
          defaultValue={values?.address}
          aria-invalid={!!errors.address}
          aria-describedby={errors.address ? "address-error" : "address-hint"}
          className={`${inputClass} resize-y`}
        />
      </Field>

      <fieldset aria-describedby={errors.sets ? "sets-error" : "sets-hint"}>
        <legend className="mb-1 text-[0.95em] font-medium text-ink">{props.t.sets}</legend>
        <p id="sets-hint" className="mb-3 text-sm text-muted">{props.t.setsHint}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {props.sets.map((s) => {
            const checked = values ? values.setIds.includes(s.id) : props.defaultSetIds?.includes(s.id);
            return (
              <label
                key={s.id}
                className="group flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface px-3.5 py-3 transition-colors hover:border-line-strong has-[:checked]:border-primary has-[:checked]:bg-soft"
              >
                <input
                  type="checkbox"
                  name="setIds"
                  value={s.id}
                  defaultChecked={checked}
                  className="mt-1 size-4 shrink-0 accent-primary"
                />
                <span className="min-w-0">
                  <span className="block leading-snug text-ink">{s.name}</span>
                  <span className="text-sm text-muted">
                    {fill(props.bookCountLabel, { n: s.count })}
                    {s.isPlaceholder && <> · {props.placeholderSetLabel}</>}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        {errors.sets && <ErrorText id="sets-error">{props.t.errors.sets}</ErrorText>}
      </fieldset>

      <Field id="note" label={props.t.note} error={errors.note && props.t.errors.note} icon={<NotebookPen />}>
        <textarea
          id="note"
          name="note"
          rows={2}
          maxLength={1000}
          defaultValue={values?.note}
          className={`${inputClass} resize-y`}
        />
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
            {props.t.consent}{" "}
            <Link href={`/${props.locale}/gizlilik`} className="font-medium text-primary underline underline-offset-2" target="_blank">
              {props.t.consentLink}
            </Link>
          </span>
        </label>
        {errors.consent && <ErrorText id="consent-error">{props.t.errors.consent}</ErrorText>}
      </div>

      {formError && (
        <p role="alert" className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {props.t.errors[formError]}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-medium text-surface shadow-lift transition-colors hover:bg-primary-dark disabled:opacity-70 sm:w-auto"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4 rtl:-scale-x-100" />}
        {pending ? props.t.submitting : props.t.submit}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-ink placeholder:text-muted/70 shadow-[inset_0_1px_2px_rgb(45_35_24/0.04)] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 aria-[invalid=true]:border-danger/60";

function Field({
  id,
  label,
  hint,
  error,
  icon,
  children,
}: {
  id: PreorderField;
  label: string;
  hint?: string;
  error?: string | false;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-2 text-[0.95em] font-medium text-ink">
        <span className="text-accent [&>svg]:size-4" aria-hidden="true">{icon}</span>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">{hint}</p>
      )}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-sm text-danger">
      {children}
    </p>
  );
}

function SuccessCard({
  t,
  name,
  phone,
  onAgain,
}: {
  t: Dictionary["preorder"];
  name: string;
  phone: string;
  onAgain: () => void;
}) {
  return (
    <div role="status" className="rounded-2xl border border-success/25 bg-success/5 p-6 sm:p-8">
      <CheckCircle2 className="size-9 text-success" strokeWidth={1.6} />
      <h3 className="font-display mt-4 text-2xl text-ink">{t.successTitle}</h3>
      <p className="mt-2 leading-relaxed text-body">
        {fill(t.successText, { name, phone })}
      </p>
      <button
        type="button"
        onClick={onAgain}
        className="mt-6 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-body hover:border-line-strong hover:text-ink"
      >
        {t.another}
      </button>
    </div>
  );
}
