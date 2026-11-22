"use client";

import { localePath } from "@/i18n/paths";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Gift,
  Loader2,
  Mail,
  MapPin,
  Minus,
  NotebookPen,
  Phone,
  Plus,
  Send,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { createPreorder } from "@/lib/actions/preorder";
import { fill } from "@/lib/format";
import type { CountryOption, GeoState } from "@/lib/geo-types";
import { formatTry } from "@/lib/pricing";
import {
  STEP_FIELDS,
  defaultValues,
  deliveryMethods,
  readPreorderForm,
  stepOfField,
  validateValues,
  type FieldErrors,
  type PreorderField,
  type PreorderState,
  type PreorderValues,
} from "@/lib/preorder-schema";
import type { Pricing } from "@/lib/types";
import { useActivePrice } from "./usePrice";

type Props = {
  locale: Locale;
  t: Dictionary["preorder"];
  pricing: Pricing;
  countries: { popular: CountryOption[]; rest: CountryOption[] };
};

const initial: PreorderState = { status: "idle" };
const MAX_QTY = 20;

/** "Yeni talep" seçilince form durumu sıfırlansın diye iç formu yeniden mount eder. */
export function PreorderForm(props: Props) {
  const [round, setRound] = useState(0);
  return <PreorderFormInner key={round} {...props} onAgain={() => setRound((r) => r + 1)} />;
}

function PreorderFormInner({ onAgain, ...props }: Props & { onAgain: () => void }) {
  const [state, action, pending] = useActionState(createPreorder, initial);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-3xl border border-success/25 bg-success/5 p-6 sm:p-8">
        <CheckCircle2 className="size-10 text-success" strokeWidth={1.8} />
        <h3 className="font-display mt-4 text-2xl text-ink">{props.t.successTitle}</h3>
        <p className="mt-2 leading-relaxed text-body">
          {fill(props.t.successText, {
            name: state.name,
            phone: state.phone,
            quantity: state.quantity,
            total: formatTry(state.total, props.locale),
          })}
        </p>
        {state.demo && (
          <p className="mt-4 rounded-xl bg-accent/25 px-4 py-3 text-sm font-bold text-ink">{props.t.demoNotice}</p>
        )}
        <button
          type="button"
          onClick={onAgain}
          className="mt-6 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-bold text-body hover:border-line-strong hover:text-ink"
        >
          {props.t.another}
        </button>
      </div>
    );
  }

  const values = state.status === "error" ? state.values : defaultValues;
  const errors = state.status === "error" ? state.fieldErrors : {};
  const formError = state.status === "error" ? state.formError : undefined;
  // Sunucu hatasında form yeniden kurulur: girilen değerler ve hatalı adım geri gelir
  const formKey = state.status === "error" ? JSON.stringify([values, errors]) : "fresh";
  return (
    <Wizard
      key={formKey}
      {...props}
      action={action}
      pending={pending}
      defaults={values}
      serverErrors={errors}
      formError={formError}
    />
  );
}

type GeoState_ = { country: string; states: GeoState[] };

function Wizard({
  locale,
  t,
  pricing,
  countries,
  action,
  pending,
  defaults,
  serverErrors,
  formError,
}: Props & {
  action: (formData: FormData) => void;
  pending: boolean;
  defaults: PreorderValues;
  serverErrors: FieldErrors;
  formError?: string;
}) {
  const w = t.wizard;
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(() => {
    const fields = Object.keys(serverErrors) as PreorderField[];
    return fields.length ? (Math.min(...fields.map(stepOfField)) as 1 | 2 | 3) : 1;
  });
  const [errors, setErrors] = useState<FieldErrors>(serverErrors);
  const [country, setCountry] = useState(defaults.country);
  const [region, setRegion] = useState(defaults.region);
  const [city, setCity] = useState(defaults.city);
  const [isGift, setIsGift] = useState(defaults.isGift);
  const [delivery, setDelivery] = useState(defaults.deliveryMethod);
  const [quantity, setQuantity] = useState(defaults.quantity);
  const [summary, setSummary] = useState<PreorderValues>(defaults);
  const [geo, setGeo] = useState<GeoState_>({ country: "", states: [] });
  const { price } = useActivePrice(pricing);

  // Seçilen ülkenin bölge/şehir listesini çek (statik dosya, ülke başına küçük)
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`/geo/${country}.json`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : { states: [] }))
      .then((g: { states: GeoState[] }) => setGeo({ country, states: g.states }))
      .catch(() => {
        if (!ctrl.signal.aborted) setGeo({ country, states: [] });
      });
    return () => ctrl.abort();
  }, [country]);

  const loadingGeo = geo.country !== country;
  const states = loadingGeo ? [] : geo.states;
  const hasStates = states.length > 0;
  const cities = states.find((s) => s.name === region)?.cities ?? [];
  const isTR = country === "TR";

  function checkStep(n: 1 | 2 | 3) {
    const values = readPreorderForm(new FormData(formRef.current!));
    const all = validateValues(values, { hasStates });
    const mine: FieldErrors = {};
    for (const f of STEP_FIELDS[n]) if (all[f]) mine[f] = all[f];
    setErrors(mine);
    return { ok: Object.keys(mine).length === 0, values };
  }

  function goTo(n: 1 | 2 | 3) {
    setStep(n);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function next() {
    const { ok, values } = checkStep(step);
    if (!ok) return;
    if (step === 2) setSummary(values);
    goTo((step + 1) as 2 | 3);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const values = readPreorderForm(new FormData(e.currentTarget));
    const all = validateValues(values, { hasStates });
    const fields = Object.keys(all) as PreorderField[];
    if (fields.length) {
      e.preventDefault();
      setErrors(all);
      goTo(Math.min(...fields.map(stepOfField)) as 1 | 2 | 3);
    }
  }

  const err = (f: PreorderField) => {
    const code = errors[f];
    return code ? (t.errors as Record<string, string>)[code] : undefined;
  };

  const countryName = [...countries.popular, ...countries.rest].find((c) => c.code === summary.country)?.name ?? summary.country;
  const addressSummary = [
    summary.neighborhood,
    summary.address,
    [summary.postalCode, summary.city].filter(Boolean).join(" "),
    summary.region,
    countryName,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={onSubmit}
      noValidate
      aria-busy={pending}
      className="scroll-mt-24"
      onKeyDown={(e) => {
        // Enter, 1-2. adımlarda formu göndermek yerine bir sonraki adıma geçirir
        if (e.key === "Enter" && step < 3 && (e.target as HTMLElement).tagName === "INPUT") {
          e.preventDefault();
          next();
        }
      }}
    >
      <input type="hidden" name="locale" value={locale} />
      {/* Bot tuzağı: kullanıcıdan ve ekran okuyucudan gizli */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <Stepper steps={w.steps} current={step} />

      {/* ADIM 1 */}
      <fieldset hidden={step !== 1} className="space-y-3.5">
        <legend className="sr-only">{w.steps[0]}</legend>
        <Field id="fullName" label={t.fullName} error={err("fullName")}>
          <IconInput icon={<User />}>
            <input id="fullName" name="fullName" autoComplete="name" maxLength={120} placeholder={t.fullName} defaultValue={defaults.fullName} aria-invalid={!!errors.fullName} className={inputClass} />
          </IconInput>
        </Field>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field id="phone" label={t.phone} error={err("phone")}>
            <IconInput icon={<Phone />} ltr>
              <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" maxLength={30} placeholder="0555 123 45 67 / +49 ..." defaultValue={defaults.phone} aria-invalid={!!errors.phone} className={ltrInputClass} />
            </IconInput>
          </Field>
          <Field id="email" label={`${w.email} (${w.optional})`} error={err("email")}>
            <IconInput icon={<Mail />} ltr>
              <input id="email" name="email" type="email" inputMode="email" autoComplete="email" dir="ltr" maxLength={160} placeholder={`${w.email} (${w.optional})`} defaultValue={defaults.email} aria-invalid={!!errors.email} className={ltrInputClass} />
            </IconInput>
          </Field>
        </div>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-dashed border-line-strong bg-soft/50 p-4">
          <input type="checkbox" name="isGift" checked={isGift} onChange={(e) => setIsGift(e.target.checked)} className="mt-1 size-5 shrink-0 accent-primary" />
          <span>
            <span className="flex items-center gap-2 font-extrabold text-ink">
              <Gift className="size-5 text-primary" /> {w.giftTitle}
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-body">{w.giftText}</span>
          </span>
        </label>
      </fieldset>

      {/* ADIM 2 */}
      <fieldset hidden={step !== 2} className="space-y-3.5">
        <legend className="sr-only">{w.steps[1]}</legend>
        {isGift && (
          <div className="space-y-3.5 rounded-2xl bg-soft/60 p-4">
            <p className="flex items-center gap-2 font-extrabold text-ink">
              <Gift className="size-5 text-primary" /> {w.recipientTitle}
            </p>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field id="recipientName" label={w.recipientName} error={err("recipientName")}>
                <IconInput icon={<User />}>
                  <input id="recipientName" name="recipientName" maxLength={120} placeholder={w.recipientName} defaultValue={defaults.recipientName} aria-invalid={!!errors.recipientName} className={inputClass} />
                </IconInput>
              </Field>
              <Field id="recipientPhone" label={w.recipientPhone} error={err("recipientPhone")}>
                <IconInput icon={<Phone />} ltr>
                  <input id="recipientPhone" name="recipientPhone" type="tel" dir="ltr" maxLength={30} placeholder={w.recipientPhone} defaultValue={defaults.recipientPhone} aria-invalid={!!errors.recipientPhone} className={ltrInputClass} />
                </IconInput>
              </Field>
            </div>
          </div>
        )}

        <Field id="country" label={w.country} error={err("country")}>
          <select
            id="country"
            name="country"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setRegion("");
              setCity("");
            }}
            className={selectClass}
          >
            {countries.popular.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
            <option disabled>──────────</option>
            {countries.rest.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </Field>

        <div className="grid gap-3.5 sm:grid-cols-2">
          {loadingGeo ? (
            <p className="flex items-center gap-2 py-3 text-sm text-muted sm:col-span-2">
              <Loader2 className="size-4 animate-spin" /> {w.loading}
            </p>
          ) : (
            <>
              {hasStates && (
                <Field id="region" label={isTR ? w.regionTr : w.regionOther} error={err("region")}>
                  <select
                    id="region"
                    name="region"
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      setCity("");
                    }}
                    aria-invalid={!!errors.region}
                    className={selectClass}
                  >
                    <option value="">{w.select}</option>
                    {states.map((s) => (
                      <option key={s.code} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </Field>
              )}
              <Field id="city" label={isTR ? w.cityTr : w.cityOther} error={err("city")}>
                {hasStates && cities.length > 0 ? (
                  <select id="city" name="city" value={city} onChange={(e) => setCity(e.target.value)} aria-invalid={!!errors.city} className={selectClass}>
                    <option value="">{w.select}</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                ) : (
                  <input id="city" name="city" maxLength={120} value={city} onChange={(e) => setCity(e.target.value)} placeholder={isTR ? w.cityTr : w.cityOther} aria-invalid={!!errors.city} className={plainInputClass} />
                )}
              </Field>
            </>
          )}
          <Field id="neighborhood" label={isTR ? w.neighborhoodTr : w.neighborhoodOther} error={err("neighborhood")}>
            <input id="neighborhood" name="neighborhood" maxLength={120} placeholder={isTR ? w.neighborhoodTr : w.neighborhoodOther} defaultValue={defaults.neighborhood} className={plainInputClass} />
          </Field>
          <Field id="postalCode" label={w.postalCode} error={err("postalCode")}>
            <input id="postalCode" name="postalCode" dir="ltr" maxLength={12} placeholder={w.postalCode} defaultValue={defaults.postalCode} aria-invalid={!!errors.postalCode} className={`${plainInputClass} rtl:text-right`} />
          </Field>
        </div>

        <Field id="address" label={w.addressLine} error={err("address")}>
          <IconInput icon={<MapPin />} top>
            <textarea id="address" name="address" autoComplete="street-address" rows={2} maxLength={600} placeholder={w.addressLine} defaultValue={defaults.address} aria-invalid={!!errors.address} className={`${inputClass} resize-y`} />
          </IconInput>
        </Field>

        <div role="radiogroup" aria-label={w.deliveryTitle}>
          <p className="mb-1.5 flex items-center gap-2 text-sm font-bold text-ink">
            <Truck className="size-4 text-primary rtl:-scale-x-100" /> {w.deliveryTitle}
          </p>
          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-soft p-1">
            {deliveryMethods.map((m) => (
              <label key={m} className="cursor-pointer">
                <input type="radio" name="deliveryMethod" value={m} checked={delivery === m} onChange={() => setDelivery(m)} className="peer sr-only" />
                <span className="block rounded-xl px-2 py-2.5 text-center text-sm font-bold text-body transition peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-soft peer-focus-visible:outline-2 peer-focus-visible:outline-primary">
                  {w[m]}
                </span>
              </label>
            ))}
          </div>
          {err("deliveryMethod") && <ErrorText id="deliveryMethod-error">{err("deliveryMethod")}</ErrorText>}
        </div>

        <Field id="note" label={t.note} error={err("note")}>
          <IconInput icon={<NotebookPen />} top>
            <textarea id="note" name="note" rows={2} maxLength={1000} placeholder={t.note} defaultValue={defaults.note} className={`${inputClass} resize-y`} />
          </IconInput>
        </Field>
      </fieldset>

      {/* ADIM 3 */}
      <fieldset hidden={step !== 3} className="space-y-4">
        <legend className="sr-only">{w.steps[2]}</legend>
        <div className="rounded-2xl border border-line bg-soft/40 p-4">
          <h3 className="font-extrabold text-ink">{w.summaryTitle}</h3>
          <dl className="mt-3 space-y-3 text-sm">
            <SummaryRow label={w.contact} onEdit={() => goTo(1)} editLabel={w.edit}>
              <span className="font-bold text-ink">{summary.fullName}</span>
              <span dir="ltr" className="block text-left text-body">{summary.phone}</span>
              {summary.email && <span dir="ltr" className="block text-left text-body">{summary.email}</span>}
            </SummaryRow>
            {summary.isGift && (
              <SummaryRow label={w.giftFor} onEdit={() => goTo(2)} editLabel={w.edit}>
                <span className="font-bold text-ink">{summary.recipientName}</span>
                <span dir="ltr" className="block text-left text-body">{summary.recipientPhone}</span>
              </SummaryRow>
            )}
            <SummaryRow label={w.deliverTo} onEdit={() => goTo(2)} editLabel={w.edit}>
              <span className="block text-body">{addressSummary}</span>
              <span className="mt-0.5 block text-muted">{w[summary.deliveryMethod]}</span>
            </SummaryRow>
          </dl>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-2xl border border-line-strong bg-white p-1" role="group" aria-label={w.quantityTitle}>
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
              aria-label={w.quantityTitle}
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
          {err("quantity") && <ErrorText id="quantity-error">{err("quantity")}</ErrorText>}
        </div>

        <div className="flex gap-3 rounded-2xl bg-teal-dark/10 p-4 text-sm leading-relaxed text-ink">
          <Wallet className="mt-0.5 size-5 shrink-0 text-teal-dark" />
          <p>
            <span className="font-extrabold">{w.paymentTitle}: </span>
            {w.paymentText}
          </p>
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-body">
            <input type="checkbox" name="consent" defaultChecked={defaults.consent} aria-invalid={!!errors.consent} className="mt-1 size-4 shrink-0 accent-primary" />
            <span>
              {t.consent}{" "}
              <Link href={localePath(locale, "privacy")} target="_blank" className="font-bold text-primary underline underline-offset-2">
                {t.consentLink}
              </Link>
            </span>
          </label>
          {err("consent") && <ErrorText id="consent-error">{err("consent")}</ErrorText>}
        </div>

        {formError && (
          <p role="alert" className="rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {(t.errors as Record<string, string>)[formError]}
          </p>
        )}
      </fieldset>

      {/* Gezinme */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={() => goTo((step - 1) as 1 | 2)}
            className="inline-flex items-center gap-2 rounded-full border-2 border-line-strong bg-surface px-5 py-3 font-extrabold text-body transition hover:border-ink hover:text-ink"
          >
            <ArrowLeft className="size-4 rtl:-scale-x-100" strokeWidth={2.6} /> {w.back}
          </button>
        )}
        {step < 3 ? (
          <button type="button" onClick={next} className="btn-coral ms-auto inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-lg font-extrabold">
            {w.next} <ArrowRight className="size-5 rtl:-scale-x-100" strokeWidth={2.6} />
          </button>
        ) : (
          <button type="submit" disabled={pending} className="btn-coral ms-auto inline-flex min-w-[260px] items-center justify-center gap-2.5 rounded-full px-8 py-3.5 text-lg font-extrabold transition disabled:opacity-70">
            {pending ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5 rtl:-scale-x-100" />}
            {pending ? t.submitting : t.submit}
          </button>
        )}
      </div>
    </form>
  );
}

function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="mb-6 flex items-center gap-2">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} aria-current={active ? "step" : undefined} className="flex flex-1 items-center gap-2 last:flex-none">
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition ${
                done ? "bg-teal-dark text-white" : active ? "bg-primary text-white shadow-soft" : "bg-soft text-muted"
              }`}
            >
              {done ? <Check className="size-4" strokeWidth={3} /> : n}
            </span>
            <span className={`text-sm font-bold ${active ? "block text-ink" : "hidden text-muted sm:block"}`}>{label}</span>
            {n < steps.length && <span className={`h-0.5 min-w-4 flex-1 rounded ${done ? "bg-teal-dark" : "bg-line"}`} aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

function SummaryRow({ label, editLabel, onEdit, children }: { label: string; editLabel: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <dt className="text-xs font-bold uppercase tracking-wide text-muted">{label}</dt>
        <dd className="mt-0.5">{children}</dd>
      </div>
      <button type="button" onClick={onEdit} className="shrink-0 rounded-full px-3 py-1 text-xs font-extrabold text-primary hover:bg-soft">
        {editLabel}
      </button>
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border border-line-strong bg-white py-3 pe-4 ps-11 text-ink placeholder:text-muted/80 shadow-[0_1px_2px_rgb(28_43_90/0.06)] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 aria-[invalid=true]:border-danger/60";
const plainInputClass = inputClass.replace("ps-11", "ps-4");
// Telefon ve e-posta her dilde (RTL sayfalar dahil) daima sola yaslı (text-left) ve LTR yönünde olmalıdır.
const ltrInputClass = `${inputClass} text-left [direction:ltr]`;
const selectClass =
  "w-full rounded-2xl border border-line-strong bg-white px-4 py-3 text-ink shadow-[0_1px_2px_rgb(28_43_90/0.06)] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 aria-[invalid=true]:border-danger/60";

function IconInput({ icon, top, ltr, children }: { icon: React.ReactNode; top?: boolean; ltr?: boolean; children: React.ReactNode }) {
  return (
    <div className="relative" dir={ltr ? "ltr" : undefined}>
      <span aria-hidden="true" className={`pointer-events-none absolute start-4 text-muted [&>svg]:size-[18px] ${top ? "top-3.5" : "top-1/2 -translate-y-1/2"}`}>
        {icon}
      </span>
      {children}
    </div>
  );
}

function StepButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} disabled={disabled} onClick={onClick} className="flex size-10 items-center justify-center rounded-xl bg-soft text-primary transition hover:bg-sky disabled:opacity-40">
      {children}
    </button>
  );
}

function Field({ id, label, error, children }: { id: PreorderField; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-ink">
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
