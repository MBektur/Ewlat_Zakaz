/**
 * Hero illüstrasyonu (özgün SVG): gökyüzü, tepeler, ağaçlar, kuş, çiçekler.
 * "wide": masaüstünde hero'nun tamamını kaplar.
 * "compact": mobilde metnin altında.
 */
type Props = { variant?: "wide" | "compact"; className?: string };

function Flower({ x, y, c = "#fff", s = 1 }: { x: number; y: number; c?: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V26" stroke="#4f9f45" strokeWidth="3" strokeLinecap="round" />
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="0" cy="-9" rx="5.5" ry="9" fill={c} transform={`rotate(${r})`} />
      ))}
      <circle r="5" fill="#ffc83d" />
    </g>
  );
}

export function HeroScene({ variant = "wide", className }: Props) {
  const wide = variant === "wide";
  return (
    <svg
      viewBox={wide ? "0 0 1440 640" : "640 0 800 640"}
      preserveAspectRatio={wide ? "xMaxYMax slice" : "xMidYMax meet"}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hs-hill1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9edaa" />
          <stop offset="1" stopColor="#b2e48a" />
        </linearGradient>
        <linearGradient id="hs-hill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9de7e" />
          <stop offset="1" stopColor="#8fd067" />
        </linearGradient>
        <linearGradient id="hs-hill3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8ad25f" />
          <stop offset="1" stopColor="#6fbf4a" />
        </linearGradient>
      </defs>

      {/* Bulutlar */}
      <g fill="#fff" opacity=".9">
        <path d="M120 150a30 30 0 0 1 28-34 38 38 0 0 1 70-8 30 30 0 0 1 36 30 24 24 0 0 1-2 48H140a28 28 0 0 1-20-36Z" opacity=".8" />
        <path d="M560 78a24 24 0 0 1 22-28 30 30 0 0 1 56-6 24 24 0 0 1 28 24 20 20 0 0 1 0 38H580a22 22 0 0 1-20-28Z" opacity=".85" />
        <path d="M1010 190a26 26 0 0 1 24-30 32 32 0 0 1 60-6 26 26 0 0 1 30 26 20 20 0 0 1 0 42h-92a24 24 0 0 1-22-32Z" opacity=".75" />
      </g>

      {/* Uzak dağlar */}
      <path d="M0 470C90 410 190 380 290 424S470 470 560 452 720 440 800 462V640H0Z" fill="#d3e7f7" />
      <path d="M520 470c60-34 130-50 200-30s140 50 240 18 300-46 480-6V640H520Z" fill="#cde4f6" opacity=".8" />

      {/* Büyük ağaç (sağ üst) */}
      <g transform="translate(0 0)">
        <path d="M1318 0C1308 84 1330 150 1316 262H1384C1372 168 1394 76 1386 0Z" fill="#a06b3e" />
        <path d="M1336 120C1300 100 1270 96 1244 112" stroke="#a06b3e" strokeWidth="10" strokeLinecap="round" fill="none" />
        <g fill="#5fae4e">
          <circle cx="1270" cy="70" r="82" />
          <circle cx="1380" cy="40" r="96" />
          <circle cx="1450" cy="130" r="84" />
          <circle cx="1330" cy="160" r="68" />
          <circle cx="1230" cy="150" r="56" />
        </g>
        <g fill="#7cc864">
          <circle cx="1250" cy="52" r="46" />
          <circle cx="1362" cy="22" r="54" />
          <circle cx="1432" cy="106" r="44" />
          <circle cx="1316" cy="144" r="34" />
        </g>
        <g fill="#9ddc7e" opacity=".8">
          <circle cx="1236" cy="40" r="22" />
          <circle cx="1352" cy="6" r="26" />
        </g>
      </g>

      {/* Arka plan ağaç/çalıları */}
      <g>
        <g transform="translate(90 0)">
        <path d="M770 470C776 420 770 380 780 340H800C808 380 800 420 806 470Z" fill="#9a6a40" />
        <circle cx="760" cy="322" r="58" fill="#86cd63" />
        <circle cx="830" cy="304" r="64" fill="#9bd877" />
        <circle cx="800" cy="360" r="52" fill="#78c25a" />
        <circle cx="815" cy="296" r="30" fill="#b3e68e" opacity=".8" />
        </g>
        <circle cx="1240" cy="388" r="50" fill="#8ed16a" />
        <circle cx="1290" cy="410" r="42" fill="#7cc55b" />
        <circle cx="1100" cy="360" r="44" fill="#a2dc7f" opacity=".9" />
      </g>

      {/* Tepeler */}
      <path d="M0 500C260 440 520 470 760 486S1200 440 1440 470V640H0Z" fill="url(#hs-hill1)" />
      <path d="M0 548C300 508 600 540 900 528S1300 508 1440 524V640H0Z" fill="url(#hs-hill2)" />

      {/* Kuş */}
      <g transform="translate(1000 150) scale(.8)">
        <path d="M-12 4C-48-42-92-40-110-14-76-18-44 0-14 18Z" fill="#a8abd4" />
        <path d="M6 0C30-44 70-56 96-40 64-38 40-20 18 16Z" fill="#7f83ae" />
        <ellipse cx="0" cy="14" rx="30" ry="13" fill="#8f92bc" />
        <path d="M-26 14 -52 28 -22 24Z" fill="#7f83ae" />
        <circle cx="28" cy="8" r="10" fill="#8f92bc" />
        <path d="M37 7 48 10 37 13Z" fill="#f0a24a" />
        <circle cx="31" cy="6" r="2" fill="#2a2a44" />
      </g>

      {/* Orta plan ağaçları */}
      <g>
        <rect x="954" y="440" width="7" height="46" rx="3" fill="#9a6a40" />
        <circle cx="957" cy="418" r="34" fill="#6fbc58" />
        <circle cx="946" cy="408" r="18" fill="#8ccf70" />
        <rect x="1196" y="452" width="6" height="40" rx="3" fill="#9a6a40" />
        <circle cx="1199" cy="432" r="28" fill="#5fae4e" />
        <circle cx="1190" cy="424" r="14" fill="#7cc864" />
        <path d="M1262 496C1250 450 1254 410 1270 380 1286 410 1290 450 1280 496Z" fill="#4f9f4b" />
      </g>

      {/* Ön plan: çim ve çiçekler */}
      <path d="M0 596C300 572 620 590 940 578S1300 566 1440 580V640H0Z" fill="url(#hs-hill3)" />
      <g fill="#5fb343">
        <path d="M880 600l8-30 6 28 10-26 2 30Z" />
        <path d="M1120 590l8-28 6 26 10-24 2 28Z" />
        <path d="M720 604l7-26 5 24 9-22 2 26Z" />
      </g>
      <Flower x={806} y={560} c="#fff" s={1.1} />
      <Flower x={846} y={578} c="#ffd1d8" s={0.9} />
      <Flower x={1330} y={540} c="#ff7d5c" s={1.2} />
      <Flower x={1380} y={560} c="#fff" s={1} />
      <Flower x={1410} y={528} c="#ffc83d" s={0.9} />
      <Flower x={1250} y={576} c="#fff" s={0.9} />
      <Flower x={690} y={580} c="#fff" s={1} />
    </svg>
  );
}
