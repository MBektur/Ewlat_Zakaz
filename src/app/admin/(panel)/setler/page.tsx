import { Suspense } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { listSetsAdmin } from "@/lib/admin-queries";
import { deleteSet } from "@/lib/actions/admin";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Loading, PageTitle, btnPrimary } from "@/components/admin/ui";

export const metadata = { title: "Setler" };

export default function SetsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Sets />
    </Suspense>
  );
}

async function Sets() {
  await requireAdmin();
  const rows = await listSetsAdmin();
  return (
    <>
      <PageTitle title="Setler">
        <Link href="/admin/setler/yeni" className={btnPrimary}>
          <Plus className="size-4" /> Yeni set
        </Link>
      </PageTitle>
      <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-surface shadow-soft">
        {rows.map(({ set, bookCount }) => (
          <li key={set.id} className="flex items-center gap-4 px-4 py-3">
            <span className="w-8 text-center text-sm text-muted">{set.sortOrder}</span>
            <div className="min-w-0 flex-1">
              <p className="font-bold">
                {set.nameTr}
                {set.isPlaceholder && <span className="ms-2 rounded-full bg-soft px-2 py-0.5 text-xs font-normal text-muted">geçici</span>}
              </p>
              {set.nameUg && <p className="ug-text text-body" dir="rtl">{set.nameUg}</p>}
            </div>
            <span className="text-sm text-muted">{bookCount} kitap</span>
            <Link href={`/admin/setler/${set.id}`} className="rounded-full px-3 py-1.5 text-sm font-bold text-primary hover:bg-soft">
              Düzenle
            </Link>
            <form action={deleteSet}>
              <input type="hidden" name="id" value={set.id} />
              <ConfirmButton
                message={`"${set.nameTr}" seti silinsin mi? Kitaplar silinmez, yalnızca setten çıkarılır.`}
                className="rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 className="size-4" aria-label="Sil" />
              </ConfirmButton>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}
