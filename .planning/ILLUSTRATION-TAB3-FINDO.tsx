function DecisionIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">

      {/* ═══ Layer 0 — Background Map Grid (subtle atmosphere) ═══ */}
      <g opacity="0.08">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <line key={`vg-${i}`} x1={40 + i * 40} y1="0" x2={40 + i * 40} y2="260" stroke="#2a2b2f" strokeWidth="0.4" />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={`hg-${i}`} x1="0" y1={20 + i * 40} x2="400" y2={20 + i * 40} stroke="#2a2b2f" strokeWidth="0.4" />
        ))}
      </g>
      {/* Subtle diagonal road accents */}
      <g opacity="0.04">
        <line x1="0" y1="200" x2="180" y2="60" stroke="#2a2b2f" strokeWidth="0.8" />
        <line x1="220" y1="260" x2="400" y2="120" stroke="#2a2b2f" strokeWidth="0.8" />
      </g>

      {/* ═══ Layer 1 — Search Bar (top, context: this is a Google search) ═══ */}
      <g transform="translate(52, 10)">
        {/* Search bar body */}
        <rect x="0" y="0" width="296" height="40" rx="20" fill="#111214" stroke="#2a2b2f" strokeWidth="1" />
        {/* Top edge highlight */}
        <path d="M20 1 Q148 -1 276 1" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" fill="none" strokeLinecap="round" />

        {/* Magnifying glass icon — brighter for visibility */}
        <circle cx="28" cy="20" r="7" stroke="#3a3b3f" strokeWidth="1.5" fill="none" />
        <line x1="33" y1="25" x2="38" y2="30" stroke="#3a3b3f" strokeWidth="1.5" strokeLinecap="round" />

        {/* Search query text placeholder — visible */}
        <rect x="48" y="13" width="120" height="6" rx="2" fill="#2a2b2f" />
        <rect x="48" y="23" width="70" height="4" rx="1.5" fill="#222326" />

        {/* Right action buttons */}
        <rect x="234" y="10" width="20" height="20" rx="10" fill="#161719" stroke="#222326" strokeWidth="0.5" />
        <line x1="241" y1="20" x2="247" y2="20" stroke="#333538" strokeWidth="1" strokeLinecap="round" />
        <rect x="260" y="10" width="20" height="20" rx="10" fill="#161719" stroke="#222326" strokeWidth="0.5" />
        <circle cx="270" cy="20" r="3" stroke="#333538" strokeWidth="0.8" fill="none" />
        <circle cx="270" cy="20" r="1" fill="#333538" />
      </g>

      {/* ═══ Layer 1b — Connection dots (search to card) ═══ */}
      <g opacity="0.1">
        <circle cx="150" cy="56" r="1.2" fill="#388839" />
        <circle cx="200" cy="58" r="1" fill="#333538" />
        <circle cx="250" cy="56" r="1.2" fill="#388839" />
      </g>

      {/* ═══ Layer 2 — Main Business Profile Card (THE hero centerpiece) ═══ */}
      <g transform="translate(45, 64)">
        {/* Card outer glow — subtle green ambient */}
        <rect x="-2" y="-2" width="314" height="179" rx="12" fill="none" stroke="rgba(56,136,57,0.06)" strokeWidth="2" />

        {/* Card background */}
        <rect x="0" y="0" width="310" height="175" rx="10" fill="#131416" stroke="#2a2b2f" strokeWidth="1" />
        {/* Top edge highlight — slightly green tinted */}
        <path d="M10 0 L300 0" stroke="rgba(56,136,57,0.08)" strokeWidth="1" strokeLinecap="round" />
        {/* Left edge subtle highlight */}
        <path d="M0 10 L0 165" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" strokeLinecap="round" />

        {/* ── Business Photo Area ── */}
        <rect x="14" y="14" width="90" height="64" rx="8" fill="#0e0f11" stroke="#222326" strokeWidth="0.7" />
        {/* Landscape scene: storefront silhouette — more visible */}
        {/* Sky gradient hint */}
        <rect x="14" y="14" width="90" height="30" rx="8" fill="#161719" opacity="0.5" />
        {/* Building shapes — clearly visible storefront */}
        <rect x="24" y="38" width="22" height="28" fill="#222326" />
        <rect x="24" y="34" width="22" height="6" fill="#2a2b2f" opacity="0.7" />
        {/* Door */}
        <rect x="31" y="50" width="8" height="16" rx="1" fill="#1c1d20" />
        {/* Window */}
        <rect x="26" y="40" width="7" height="6" rx="1" fill="#2a2b2f" opacity="0.5" />
        <rect x="35" y="40" width="7" height="6" rx="1" fill="#2a2b2f" opacity="0.5" />
        {/* Second building */}
        <rect x="50" y="42" width="18" height="24" fill="#1c1d20" />
        <rect x="52" y="44" width="5" height="4" rx="0.5" fill="#222326" opacity="0.6" />
        <rect x="60" y="44" width="5" height="4" rx="0.5" fill="#222326" opacity="0.6" />
        <rect x="52" y="52" width="5" height="4" rx="0.5" fill="#222326" opacity="0.6" />
        <rect x="60" y="52" width="5" height="4" rx="0.5" fill="#222326" opacity="0.6" />
        {/* Tree */}
        <rect x="74" y="52" width="3" height="14" fill="#222326" opacity="0.4" />
        <circle cx="76" cy="48" r="8" fill="#1c1d20" opacity="0.6" />
        {/* Ground line */}
        <line x1="18" y1="66" x2="100" y2="66" stroke="#222326" strokeWidth="0.5" />
        {/* Quality badge overlay — small green circle in corner */}
        <circle cx="94" cy="24" r="7" fill="#131416" stroke="#222326" strokeWidth="0.5" />
        <circle cx="94" cy="24" r="5" fill="rgba(56,136,57,0.15)" />
        {/* Check mark inside quality badge */}
        <path d="M91.5 24 L93 25.5 L96.5 22" stroke="#388839" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />

        {/* ── Business Name (clearly a title — brighter) ── */}
        <rect x="118" y="16" width="134" height="11" rx="3" fill="#3a3b3f" />
        {/* Verified badge — GREEN checkmark, clearly visible */}
        <circle cx="260" cy="22" r="7" fill="rgba(56,136,57,0.15)" stroke="rgba(56,136,57,0.3)" strokeWidth="0.7" />
        <path d="M256.5 22 L258.5 24 L263.5 19" stroke="#388839" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* ── Business Category ── */}
        <rect x="118" y="33" width="90" height="6" rx="2" fill="#222326" />
        <circle cx="214" cy="36" r="1.5" fill="#2a2b2f" />
        <rect x="220" y="33" width="50" height="6" rx="2" fill="#1c1d20" />

        {/* ── Star Ratings Row — warm amber/gold, GLOWING against monochrome ── */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`star-${i}`} transform={`translate(${118 + i * 18}, 47)`}>
            {/* Star glow backdrop */}
            <circle cx="6" cy="5.5" r="7" fill="rgba(122,107,63,0.06)" />
            {/* Star shape — warm amber fill */}
            <path
              d="M6 0 L7.4 4.1 L11.8 4.1 L8.2 6.6 L9.6 10.8 L6 8.3 L2.4 10.8 L3.8 6.6 L0.2 4.1 L4.6 4.1 Z"
              fill="#7a6b3f"
              opacity="0.7"
            />
          </g>
        ))}
        {/* Rating count text */}
        <rect x="210" y="50" width="36" height="8" rx="4" fill="#1c1d20" stroke="#222326" strokeWidth="0.5" />
        <rect x="216" y="52.5" width="24" height="3" rx="1" fill="#2a2b2f" />

        {/* ── Divider ── */}
        <line x1="14" y1="90" x2="296" y2="90" stroke="#222326" strokeWidth="0.5" strokeLinecap="round" />

        {/* ── Contact: Phone ── */}
        <g transform="translate(14, 98)">
          <rect x="0" y="0" width="32" height="32" rx="8" fill="#161719" stroke="#222326" strokeWidth="0.5" />
          {/* Phone icon — brighter */}
          <path
            d="M10 11 C10 11 11 10 12 12 L13.5 14.5 C14 15.5 13 16.5 12.5 17 C12.5 17 14 19 16 21 C18 23 19.5 24.5 19.5 24.5 C20 24 21 23 22 24 L24 26 C25 27 24 27.5 24 27.5"
            stroke="#4a4b50"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
        <rect x="54" y="102" width="72" height="7" rx="2" fill="#2a2b2f" />
        <rect x="54" y="114" width="50" height="5" rx="1.5" fill="#222326" />

        {/* ── Contact: Directions / Map ── */}
        <g transform="translate(148, 98)">
          <rect x="0" y="0" width="32" height="32" rx="8" fill="#161719" stroke="#222326" strokeWidth="0.5" />
          {/* Map pin icon — brighter */}
          <path
            d="M16 9 C13 9 10.5 11.5 10.5 14 C10.5 18 16 25 16 25 C16 25 21.5 18 21.5 14 C21.5 11.5 19 9 16 9 Z"
            stroke="#4a4b50"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="16" cy="14" r="2.5" fill="#4a4b50" />
        </g>
        <rect x="188" y="102" width="80" height="7" rx="2" fill="#2a2b2f" />
        <rect x="188" y="114" width="58" height="5" rx="1.5" fill="#222326" />

        {/* ── "Open Now" Badge — THE most colorful element, GREEN pulse ── */}
        <g transform="translate(14, 140)">
          <rect x="0" y="0" width="72" height="22" rx="11" fill="#161719" stroke="rgba(56,136,57,0.2)" strokeWidth="0.7" />
          {/* Outer pulse ring 2 */}
          <circle cx="15" cy="11" r="9" stroke="#388839" strokeWidth="0.3" fill="none" opacity="0.1" />
          {/* Outer pulse ring 1 */}
          <circle cx="15" cy="11" r="6.5" stroke="#388839" strokeWidth="0.4" fill="none" opacity="0.2" />
          {/* Green dot — full opacity, alive */}
          <circle cx="15" cy="11" r="3.5" fill="#388839" opacity="0.9" />
          {/* Inner bright core */}
          <circle cx="15" cy="11" r="1.8" fill="#4caf50" opacity="0.5" />
          {/* "Open Now" text placeholder — brighter */}
          <rect x="24" y="7" width="40" height="6" rx="2" fill="#3a3b3f" />
        </g>

        {/* ── Website Button ── */}
        <g transform="translate(96, 140)">
          <rect x="0" y="0" width="60" height="22" rx="11" fill="#161719" stroke="#222326" strokeWidth="0.5" />
          {/* Globe icon */}
          <circle cx="16" cy="11" r="5" stroke="#3a3b3f" strokeWidth="0.8" fill="none" />
          <path d="M11 11 L21 11 M16 6 L16 16" stroke="#3a3b3f" strokeWidth="0.4" strokeLinecap="round" />
          <ellipse cx="16" cy="11" rx="3" ry="5" stroke="#3a3b3f" strokeWidth="0.4" fill="none" />
          {/* Text */}
          <rect x="26" y="7.5" width="26" height="5" rx="1.5" fill="#222326" />
        </g>

        {/* ── Call Button — subtle green tint, action CTA ── */}
        <g transform="translate(166, 140)">
          <rect x="0" y="0" width="130" height="22" rx="11" fill="rgba(56,136,57,0.1)" stroke="rgba(56,136,57,0.2)" strokeWidth="0.7" />
          {/* Phone icon in button */}
          <path
            d="M14 8 C14 8 14.5 7.5 15.5 9 L16.5 11 C17 11.5 16 12.5 16 12.5 C16 12.5 17 14 18.5 15.5 C20 17 21.5 18 21.5 18 C21.5 18 22.5 17 23 17.5 L24 18.5 C24.5 19 24 19.5 24 19.5"
            stroke="#388839"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          {/* "Call Now" text */}
          <rect x="32" y="7.5" width="54" height="5.5" rx="2" fill="#388839" opacity="0.3" />
          {/* Arrow hint */}
          <path d="M96 11 L102 11 M99 8 L102 11 L99 14" stroke="#388839" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4" />
        </g>
      </g>

      {/* ═══ Layer 3 — Map Pin (floating, top-right — larger and green-accented) ═══ */}
      <g transform="translate(330, 14)">
        {/* Outer pulse ring 2 */}
        <circle cx="18" cy="18" r="34" stroke="rgba(56,136,57,0.08)" strokeWidth="0.5" fill="none" />
        {/* Outer pulse ring 1 */}
        <circle cx="18" cy="18" r="26" stroke="rgba(56,136,57,0.15)" strokeWidth="0.6" fill="none" />
        {/* Halo glow */}
        <circle cx="18" cy="18" r="18" fill="rgba(56,136,57,0.03)" />
        {/* Pin shadow */}
        <ellipse cx="18" cy="38" rx="9" ry="2.5" fill="#0c0d0f" opacity="0.5" />
        {/* Pin body — slightly brighter */}
        <path
          d="M18 2 C11 2 5 8 5 14.5 C5 23 18 37 18 37 C18 37 31 23 31 14.5 C31 8 25 2 18 2 Z"
          fill="#1c1d20"
          stroke="#2a2b2f"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Pin top highlight */}
        <path d="M11 5 Q18 2 25 5" stroke="rgba(255,255,255,0.07)" strokeWidth="0.6" fill="none" strokeLinecap="round" />
        {/* Inner circle */}
        <circle cx="18" cy="14" r="6" fill="#0e0f11" stroke="#2a2b2f" strokeWidth="0.6" />
        {/* GREEN inner dot — marking YOUR location */}
        <circle cx="18" cy="14" r="3" fill="#388839" opacity="0.8" />
        {/* Bright core */}
        <circle cx="18" cy="14" r="1.2" fill="#4caf50" opacity="0.4" />
      </g>

      {/* ═══ Layer 4 — Corner intersection markers (subtle map feel) ═══ */}
      <g opacity="0.06">
        <circle cx="40" cy="20" r="1.5" fill="#2a2b2f" />
        <circle cx="360" cy="240" r="1.5" fill="#2a2b2f" />
        <circle cx="200" cy="256" r="1.5" fill="#2a2b2f" />
      </g>

      {/* ═══ Layer 5 — Scattered atmosphere dots ═══ */}
      <circle cx="20" cy="80" r="0.8" fill="#1c1d20" opacity="0.2" />
      <circle cx="385" cy="140" r="1" fill="#1c1d20" opacity="0.15" />
      <circle cx="10" cy="200" r="0.7" fill="#1c1d20" opacity="0.12" />
      <circle cx="392" cy="250" r="0.8" fill="#161719" opacity="0.1" />

    </svg>
  );
}
