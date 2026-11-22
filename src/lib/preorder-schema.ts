import { z } from "zod";

export const deliveryMethods = ["cargo", "pickup", "post"] as const;
export type DeliveryMethod = (typeof deliveryMethods)[number];

/** Form alanları (FormData adlarıyla aynı). */
export type PreorderField =
  | "fullName"
  | "phone"
  | "email"
  | "country"
  | "region"
  | "city"
  | "neighborhood"
  | "address"
  | "postalCode"
  | "deliveryMethod"
  | "note"
  | "recipientName"
  | "recipientPhone"
  | "quantity"
  | "consent";

/** Hata kodları sözlükteki preorder.errors anahtarlarıyla eşleşir. */
export type PreorderErrorCode =
  | "fullName"
  | "phone"
  | "email"
  | "country"
  | "region"
  | "city"
  | "address"
  | "postalCode"
  | "delivery"
  | "note"
  | "recipientName"
  | "recipientPhone"
  | "quantity"
  | "consent"
  | "rateLimit"
  | "closed"
  | "generic";

export type PreorderValues = {
  fullName: string;
  phone: string;
  email: string;
  country: string;
  region: string;
  city: string;
  neighborhood: string;
  address: string;
  postalCode: string;
  deliveryMethod: DeliveryMethod;
  note: string;
  isGift: boolean;
  recipientName: string;
  recipientPhone: string;
  quantity: number;
  consent: boolean;
};

export type FieldErrors = Partial<Record<PreorderField, PreorderErrorCode>>;

export type PreorderState =
  | { status: "idle" }
  | { status: "success"; name: string; phone: string; quantity: number; total: number; demo?: boolean }
  | { status: "error"; fieldErrors: FieldErrors; formError?: PreorderErrorCode; values: PreorderValues };

/** Wizard adımları ve her adımın alanları. */
export const STEP_FIELDS: Record<1 | 2 | 3, PreorderField[]> = {
  1: ["fullName", "phone", "email"],
  2: ["country", "region", "city", "neighborhood", "address", "postalCode", "deliveryMethod", "note", "recipientName", "recipientPhone"],
  3: ["quantity", "consent"],
};

export function stepOfField(field: PreorderField): 1 | 2 | 3 {
  return ([1, 2, 3] as const).find((s) => STEP_FIELDS[s].includes(field)) ?? 1;
}

export const defaultValues: PreorderValues = {
  fullName: "",
  phone: "",
  email: "",
  country: "TR",
  region: "",
  city: "",
  neighborhood: "",
  address: "",
  postalCode: "",
  deliveryMethod: "cargo",
  note: "",
  isGift: false,
  recipientName: "",
  recipientPhone: "",
  quantity: 1,
  consent: false,
};

const digits = (v: string) => v.replace(/\D/g, "");
const validPhone = (v: string) => {
  const t = v.trim();
  const n = digits(t).length;
  return t.length <= 30 && /^[+\d\s().-]+$/.test(t) && n >= 10 && n <= 15;
};

export function makePreorderSchema() {
  return z.object({
    fullName: z.string().trim().min(3, "fullName").max(120, "fullName"),
    phone: z.string().trim().refine(validPhone, "phone"),
    email: z
      .string()
      .trim()
      .max(160, "email")
      .refine((v) => v === "" || z.email().safeParse(v).success, "email"),
    country: z.string().regex(/^[A-Z]{2}$/, "country"),
    region: z.string().trim().max(120, "region"),
    city: z.string().trim().min(2, "city").max(120, "city"),
    neighborhood: z.string().trim().max(120, "neighborhood"),
    address: z.string().trim().min(10, "address").max(600, "address"),
    postalCode: z
      .string()
      .trim()
      .max(12, "postalCode")
      .regex(/^[A-Za-z0-9 -]*$/, "postalCode"),
    deliveryMethod: z.enum(deliveryMethods, { error: "deliveryMethod" }),
    note: z.string().trim().max(1000, "note"),
    isGift: z.boolean(),
    recipientName: z.string().trim().max(120, "recipientName"),
    recipientPhone: z.string().trim().max(30, "recipientPhone"),
    quantity: z.number().int("quantity").min(1, "quantity").max(20, "quantity"),
    consent: z.literal(true, { error: "consent" }),
  });
}

/** Bölge zorunluluğu ve hediye alıcısı gibi alanlar arası kurallar (zod'dan bağımsız çalışır). */
function crossFieldErrors(v: PreorderValues, opts: { hasStates: boolean }): FieldErrors {
  const errors: FieldErrors = {};
  if (opts.hasStates && v.region.trim().length === 0) errors.region = "region";
  if (v.isGift) {
    if (v.recipientName.trim().length < 3) errors.recipientName = "recipientName";
    if (!validPhone(v.recipientPhone)) errors.recipientPhone = "recipientPhone";
  }
  return errors;
}

const errorCode: Partial<Record<PreorderField, PreorderErrorCode>> = {
  neighborhood: "address",
  deliveryMethod: "delivery",
};

/** Zod hatalarını alan → hata kodu haritasına çevirir. */
export function validateValues(values: PreorderValues, opts: { hasStates: boolean }): FieldErrors {
  const errors: FieldErrors = crossFieldErrors(values, opts);
  const parsed = makePreorderSchema().safeParse(values);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as PreorderField;
      errors[field] ??= errorCode[field] ?? (field as PreorderErrorCode);
    }
  }
  return errors;
}

export function readPreorderForm(formData: FormData): PreorderValues {
  const str = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
  };
  const method = str("deliveryMethod");
  const isGift = formData.get("isGift") === "on";
  return {
    fullName: str("fullName"),
    phone: str("phone"),
    email: str("email"),
    country: str("country").toUpperCase(),
    region: str("region"),
    city: str("city"),
    neighborhood: str("neighborhood"),
    address: str("address"),
    postalCode: str("postalCode"),
    deliveryMethod: (deliveryMethods as readonly string[]).includes(method) ? (method as DeliveryMethod) : "cargo",
    note: str("note"),
    isGift,
    recipientName: isGift ? str("recipientName") : "",
    recipientPhone: isGift ? str("recipientPhone") : "",
    quantity: Number(str("quantity") || "1"),
    consent: formData.get("consent") === "on",
  };
}
