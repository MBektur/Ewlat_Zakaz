import { isAdmin } from "@/lib/auth";
import { listPreorders, statusLabels } from "@/lib/admin-queries";

const cell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  // Excel formül enjeksiyonunu önle, tırnakları kaçır
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};

export async function GET(request: Request) {
  if (!(await isAdmin())) return new Response("Yetkisiz", { status: 401 });
  const status = new URL(request.url).searchParams.get("status") ?? "";
  const rows = await listPreorders({ status });
  const header = ["No", "Tarih", "Ad Soyad", "Telefon", "Adres", "Takım", "Takım fiyatı (TL)", "Tutar (TL)", "Durum", "Müşteri notu", "İç not", "Dil"];
  const lines = rows.map((r) =>
    [
      r.id,
      r.createdAt.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" }),
      r.fullName,
      r.phone,
      r.address,
      r.quantity,
      r.unitPriceTry,
      r.quantity * r.unitPriceTry,
      statusLabels[r.status],
      r.note,
      r.adminNote,
      r.locale,
    ]
      .map(cell)
      .join(";"),
  );
  // BOM + noktalı virgül: Türkçe Excel'de doğrudan doğru açılır
  const body = "﻿" + [header.map(cell).join(";"), ...lines].join("\r\n");
  return new Response(body, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="on-siparisler.csv"`,
      "cache-control": "no-store",
    },
  });
}
