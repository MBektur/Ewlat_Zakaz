import { Sparkle } from "@/components/art/HeroDecor";

/** Ortalanmış bölüm başlığı, iki yanında küçük yıldızlar. */
export function SectionTitle({ id, children, as: Tag = "h2" }: { id?: string; children: React.ReactNode; as?: "h1" | "h2" }) {
  return (
    <div className="flex items-center justify-center gap-3 text-center">
      <Sparkle className="size-5 shrink-0" color="#f5b335" />
      <Tag id={id} className="font-display text-2xl text-ink sm:text-4xl">
        {children}
      </Tag>
      <Sparkle className="size-5 shrink-0" color="#2a9d8f" />
    </div>
  );
}
