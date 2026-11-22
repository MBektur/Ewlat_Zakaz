import { z } from "zod";

/** Hata kodları sözlükteki preorder.errors anahtarlarıyla eşleşir. */
export type PreorderErrorCode =
  | "fullName"
  | "phone"
  | "address"
  | "quantity"
  | "note"
  | "consent"
  | "rateLimit"
  | "closed"
  | "generic";

export type PreorderField = "fullName" | "phone" | "address" | "quantity" | "note" | "consent";

export type PreorderValues = {
  fullName: string;
  phone: string;
  address: string;
  note: string;
  quantity: number;
  consent: boolean;
};

export type PreorderState =
  | { status: "idle" }
  | { status: "success"; name: string; phone: string; quantity: number; total: number }
  | {
      status: "error";
      fieldErrors: Partial<Record<PreorderField, PreorderErrorCode>>;
      formError?: PreorderErrorCode;
      values: PreorderValues;
    };

const phoneDigits = (v: string) => v.replace(/\D/g, "");

export const preorderSchema = z.object({
  fullName: z.string().trim().min(3, "fullName").max(120, "fullName"),
  phone: z
    .string()
    .trim()
    .max(30, "phone")
    .regex(/^[+\d\s().-]+$/, "phone")
    .refine((v) => {
      const n = phoneDigits(v).length;
      return n >= 10 && n <= 15;
    }, "phone"),
  address: z.string().trim().min(10, "address").max(600, "address"),
  note: z.string().trim().max(1000, "note"),
  quantity: z.number().int("quantity").min(1, "quantity").max(20, "quantity"),
  consent: z.literal(true, { error: "consent" }),
});

export function readPreorderForm(formData: FormData): PreorderValues {
  const str = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
  };
  return {
    fullName: str("fullName"),
    phone: str("phone"),
    address: str("address"),
    note: str("note"),
    quantity: Number(str("quantity") || "1"),
    consent: formData.get("consent") === "on",
  };
}
