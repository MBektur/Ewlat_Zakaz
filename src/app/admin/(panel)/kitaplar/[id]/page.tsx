import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getBookAdmin, listSetsAdmin } from "@/lib/admin-queries";
import { BookForm, type BookFormData } from "@/components/admin/BookForm";
import { Loading, PageTitle } from "@/components/admin/ui";

export const metadata = { title: "Kitap" };

export default function BookEditPage(props: PageProps<"/admin/kitaplar/[id]">) {
  return (
    <Suspense fallback={<Loading />}>
      <Editor params={props.params} />
    </Suspense>
  );
}

const empty: BookFormData = {
  titleTr: null,
  titleUg: null,
  topicTr: null,
  topicUg: null,
  coverUrl: null,
  coverWidth: 148,
  coverHeight: 210,
  thicknessMm: 6,
  isFeatured: false,
  featuredOrder: 0,
  isVisible: true,
  missingInfo: [],
  setId: null,
  position: 0,
};

async function Editor({ params }: { params: PageProps<"/admin/kitaplar/[id]">["params"] }) {
  await requireAdmin();
  const { id } = await params;
  const sets = (await listSetsAdmin()).map((s) => ({ id: s.set.id, name: s.set.nameTr }));

  let data = empty;
  if (id !== "yeni") {
    const row = await getBookAdmin(Number(id));
    if (!row) notFound();
    data = { ...row.book, setId: row.setId, position: row.position ?? 0 };
  }

  return (
    <>
      <PageTitle title={id === "yeni" ? "Yeni kitap" : "Kitabı düzenle"} />
      <BookForm book={data} sets={sets} />
    </>
  );
}
