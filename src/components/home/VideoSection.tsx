"use client";

import { useEffect, useRef, useState } from "react";
import { Film, Play, X } from "lucide-react";

const STORAGE_KEY = "ewlat_intro_seen";

export interface VideoSectionT {
  modalTitle: string;
  modalSubtitle: string;
  modalClose: string;
  dontShowAgain: string;
  watchNow: string;
  modalSkip: string;
  title: string;
  sectionTitle: string;
  caption: string;
}

interface Props {
  videoId: string;
  t: VideoSectionT;
}

/**
 * Tanıtım video bölümü — thumbnail + modal.
 *
 * Davranış:
 *  - Sayfa ilk yüklendiğinde localStorage'da kayıt yoksa 700ms sonra modal otomatik açılır.
 *  - Thumbnail'e tıklandığında da aynı modal açılır.
 *  - Footer'daki "bir daha gösterme" checkbox'ı işaretli kapatılırsa localStorage'a kaydeder.
 *  - ESC ve backdrop tıklaması da kapatır.
 */
export function VideoSection({ videoId, t }: Props) {
  const [open, setOpen] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const checkboxId = "intro-dont-show";
  const dialogRef = useRef<HTMLDivElement>(null);
  const thumb = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  // Auto-open: ilk ziyarette
  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const timer = setTimeout(() => setOpen(true), 700);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  // ESC ile kapat
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, dontShow]);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    if (dontShow) {
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    }
    setOpen(false);
  }

  return (
    <>
      {/* ── THUMBNAIL (section içinde) ── */}
      <div className="mx-auto w-full max-w-3xl">
        <div
          className="relative w-full overflow-hidden rounded-3xl shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
          style={{ aspectRatio: "16/9" }}
        >
          <button
            type="button"
            onClick={handleOpen}
            className="group absolute inset-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
            aria-label={`${t.watchNow}: ${t.title}`}
          >
            {/* Thumbnail */}
            <img
              src={thumb}
              alt={t.title}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            {/* Karartma */}
            <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
            {/* Play butonu */}
            <div className="relative flex size-20 items-center justify-center rounded-full bg-white/90 shadow-xl transition-transform group-hover:scale-110">
              <Play className="size-9 translate-x-0.5 text-primary" fill="currentColor" strokeWidth={0} />
            </div>
            {/* Açıklama */}
            {t.caption && (
              <p className="relative mt-4 rounded-full bg-black/50 px-5 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
                {t.caption}
              </p>
            )}
          </button>
        </div>
      </div>

      {/* ── MODAL ── */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
          onClick={handleClose}
          role="presentation"
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between gap-4 border-b border-teal-dark/20 bg-teal-dark px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Film className="size-5 text-white" strokeWidth={2} />
                </span>
                <div>
                  <h2 id="video-modal-title" className="text-base font-extrabold leading-tight text-white">
                    {t.modalTitle}
                  </h2>
                  <p className="mt-0.5 text-xs text-white/75">{t.modalSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label={t.modalClose}
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
              >
                <X className="size-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* VIDEO */}
            <div className="bg-black" style={{ aspectRatio: "16/9" }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={t.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            {/* FOOTER */}
            <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <label
                htmlFor={checkboxId}
                className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-gray-600"
              >
                <input
                  id={checkboxId}
                  type="checkbox"
                  checked={dontShow}
                  onChange={(e) => setDontShow(e.target.checked)}
                  className="size-4 rounded border-gray-300 accent-teal-dark"
                />
                {t.dontShowAgain}
              </label>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-bold text-gray-600 transition hover:border-gray-400 hover:text-gray-900 sm:shrink-0"
              >
                {t.modalSkip}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
