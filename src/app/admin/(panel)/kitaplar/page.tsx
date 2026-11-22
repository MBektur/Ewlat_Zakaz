import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Eye, EyeOff, Plus, Star, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { listBooksAdmin } from "@/lib/admin-queries";
import { deleteBook } from "@/lib/actions/admin";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Loading, PageTitle, btnPrimary } from "@/components/admin/ui";

export const metadata = { title: "Kitaplar" };

const missingLabels: Record<string, string> = {
  title: "ad yok",
  title_tr: "TR ad yok",
  title_ug: "UG ad yok",
  cover: "kapak yok",
  thickness_mm: "kalınlık tahmini",
  verify_title_ug: "UG ad doğrulanmalı",
  verify_topic_tr: "TR konu doğrulanmalı",
};

export default function BooksPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Books />
    </Suspense>
  );
}

async function Books() {
  await requireAdmin();
  const rows = await listBooksAdmin();
  const groups = new Map<string, typeof rows>();
  for (const r of rows) {
    const key = r.setName ?? "Sete bağlı değil";
    groups.set(key, [...(groups.get(key) ?? []), r]);
  }

  return (
    <>
      <PageTitle title={`Kitaplar (${rows.length})`}>
        <Link href="/admin/kitaplar/yeni" className={btnPrimary}>
          <Plus className="size-4" /> Yeni kitap
        </Link>
      </PageTitle>
      <p className="-mt-3 mb-6 text-sm text-muted">
        Toplu ekleme için: <code className="rounded bg-soft px-1.5 py-0.5">npm run import:books -- kitaplar.csv</code>
      </p>

      <div className="space-y-8">
        {[...groups].map(([setName, items]) => (
          <section key={setName}>
            <h2 className="mb-3 font-extrabold">
              {setName} <span className="font-normal text-muted">· {items.length}</span>
            </h2>
            <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-surface shadow-soft">
              {items.map(({ book, position }) => (
                <li key={book.id} className="flex items-center gap-4 px-4 py-3">
                  <div
                    className="relative w-11 shrink-0 overflow-hidden rounded bg-soft ring-1 ring-line"
                    style={{ aspectRatio: `${book.coverWidth} / ${book.coverHeight}` }}
                  >
                    {book.coverUrl ? (
                      <Image
                        src={book.coverUrl}
                        alt=""
                        fill
                        sizes="44px"
                        unoptimized={!!book.coverUrl.startsWith("/covers/")}
                        className="object-cover"
                      />
                    ) : (
                      <BookOpen className="absolute inset-0 m-auto size-4 text-muted" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">
                      {position ? <span className="me-1 text-muted">{position}.</span> : null}
                      {book.titleTr ?? <span className="ug-text font-normal" dir="rtl">{book.titleUg}</span>}
                      {!book.titleTr && !book.titleUg && <span className="italic text-muted">Adsız</span>}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {book.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-bold text-[#9a6a00]">
                          <Star className="size-3" /> Carousel
                        </span>
                      )}
                      {book.missingInfo.map((m) => (
                        <span key={m} className="rounded-full bg-danger/8 px-2 py-0.5 text-xs text-danger">
                          {missingLabels[m] ?? m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="hidden text-muted sm:block" title={book.isVisible ? "Sitede görünür" : "Gizli"}>
                    {book.isVisible ? <Eye className="size-4" /> : <EyeOff className="size-4 text-danger" />}
                  </span>
                  <Link href={`/admin/kitaplar/${book.id}`} className="rounded-full px-3 py-1.5 text-sm font-bold text-primary hover:bg-soft">
                    Düzenle
                  </Link>
                  <form action={deleteBook}>
                    <input type="hidden" name="id" value={book.id} />
                    <ConfirmButton message="Bu kitap kalıcı olarak silinsin mi?" className="rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger">
                      <Trash2 className="size-4" aria-label="Sil" />
                    </ConfirmButton>
                  </form>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
