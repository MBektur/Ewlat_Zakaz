/** Sipariş panelindeki uçan kargo kutusu (koyu zeminde). */
function Spark({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0-12 3.5-3.5 12 0 3.5 3.5 0 12-3.5 3.5-12 0-3.5-3.5Z" fill="#ffd04a" />;
}

export function ParcelArt({ className }: { className?: string }) {
  return (
    <svg viewBox="70 40 290 230" className={className} aria-hidden="true">
      <ellipse cx="150" cy="238" rx="122" ry="34" transform="rotate(-14 150 238)" stroke="#fff" strokeOpacity=".7" strokeWidth="8" strokeDasharray="250 600" strokeLinecap="round" fill="none" />
      <ellipse cx="170" cy="252" rx="130" ry="38" transform="rotate(-14 170 252)" stroke="#f5b31b" strokeOpacity=".8" strokeWidth="4" strokeDasharray="200 700" strokeLinecap="round" fill="none" />
      <g transform="translate(0 6) rotate(-8 200 150)">
        <polygon points="110,95 215,60 300,95 195,135" fill="#f0c892" />
        <polygon points="110,95 195,135 195,235 110,195" fill="#d9a062" />
        <polygon points="195,135 300,95 300,190 195,235" fill="#b9803f" />
        <polygon points="150.6,81.8 173.4,74.2 259.4,111.2 236.6,118.8" fill="#fbe4b4" opacity=".95" />
        <polygon points="195,135 195,148 236.6,131 236.6,118.8" fill="#fbe4b4" opacity=".6" />
        <path d="M110 95 195 135 300 95" stroke="#fff" strokeOpacity=".3" strokeWidth="2" fill="none" />
        <g transform="matrix(1 0.47 0 1 110 95)">
          <g transform="translate(42 62)">
            <path d="M0 6C-8 1-18 0-27 2V32C-18 30-8 31 0 36 8 31 18 30 27 32V2C18 0 8 1 0 6Z" fill="#2b5fd9" />
            <path d="M0 9C-7 5-15 4-23 6V28C-15 26-7 27 0 31Z" fill="#fff" />
            <path d="M0 9C7 5 15 4 23 6V28C15 26 7 27 0 31Z" fill="#dcebfb" />
            <path d="m0-12 3.4 7 7.6 1.1-5.5 5.4 1.3 7.6L0-.5-6.8 3.1l1.3-7.6L-11-9.9l7.6-1.1Z" fill="#f5b31b" />
          </g>
        </g>
      </g>
      <Spark x={340} y={86} s={1.1} />
      <Spark x={316} y={128} s={0.6} />
      <Spark x={96} y={90} s={0.7} />
    </svg>
  );
}
