import { Suspense } from "react";
import Link from "next/link";
import { Download, Search, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { listPreorders, preorderStats, statusLabels } from "@/lib/admin-queries";
import { deletePreorder, updatePreorderNote, updatePreorderStatus } from "@/lib/actions/admin";
import { AutoSubmitSelect } from "@/components/admin/AutoSubmitSelect";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Loading, PageTitle, btnGhost, inputCls } from "@/components/admin/ui";
import { deliveryLabels, formatAddress } from "@/lib/address";
import { formatTry } from "@/lib/pricing";

export const metadata = { title: "Siparişler" };

const statusColor: Record<string, string> = {
  new: "bg-primary/10 text-primary",
  contacted: "bg-accent/15 text-[#9a6a00]",
  confirmed: "bg-purple/15 text-purple",
  shipped: "bg-success/10 text-success",
  cancelled: "bg-danger/10 text-danger",
};

export default function OrdersPage(props: PageProps<"/admin">) {
  return (
    <Suspense fallback={<Loading />}>
      <Orders searchParams={props.searchParams} />
    </Suspense>
  );
}

async function Orders({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const [rows, stats] = await Promise.all([listPreorders({ status, q }), preorderStats()]);
  const dateFmt = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Istanbul" });

  return (
    <>
      <PageTitle title="Ön siparişler">
        <a href={`/admin/siparisler.csv${status ? `?status=${status}` : ""}`} className={btnGhost}>
          <Download className="size-4" /> Excel / CSV indir
        </a>
      </PageTitle>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Sipariş", stats.orders],
          ["Toplam takım", stats.sets],
          ["Toplam tutar", formatTry(stats.amount, "tr")],
          ["Yeni (aranmadı)", stats.fresh],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-surface p-4 shadow-soft">
            <p className="text-sm text-muted">{label}</p>
            <p className="font-display mt-1 text-2xl">{value}</p>
          </div>
        ))}
      </div>
      <p className="-mt-3 mb-6 text-xs text-muted">İptal edilen siparişler toplamlara dahil değildir.</p>

      <form className="mb-4 flex flex-wrap gap-2" role="search">
        <label className="relative min-w-60 flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input name="q" defaultValue={q} placeholder="Ad, telefon veya adres ara" className={`${inputCls} ps-9`} />
        </label>
        <select name="status" defaultValue={status} className={`${inputCls} w-auto`}>
          <option value="">Tüm durumlar</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button className={btnGhost}>Filtrele</button>
        {(q || status) && <Link href="/admin" className={btnGhost}>Temizle</Link>}
      </form>

      {rows.length === 0 ? (
        <p className="rounded-2xl bg-surface p-10 text-center text-muted shadow-soft">Henüz sipariş yok.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-surface shadow-soft">
          <table className="w-full min-w-[1040px] text-sm">
            <thead className="border-b border-line text-start text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 text-start">#</th>
                <th className="px-4 py-3 text-start">Tarih</th>
                <th className="px-4 py-3 text-start">Müşteri</th>
                <th className="px-4 py-3 text-start">Adres</th>
                <th className="px-4 py-3 text-end">Takım</th>
                <th className="px-4 py-3 text-end">Tutar</th>
                <th className="px-4 py-3 text-start">Durum</th>
                <th className="px-4 py-3 text-start">Not</th>
                <th className="px-2 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.id} className="align-top">
                  <td className="px-4 py-3 text-muted">{r.id}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {dateFmt.format(r.createdAt)}
                    <span className="mt-0.5 block text-xs uppercase text-muted">{r.locale}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold">{r.fullName}</span>
                    <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`} className="mt-0.5 block text-primary" dir="ltr">
                      {r.phone}
                    </a>
                    {r.email && (
                      <a href={`mailto:${r.email}`} className="block break-all text-xs text-body" dir="ltr">
                        {r.email}
                      </a>
                    )}
                    {r.isGift && (
                      <span className="mt-1 block rounded-lg bg-soft px-2 py-1 text-xs text-body">
                        🎁 Hediye → <b>{r.recipientName}</b> <span dir="ltr">{r.recipientPhone}</span>
                      </span>
                    )}
                    {r.note && <span className="mt-1 block max-w-56 text-xs text-muted">“{r.note}”</span>}
                  </td>
                  <td className="max-w-72 px-4 py-3 text-body">
                    {formatAddress(r)}
                    <span className="mt-1 block text-xs text-muted">Teslimat: {deliveryLabels[r.deliveryMethod] ?? r.deliveryMethod}</span>
                  </td>
                  <td className="px-4 py-3 text-end font-bold">{r.quantity}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-end">
                    {formatTry(r.quantity * r.unitPriceTry, "tr")}
                    <span className="block text-xs text-muted">{formatTry(r.unitPriceTry, "tr")} / takım</span>
                  </td>
                  <td className="px-4 py-3">
                    <form action={updatePreorderStatus}>
                      <input type="hidden" name="id" value={r.id} />
                      <AutoSubmitSelect
                        name="status"
                        defaultValue={r.status}
                        aria-label="Durum"
                        className={`rounded-full border-0 px-3 py-1.5 text-xs font-bold ${statusColor[r.status]}`}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </AutoSubmitSelect>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <form action={updatePreorderNote} className="flex gap-1">
                      <input type="hidden" name="id" value={r.id} />
                      <input
                        name="adminNote"
                        defaultValue={r.adminNote ?? ""}
                        placeholder="İç not"
                        className="w-40 rounded-lg border border-line px-2 py-1 text-xs outline-none focus:border-primary"
                      />
                      <button className="rounded-lg px-2 text-xs font-bold text-primary hover:bg-soft">Kaydet</button>
                    </form>
                  </td>
                  <td className="px-2 py-3">
                    <form action={deletePreorder}>
                      <input type="hidden" name="id" value={r.id} />
                      <ConfirmButton
                        message={`#${r.id} ${r.fullName} siparişi kalıcı olarak silinsin mi?`}
                        className="rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger"
                      >
                        <Trash2 className="size-4" aria-label="Sil" />
                      </ConfirmButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
