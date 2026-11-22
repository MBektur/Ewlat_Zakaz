"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "ewlat_intro_seen";

interface Props {
  videoId: string;
  title: string;
  closeLabel: string;
  skipLabel: string;
}

/**
 * Siteye ilk girişte otomatik açılan tanıtım video modalı.
 * localStorage'da "ewlat_intro_seen" yoksa gösterilir; kapanınca kaydeder.
 */
export function VideoIntroModal({ videoId, title, closeLabel, skipLabel }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        // Küçük gecikme: sayfa render olduktan sonra aç (layout shift önleme)
        const t = setTimeout(() => setOpen(true), 800);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage erişilemiyorsa sessizce geç
    }
  }, []);

  function close() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setOpen(false);
  }

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Modal kutusu — tıklamayı durdur */}
      <div
        className="relative w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kapat butonu */}
        <button
          type="button"
          onClick={close}
          aria-label={closeLabel}
          className="absolute -right-3 -top-3 z-10 flex size-9 items-center justify-center rounded-full bg-white text-ink shadow-lg transition hover:bg-gray-100 rtl:left-[-0.75rem] rtl:right-auto"
        >
          <X className="size-5" strokeWidth={2.5} />
        </button>

        {/* Video iframe */}
        <div
          className="overflow-hidden rounded-2xl shadow-2xl"
          style={{ aspectRatio: "16/9" }}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Alt çubuk */}
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={close}
            className="rounded-full bg-white/15 px-5 py-2 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            {skipLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
