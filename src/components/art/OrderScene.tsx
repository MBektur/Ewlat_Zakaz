/** Ön sipariş kartı illüstrasyonu (özgün SVG): uçan kargo kutusu, cami, tepeler, ağaçlar. */
function Spark({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0-12 3.5-3.5 12 0 3.5 3.5 0 12-3.5 3.5-12 0-3.5-3.5Z"
      fill="#ffc83d"
    />
  );
}

function Tree({ x, y, s = 1, c = "#5fae4e", c2 = "#7cc864" }: { x: number; y: number; s?: number; c?: string; c2?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2.5" y="-4" width="5" height="22" rx="2" fill="#9a6a40" />
      <circle cy="-20" r="20" fill={c} />
      <circle cx="-7" cy="-26" r="11" fill={c2} />
    </g>
  );
}

function Cypress({ x, y, s = 1, c = "#4f9f4b" }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2" y="0" width="4" height="14" rx="2" fill="#8a5d38" />
      <path d="M0-52C14-32 16-8 12 2H-12C-16-8-14-32 0-52Z" fill={c} />
      <path d="M0-48C6-30 6-12 3 0" stroke="#fff" strokeOpacity=".2" strokeWidth="3" fill="none" />
    </g>
  );
}

function Minaret({ x, h, w = 16 }: { x: number; h: number; w?: number }) {
  const top = 352 - h;
  return (
    <g>
      <rect x={x - w / 2} y={top} width={w} height={h} fill="url(#os-wall)" />
      <rect x={x - w / 2 - 3} y={top + 32} width={w + 6} height="6" rx="2" fill="#d9b574" />
      <rect x={x - w / 2 - 2} y={top + 8} width={w + 4} height="5" rx="2" fill="#d9b574" />
      <path d={`M${x - w / 2 - 1} ${top + 8}L${x} ${top - 28}L${x + w / 2 + 1} ${top + 8}Z`} fill="#3b82d6" />
      <path d={`M${x} ${top - 28}v-8`} stroke="#d9b574" strokeWidth="2" />
      <path d={`M${x - 2} ${top + 46}h4v18h-4Z`} fill="#b98a4e" opacity=".55" />
    </g>
  );
}

export function OrderScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 440" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="os-wall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f6dfae" />
          <stop offset="1" stopColor="#e2bd80" />
        </linearGradient>
        <linearGradient id="os-dome" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5aa0ee" />
          <stop offset="1" stopColor="#2f6bbd" />
        </linearGradient>
        <linearGradient id="os-hill1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4ec9f" />
          <stop offset="1" stopColor="#a5de7c" />
        </linearGradient>
        <linearGradient id="os-hill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd566" />
          <stop offset="1" stopColor="#6fbf4a" />
        </linearGradient>
      </defs>

      {/* bulutlar */}
      <g fill="#fff" opacity=".85">
        <path d="M30 230a18 18 0 0 1 17-20 24 24 0 0 1 44-4 18 18 0 0 1 20 18 14 14 0 0 1 0 28H46a16 16 0 0 1-16-22Z" />
        <path d="M500 140a14 14 0 0 1 13-16 20 20 0 0 1 36-4 15 15 0 0 1 16 14 12 12 0 0 1 0 24h-54a14 14 0 0 1-11-18Z" opacity=".8" />
        <path d="M330 250a12 12 0 0 1 11-14 16 16 0 0 1 30-3 12 12 0 0 1 14 11 10 10 0 0 1 0 20h-44a12 12 0 0 1-11-14Z" opacity=".7" />
      </g>

      {/* uzak dağlar */}
      <path d="M0 330C70 280 150 284 220 320S320 350 380 340V440H0Z" fill="#cfe4f6" />
      <path d="M230 346C300 300 380 296 450 330S580 350 640 330V440H230Z" fill="#d6e8f8" opacity=".9" />

      {/* camii */}
      <g>
        <Minaret x={372} h={150} />
        <Minaret x={568} h={150} />
        <Minaret x={346} h={108} w={13} />
        <Minaret x={594} h={108} w={13} />
        <rect x="394" y="270" width="152" height="82" fill="url(#os-wall)" />
        <rect x="446" y="246" width="48" height="106" fill="#efd29c" />
        <rect x="422" y="262" width="96" height="12" rx="2" fill="#e8c88d" />
        <path d="M418 266A52 60 0 0 1 522 266Z" fill="url(#os-dome)" />
        <path d="M430 262A40 48 0 0 1 462 222" stroke="#fff" strokeOpacity=".4" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M470 206v-12" stroke="#d9b574" strokeWidth="3" />
        <circle cx="470" cy="190" r="4" fill="#ffc83d" />
        <path d="M390 272A19 22 0 0 1 428 272Z" fill="#4a90e2" />
        <path d="M512 272A19 22 0 0 1 550 272Z" fill="#4a90e2" />
        <path d="M456 352V308a14 14 0 0 1 28 0V352Z" fill="#c99a5b" />
        <path d="M461 352V312a9 9 0 0 1 18 0V352Z" fill="#2f5d8c" />
        {[404, 420, 520, 536].map((x) =>
          [288, 318].map((y) => (
            <path key={`${x}-${y}`} d={`M${x} ${y + 20}V${y + 6}a4.5 4.5 0 0 1 9 0V${y + 20}Z`} fill="#b98a4e" opacity=".6" />
          )),
        )}
        {[450, 486].map((x) => (
          <path key={x} d={`M${x} 292V278a4 4 0 0 1 8 0V292Z`} fill="#b98a4e" opacity=".6" />
        ))}
      </g>

      {/* tepeler */}
      <path d="M130 440C220 380 360 350 480 356S600 376 640 362V440Z" fill="url(#os-hill1)" />
      <path d="M0 440V392C70 366 150 372 210 394S330 418 400 414 540 400 640 408V440Z" fill="url(#os-hill2)" />
      <path d="M455 440C440 414 524 404 494 372L488 354H468L474 372C496 404 424 414 438 440Z" fill="#f1dca8" />

      {/* ağaçlar */}
      <Cypress x={282} y={388} s={1.05} />
      <Cypress x={304} y={392} s={0.8} c="#5fae4e" />
      <Tree x={252} y={394} s={0.9} />
      <Tree x={346} y={386} s={0.7} c="#6fbc58" c2="#8ccf70" />
      <Tree x={604} y={380} s={0.85} />
      <Tree x={630} y={392} s={0.7} c="#6fbc58" c2="#8ccf70" />
      <Tree x={120} y={404} s={0.85} />
      <Tree x={80} y={412} s={0.7} c="#6fbc58" c2="#8ccf70" />
      <Cypress x={176} y={408} s={0.75} />

      {/* çiçekler */}
      <g>
        <path d="M570 440v-34" stroke="#4f9f45" strokeWidth="3" />
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx="570" cy="394" rx="6" ry="11" fill="#ffc83d" transform={`rotate(${r} 570 402)`} />
        ))}
        <circle cx="570" cy="402" r="6" fill="#e8892b" />
        <path d="M606 440v-22" stroke="#4f9f45" strokeWidth="3" />
        <circle cx="606" cy="414" r="8" fill="#ff8aa1" />
        <circle cx="606" cy="414" r="3.5" fill="#ffe08a" />
        <path d="M30 440v-20" stroke="#4f9f45" strokeWidth="3" />
        <circle cx="30" cy="414" r="8" fill="#fff" />
        <circle cx="30" cy="414" r="3.5" fill="#ffc83d" />
      </g>

      {/* hareket halkası */}
      <ellipse cx="150" cy="238" rx="122" ry="34" transform="rotate(-14 150 238)" stroke="#fff" strokeOpacity=".75" strokeWidth="9" strokeDasharray="250 600" strokeLinecap="round" fill="none" />
      <ellipse cx="170" cy="250" rx="130" ry="38" transform="rotate(-14 170 250)" stroke="#9cc9f2" strokeOpacity=".7" strokeWidth="4" strokeDasharray="200 700" strokeLinecap="round" fill="none" />

      {/* uçan kutu */}
      <g transform="translate(0 6) rotate(-8 200 150)">
        <polygon points="110,95 215,60 300,95 195,135" fill="#ecc189" />
        <polygon points="110,95 195,135 195,235 110,195" fill="#d29a5b" />
        <polygon points="195,135 300,95 300,190 195,235" fill="#b9803f" />
        <polygon points="150.6,81.8 173.4,74.2 259.4,111.2 236.6,118.8" fill="#f6dcaa" opacity=".9" />
        <polygon points="195,135 195,148 236.6,131 236.6,118.8" fill="#f6dcaa" opacity=".6" />
        <path d="M110 95 195 135 300 95" stroke="#fff" strokeOpacity=".3" strokeWidth="2" fill="none" />
        <path d="M195 135V235" stroke="#000" strokeOpacity=".12" strokeWidth="2" />
        {/* sol yüzde kitap logosu */}
        <g transform="matrix(1 0.47 0 1 110 95)">
          <g transform="translate(42 62)">
            <path d="M0 6C-8 1-18 0-27 2V32C-18 30-8 31 0 36 8 31 18 30 27 32V2C18 0 8 1 0 6Z" fill="#2c7be5" />
            <path d="M0 9C-7 5-15 4-23 6V28C-15 26-7 27 0 31Z" fill="#fff" />
            <path d="M0 9C7 5 15 4 23 6V28C15 26 7 27 0 31Z" fill="#dcebfb" />
            <path d="m0-12 3.4 7 7.6 1.1-5.5 5.4 1.3 7.6L0-.5-6.8 3.1l1.3-7.6L-11-9.9l7.6-1.1Z" fill="#f5b31b" />
          </g>
        </g>
        <path d="M262 150 288 140" stroke="#8a5d2e" strokeOpacity=".5" strokeWidth="3" strokeLinecap="round" />
        <path d="M250 175 285 162" stroke="#8a5d2e" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
      </g>

      <Spark x={352} y={88} s={1.1} />
      <Spark x={382} y={118} s={0.7} />
      <Spark x={336} y={126} s={0.5} />
    </svg>
  );
}
