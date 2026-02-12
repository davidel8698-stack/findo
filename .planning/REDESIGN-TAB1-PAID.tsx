/**
 * PaidAdIllustration — REDESIGNED: Simplified, high-contrast declining chart
 * Visual story: "Paid ads = renting traffic. Budget stops → everything crashes to zero."
 *
 * Changes from original:
 * - REDUCED from ~50+ elements to ~22 elements
 * - INCREASED contrast: key elements 2-3 stops brighter
 * - ONE dominant visual: thick declining curve from top-left to bottom-right
 * - Removed metric cards (too small to read at card size)
 * - Bigger budget "STOP" marker, bigger data points, bigger tooltip
 * - Stronger red accent (0.6 opacity vs 0.45)
 * - Brighter area fill (0.6 start opacity vs 0.5)
 * - Only 2 dollar coins, bigger and more visible
 */
function PaidAdIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">

      {/* ═══ Gradients ═══ */}
      <defs>
        <linearGradient id="paid-declineAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2b2f" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#1c1d20" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0e0f11" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="paid-redGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#883839" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#883839" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ═══ Dashboard Frame ═══ */}
      <rect x="24" y="10" width="352" height="240" rx="12" fill="#0e0f11" stroke="#2a2b2f" strokeWidth="1" />

      {/* ── Header Bar ── */}
      <rect x="24" y="10" width="352" height="36" rx="12" fill="#0c0d0f" />
      <line x1="24" y1="46" x2="376" y2="46" stroke="#1c1d20" strokeWidth="0.5" />
      <circle cx="44" cy="28" r="4" fill="#222326" />
      <circle cx="58" cy="28" r="4" fill="#222326" />
      <circle cx="72" cy="28" r="4" fill="#222326" />
      <rect x="92" y="22" width="72" height="7" rx="2" fill="#2a2b2f" />

      {/* ── "Paused" Status Pill — RED accent ── */}
      <rect x="280" y="17" width="86" height="24" rx="12" fill="#1c1d20" stroke="rgba(136,56,57,0.5)" strokeWidth="1" />
      <circle cx="298" cy="29" r="4.5" fill="#883839" opacity="0.8" />
      <circle cx="298" cy="29" r="7" stroke="#883839" strokeWidth="0.6" fill="none" opacity="0.4" />
      <rect x="310" y="25" width="46" height="6" rx="2" fill="#4a4b50" />

      {/* ═══ Chart Area ═══ */}
      <rect x="38" y="56" width="324" height="180" rx="8" fill="#0c0d0f" stroke="#1c1d20" strokeWidth="0.5" />

      {/* ── Grid Lines (4 horizontal only) ── */}
      <line x1="62" y1="86" x2="350" y2="86" stroke="#1c1d20" strokeWidth="0.5" strokeDasharray="3 5" />
      <line x1="62" y1="126" x2="350" y2="126" stroke="#1c1d20" strokeWidth="0.5" strokeDasharray="3 5" />
      <line x1="62" y1="166" x2="350" y2="166" stroke="#1c1d20" strokeWidth="0.5" strokeDasharray="3 5" />
      <line x1="62" y1="206" x2="350" y2="206" stroke="#1c1d20" strokeWidth="0.5" strokeDasharray="3 5" />

      {/* ── Declining Area Fill ── */}
      <path
        d="M68 78 L120 82 L170 90 L200 105 L230 135 L260 170 L300 205 L340 222 L350 226 L350 228 L68 228 Z"
        fill="url(#paid-declineAreaGrad)"
      />

      {/* ── Red danger zone fill (steep decline region) ── */}
      <path
        d="M200 105 L230 135 L260 170 L300 205 L300 228 L200 228 Z"
        fill="url(#paid-redGlow)"
      />

      {/* ═══ THE DECLINING LINE — HERO ELEMENT ═══ */}
      <path
        d="M68 78 C95 79 108 81 120 82 C145 85 158 88 170 90 C185 94 193 100 200 105 C213 116 222 128 230 135 C243 149 252 162 260 170 C275 185 288 198 300 205 C315 213 328 220 340 222"
        stroke="#5a5b60"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── Red accent overlay on steepest decline ── */}
      <path
        d="M200 105 C213 116 222 128 230 135 C243 149 252 162 260 170 C275 185 288 198 300 205"
        stroke="#883839"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />

      {/* ═══ Data Points (4 key points, bigger) ═══ */}
      <circle cx="68" cy="78" r="6" fill="#5a5b60" stroke="#0c0d0f" strokeWidth="2" />
      <circle cx="170" cy="90" r="5" fill="#4a4b50" stroke="#0c0d0f" strokeWidth="1.5" />
      <circle cx="260" cy="170" r="5.5" fill="#883839" stroke="#0c0d0f" strokeWidth="2" opacity="0.8" />
      <circle cx="340" cy="222" r="6" fill="#333538" stroke="#0c0d0f" strokeWidth="2" />

      {/* ═══ Crosshair + Tooltip on steepest decline ═══ */}
      <line x1="230" y1="60" x2="230" y2="228" stroke="#4a4b50" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      <line x1="62" y1="135" x2="350" y2="135" stroke="#4a4b50" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      <circle cx="230" cy="135" r="9" stroke="#883839" strokeWidth="1.5" fill="none" opacity="0.6" />
      <circle cx="230" cy="135" r="3.5" fill="#883839" opacity="0.5" />

      {/* ── Tooltip box ── */}
      <rect x="240" y="118" width="68" height="22" rx="5" fill="#1c1d20" stroke="#333538" strokeWidth="0.7" />
      <path d="M250 125 L254 133 L258 125" stroke="#883839" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" />
      <rect x="264" y="126" width="36" height="6" rx="1.5" fill="#4a4b50" />

      {/* ═══ Budget "STOP" Marker ═══ */}
      <line x1="200" y1="60" x2="200" y2="228" stroke="#885c38" strokeWidth="1.2" strokeDasharray="5 4" strokeLinecap="round" opacity="0.5" />
      <rect x="175" y="60" width="50" height="16" rx="5" fill="#1c1d20" stroke="#885c38" strokeWidth="0.8" opacity="0.7" />
      <rect x="181" y="65" width="38" height="6" rx="2" fill="#885c38" opacity="0.6" />

      {/* ═══ Dollar Coins (2 only, bigger, brighter) ═══ */}
      <g opacity="0.8">
        <circle cx="28" cy="180" r="18" stroke="#4a4b50" strokeWidth="1.4" fill="#111214" />
        <circle cx="28" cy="180" r="13" stroke="#333538" strokeWidth="0.6" fill="none" />
        <text x="20" y="187" fill="#5a5b60" fontSize="18" fontFamily="system-ui, -apple-system, monospace" fontWeight="700">$</text>
      </g>
      <g opacity="0.65">
        <circle cx="386" cy="56" r="14" stroke="#3a3b3f" strokeWidth="1.2" fill="#111214" />
        <circle cx="386" cy="56" r="10" stroke="#2a2b2f" strokeWidth="0.5" fill="none" />
        <text x="379" y="62" fill="#4a4b50" fontSize="14" fontFamily="system-ui, -apple-system, monospace" fontWeight="700">$</text>
      </g>

    </svg>
  );
}
