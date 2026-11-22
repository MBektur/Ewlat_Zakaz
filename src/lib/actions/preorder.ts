"use server";

import { createHash } from "node:crypto";
import { and, count, eq, gt } from "drizzle-orm";
import { headers } from "next/headers";
import { after } from "next/server";
import { db, schema } from "@/db";
import { hasLocale } from "@/i18n/config";
import { notifyNewPreorder } from "@/lib/notify";
import { activePrice } from "@/lib/pricing";
import { readPricing } from "@/lib/queries";
import {
  preorderSchema,
  readPreorderForm,
  type PreorderErrorCode,
  type PreorderField,
  type PreorderState,
} from "@/lib/preorder-schema";

const RATE_LIMIT = { max: 5, windowMinutes: 10 };

async function clientIpHash() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return createHash("sha256")
    .update(`${process.env.SESSION_SECRET ?? ""}:${ip}`)
    .digest("hex")
    .slice(0, 32);
}

/** Tüm koleksiyon için ön sipariş kaydı. Fiyat sunucuda, sipariş anında hesaplanır. */
export async function createPreorder(_prev: PreorderState, formData: FormData): Promise<PreorderState> {
  const values = readPreorderForm(formData);
  const localeRaw = String(formData.get("locale") ?? "");
  const locale = hasLocale(localeRaw) ? localeRaw : "tr";

  // Bot tuzağı: gerçek kullanıcı bu gizli alanı görmez. Doluysa kaydetmeden "başarılı" dön.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", name: values.fullName, phone: values.phone, quantity: values.quantity, total: 0 };
  }

  const parsed = preorderSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<PreorderField, PreorderErrorCode>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as PreorderField;
      fieldErrors[field] ??= field;
    }
    return { status: "error", fieldErrors, values };
  }
  const data = parsed.data;

  try {
    const pricing = await readPricing();
    if (!pricing.preordersOpen) {
      return { status: "error", fieldErrors: {}, formError: "closed", values };
    }
    const { price } = activePrice(pricing, new Date());

    const { preorders } = schema;
    const ipHash = await clientIpHash();
    const since = new Date(Date.now() - RATE_LIMIT.windowMinutes * 60_000);
    const [{ recent }] = await db
      .select({ recent: count() })
      .from(preorders)
      .where(and(eq(preorders.ipHash, ipHash), gt(preorders.createdAt, since)));
    if (recent >= RATE_LIMIT.max) {
      return { status: "error", fieldErrors: {}, formError: "rateLimit", values };
    }

    const [row] = await db
      .insert(preorders)
      .values({
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        note: data.note || null,
        quantity: data.quantity,
        unitPriceTry: price,
        locale,
        consentAt: new Date(),
        ipHash,
      })
      .returning({ id: preorders.id });

    const total = price * data.quantity;
    // Yanıtı bekletmeden bildirim gönder
    after(() =>
      notifyNewPreorder({
        id: row.id,
        fullName: data.fullName,
        phone: data.phone,
        quantity: data.quantity,
        total,
        locale,
      }),
    );

    return { status: "success", name: data.fullName, phone: data.phone, quantity: data.quantity, total };
  } catch (err) {
    console.error("Ön sipariş kaydedilemedi:", err);
    return { status: "error", fieldErrors: {}, formError: "generic", values };
  }
}
