import { BookOpen, Languages, ShieldCheck, Truck } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

const styles = [
  { Icon: BookOpen, bubble: "bg-gradient-to-br from-[#dcecff] to-[#b9d8fb] text-primary" },
  { Icon: Languages, bubble: "bg-gradient-to-br from-[#e3f6d9] to-[#bfe6a8] text-[#3f9a3a]" },
  { Icon: ShieldCheck, bubble: "bg-gradient-to-br from-[#ebe6ff] to-[#cfc5fb] text-purple" },
  { Icon: Truck, bubble: "bg-gradient-to-br from-[#ffe9d6] to-[#ffc999] text-orange" },
];

export function Features({ items }: { items: Dictionary["features"] }) {
  return (
    <ul className="grid grid-cols-2 rounded-[2rem] border border-white bg-[#ecf4fd] p-2 shadow-soft lg:grid-cols-4">
      {items.map((item, i) => {
        const { Icon, bubble } = styles[i % styles.length];
        return (
          <li
            key={item.title}
            className="flex flex-col items-center gap-3 px-3 py-6 text-center lg:border-e lg:border-line-strong/60 lg:last:border-e-0"
          >
            <span className={`flex size-16 items-center justify-center rounded-2xl ${bubble}`}>
              <Icon className="size-8 rtl:-scale-x-100" strokeWidth={2} />
            </span>
            <span>
              <span className="block text-lg font-extrabold text-ink">{item.title}</span>
              <span className="mt-0.5 block text-sm text-body">{item.text}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
