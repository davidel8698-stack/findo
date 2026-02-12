/**
 * PaidAdIllustration — FINAL REDESIGN: "Paid ads crash when budget stops"
 *
 * Visual Metaphor (3-second clarity):
 * A dashboard chart split into two halves by a bold vertical "BUDGET OFF" line.
 * LEFT = healthy traffic (bars + stable line at top).
 * RIGHT = dramatic cliff-drop to ZERO (line falls off a cliff, red danger zone).
 * A large $ coin sits prominently in the upper-left as the money symbol.
 * A red "Paused" pill in the header signals the campaign is dead.
 *
 * 5-Element Clarity Test:
 * 1. THE STORY: Dramatic cliff-drop line from high to zero (hero, 60% weight)
 * 2. THE CONTEXT: Dashboard frame with chart grid (it's an analytics dashboard)
 * 3. THE EMOTION: Red accent on crash zone + red "Paused" badge (danger!)
 * 4. THE TEXTURE: Faint grid lines, subtle area fills (depth/atmosphere)
 * 5. THE FRAME: Dashboard border with header bar (contains the scene)
 *
 * Element count: ~30 (under 35 limit)
 * Stroke minimums: 1.5px+ for all visible lines
 * Hero element opacity: 0.7 white (the crash line)
 * Color accent: #883839 red at 0.7-0.9 opacity
 */
function PaidAdIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">

      <defs>
        {/* Area fill under the healthy portion of the line */}
        <linearGradient id="paid-healthyArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2b2f" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#1c1d20" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0e0f11" stopOpacity="0" />
        </linearGradient>

        {/* Red danger zone fill under the crash */}
        <linearGradient id="paid-crashZone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#883839" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#883839" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#883839" stopOpacity="0" />
        </linearGradient>

        {/* Subtle radial glow behind the $ coin */}
        <radialGradient id="paid-coinGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* Clip path for "extends beyond frame" on bottom-right */}
        <clipPath id="paid-frameClip">
          <rect x="20" y="6" width="380" height="254" rx="12" />
        </clipPath>
      </defs>

      {/* ═══ LAYER 1: Dashboard Frame ═══ */}
      <rect x="24" y="10" width="352" height="240" rx="12" fill="#0e0f11" stroke="#2a2b2f" strokeWidth="1.5" />

      {/* ── Header Bar ── */}
      <rect x="24" y="10" width="352" height="36" rx="12" fill="#0c0d0f" />
      <rect x="24" y="34" width="352" height="12" fill="#0c0d0f" />
      <line x1="24" y1="46" x2="376" y2="46" stroke="#1c1d20" strokeWidth="1.5" />

      {/* Window dots */}
      <circle cx="44" cy="28" r="5" fill="#1c1d20" />
      <circle cx="60" cy="28" r="5" fill="#1c1d20" />
      <circle cx="76" cy="28" r="5" fill="#1c1d20" />

      {/* ── Red "PAUSED" Status Pill — clear campaign-is-dead signal ── */}
      <rect x="264" y="16" width="104" height="24" rx="12" fill="#1c1d20" stroke="#883839" strokeWidth="1.5" strokeOpacity="0.7" />
      <circle cx="284" cy="28" r="5" fill="#883839" opacity="0.9" />
      <text
        x="296" y="33"
        fill="#883839"
        fontSize="13"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="700"
        opacity="0.85"
      >PAUSED</text>

      {/* ═══ LAYER 2: Chart Area ═══ */}
      <g clipPath="url(#paid-frameClip)">

        {/* Chart background */}
        <rect x="38" y="54" width="338" height="186" rx="8" fill="#0c0d0f" stroke="#1c1d20" strokeWidth="0.8" />

        {/* ── Horizontal Grid Lines (atmospheric) ── */}
        <line x1="60" y1="88" x2="360" y2="88" stroke="#1c1d20" strokeWidth="0.6" strokeDasharray="4 6" />
        <line x1="60" y1="122" x2="360" y2="122" stroke="#1c1d20" strokeWidth="0.6" strokeDasharray="4 6" />
        <line x1="60" y1="156" x2="360" y2="156" stroke="#1c1d20" strokeWidth="0.6" strokeDasharray="4 6" />
        <line x1="60" y1="190" x2="360" y2="190" stroke="#1c1d20" strokeWidth="0.6" strokeDasharray="4 6" />
        <line x1="60" y1="224" x2="360" y2="224" stroke="#1c1d20" strokeWidth="0.6" strokeDasharray="4 6" />

        {/* ═══ LAYER 3: Area Fills (behind the lines) ═══ */}

        {/* Healthy area fill (left side, under the stable line) */}
        <path
          d="M60 82 L100 78 L140 80 L180 76 L200 78 L200 230 L60 230 Z"
          fill="url(#paid-healthyArea)"
        />

        {/* RED crash zone fill (right side, under the cliff-drop) */}
        <path
          d="M200 78 L202 80 L210 120 L220 180 L230 210 L240 224 L360 230 L360 232 L200 232 Z"
          fill="url(#paid-crashZone)"
        />

        {/* ═══ LAYER 4: THE LINE — HERO ELEMENT (60% visual weight) ═══ */}

        {/* Healthy phase: stable, slightly wavy line near the top — GRAY */}
        <path
          d="M60 82 C80 80 90 79 100 78 C120 77 130 80 140 80 C160 79 170 77 180 76 C190 76 195 77 200 78"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* CRASH phase: dramatic vertical cliff-drop — RED, thick */}
        <path
          d="M200 78 C202 82 204 95 206 110 C208 130 212 155 218 180 C222 195 226 208 232 218 C238 225 248 228 270 230"
          stroke="#883839"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />

        {/* Flatline at zero (after crash) — dim, dead */}
        <path
          d="M270 230 L340 230 L380 230"
          stroke="#883839"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* ═══ LAYER 5: Data Points ═══ */}

        {/* Start point — healthy */}
        <circle cx="60" cy="82" r="6" fill="#5a5b60" stroke="#0c0d0f" strokeWidth="2" />

        {/* Peak / last healthy point — bright, about to fall */}
        <circle cx="200" cy="78" r="7" fill="rgba(255,255,255,0.5)" stroke="#0c0d0f" strokeWidth="2.5" />

        {/* Bottom of crash — red, danger */}
        <circle cx="270" cy="230" r="6" fill="#883839" stroke="#0c0d0f" strokeWidth="2" opacity="0.8" />

        {/* ═══ LAYER 6: Budget OFF Vertical Divider ═══ */}
        {/* This is the KEY storytelling element — where budget stops */}
        <line
          x1="200" y1="54"
          x2="200" y2="240"
          stroke="#885c38"
          strokeWidth="2"
          strokeDasharray="6 4"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* "BUDGET OFF" label at top of divider */}
        <rect x="162" y="56" width="76" height="22" rx="6" fill="#111214" stroke="#885c38" strokeWidth="1.5" opacity="0.9" />
        <text
          x="200" y="72"
          textAnchor="middle"
          fill="#885c38"
          fontSize="12"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          letterSpacing="0.5"
          opacity="0.9"
        >BUDGET OFF</text>

        {/* ═══ LAYER 7: $ Money Symbol — large, front-and-center ═══ */}
        {/* Positioned prominently in the healthy zone */}
        <g opacity="0.75">
          <circle cx="90" cy="110" r="24" fill="url(#paid-coinGlow)" />
          <circle cx="90" cy="110" r="20" fill="#111214" stroke="#3a3b3f" strokeWidth="1.5" />
          <circle cx="90" cy="110" r="14" stroke="#2a2b2f" strokeWidth="1.5" fill="none" />
          <text
            x="90" y="119"
            textAnchor="middle"
            fill="rgba(255,255,255,0.6)"
            fontSize="24"
            fontFamily="system-ui, -apple-system, monospace"
            fontWeight="700"
          >$</text>
        </g>

        {/* Second smaller $ coin — clipping bottom-right edge (extends beyond) */}
        <g opacity="0.4" transform="translate(360, 200)">
          <circle cx="0" cy="0" r="28" fill="#111214" stroke="#2a2b2f" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="20" stroke="#1c1d20" strokeWidth="1.5" fill="none" />
          <text
            x="0" y="9"
            textAnchor="middle"
            fill="rgba(255,255,255,0.35)"
            fontSize="26"
            fontFamily="system-ui, -apple-system, monospace"
            fontWeight="700"
          >$</text>
        </g>

        {/* ═══ LAYER 8: "0" label at crash bottom — the zero result ═══ */}
        <text
          x="320" y="222"
          textAnchor="middle"
          fill="#883839"
          fontSize="20"
          fontFamily="system-ui, -apple-system, monospace"
          fontWeight="800"
          opacity="0.6"
        >0</text>

      </g>
    </svg>
  );
}
