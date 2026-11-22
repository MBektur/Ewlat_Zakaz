/** Hero çevresindeki yumuşak şekiller: yapraklar ve yıldızlar. Yalnızca kenarlarda, metne girmez. */
export function SideLeaf({ className, tone = "coral" }: { className?: string; tone?: "coral" | "teal" }) {
  const a = tone === "coral" ? "#f47e5a" : "#2a9d8f";
  const b = tone === "coral" ? "#f9a98a" : "#5cc2b4";
  return (
    <svg viewBox="0 0 160 220" className={className} aria-hidden="true">
      <path d="M80 220C70 150 50 100 10 60 70 50 120 90 130 150 134 180 110 205 80 220Z" fill={a} />
      <path d="M80 220C84 160 110 110 150 80 150 130 130 190 80 220Z" fill={b} />
      <path d="M80 218C78 170 60 120 28 78" stroke="#fff" strokeOpacity=".4" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Sparkle({ className, color = "#f5b335" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="-12 -12 24 24" className={className} aria-hidden="true">
      <path d="M0-11 3-3 11 0 3 3 0 11-3 3-11 0-3-3Z" fill={color} />
    </svg>
  );
}

/** Kitapların arkasındaki yumuşak şeftali leke ve yörünge. */
export function BookBlob({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 470" className={className} aria-hidden="true">
      <path d="M92 150C112 70 220 22 322 44s176 78 170 176c-6 100-96 190-214 196S60 380 70 270c3-44 12-86 22-120Z" fill="#ffd7b8" />
      <path d="M128 176C150 118 232 84 312 100s140 62 136 140c-4 78-72 142-162 146S100 336 106 252c2-30 10-54 22-76Z" fill="#ffc9a1" opacity=".6" />
      <ellipse cx="260" cy="430" rx="190" ry="14" fill="#d99a72" opacity=".35" />
      <path d="M40 230C70 120 170 60 270 60" stroke="#f5b335" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" fill="none" />
      <path transform="translate(60 120)" d="M0-12 3.5-3.5 12 0 3.5 3.5 0 12-3.5 3.5-12 0-3.5-3.5Z" fill="#f5b335" />
      <path transform="translate(470 330) scale(.8)" d="M0-12 3.5-3.5 12 0 3.5 3.5 0 12-3.5 3.5-12 0-3.5-3.5Z" fill="#2a9d8f" />
      <path transform="translate(36 340) scale(.6)" d="M0-12 3.5-3.5 12 0 3.5 3.5 0 12-3.5 3.5-12 0-3.5-3.5Z" fill="#ef6a4d" />
    </svg>
  );
}
