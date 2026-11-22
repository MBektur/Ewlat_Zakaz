"use client";

import { useSyncExternalStore } from "react";
import { ArrowDown, ArrowUp, MessageCircle } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { whatsappUrl } from "@/lib/contact";

type Props = {
  locale: Locale;
  labels: { whatsapp: string; scrollTop: string; scrollBottom: string };
};

/**
 * Kaydırma yüzdesi (0–100). 0 yalnızca tam başta, 100 yalnızca tam sonda döner;
 * böylece "yukarı" ve "aşağı" düğmelerinin etkin/pasif durumu bu tek sayıdan çıkar.
 */
function getPercent(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 1) return 0;
  const y = window.scrollY;
  if (y < 1) return 0;
  if (max - y < 1) return 100;
  return Math.min(99, Math.max(1, Math.round((y / max) * 100)));
}

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

function scrollToY(top: number) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

const R = 15;
const CIRC = 2 * Math.PI * R;

const arrowBtn =
  "flex size-8 items-center justify-center rounded-full text-body transition hover:bg-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-body";

/**
 * Sağ altta (RTL'de sol altta) sabit grup: yukarı ok, kaydırma yüzdesi, aşağı ok ve altında WhatsApp.
 * `fixed` olduğu için sayfa düzenini etkilemez. Çalışmayan ok gizlenmez, pasif görünür.
 */
export function FloatingActions({ locale, labels }: Props) {
  const percent = useSyncExternalStore(subscribe, getPercent, () => 0);

  return (
    <div className="fixed bottom-3 end-3 z-40 flex flex-col items-center gap-2 opacity-85 transition-opacity hover:opacity-100 focus-within:opacity-100 sm:bottom-4 sm:end-4">
      <div className="flex flex-col items-center gap-0.5 rounded-full border border-line bg-surface/90 p-1 shadow-soft backdrop-blur">
        <button
          type="button"
          onClick={() => scrollToY(0)}
          disabled={percent === 0}
          aria-label={labels.scrollTop}
          title={labels.scrollTop}
          className={arrowBtn}
        >
          <ArrowUp className="size-4" strokeWidth={2.6} aria-hidden="true" />
        </button>

        {/* Kaydırma ilerlemesi: halka + yüzde */}
        <div dir="ltr" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} className="relative flex size-8 items-center justify-center">
          <svg viewBox="0 0 36 36" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
            <circle cx="18" cy="18" r={R} fill="none" strokeWidth="3" className="stroke-line" />
            <circle
              cx="18"
              cy="18"
              r={R}
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - percent / 100)}
              className="stroke-teal transition-[stroke-dashoffset] duration-150"
            />
          </svg>
          <span className="text-[9px] font-bold tabular-nums text-muted">{percent}%</span>
        </div>

        <button
          type="button"
          onClick={() => scrollToY(document.documentElement.scrollHeight)}
          disabled={percent === 100}
          aria-label={labels.scrollBottom}
          title={labels.scrollBottom}
          className={arrowBtn}
        >
          <ArrowDown className="size-4" strokeWidth={2.6} aria-hidden="true" />
        </button>
      </div>

      <a
        href={whatsappUrl(locale)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.whatsapp}
        title={labels.whatsapp}
        className="flex size-11 items-center justify-center rounded-full bg-[#3fa56d] text-white shadow-soft transition hover:scale-105 hover:bg-[#25D366] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3fa56d]"
      >
        <MessageCircle className="size-6" aria-hidden="true" fill="currentColor" strokeWidth={0} />
      </a>
    </div>
  );
}
