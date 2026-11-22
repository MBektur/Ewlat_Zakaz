import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getSetAdmin } from "@/lib/admin-queries";
import { SetForm } from "@/components/admin/SetForm";
import { Loading, PageTitle } from "@/components/admin/ui";

export const metadata = { title: "Set" };

export default function SetEditPage(props: PageProps<"/admin/setler/[id]">) {
  return (
    <Suspense fallback={<Loading />}>
      <Editor params={props.params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: PageProps<"/admin/setler/[id]">["params"] }) {
  await requireAdmin();
  const { id } = await params;
  const set = id === "yeni" ? undefined : await getSetAdmin(Number(id));
  if (id !== "yeni" && !set) notFound();
  return (
    <>
      <PageTitle title={set ? "Seti düzenle" : "Yeni set"} />
      <SetForm set={set} />
    </>
  );
}
