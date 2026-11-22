"use client";

import { useEffect, useRef, useState } from "react";
import { X, Film } from "lucide-react";

const STORAGE_KEY = "ewlat_intro_seen";

export interface VideoIntroModalT {
  modalTitle: string;
  modalSubtitle: string;
  modalClose: string;
  dontShowAgain: string;
  watchNow: string;
  modalSkip: string;
  title: string;
}

interface Props {
  videoId: string;
  t: VideoIntroModalT;
}

/**
 * Siteye ilk girişte açılan tanıtım video modalı.
 * - Header: başlık + X butonu
 * - Body: YouTube iframe
 * - Footer: "bir daha gösterme" checkbox + "şimdi değil" butonu
 *
 * Checkbox işaretliyken kapatılırsa localStorage'a kaydeder → bir daha açılmaz.
 * Checkbox işaretli değilse her ziyarette tekrar açılır.
 */
export function VideoIntroModal({ videoId, t }: Props) {
  const [open, setOpen] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const checkboxId = "intro-dont-show";
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const timer = setTimeout(() => setOpen(true), 700);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage yoksa sessizce geç
    }
  }, []);

  // ESC tuşuyla kapat
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  function close() {
    if (dontShow) {
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
      onClick={close}
      role="presentation"
    >
      {/* Modal kutu */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between gap-4 border-b border-teal-dark/20 bg-teal-dark px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Film className="size-5 text-white" strokeWidth={2} />
            </span>
            <div>
              <h2
                id="video-modal-title"
                className="text-base font-extrabold leading-tight text-white"
              >
                {t.modalTitle}
              </h2>
              <p className="mt-0.5 text-xs text-white/75">{t.modalSubtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={t.modalClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
          >
            <X className="size-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* ── VIDEO BODY ── */}
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

        {/* ── FOOTER ── */}
        <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Checkbox */}
          <label
            htmlFor={checkboxId}
            className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-gray-600"
          >
            <input
              id={checkboxId}
              type="checkbox"
              checked={dontShow}
              onChange={(e) => setDontShow(e.target.checked)}
              className="size-4 rounded border-gray-300 accent-[#1B4A7D]"
            />
            {t.dontShowAgain}
          </label>

          {/* Kapat butonu */}
          <button
            type="button"
            onClick={close}
            className="btn-teal inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-extrabold transition sm:shrink-0"
          >
            {t.modalSkip}
          </button>
        </div>
      </div>
    </div>
  );
}
