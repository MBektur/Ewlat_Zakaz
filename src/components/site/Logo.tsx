import Image from "next/image";

/** Hilal üzerinde kitap okuyan çocuk. Hilal beyaz olduğu için koyu teal rozet içinde durur. */
export function LogoMark({ className = "size-11" }: { className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-2xl bg-teal-dark p-[12%] ${className}`} aria-hidden="true">
      <Image src="/logo-mark.png" alt="" width={534} height={640} unoptimized className="h-full w-auto" />
    </span>
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
