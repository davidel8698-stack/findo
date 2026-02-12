/**
 * OrganicIllustration — Tab 2: "Organic Marketing" (קידום אורגני)
 *
 * Communicates at a glance: "ORGANIC SEO = LONG MARATHON. Takes 6-12 months."
 *
 * Visual hierarchy:
 *   1. "6-12" hero number (THE story — it takes MONTHS)
 *   2. "months" supporting text
 *   3. Frustratingly flat growth curve
 *   4. Timeline with month markers
 *   5. Hourglass (patience/waiting symbol)
 *   6. Progress bar at ~22% (long way to go)
 *
 * Palette: dark monochrome with accent-orange (#885c38) for time/patience elements
 * ViewBox: 0 0 400 260
 */
function OrganicIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">

      {/* ═══ Background ═══ */}
      <rect x="0" y="0" width="400" height="260" rx="0" fill="#08090a" />
      {/* Subtle inner panel for depth */}
      <rect x="16" y="12" width="368" height="236" rx="10" fill="#0c0d0f" stroke="#161719" strokeWidth="0.5" />

      {/* ═══ Faint horizontal grid lines — very subtle depth texture ═══ */}
      <g opacity="0.3">
        <line x1="28" y1="60" x2="372" y2="60" stroke="#131416" strokeWidth="0.4" />
        <line x1="28" y1="100" x2="372" y2="100" stroke="#131416" strokeWidth="0.4" />
        <line x1="28" y1="140" x2="372" y2="140" stroke="#131416" strokeWidth="0.4" />
        <line x1="28" y1="180" x2="372" y2="180" stroke="#131416" strokeWidth="0.4" />
      </g>

      {/* ═══ HERO: "6-12" — THE dominant focal point ═══ */}
      <text
        x="200"
        y="138"
        textAnchor="middle"
        fill="rgba(255,255,255,0.45)"
        fontSize="82"
        fontWeight="800"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-4"
      >
        6-12
      </text>

      {/* "months" supporting label — readable but secondary */}
      <text
        x="200"
        y="164"
        textAnchor="middle"
        fill="rgba(255,255,255,0.18)"
        fontSize="20"
        fontWeight="500"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="4"
      >
        MONTHS
      </text>

      {/* ═══ Growth Curve — frustratingly flat, barely rising ═══ */}
      {/* Area fill under the curve */}
      <path
        d="M40 210 C80 209 140 208 200 206 C260 204 310 200 360 194 L360 230 L40 230 Z"
        fill="#1c1d20"
        opacity="0.4"
      />
      {/* The line itself — almost horizontal, very gentle slope */}
      <path
        d="M40 210 C80 209.5 140 208.5 200 206.5 C260 204 310 200 360 194"
        stroke="#3a3b3f"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Data points along curve */}
      <circle cx="100" cy="209" r="2.5" fill="#333538" stroke="#0c0d0f" strokeWidth="1" />
      <circle cx="200" cy="206.5" r="3" fill="#3a3b3f" stroke="#0c0d0f" strokeWidth="1.5" />
      <circle cx="300" cy="198" r="2.5" fill="#333538" stroke="#0c0d0f" strokeWidth="1" />
      {/* Faint projected continuation (dashed) — still barely rising */}
      <path
        d="M360 194 C370 192 380 190 390 188"
        stroke="#2a2b2f"
        strokeWidth="1"
        strokeDasharray="3 4"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* ═══ Timeline Month Markers — bottom row ═══ */}
      <g>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
          const x = 52 + i * 27.5;
          const isActive = i < 4; // first ~4 months "done"
          return (
            <g key={`month-${i}`}>
              {/* Tick mark */}
              <line
                x1={x}
                y1="232"
                x2={x}
                y2="238"
                stroke={isActive ? "#4a4b50" : "#222326"}
                strokeWidth="1"
                strokeLinecap="round"
              />
              {/* Month number */}
              <text
                x={x}
                y="246"
                textAnchor="middle"
                fill={isActive ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)"}
                fontSize="7"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {i + 1}
              </text>
            </g>
          );
        })}
        {/* Timeline base line */}
        <line x1="40" y1="234" x2="360" y2="234" stroke="#222326" strokeWidth="0.5" strokeLinecap="round" />
      </g>

      {/* ═══ Hourglass — single time symbol, clearly visible ═══ */}
      <g transform="translate(52, 36)" opacity="0.55">
        {/* Top bar */}
        <line x1="-8" y1="-14" x2="8" y2="-14" stroke="#885c38" strokeWidth="1.5" strokeLinecap="round" />
        {/* Bottom bar */}
        <line x1="-8" y1="14" x2="8" y2="14" stroke="#885c38" strokeWidth="1.5" strokeLinecap="round" />
        {/* Left glass outline */}
        <path d="M-7 -14 L-7 -6 C-7 -2 0 0 0 0 C0 0 -7 2 -7 6 L-7 14" stroke="#885c38" strokeWidth="1" fill="none" strokeLinecap="round" />
        {/* Right glass outline */}
        <path d="M7 -14 L7 -6 C7 -2 0 0 0 0 C0 0 7 2 7 6 L7 14" stroke="#885c38" strokeWidth="1" fill="none" strokeLinecap="round" />
        {/* Sand in bottom half */}
        <path d="M-4 6 C-4 3.5 0 1.5 0 1.5 C0 1.5 4 3.5 4 6 L4 13 L-4 13 Z" fill="rgba(136,92,56,0.25)" />
        {/* Falling sand grain */}
        <line x1="0" y1="0" x2="0" y2="3" stroke="rgba(136,92,56,0.35)" strokeWidth="0.8" strokeLinecap="round" />
      </g>

      {/* ═══ Progress Bar — at ~22%, showing "long way to go" ═══ */}
      <g transform="translate(280, 38)">
        {/* Track */}
        <rect x="0" y="0" width="88" height="8" rx="4" fill="#111214" stroke="#1c1d20" strokeWidth="0.5" />
        {/* Fill — orange accent, only ~22% */}
        <rect x="1" y="1" width="19" height="6" rx="3" fill="rgba(136,92,56,0.5)" />
        {/* Percentage text */}
        <text
          x="94"
          y="7"
          fill="rgba(136,92,56,0.5)"
          fontSize="8"
          fontWeight="600"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          22%
        </text>
        {/* Label above */}
        <text
          x="0"
          y="-4"
          fill="rgba(255,255,255,0.1)"
          fontSize="7"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          progress
        </text>
      </g>

      {/* ═══ Subtle calendar mini-panel (top-right, at depth) ═══ */}
      <g transform="translate(310, 62)" opacity="0.3">
        <rect x="0" y="0" width="56" height="44" rx="5" fill="#111214" stroke="#1c1d20" strokeWidth="0.5" />
        {/* Header */}
        <rect x="0" y="0" width="56" height="12" rx="5" fill="#131416" />
        <line x1="0" y1="12" x2="56" y2="12" stroke="#1c1d20" strokeWidth="0.5" />
        {/* Month text placeholder */}
        <rect x="6" y="3" width="24" height="5" rx="1" fill="#222326" />
        {/* Day grid — 3 rows x 7 cols */}
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3, 4, 5, 6].map((col) => (
            <rect
              key={`cal-${row}-${col}`}
              x={4 + col * 7}
              y={16 + row * 9}
              width="5"
              height="5"
              rx="1"
              fill={row === 0 && col < 3 ? "#222326" : "#191a1c"}
            />
          ))
        )}
      </g>

      {/* ═══ Subtle decorative: "effort" arrow (very faint) ═══ */}
      {/* A long horizontal arrow showing the journey ahead */}
      <g opacity="0.12">
        <line x1="80" y1="180" x2="320" y2="180" stroke="#2a2b2f" strokeWidth="0.8" strokeDasharray="4 6" strokeLinecap="round" />
        <path d="M316 177 L322 180 L316 183" stroke="#2a2b2f" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

    </svg>
  );
}

export default OrganicIllustration;
