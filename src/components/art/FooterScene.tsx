/** Alt bilgi illüstrasyonu (özgün SVG): açık mavi cami silueti, servi ağaçları, tepe. */
export function FooterScene({ className }: { className?: string }) {
  const minaret = (x: number, h: number, w = 11) => (
    <g key={x}>
      <rect x={x - w / 2} y={160 - h} width={w} height={h} fill="#b6d6f6" />
      <rect x={x - w / 2 - 2} y={160 - h + 20} width={w + 4} height="5" rx="2" fill="#a2c9f0" />
      <path d={`M${x - w / 2 - 1} ${160 - h + 6}L${x} ${160 - h - 24}L${x + w / 2 + 1} ${160 - h + 6}Z`} fill="#8dbdf0" />
    </g>
  );
  return (
    <svg viewBox="0 0 520 180" className={className} aria-hidden="true">
      <path d="M0 180V146C110 116 230 114 350 132S480 138 520 126V180Z" fill="#d6e9fb" />
      {/* cami */}
      {minaret(262, 112)}
      {minaret(402, 112)}
      {minaret(244, 80, 9)}
      {minaret(420, 80, 9)}
      <rect x="272" y="104" width="120" height="56" fill="#bcdaf7" />
      <rect x="312" y="88" width="40" height="72" fill="#b2d3f4" />
      <path d="M290 104A42 48 0 0 1 374 104Z" fill="#8dbdf0" />
      <path d="M332 62v-14" stroke="#a2c9f0" strokeWidth="3" />
      <circle cx="332" cy="45" r="3.5" fill="#a2c9f0" />
      <path d="M278 106A14 17 0 0 1 306 106Z" fill="#9cc7f0" />
      <path d="M358 106A14 17 0 0 1 386 106Z" fill="#9cc7f0" />
      <path d="M322 160V132a10 10 0 0 1 20 0V160Z" fill="#8dbdf0" />
      {[286, 298, 366, 378].map((x) => (
        <path key={x} d={`M${x} 142V132a3.5 3.5 0 0 1 7 0V142Z`} fill="#8dbdf0" opacity=".8" />
      ))}
      {/* servi ağaçları */}
      <path d="M214 158C204 130 206 100 218 82 230 100 232 130 224 158Z" fill="#a4cdf3" />
      <path d="M196 160C190 140 192 120 200 108 208 120 208 140 204 160Z" fill="#b6d7f6" />
      {/* yeşil ağaç */}
      <rect x="160" y="132" width="5" height="30" rx="2" fill="#9a6a40" />
      <circle cx="162" cy="122" r="22" fill="#79c862" />
      <circle cx="154" cy="116" r="11" fill="#97d97d" />
      {/* sağ kenar ağaçları */}
      <rect x="478" y="132" width="5" height="30" rx="2" fill="#9a6a40" />
      <circle cx="480" cy="118" r="24" fill="#6fbf58" />
      <circle cx="504" cy="132" r="22" fill="#82cc68" />
      <circle cx="472" cy="110" r="12" fill="#9bdb82" opacity=".8" />
    </svg>
  );
}
