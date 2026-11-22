"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Loader2, Save, Upload } from "lucide-react";
import { saveBook } from "@/lib/actions/admin";
import { Book3D } from "@/components/book/Book3D";
import { Field, btnGhost, btnPrimary, inputCls } from "./ui";

export type BookFormData = {
  id?: number;
  titleTr: string | null;
  titleUg: string | null;
  topicTr: string | null;
  topicUg: string | null;
  coverUrl: string | null;
  coverWidth: number;
  coverHeight: number;
  thicknessMm: number;
  isFeatured: boolean;
  featuredOrder: number;
  isVisible: boolean;
  missingInfo: string[];
  setId: number | null;
  position: number;
};

export function BookForm({ book, sets }: { book: BookFormData; sets: { id: number; name: string }[] }) {
  const [state, action, pending] = useActionState(saveBook, null);
  const [preview, setPreview] = useState<{ url: string; w: number; h: number } | null>(null);
  const [thickness, setThickness] = useState(book.thicknessMm);
  const hasVerifyFlags = book.missingInfo.some((m) => m.startsWith("verify_") || m === "thickness_mm");

  // Önizleme: seçilen dosyanın gerçek ölçüleriyle 3D kitap
  function onFile(file: File | undefined) {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => setPreview({ url, w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;
  }

  const shown = preview
    ? { coverUrl: preview.url, coverWidth: preview.w, coverHeight: preview.h, thicknessMm: thickness }
    : { coverUrl: book.coverUrl, coverWidth: book.coverWidth, coverHeight: book.coverHeight, thicknessMm: thickness };

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {book.id && <input type="hidden" name="id" value={book.id} />}
      <div className="space-y-5 rounded-2xl bg-surface p-6 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Türkçe ad">
            <input name="titleTr" defaultValue={book.titleTr ?? ""} className={inputCls} />
          </Field>
          <Field label="Uygurca ad (Arap harfli)">
            <input name="titleUg" defaultValue={book.titleUg ?? ""} dir="rtl" lang="ug" className={`${inputCls} ug-text`} />
          </Field>
          <Field label="Konu (Türkçe)">
            <input name="topicTr" defaultValue={book.topicTr ?? ""} className={inputCls} />
          </Field>
          <Field label="Konu (Uygurca)">
            <input name="topicUg" defaultValue={book.topicUg ?? ""} dir="rtl" lang="ug" className={`${inputCls} ug-text`} />
          </Field>
          <Field label="Set">
            <select name="setId" defaultValue={book.setId ?? ""} className={inputCls}>
              <option value="">— Sete bağlı değil —</option>
              {sets.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Set içindeki sıra">
            <input name="position" type="number" min={0} defaultValue={book.position || ""} className={inputCls} />
          </Field>
          <Field label="Sırt kalınlığı (mm)" hint="3D görünümdeki sayfa kalınlığını belirler.">
            <input
              name="thicknessMm"
              type="number"
              step="0.5"
              min={1}
              max={80}
              value={thickness}
              onChange={(e) => setThickness(Number(e.target.value) || 1)}
              className={inputCls}
            />
          </Field>
          <Field label="Carousel sırası">
            <input name="featuredOrder" type="number" min={0} defaultValue={book.featuredOrder || ""} className={inputCls} />
          </Field>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <Check name="isFeatured" label="Ana sayfa carousel'inde göster" defaultChecked={book.isFeatured} />
          <Check name="isVisible" label="Sitede görünür" defaultChecked={book.isVisible} />
          {hasVerifyFlags && <Check name="verified" label="Bilgileri kontrol ettim (doğrulama işaretlerini kaldır)" />}
        </div>

        {state?.error && <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{state.error}</p>}

        <div className="flex gap-2">
          <button type="submit" disabled={pending} className={btnPrimary}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Kaydet
          </button>
          <Link href="/admin/kitaplar" className={btnGhost}>Vazgeç</Link>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="flex min-h-80 items-end justify-center rounded-2xl bg-soft p-6">
          {shown.coverUrl ? (
            <Book3D book={shown} maxWidth={200} maxHeight={280} alt="Kapak önizleme" />
          ) : (
            <p className="self-center text-sm text-muted">Kapak yok</p>
          )}
        </div>
        <p className="text-center text-xs text-muted">
          Oran: {shown.coverWidth}×{shown.coverHeight} px (görsel dosyasından)
        </p>
        <label className={`${btnGhost} w-full cursor-pointer`}>
          <Upload className="size-4" />
          {book.coverUrl ? "Kapağı değiştir" : "Kapak yükle"}
          <input type="file" name="cover" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        <p className="text-xs leading-relaxed text-muted">
          JPG/PNG, en fazla 10 MB. Matbaa (CMYK) dosyaları otomatik olarak web renklerine çevrilir ve küçültülür.
        </p>
        {book.coverUrl && !preview && <Check name="removeCover" label="Kapağı kaldır" />}
      </aside>
    </form>
  );
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 accent-primary" />
      {label}
    </label>
  );
}
