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
import { isDemo } from "@/lib/demo";
import { geoDataAvailable, loadGeo } from "@/lib/geo";
import {
  readPreorderForm,
  validateValues,
  type FieldErrors,
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

  // Ülke geçerli mi, bölge/şehir seçimi listeyle uyumlu mu?
  const dataOk = await geoDataAvailable();
  const geo = dataOk ? await loadGeo(values.country) : null;
  const states = geo?.states ?? [];
  const fieldErrors: FieldErrors = validateValues(values, { hasStates: states.length > 0 });
  if (dataOk) {
    if (!geo) fieldErrors.country = "country";
    if (states.length > 0 && values.region) {
      const state = states.find((s) => s.name === values.region);
      if (!state) fieldErrors.region = "region";
      else if (state.cities.length > 0 && !state.cities.includes(values.city)) fieldErrors.city = "city";
    }
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, values };
  }

  // Önizleme modu: veri tabanı yok, kayıt yapılmaz
  if (isDemo()) {
    const { price } = activePrice(await readPricing(), new Date());
    return { status: "success", name: values.fullName.trim(), phone: values.phone.trim(), quantity: values.quantity, total: price * values.quantity, demo: true };
  }

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
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        email: values.email.trim() || null,
        country: values.country,
        region: values.region.trim() || null,
        city: values.city.trim(),
        neighborhood: values.neighborhood.trim() || null,
        address: values.address.trim(),
        postalCode: values.postalCode.trim() || null,
        deliveryMethod: values.deliveryMethod,
        note: values.note.trim() || null,
        isGift: values.isGift,
        recipientName: values.isGift ? values.recipientName.trim() : null,
        recipientPhone: values.isGift ? values.recipientPhone.trim() : null,
        quantity: values.quantity,
        unitPriceTry: price,
        locale,
        consentAt: new Date(),
        ipHash,
      })
      .returning({ id: preorders.id });

    const total = price * values.quantity;
    // Yanıtı bekletmeden bildirim gönder
    after(() =>
      notifyNewPreorder({
        id: row.id,
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        quantity: values.quantity,
        total,
        locale,
      }),
    );

    return { status: "success", name: values.fullName.trim(), phone: values.phone.trim(), quantity: values.quantity, total };
  } catch (err) {
    console.error("Ön sipariş kaydedilemedi:", err);
    return { status: "error", fieldErrors: {}, formError: "generic", values };
  }
}
