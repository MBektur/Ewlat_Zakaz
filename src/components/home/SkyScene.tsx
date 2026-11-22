/** Hero arka planı: gökyüzü, bulutlar, tepeler. Tamamen dekoratif. */
export function SkyScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-[#cfe6fb] via-[#e5f2fd] to-[#f2f8fe]" />
      <Cloud className="absolute left-[4%] top-[18%] w-40 opacity-90" />
      <Cloud className="absolute right-[30%] top-[8%] w-28 opacity-80" />
      <Cloud className="absolute right-[3%] top-[30%] w-36 opacity-90" />
      {/* Kuş */}
      <svg viewBox="0 0 40 20" className="absolute right-[24%] top-[14%] w-10 text-[#7b8fb8]">
        <path d="M2 12c6-6 12-6 18 0 6-6 12-6 18 0" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
      {/* Tepeler */}
      <svg viewBox="0 0 1440 260" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[38%] w-full">
        <path d="M0 150C200 90 360 80 560 120s380 70 560 20 260-40 320-30V260H0Z" fill="#bfe3a8" />
        <path d="M0 190c180-40 360-50 560-20s420 60 600 30 220-30 280-25V260H0Z" fill="#9fd486" />
        <path d="M0 225c240-25 520-25 760-5s460 25 680 0V260H0Z" fill="#f2f8fe" />
      </svg>
      {/* Çiçek noktaları */}
      {[
        ["58%", "78%", "#f5b31b"],
        ["66%", "84%", "#ffffff"],
        ["82%", "80%", "#f08a3a"],
        ["90%", "86%", "#ffffff"],
        ["12%", "86%", "#ffffff"],
        ["20%", "82%", "#f5b31b"],
      ].map(([left, top, color]) => (
        <span key={left + top} className="absolute size-2 rounded-full" style={{ left, top, background: color }} />
      ))}
    </div>
  );
}

function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 50" className={className}>
      <path
        d="M20 44h82a16 16 0 0 0 0-32 22 22 0 0 0-40-6A18 18 0 0 0 30 18 14 14 0 0 0 20 44Z"
        fill="#fff"
      />
    </svg>
  );
}
