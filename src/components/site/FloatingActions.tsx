"use client";

import { useSyncExternalStore } from "react";
import { ArrowDown, ArrowUp, MessageCircle } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { whatsappUrl } from "@/lib/contact";

type Props = {
  locale: Locale;
  labels: { whatsapp: string; scrollTop: string; scrollBottom: string };
};

/** Sayfa konumu: başta, ortada, sonda ya da kaydırılacak yer yok. */
type Pos = "none" | "top" | "mid" | "bottom";
const EDGE = 300;

function getPos(): Pos {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max < EDGE * 2) return "none";
  if (window.scrollY < EDGE) return "top";
  if (max - window.scrollY < EDGE) return "bottom";
  return "mid";
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

const round =
  "flex items-center justify-center rounded-full shadow-lift transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2";

/**
 * Sağ altta (RTL'de sol altta) sabit buton grubu: yukarı çık, aşağı in, WhatsApp.
 * `fixed` olduğu için sayfa düzenini etkilemez; gereksiz olan ok gizlenir ama yeri korunur,
 * bu yüzden WhatsApp düğmesi hiç yer değiştirmez.
 */
export function FloatingActions({ locale, labels }: Props) {
  const pos = useSyncExternalStore(subscribe, getPos, () => "none" as Pos);
  const showTop = pos === "mid" || pos === "bottom";
  const showBottom = pos === "top" || pos === "mid";
  const arrow = `${round} size-11 bg-surface text-ink ring-1 ring-line-strong hover:bg-soft focus-visible:outline-primary`;
  const hidden = "pointer-events-none translate-y-2 opacity-0";

  return (
    <div className="fixed bottom-4 end-4 z-40 flex flex-col items-center gap-2 sm:bottom-6 sm:end-6">
      <button
        type="button"
        onClick={() => scrollToY(0)}
        aria-label={labels.scrollTop}
        title={labels.scrollTop}
        aria-hidden={!showTop}
        tabIndex={showTop ? 0 : -1}
        className={`${arrow} ${showTop ? "" : hidden}`}
      >
        <ArrowUp className="size-5" strokeWidth={2.6} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => scrollToY(document.documentElement.scrollHeight)}
        aria-label={labels.scrollBottom}
        title={labels.scrollBottom}
        aria-hidden={!showBottom}
        tabIndex={showBottom ? 0 : -1}
        className={`${arrow} ${showBottom ? "" : hidden}`}
      >
        <ArrowDown className="size-5" strokeWidth={2.6} aria-hidden="true" />
      </button>
      <a
        href={whatsappUrl(locale)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.whatsapp}
        title={labels.whatsapp}
        className={`${round} size-14 bg-[#25D366] text-white hover:scale-105 hover:brightness-95 focus-visible:outline-[#25D366]`}
      >
        <MessageCircle className="size-7" aria-hidden="true" fill="currentColor" strokeWidth={0} />
      </a>
    </div>
  );
}
