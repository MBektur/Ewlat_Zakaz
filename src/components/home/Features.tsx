import { BookOpen, Languages, ShieldCheck, Truck } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

const styles = [
  { Icon: BookOpen, bubble: "bg-teal-dark" },
  { Icon: Languages, bubble: "bg-accent" },
  { Icon: ShieldCheck, bubble: "bg-primary" },
  { Icon: Truck, bubble: "bg-purple" },
];

/** Avantajlar: yuvarlak renkli ikon + başlık + kısa açıklama. */
export function Features({ items }: { items: Dictionary["features"] }) {
  return (
    <ul className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => {
        const { Icon, bubble } = styles[i % styles.length];
        return (
          <li key={item.title} className="flex items-center gap-4">
            <span className={`flex size-16 shrink-0 items-center justify-center rounded-full text-white shadow-soft ${bubble}`}>
              <Icon className="size-8 rtl:-scale-x-100" strokeWidth={2} />
            </span>
            <span>
              <span className="block text-lg font-extrabold leading-tight text-ink">{item.title}</span>
              <span className="mt-1 block text-sm leading-snug text-body">{item.text}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
