import type { Dictionary } from "@/i18n/dictionaries";
import { SectionTitle } from "./SectionTitle";

const tone = ["bg-primary", "bg-accent text-ink", "bg-teal-dark"];

/** "Nasıl çalışır?" : üç net adım. */
export function Steps({ how }: { how: Dictionary["how"] }) {
  return (
    <div>
      <SectionTitle>{how.title}</SectionTitle>
      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {how.steps.map((step, i) => (
          <li key={step.title} className="relative rounded-3xl border border-line bg-surface p-6 pt-9">
            <span
              className={`font-display absolute -top-5 start-6 flex size-11 items-center justify-center rounded-full text-xl text-white shadow-soft ${tone[i % tone.length]}`}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <h3 className="text-xl font-extrabold text-ink">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-body">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
