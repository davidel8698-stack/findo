/**
 * OrganicIllustration — "6-12 MONTHS" hero text with flat growth curve
 * Shows the marathon nature of organic SEO — long, slow, relentless
 * REDESIGNED: 5 clear elements, all highly visible
 * Elements: Hero text, Growth curve, Hourglass, Progress bar, Timeline
 */
function OrganicIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">

      {/* ═══ Defs — unique gradient IDs ═══ */}
      <defs>
        <linearGradient id="organic-curve-fill" x1="0" y1="185" x2="0" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1c1d20" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0c0d0f" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="organic-progress-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#885c38" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#885c38" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="organic-sand-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(136,92,56,0.1)" />
          <stop offset="100%" stopColor="rgba(136,92,56,0.4)" />
        </linearGradient>
      </defs>

      {/* ═══ Background ═══ */}
      <rect x="0" y="0" width="400" height="260" rx="0" fill="#08090a" />
      <rect x="16" y="12" width="368" height="236" rx="10" fill="#0c0d0f" stroke="#161719" strokeWidth="0.5" />

      {/* ═══ Faint horizontal grid lines ═══ */}
      <g opacity="0.3">
        <line x1="28" y1="60" x2="372" y2="60" stroke="#131416" strokeWidth="0.4" />
        <line x1="28" y1="100" x2="372" y2="100" stroke="#131416" strokeWidth="0.4" />
        <line x1="28" y1="140" x2="372" y2="140" stroke="#131416" strokeWidth="0.4" />
        <line x1="28" y1="180" x2="372" y2="180" stroke="#131416" strokeWidth="0.4" />
      </g>

      {/* ═══ ELEMENT 1: Hourglass — prominent time symbol, top-left ═══ */}
      <g transform="translate(58, 42) scale(1.5)" opacity="0.8">
        {/* Top cap */}
        <line x1="-8" y1="-14" x2="8" y2="-14" stroke="#885c38" strokeWidth="2.5" strokeLinecap="round" />
        {/* Bottom cap */}
        <line x1="-8" y1="14" x2="8" y2="14" stroke="#885c38" strokeWidth="2.5" strokeLinecap="round" />
        {/* Left glass body */}
        <path
          d="M-7 -14 L-7 -6 C-7 -2 0 0 0 0 C0 0 -7 2 -7 6 L-7 14"
          stroke="#885c38"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Right glass body */}
        <path
          d="M7 -14 L7 -6 C7 -2 0 0 0 0 C0 0 7 2 7 6 L7 14"
          stroke="#885c38"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Sand accumulated in bottom half */}
        <path
          d="M-4 6 C-4 3.5 0 1.5 0 1.5 C0 1.5 4 3.5 4 6 L4 13 L-4 13 Z"
          fill="url(#organic-sand-fill)"
        />
        {/* Sand stream falling */}
        <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(136,92,56,0.5)" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* ═══ ELEMENT 2: Progress Bar — 22%, clearly readable ═══ */}
      <g transform="translate(260, 32)">
        {/* "progress" label */}
        <text
          x="0"
          y="-6"
          fill="rgba(255,255,255,0.2)"
          fontSize="9"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="1"
        >
          progress
        </text>
        {/* Track */}
        <rect x="0" y="0" width="120" height="12" rx="6" fill="#111214" stroke="#1c1d20" strokeWidth="0.8" />
        {/* Fill — 22% of 120 = ~26px */}
        <rect x="1.5" y="1.5" width="25" height="9" rx="4.5" fill="url(#organic-progress-fill)" />
        {/* Percentage */}
        <text
          x="128"
          y="10"
          fill="rgba(136,92,56,0.7)"
          fontSize="11"
          fontWeight="600"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          22%
        </text>
      </g>

      {/* ═══ ELEMENT 3: HERO — "6-12 MONTHS" dominant focal point ═══ */}
      <text
        x="200"
        y="132"
        textAnchor="middle"
        fill="rgba(255,255,255,0.55)"
        fontSize="82"
        fontWeight="800"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-4"
      >
        6-12
      </text>
      <text
        x="200"
        y="158"
        textAnchor="middle"
        fill="rgba(255,255,255,0.25)"
        fontSize="20"
        fontWeight="500"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="4"
      >
        MONTHS
      </text>

      {/* ═══ ELEMENT 4: Growth Curve — frustratingly flat, mid-lower ═══ */}
      {/* The curve: nearly flat, tiny upward bend at end */}
      <path
        d="M40 200 C80 199.5 140 198.5 200 197 C260 195 310 192 355 186"
        stroke="#4a4b50"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Area fill beneath the curve */}
      <path
        d="M40 200 C80 199.5 140 198.5 200 197 C260 195 310 192 355 186 L355 220 L40 220 Z"
        fill="url(#organic-curve-fill)"
      />
      {/* Data points — 3 visible dots */}
      <circle cx="110" cy="199" r="4" fill="#3a3b3f" stroke="#0c0d0f" strokeWidth="1.5" />
      <circle cx="200" cy="197" r="4" fill="#4a4b50" stroke="#0c0d0f" strokeWidth="1.5" />
      <circle cx="300" cy="190" r="4" fill="#3a3b3f" stroke="#0c0d0f" strokeWidth="1.5" />
      {/* Dashed continuation — "maybe someday..." */}
      <path
        d="M355 186 C365 183.5 375 181 388 177"
        stroke="#3a3b3f"
        strokeWidth="2"
        strokeDasharray="4 5"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* ═══ ELEMENT 5: Timeline Month Markers ═══ */}
      <g>
        {/* Baseline */}
        <line x1="40" y1="228" x2="360" y2="228" stroke="#222326" strokeWidth="0.8" strokeLinecap="round" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
          const x = 52 + i * 27.5;
          const isActive = i < 4;
          return (
            <g key={`month-${i}`}>
              <line
                x1={x}
                y1="224"
                x2={x}
                y2="232"
                stroke={isActive ? "#5a5b60" : "#2a2b2f"}
                strokeWidth={isActive ? 1.5 : 1}
                strokeLinecap="round"
              />
              <text
                x={x}
                y="242"
                textAnchor="middle"
                fill={isActive ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}
                fontSize="9"
                fontWeight={isActive ? "500" : "400"}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {i + 1}
              </text>
            </g>
          );
        })}
      </g>

    </svg>
  );
}
