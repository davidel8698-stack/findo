/**
 * PaidAdIllustration — "Sponsored Marketing" card illustration
 *
 * Communicates at a glance: PAID ADS = MONEY DRAIN. Traffic declines when budget stops.
 *
 * Visual hierarchy:
 *   1. Declining chart line + area fill (THE story)
 *   2. "Paused" status indicator with red accent
 *   3. Dollar coins draining away
 *   4. Single clean dashboard frame for context
 *
 * Design: ONE clean dashboard panel with clear internal structure.
 * The declining line is the HERO element.
 */
function PaidAdIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">

      {/* ═══ Single Dashboard Panel ═══ */}
      <rect x="24" y="10" width="352" height="240" rx="12" fill="#0e0f11" stroke="#2a2b2f" strokeWidth="1" />
      {/* Top edge highlight */}
      <line x1="36" y1="10" x2="364" y2="10" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeLinecap="round" />

      {/* ── Dashboard Header Bar ── */}
      <rect x="24" y="10" width="352" height="36" rx="12" fill="#0c0d0f" />
      <line x1="24" y1="46" x2="376" y2="46" stroke="#1c1d20" strokeWidth="0.5" />

      {/* Traffic-light dots */}
      <circle cx="44" cy="28" r="4" fill="#1c1d20" />
      <circle cx="58" cy="28" r="4" fill="#1c1d20" />
      <circle cx="72" cy="28" r="4" fill="#1c1d20" />

      {/* Dashboard title */}
      <rect x="92" y="22" width="72" height="7" rx="2" fill="#222326" />
      <rect x="172" y="22" width="40" height="7" rx="2" fill="#1c1d20" />

      {/* ── "Paused" Status Pill — RED ACCENT, clearly an alert state ── */}
      <rect x="290" y="18" width="76" height="22" rx="11" fill="#1c1d20" stroke="rgba(136,56,57,0.4)" strokeWidth="1" />
      {/* Red dot indicator */}
      <circle cx="306" cy="29" r="4" fill="#883839" opacity="0.7" />
      {/* Subtle pulse ring around red dot */}
      <circle cx="306" cy="29" r="6.5" stroke="#883839" strokeWidth="0.5" fill="none" opacity="0.3" />
      {/* "Paused" text placeholder */}
      <rect x="316" y="25" width="42" height="6" rx="2" fill="#3a3b3f" />

      {/* ═══ 3 Metric Cards — clearly visible with DOWN arrows ═══ */}

      {/* Metric 1: Clicks — declining */}
      <rect x="38" y="56" width="102" height="50" rx="6" fill="#131416" stroke="#222326" strokeWidth="0.5" />
      <line x1="38" y1="56" x2="140" y2="56" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeLinecap="round" />
      {/* Label */}
      <rect x="48" y="63" width="36" height="5" rx="1" fill="#333538" />
      {/* Value */}
      <rect x="48" y="74" width="52" height="9" rx="2" fill="#3a3b3f" />
      {/* Down arrow — red tinted */}
      <path d="M114 65 L120 75 L126 65" stroke="#883839" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
      {/* Mini sparkline — declining */}
      <path d="M48 96 L58 94 L68 95 L78 97 L88 100 L98 100 L108 99 L118 97" stroke="#333538" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* Metric 2: Impressions — declining steeper */}
      <rect x="149" y="56" width="102" height="50" rx="6" fill="#131416" stroke="#222326" strokeWidth="0.5" />
      <line x1="149" y1="56" x2="251" y2="56" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeLinecap="round" />
      {/* Label */}
      <rect x="159" y="63" width="44" height="5" rx="1" fill="#333538" />
      {/* Value */}
      <rect x="159" y="74" width="44" height="9" rx="2" fill="#3a3b3f" />
      {/* Down arrow — red tinted */}
      <path d="M225 65 L231 75 L237 65" stroke="#883839" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
      {/* Mini sparkline — declining steeper */}
      <path d="M159 94 L169 95 L179 97 L189 100 L199 100 L209 98 L219 95 L229 91" stroke="#2a2b2f" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* Metric 3: Budget — draining, orange accent */}
      <rect x="260" y="56" width="102" height="50" rx="6" fill="#131416" stroke="#222326" strokeWidth="0.5" />
      <line x1="260" y1="56" x2="362" y2="56" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeLinecap="round" />
      {/* Label */}
      <rect x="270" y="63" width="30" height="5" rx="1" fill="#333538" />
      {/* Dollar sign in value — visible */}
      <text x="270" y="83" fill="#4a4b50" fontSize="11" fontFamily="system-ui, -apple-system, monospace" fontWeight="700">$0.00</text>
      {/* Warning icon — orange tinted */}
      <path d="M340 66 L345 75 L335 75 Z" stroke="#885c38" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
      {/* Mini bar chart — depleting */}
      <rect x="270" y="100" width="6" height="4" rx="1" fill="#333538" />
      <rect x="280" y="98" width="6" height="6" rx="1" fill="#2a2b2f" />
      <rect x="290" y="95" width="6" height="9" rx="1" fill="#222326" />
      <rect x="300" y="92" width="6" height="12" rx="1" fill="#1c1d20" />
      <rect x="310" y="96" width="6" height="8" rx="1" fill="#1c1d20" opacity="0.5" />
      <rect x="320" y="99" width="6" height="5" rx="1" fill="#161719" opacity="0.4" />

      {/* ═══ Main Chart Area — THE HERO ═══ */}
      <rect x="38" y="116" width="324" height="124" rx="6" fill="#0c0d0f" stroke="#1c1d20" strokeWidth="0.5" />

      {/* Y-axis labels */}
      <rect x="42" y="124" width="14" height="4" rx="1" fill="#222326" />
      <rect x="42" y="144" width="12" height="4" rx="1" fill="#1c1d20" />
      <rect x="42" y="164" width="14" height="4" rx="1" fill="#1c1d20" />
      <rect x="42" y="184" width="12" height="4" rx="1" fill="#1c1d20" />
      <rect x="42" y="204" width="14" height="4" rx="1" fill="#1c1d20" />
      <rect x="42" y="224" width="10" height="4" rx="1" fill="#1c1d20" />

      {/* X-axis labels */}
      <rect x="80" y="232" width="18" height="4" rx="1" fill="#1c1d20" />
      <rect x="130" y="232" width="18" height="4" rx="1" fill="#1c1d20" />
      <rect x="180" y="232" width="18" height="4" rx="1" fill="#1c1d20" />
      <rect x="230" y="232" width="18" height="4" rx="1" fill="#1c1d20" />
      <rect x="280" y="232" width="18" height="4" rx="1" fill="#1c1d20" />
      <rect x="330" y="232" width="18" height="4" rx="1" fill="#1c1d20" />

      {/* Horizontal grid lines — dashed */}
      <line x1="62" y1="126" x2="354" y2="126" stroke="#161719" strokeWidth="0.4" strokeDasharray="3 4" strokeLinecap="round" />
      <line x1="62" y1="146" x2="354" y2="146" stroke="#161719" strokeWidth="0.4" strokeDasharray="3 4" strokeLinecap="round" />
      <line x1="62" y1="166" x2="354" y2="166" stroke="#161719" strokeWidth="0.4" strokeDasharray="3 4" strokeLinecap="round" />
      <line x1="62" y1="186" x2="354" y2="186" stroke="#161719" strokeWidth="0.4" strokeDasharray="3 4" strokeLinecap="round" />
      <line x1="62" y1="206" x2="354" y2="206" stroke="#161719" strokeWidth="0.4" strokeDasharray="3 4" strokeLinecap="round" />

      {/* Vertical grid lines — dashed */}
      <line x1="90" y1="120" x2="90" y2="228" stroke="#161719" strokeWidth="0.3" strokeDasharray="2 5" strokeLinecap="round" />
      <line x1="140" y1="120" x2="140" y2="228" stroke="#161719" strokeWidth="0.3" strokeDasharray="2 5" strokeLinecap="round" />
      <line x1="190" y1="120" x2="190" y2="228" stroke="#161719" strokeWidth="0.3" strokeDasharray="2 5" strokeLinecap="round" />
      <line x1="240" y1="120" x2="240" y2="228" stroke="#161719" strokeWidth="0.3" strokeDasharray="2 5" strokeLinecap="round" />
      <line x1="290" y1="120" x2="290" y2="228" stroke="#161719" strokeWidth="0.3" strokeDasharray="2 5" strokeLinecap="round" />
      <line x1="340" y1="120" x2="340" y2="228" stroke="#161719" strokeWidth="0.3" strokeDasharray="2 5" strokeLinecap="round" />

      {/* ── Area Fill Under Declining Line — visible gradient showing loss ── */}
      <defs>
        <linearGradient id="declineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1d20" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#161719" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0c0d0f" stopOpacity="0.05" />
        </linearGradient>
        {/* Red glow gradient for the steep decline area */}
        <linearGradient id="redDeclineGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#883839" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#883839" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Main area fill */}
      <path
        d="M68 130 L90 131 L115 133 L140 136 L165 140 L190 148 L215 160 L240 176 L265 194 L290 208 L315 218 L340 224 L354 226 L354 228 L68 228 Z"
        fill="url(#declineGrad)"
      />

      {/* Red-tinted area at the steep decline portion (around x=190 to x=290) */}
      <path
        d="M190 148 L215 160 L240 176 L265 194 L290 208 L290 228 L190 228 Z"
        fill="url(#redDeclineGlow)"
      />

      {/* ── Declining Line — THE MAIN VISUAL STORY ── */}
      <path
        d="M68 130 C79 130.5 84 131 90 131 C103 132 110 133 115 133 C128 134 134 135.5 140 136 C153 137.5 159 139 165 140 C178 143 184 146 190 148 C203 153 209 158 215 160 C228 167 234 174 240 176 C253 183 259 191 265 194 C278 200 284 206 290 208 C303 213 309 217 315 218 C328 221 334 223 340 224"
        stroke="#4a4b50"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Red accent on the steepest part of the decline (190-290) */}
      <path
        d="M190 148 C203 153 209 158 215 160 C228 167 234 174 240 176 C253 183 259 191 265 194 C278 200 284 206 290 208"
        stroke="#883839"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.45"
      />

      {/* ── Data Points Along the Line ── */}
      {/* Starting high point */}
      <circle cx="68" cy="130" r="4" fill="#4a4b50" stroke="#0c0d0f" strokeWidth="1.5" />
      {/* Mid points */}
      <circle cx="115" cy="133" r="3" fill="#3a3b3f" stroke="#0c0d0f" strokeWidth="1" />
      <circle cx="165" cy="140" r="3" fill="#3a3b3f" stroke="#0c0d0f" strokeWidth="1" />
      {/* Steep decline points — red tinted */}
      <circle cx="215" cy="160" r="3.5" fill="#883839" stroke="#0c0d0f" strokeWidth="1.5" opacity="0.6" />
      <circle cx="265" cy="194" r="3.5" fill="#883839" stroke="#0c0d0f" strokeWidth="1.5" opacity="0.5" />
      {/* End points — bottoming out */}
      <circle cx="315" cy="218" r="3" fill="#333538" stroke="#0c0d0f" strokeWidth="1" />
      <circle cx="340" cy="224" r="4" fill="#3a3b3f" stroke="#0c0d0f" strokeWidth="1.5" />

      {/* ── Crosshair on the steepest drop point ── */}
      <line x1="240" y1="120" x2="240" y2="228" stroke="#333538" strokeWidth="0.6" strokeDasharray="2 3" strokeLinecap="round" opacity="0.5" />
      <line x1="62" y1="176" x2="354" y2="176" stroke="#333538" strokeWidth="0.6" strokeDasharray="2 3" strokeLinecap="round" opacity="0.5" />
      <circle cx="240" cy="176" r="7" stroke="#883839" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="240" cy="176" r="3" fill="#883839" opacity="0.35" />

      {/* ── Tooltip near the highlighted drop point ── */}
      <rect x="248" y="162" width="56" height="18" rx="4" fill="#1c1d20" stroke="#333538" strokeWidth="0.5" />
      {/* Down arrow icon in tooltip */}
      <path d="M256 168 L259 174 L262 168" stroke="#883839" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
      {/* Value text placeholder */}
      <rect x="266" y="168" width="30" height="5" rx="1" fill="#3a3b3f" />

      {/* ── Dashed "budget stopped" vertical line — marks when money ran out ── */}
      <line x1="190" y1="120" x2="190" y2="228" stroke="#885c38" strokeWidth="1" strokeDasharray="4 3" strokeLinecap="round" opacity="0.35" />
      {/* Small label above the line */}
      <rect x="172" y="120" width="36" height="10" rx="3" fill="#1c1d20" stroke="#885c38" strokeWidth="0.5" opacity="0.5" />
      <rect x="177" y="123" width="26" height="4" rx="1" fill="#885c38" opacity="0.4" />

      {/* ═══ Floating Dollar Coins — clearly visible, draining away ═══ */}

      {/* Large coin (bottom-left, most visible) */}
      <g opacity="0.75">
        <circle cx="30" cy="200" r="16" stroke="#3a3b3f" strokeWidth="1.2" fill="#111214" />
        <circle cx="30" cy="200" r="12" stroke="#2a2b2f" strokeWidth="0.5" fill="none" />
        <text x="23" y="206" fill="#4a4b50" fontSize="16" fontFamily="system-ui, -apple-system, monospace" fontWeight="700">$</text>
      </g>

      {/* Medium coin (top-right) */}
      <g opacity="0.6">
        <circle cx="384" cy="48" r="13" stroke="#333538" strokeWidth="1" fill="#111214" />
        <circle cx="384" cy="48" r="9" stroke="#222326" strokeWidth="0.5" fill="none" />
        <text x="378" y="53" fill="#3a3b3f" fontSize="13" fontFamily="system-ui, -apple-system, monospace" fontWeight="700">$</text>
      </g>

      {/* Small coin (bottom-right, fading) */}
      <g opacity="0.45">
        <circle cx="388" cy="218" r="9" stroke="#2a2b2f" strokeWidth="0.8" fill="#0e0f11" />
        <circle cx="388" cy="218" r="6" stroke="#1c1d20" strokeWidth="0.5" fill="none" />
        <text x="383" y="222" fill="#333538" fontSize="10" fontFamily="system-ui, -apple-system, monospace" fontWeight="600">$</text>
      </g>

      {/* Tiny coin (mid-left, nearly gone) */}
      <g opacity="0.35">
        <circle cx="14" cy="120" r="7" stroke="#222326" strokeWidth="0.6" fill="#0e0f11" />
        <text x="10" y="124" fill="#2a2b2f" fontSize="8" fontFamily="system-ui, -apple-system, monospace" fontWeight="600">$</text>
      </g>

      {/* ═══ Chart Legend (bottom of chart) ═══ */}
      <circle cx="72" cy="228" r="2.5" fill="#4a4b50" />
      <rect x="80" y="226" width="28" height="4" rx="1" fill="#222326" />
      <circle cx="120" cy="228" r="2.5" fill="#883839" opacity="0.5" />
      <rect x="128" y="226" width="32" height="4" rx="1" fill="#222326" />

    </svg>
  );
}

export default PaidAdIllustration;
