import { HandCoins, Languages, Library, Truck } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

const icons = [Library, Languages, HandCoins, Truck];

export function Features({ items }: { items: Dictionary["features"] }) {
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
      {items.map((item, i) => {
        const Icon = icons[i] ?? Library;
        return (
          <li key={item.title} className="flex flex-col items-center gap-3 bg-surface px-4 py-7 text-center sm:flex-row sm:items-start sm:text-start">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-soft text-primary">
              <Icon className="size-5 rtl:-scale-x-100" strokeWidth={1.6} />
            </span>
            <span>
              <span className="block font-medium text-ink">{item.title}</span>
              <span className="mt-0.5 block text-sm text-muted">{item.text}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
