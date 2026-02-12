/**
 * DecisionIllustration -- DEFINITIVE Tab 3: Google Business Profile (THE FINDO TAB)
 *
 * Visual story in 3 seconds:
 *   "Someone searched -> found a COMPLETE, TRUSTED, AVAILABLE business -> ready to call NOW."
 *
 * Design DNA:
 *   - GREEN #388839 is the DOMINANT accent (success, alive, go, ready)
 *   - Gold #C19552 for 5 stars (warm, premium, trustworthy)
 *   - This tab is the RICHEST, most COLORFUL, most ALIVE of all 3
 *   - Tab 1 = RED (dead) -> Tab 2 = ORANGE (stalled) -> Tab 3 = GREEN (thriving)
 *
 * Visual hierarchy (60-30-10):
 *   60% - Business Profile Card (the hero, fills ~65% of SVG)
 *   30% - Search bar + connector + map pin (context & flow)
 *   10% - Green accents, gold stars, ambient glow (emotion & color)
 *
 * 5-Element Clarity Test:
 *   1. THE story: "A complete business profile ready for contact"
 *   2. THE context: "Found via a Google-style search bar"
 *   3. THE emotion: "Green everywhere = alive, open, verified, ready"
 *   4. THE texture: "Subtle map grid in background"
 *   5. THE frame: "Green ambient glow wrapping the card"
 *
 * Element count: ~47 (within budget for the preferred tab, chunked into 6-7 visual groups)
 */
function DecisionIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">

      <defs>
        {/* Card border: green-tinted gradient for premium feel */}
        <linearGradient id="dec-card-border" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(56,136,57,0.4)" />
          <stop offset="50%" stopColor="rgba(56,136,57,0.15)" />
          <stop offset="100%" stopColor="rgba(56,136,57,0.35)" />
        </linearGradient>

        {/* CTA button fill: green horizontal gradient */}
        <linearGradient id="dec-cta-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(56,136,57,0.3)" />
          <stop offset="100%" stopColor="rgba(56,136,57,0.12)" />
        </linearGradient>

        {/* Connector arrow: fades from transparent to green */}
        <linearGradient id="dec-arrow-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#388839" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#388839" stopOpacity="0.7" />
        </linearGradient>

        {/* Ambient green glow behind entire card */}
        <radialGradient id="dec-green-glow" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#388839" stopOpacity="0.16" />
          <stop offset="50%" stopColor="#388839" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#388839" stopOpacity="0" />
        </radialGradient>

        {/* Photo area: dark gradient */}
        <linearGradient id="dec-photo-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1d20" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0e0f11" stopOpacity="1" />
        </linearGradient>

        {/* Map pin body gradient: subtle 3D */}
        <linearGradient id="dec-pin-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a2b2f" />
          <stop offset="100%" stopColor="#1c1d20" />
        </linearGradient>
      </defs>

      {/* ================================================================ */}
      {/* LAYER 0 -- Background Map Grid (atmospheric, sets "map" context) */}
      {/* ================================================================ */}
      <g opacity="0.06">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={`vg-${i}`} x1={50 + i * 50} y1="0" x2={50 + i * 50} y2="260" stroke="#2a2b2f" strokeWidth="0.4" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`hg-${i}`} x1="0" y1={30 + i * 50} x2="400" y2={30 + i * 50} stroke="#2a2b2f" strokeWidth="0.4" />
        ))}
      </g>

      {/* ================================================================ */}
      {/* LAYER 1 -- Green Ambient Glow (warmth, "alive" energy)           */}
      {/* ================================================================ */}
      <ellipse cx="195" cy="155" rx="200" ry="130" fill="url(#dec-green-glow)" />

      {/* ================================================================ */}
      {/* LAYER 2 -- Search Bar (Google-style pill, context setter)        */}
      {/* ================================================================ */}
      <g transform="translate(40, 2)">
        {/* Search bar body */}
        <rect x="0" y="0" width="320" height="46" rx="23" fill="#111214" stroke="#2a2b2f" strokeWidth="1" />

        {/* Magnifying glass icon -- LARGE, clearly recognizable */}
        <circle cx="30" cy="22" r="10" stroke="#5a5b60" strokeWidth="2.2" fill="none" />
        <line x1="38" y1="30" x2="45" y2="37" stroke="#5a5b60" strokeWidth="2.2" strokeLinecap="round" />

        {/* Search query placeholder bars */}
        <rect x="58" y="11" width="160" height="9" rx="4" fill="#333538" />
        <rect x="58" y="26" width="95" height="7" rx="3" fill="#262728" />
      </g>

      {/* ================================================================ */}
      {/* LAYER 3 -- Connector Arrow (search -> result, GREEN flow)        */}
      {/* ================================================================ */}
      <line x1="200" y1="50" x2="200" y2="74" stroke="url(#dec-arrow-grad)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M191 67 L200 78 L209 67" stroke="#388839" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />

      {/* ================================================================ */}
      {/* LAYER 4 -- Main Business Profile Card (THE HERO, ~65% of SVG)   */}
      {/* ================================================================ */}
      <g transform="translate(22, 82)">
        {/* Card background with green-tinted border */}
        <rect x="0" y="0" width="304" height="170" rx="12" fill="#161719" stroke="url(#dec-card-border)" strokeWidth="1.8" />

        {/* ------------------------------------------------------------ */}
        {/* SECTION A: Photo + Business Identity                         */}
        {/* ------------------------------------------------------------ */}

        {/* Profile photo area */}
        <rect x="14" y="14" width="90" height="58" rx="8" fill="url(#dec-photo-grad)" stroke="#222326" strokeWidth="0.7" />
        {/* Simplified building silhouette inside photo */}
        <rect x="36" y="30" width="28" height="32" fill="#1c1d20" />
        <rect x="40" y="24" width="20" height="8" rx="2" fill="#222326" opacity="0.7" />
        <rect x="46" y="44" width="10" height="16" rx="2" fill="#161719" />

        {/* Business name bar -- wide, bright */}
        <rect x="118" y="16" width="138" height="14" rx="3" fill="#4a4b50" />

        {/* Verified badge -- LARGE green check, unmistakable trust signal */}
        <circle cx="272" cy="23" r="15" fill="rgba(56,136,57,0.28)" stroke="rgba(56,136,57,0.6)" strokeWidth="1.5" />
        <path d="M264 23 L269 28.5 L280 16" stroke="#388839" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Category bar */}
        <rect x="118" y="36" width="105" height="7" rx="2" fill="#2a2b2f" />

        {/* ------------------------------------------------------------ */}
        {/* SECTION B: 5 Gold Stars (warm, premium -- THE trust signal)   */}
        {/* ------------------------------------------------------------ */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`star-${i}`} transform={`translate(${118 + i * 25}, 50)`}>
            <path
              d="M9.5 0.5 L12 6.8 L19 6.8 L13.5 11 L15.5 17.2 L9.5 13 L3.5 17.2 L5.5 11 L0 6.8 L7 6.8 Z"
              fill="#C19552"
              opacity="0.95"
            />
          </g>
        ))}
        {/* Review count pill next to stars */}
        <rect x="245" y="54" width="44" height="12" rx="6" fill="#1c1d20" stroke="#222326" strokeWidth="0.6" />
        <rect x="251" y="58" width="32" height="4" rx="2" fill="#4a4b50" opacity="0.7" />

        {/* ------------------------------------------------------------ */}
        {/* Divider line                                                  */}
        {/* ------------------------------------------------------------ */}
        <line x1="14" y1="80" x2="290" y2="80" stroke="#222326" strokeWidth="0.7" />

        {/* ------------------------------------------------------------ */}
        {/* SECTION C: "Open Now" + "Call Now" (action row)               */}
        {/* ------------------------------------------------------------ */}

        {/* "Open Now" badge -- GREEN, pulsing, ALIVE */}
        <g transform="translate(14, 92)">
          <rect x="0" y="0" width="116" height="36" rx="18" fill="#111214" stroke="rgba(56,136,57,0.45)" strokeWidth="1.3" />
          {/* Pulsing green dot -- layered for glow effect */}
          <circle cx="26" cy="18" r="10" fill="rgba(56,136,57,0.12)" />
          <circle cx="26" cy="18" r="7" fill="#388839" />
          <circle cx="26" cy="18" r="3.5" fill="#4caf50" opacity="0.7" />
          {/* "Open Now" text placeholder */}
          <rect x="42" y="11" width="62" height="10" rx="3" fill="#4a4b50" />
        </g>

        {/* "Call Now" CTA -- GREEN, the PRIMARY action */}
        <g transform="translate(142, 92)">
          <rect x="0" y="0" width="162" height="36" rx="18" fill="url(#dec-cta-fill)" stroke="rgba(56,136,57,0.55)" strokeWidth="1.5" />
          {/* Phone icon -- larger, clearer */}
          <g transform="translate(16, 7)">
            <path
              d="M0 4.5 C0 4.5 0.5 1.5 2.8 2.8 L5 4.2 C6 5 5.5 6.5 5 7 C5 7 6 9.5 8.5 12 C11 14.5 13.5 15.5 13.5 15.5 C14 15 15.5 14.5 16.3 15.5 L17.5 17 C18 18 16.5 19 16.5 19 C14 20 11 17.5 8 14.5 C5 11.5 3 8.5 2.5 6.5 C2 5 0 4.5 0 4.5 Z"
              fill="#388839"
              opacity="0.85"
            />
          </g>
          {/* "Call Now" text placeholder -- green tinted */}
          <rect x="44" y="12" width="72" height="10" rx="3" fill="#388839" opacity="0.5" />
          {/* Arrow indicator -> */}
          <path d="M130 18 L143 18 M139 12 L144 18 L139 24" stroke="#388839" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
        </g>

        {/* ------------------------------------------------------------ */}
        {/* SECTION D: Rating summary bar (bottom)                        */}
        {/* ------------------------------------------------------------ */}
        <g transform="translate(14, 142)">
          <rect x="0" y="0" width="276" height="22" rx="6" fill="#111214" stroke="#1c1d20" strokeWidth="0.5" />
          {/* Mini star */}
          <path d="M18 5 L19.5 9 L23.5 9 L20.5 11.5 L21.5 15.5 L18 13 L14.5 15.5 L15.5 11.5 L12.5 9 L16.5 9 Z" fill="#C19552" opacity="0.75" />
          {/* Rating number placeholder */}
          <rect x="28" y="7" width="28" height="7" rx="2" fill="#4a4b50" />
          {/* Separator */}
          <circle cx="64" cy="11" r="1.5" fill="#3a3b3f" />
          {/* Review count placeholder */}
          <rect x="72" y="7" width="48" height="7" rx="2" fill="#333538" />
          {/* Separator */}
          <circle cx="128" cy="11" r="1.5" fill="#3a3b3f" />
          {/* Category placeholder */}
          <rect x="136" y="7" width="64" height="7" rx="2" fill="#2a2b2f" />
        </g>
      </g>

      {/* ================================================================ */}
      {/* LAYER 5 -- Map Pin (upper right -- LARGE, vivid green marker)   */}
      {/* ================================================================ */}
      <g transform="translate(338, 58) scale(1.5)">
        {/* Pin shadow */}
        <ellipse cx="18" cy="52" rx="10" ry="3" fill="#0c0d0f" opacity="0.5" />
        {/* Pin body */}
        <path
          d="M18 2 C11 2 5 8.5 5 15.5 C5 25 18 48 18 48 C18 48 31 25 31 15.5 C31 8.5 25 2 18 2 Z"
          fill="url(#dec-pin-body)"
          stroke="#3a3b3f"
          strokeWidth="1"
        />
        {/* Inner circle */}
        <circle cx="18" cy="15" r="8.5" fill="#161719" stroke="#3a3b3f" strokeWidth="0.7" />
        {/* GREEN center dot -- FULL OPACITY, alive */}
        <circle cx="18" cy="15" r="6" fill="#388839" />
        <circle cx="18" cy="15" r="3" fill="#4caf50" opacity="0.7" />
      </g>

    </svg>
  );
}
