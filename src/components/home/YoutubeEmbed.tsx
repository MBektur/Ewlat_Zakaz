"use client";

import { useState } from "react";
import { Play } from "lucide-react";

interface YoutubeEmbedProps {
  videoId: string;
  /** Section başlığı */
  title?: string;
  /** Thumbnail üzerinde gösterilecek açıklama */
  caption?: string;
}

/**
 * Lazy-load YouTube embed:
 * İlk renderda yalnızca thumbnail + play butonu gösterilir.
 * Kullanıcı tıklayınca gerçek iframe yüklenir (privacy-enhanced embed).
 */
export function YoutubeEmbed({
  videoId,
  title = "Tanıtım Videosu",
  caption,
}: YoutubeEmbedProps) {
  const [active, setActive] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div
        className="relative w-full overflow-hidden rounded-3xl shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
        style={{ aspectRatio: "16/9" }}
      >
        {active ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            onClick={() => setActive(true)}
            className="group absolute inset-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
            aria-label={`Videoyu oynat: ${title}`}
          >
            {/* Thumbnail */}
            <img
              src={thumb}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                // maxresdefault yoksa hqdefault'a düş
                (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />

            {/* Karartma overlay */}
            <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />

            {/* Oynat butonu */}
            <div className="relative flex size-20 items-center justify-center rounded-full bg-white/90 shadow-xl transition-transform group-hover:scale-110">
              <Play
                className="size-9 translate-x-0.5 text-[#D32F2F]"
                fill="currentColor"
                strokeWidth={0}
              />
            </div>

            {/* Alt açıklama */}
            {caption && (
              <p className="relative mt-4 rounded-full bg-black/50 px-5 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
                {caption}
              </p>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
