/** Köşe yaprak demeti. Dekoratif SVG. */
export function LeafCluster({ className, flip }: { className?: string; flip?: boolean }) {
  const leaf = "M0 0C14-20 38-22 54-6 40 14 14 18 0 0Z";
  return (
    <svg viewBox="0 0 90 130" className={className} aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M8 130C14 90 18 50 10 6" stroke="#6aa94f" strokeWidth="3" fill="none" strokeLinecap="round" />
      {[
        { x: 10, y: 14, r: -25, c: "#8ccf66" },
        { x: 12, y: 40, r: 18, c: "#6dbb52" },
        { x: 12, y: 62, r: -30, c: "#9bd978" },
        { x: 14, y: 86, r: 22, c: "#78c45a" },
        { x: 14, y: 108, r: -18, c: "#8ccf66" },
      ].map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r})`}>
          <path d={leaf} fill={l.c} />
          <path d="M2 0C20-3 36-6 50-6" stroke="#fff" strokeOpacity=".5" strokeWidth="1.4" fill="none" />
        </g>
      ))}
    </svg>
  );
}
