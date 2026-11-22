/** Açık kitap + yıldız (ref-ui logosu esinli). */
export function LogoMark({ className = "size-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M24 14c-5-3.6-11.6-4.6-19-3.4v25.6c7.4-1.2 14 .2 19 3.8 5-3.6 11.6-5 19-3.8V10.6C35.6 9.4 29 10.4 24 14Z" fill="#2a9d8f" />
      <path d="M24 16.4c-4.2-2.8-9.6-3.6-15.6-2.8v20.2c6-.6 11.4.6 15.6 3.4V16.4Z" fill="#fff" />
      <path d="M24 16.4c4.2-2.8 9.6-3.6 15.6-2.8v20.2c-6-.6-11.4.6-15.6 3.4V16.4Z" fill="#fde8d4" />
      <path d="M12 20.5c3.6-.3 6.8.4 9 1.8M12 25c3.6-.3 6.8.4 9 1.8M27 22.3c2.2-1.4 5.4-2.1 9-1.8M27 26.8c2.2-1.4 5.4-2.1 9-1.8" stroke="#e6c9a8" strokeWidth="1.4" strokeLinecap="round" />
      <path d="m24 2.8 2.2 4.5 5 .7-3.6 3.5.9 4.9-4.5-2.3-4.5 2.3.9-4.9L16.8 8l5-.7L24 2.8Z" fill="#f5b31b" />
    </svg>
  );
}

/** Marka adını iki satıra böler: "Ewlat" / "Kitap". */
export function BrandText({ brand, className = "", light }: { brand: string; className?: string; light?: boolean }) {
  const [first, ...rest] = brand.split(" ");
  return (
    <span className={`flex flex-col font-display text-[1.2rem] leading-[1.05] ${className}`}>
      <span className={light ? "text-white" : "text-primary"}>{first}</span>
      {rest.length > 0 && <span className={light ? "text-sun" : "text-teal-dark"}>{rest.join(" ")}</span>}
    </span>
  );
}
