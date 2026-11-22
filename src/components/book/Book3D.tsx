"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { BookOpen } from "lucide-react";

export type Book3DData = {
  coverUrl: string | null;
  /** Kapak görselinin piksel ölçüleri (yükleme/seed sırasında dosyadan okunur). */
  coverWidth: number;
  coverHeight: number;
  thicknessMm: number;
};

type Props = {
  book: Book3DData;
  /** Kitabın sığacağı kutu (px). Oran korunur; uzun kitap yüksekliği, geniş kitap genişliği doldurur. */
  maxWidth: number;
  maxHeight: number;
  /** Uygurca kitaplar sağdan ciltlenir. */
  binding?: "right" | "left";
  alt: string;
  /** Gerçek kapak yokken kapakta gösterilecek kısa metin. */
  placeholderLabel?: string;
  priority?: boolean;
  className?: string;
};

/** Kapak oranına göre kutuya sığdırır; sırt kalınlığını kapak genişliğine göre ölçekler. */
export function bookSize(ratio: number, thicknessMm: number, maxWidth: number, maxHeight: number) {
  const width = Math.round(Math.min(maxWidth, maxHeight / ratio));
  const height = Math.round(width * ratio);
  // ~150 mm genişliğinde bir kitap varsayımıyla mm → px
  const thickness = Math.round(Math.min(28, Math.max(6, thicknessMm * (width / 150) * 1.6)));
  return { width, height, thickness };
}

export function Book3D({
  book,
  maxWidth,
  maxHeight,
  binding = "right",
  alt,
  placeholderLabel,
  priority,
  className = "",
}: Props) {
  // 3D kitabın oranı kapak görselinin oranıdır. Kayıttaki ölçü yanlışsa, görsel
  // yüklendiğinde gerçek piksel ölçüsüyle düzeltilir.
  const [ratio, setRatio] = useState(book.coverHeight / book.coverWidth);
  const { width, height, thickness } = bookSize(ratio, book.thicknessMm, maxWidth, maxHeight);

  function syncRatio(img: HTMLImageElement) {
    if (!img.naturalWidth || !img.naturalHeight) return;
    const real = img.naturalHeight / img.naturalWidth;
    if (Math.abs(real - ratio) / ratio > 0.01) setRatio(real);
  }

  const style = {
    "--book-w": `${width}px`,
    "--book-h": `${height}px`,
    "--book-t": `${thickness}px`,
  } as CSSProperties;
  const sizes = `${width}px`;
  const isStaticCover = !!book.coverUrl?.startsWith("/covers/");

  return (
    <div
      className={`book-scene book--bind-${binding} ${className}`}
      style={{ ...style, minHeight: height + 14 }}
      role="img"
      aria-label={alt}
    >
      <div className="book" aria-hidden="true">
        <div className="book-face book-front">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt=""
              fill
              sizes={sizes}
              unoptimized={isStaticCover}
              priority={priority}
              loading={priority ? "eager" : "lazy"}
              onLoad={(e) => syncRatio(e.currentTarget)}
              className="object-cover"
            />
          ) : (
            <div className="book-placeholder">
              <BookOpen className="size-7 opacity-50" strokeWidth={1.4} />
              {placeholderLabel && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">
                  {placeholderLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="book-face book-spine">
          {book.coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.coverUrl}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          )}
        </div>
        <div className="book-face book-pages" />
        <div className="book-face book-top" />
        <div className="book-face book-back" />
      </div>
      <div className="book-shadow" aria-hidden="true" />
    </div>
  );
}
