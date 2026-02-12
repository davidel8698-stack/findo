/**
 * DecisionIllustration — REDESIGNED: Google Business Profile discovery (THE Findo tab)
 * Visual story: "The customer is ALREADY SEARCHING for you. They just need trust + availability."
 *
 * Changes from original:
 * - REDUCED from ~80+ elements to ~32 elements
 * - INCREASED green presence: card border, verified badge, open badge, CTA button, map pin
 * - Business Profile Card takes 65-70% of SVG area (THE HERO)
 * - Removed: phone contact row, directions row, website button, corner markers, atmosphere dots
 * - Removed: diagonal road accents, subtle glow circles behind stars, multiple pulse rings
 * - BIGGER: verified badge (r=9), stars, "Open Now" badge (90x26), call CTA, map pin
 * - BRIGHTER: stars (#9a8b4f at 0.85), green dot (full opacity), business name (#4a4b50)
 * - Simplified storefront to gradient + 3-shape silhouette (not 15 tiny rects)
 * - Clear visual flow: Search bar -> connector -> Business card -> Contact CTA
 * - Green accent #388839 at 0.7-1.0 throughout (vs 0.1-0.3 in original)
 */
function DecisionIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">

      {/* ═══ Defs — unique gradient IDs ═══ */}
      <defs>
        <linearGradient id="decision-storefront-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1d20" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0e0f11" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="decision-card-border" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(56,136,57,0.2)" />
          <stop offset="50%" stopColor="rgba(56,136,57,0.08)" />
          <stop offset="100%" stopColor="rgba(56,136,57,0.15)" />
        </linearGradient>
        <linearGradient id="decision-cta-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(56,136,57,0.18)" />
          <stop offset="100%" stopColor="rgba(56,136,57,0.08)" />
        </linearGradient>
      </defs>

      {/* ═══ Background Map Grid (very subtle) ═══ */}
      <g opacity="0.06">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <line key={`vg-${i}`} x1={40 + i * 40} y1="0" x2={40 + i * 40} y2="260" stroke="#2a2b2f" strokeWidth="0.4" />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={`hg-${i}`} x1="0" y1={20 + i * 40} x2="400" y2={20 + i * 40} stroke="#2a2b2f" strokeWidth="0.4" />
        ))}
      </g>

      {/* ═══ Search Bar (top — context setter, simplified) ═══ */}
      <g transform="translate(52, 8)">
        <rect x="0" y="0" width="296" height="40" rx="20" fill="#111214" stroke="#2a2b2f" strokeWidth="1" />
        {/* Magnifying glass — BIGGER, brighter */}
        <circle cx="28" cy="20" r="8" stroke="#4a4b50" strokeWidth="1.8" fill="none" />
        <line x1="34" y1="26" x2="40" y2="32" stroke="#4a4b50" strokeWidth="1.8" strokeLinecap="round" />
        {/* Search text placeholder — wider, brighter */}
        <rect x="50" y="14" width="140" height="7" rx="3" fill="#333538" />
        <rect x="50" y="25" width="80" height="5" rx="2" fill="#262728" />
      </g>

      {/* ═══ Connector — search to card flow (green-tinted arrow) ═══ */}
      <g opacity="0.25">
        <line x1="200" y1="50" x2="200" y2="66" stroke="#388839" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M194 60 L200 68 L206 60" stroke="#388839" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* ═══ Main Business Profile Card (THE HERO — 65-70% of SVG) ═══ */}
      <g transform="translate(32, 72)">
        {/* Card background with green-tinted border */}
        <rect x="0" y="0" width="280" height="178" rx="10" fill="#161719" stroke="url(#decision-card-border)" strokeWidth="1.2" />

        {/* ── Storefront Photo Area (simplified: gradient + silhouette) ── */}
        <rect x="14" y="14" width="100" height="68" rx="8" fill="url(#decision-storefront-grad)" stroke="#222326" strokeWidth="0.7" />
        {/* Building silhouette — 3 shapes only */}
        <rect x="30" y="38" width="28" height="34" fill="#222326" />
        <rect x="34" y="32" width="20" height="8" fill="#2a2b2f" opacity="0.7" />
        <rect x="40" y="48" width="10" height="20" rx="2" fill="#1c1d20" />
        {/* Second building wing */}
        <rect x="62" y="44" width="20" height="28" fill="#1c1d20" opacity="0.6" />
        {/* Windows — just 4 simple squares */}
        <rect x="65" y="48" width="6" height="5" rx="1" fill="#2a2b2f" opacity="0.5" />
        <rect x="73" y="48" width="6" height="5" rx="1" fill="#2a2b2f" opacity="0.5" />
        <rect x="65" y="56" width="6" height="5" rx="1" fill="#2a2b2f" opacity="0.4" />
        <rect x="73" y="56" width="6" height="5" rx="1" fill="#2a2b2f" opacity="0.4" />

        {/* ── Business Name — WIDER, BRIGHTER ── */}
        <rect x="128" y="16" width="120" height="12" rx="3" fill="#4a4b50" />

        {/* ── Verified Badge — BIGGER (r=9), MORE GREEN ── */}
        <circle cx="260" cy="22" r="9" fill="rgba(56,136,57,0.2)" stroke="rgba(56,136,57,0.45)" strokeWidth="1" />
        <path d="M255.5 22 L258 24.5 L264.5 18" stroke="#388839" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" />

        {/* ── Category line ── */}
        <rect x="128" y="34" width="96" height="6" rx="2" fill="#2a2b2f" />

        {/* ── Star Ratings — BIGGER, BRIGHTER amber (#9a8b4f at 0.85) ── */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`star-${i}`} transform={`translate(${128 + i * 20}, 48)`}>
            <path
              d="M7 0 L8.6 4.8 L13.8 4.8 L9.6 7.7 L11.2 12.5 L7 9.6 L2.8 12.5 L4.4 7.7 L0.2 4.8 L5.4 4.8 Z"
              fill="#9a8b4f"
              opacity="0.85"
            />
          </g>
        ))}
        {/* Review count badge */}
        <rect x="230" y="51" width="38" height="9" rx="4.5" fill="#1c1d20" stroke="#222326" strokeWidth="0.5" />
        <rect x="236" y="54" width="26" height="3" rx="1" fill="#333538" />

        {/* ── Divider ── */}
        <line x1="14" y1="94" x2="266" y2="94" stroke="#222326" strokeWidth="0.5" strokeLinecap="round" />

        {/* ── "Open Now" Badge — BIGGER (90x26), GREEN PULSE ── */}
        <g transform="translate(14, 106)">
          <rect x="0" y="0" width="90" height="26" rx="13" fill="#161719" stroke="rgba(56,136,57,0.3)" strokeWidth="1" />
          {/* Green dot — FULL OPACITY, bright and alive */}
          <circle cx="18" cy="13" r="4.5" fill="#388839" opacity="1.0" />
          <circle cx="18" cy="13" r="2.2" fill="#4caf50" opacity="0.6" />
          {/* "Open Now" text placeholder — brighter */}
          <rect x="30" y="8" width="50" height="7" rx="2" fill="#4a4b50" />
        </g>

        {/* ── Call Button — GREEN CTA, clearly the action ── */}
        <g transform="translate(116, 106)">
          <rect x="0" y="0" width="150" height="26" rx="13" fill="url(#decision-cta-fill)" stroke="rgba(56,136,57,0.35)" strokeWidth="1" />
          {/* Phone icon — green */}
          <path
            d="M16 9 C16 9 16.8 8.2 17.5 10 L18.8 12.5 C19.2 13.2 18.2 14.2 18 14.5 C18 14.5 19 16 21 18 C22.5 19.5 24 20.5 24 20.5 C24.3 20.2 25.2 19.3 26 19.8 L27.5 21 C28.2 21.5 27.5 22 27.5 22"
            stroke="#388839"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          {/* CTA text placeholder — green tinted */}
          <rect x="38" y="8" width="66" height="7" rx="2" fill="#388839" opacity="0.4" />
          {/* Arrow → */}
          <path d="M118 13 L126 13 M122 9 L126 13 L122 17" stroke="#388839" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
        </g>

        {/* ── Rating summary bar (bottom) ── */}
        <g transform="translate(14, 146)">
          <rect x="0" y="0" width="252" height="20" rx="6" fill="#111214" stroke="#1c1d20" strokeWidth="0.5" />
          {/* Star icon mini */}
          <path
            d="M16 6 L17 8.5 L19.5 8.5 L17.5 10 L18.3 12.5 L16 11 L13.7 12.5 L14.5 10 L12.5 8.5 L15 8.5 Z"
            fill="#9a8b4f"
            opacity="0.7"
          />
          {/* Rating number */}
          <rect x="24" y="7" width="22" height="6" rx="1.5" fill="#4a4b50" />
          {/* Separator dot */}
          <circle cx="52" cy="10" r="1.2" fill="#333538" />
          {/* Review count */}
          <rect x="58" y="7" width="40" height="6" rx="1.5" fill="#333538" />
          {/* Separator dot */}
          <circle cx="104" cy="10" r="1.2" fill="#333538" />
          {/* Category */}
          <rect x="110" y="7" width="56" height="6" rx="1.5" fill="#2a2b2f" />
        </g>
      </g>

      {/* ═══ Map Pin (top-right — LARGER, MORE GREEN) ═══ */}
      <g transform="translate(332, 80)">
        {/* Pin shadow */}
        <ellipse cx="20" cy="56" rx="10" ry="3" fill="#0c0d0f" opacity="0.5" />
        {/* Pin body — brighter */}
        <path
          d="M20 2 C12 2 5 9 5 17 C5 27 20 52 20 52 C20 52 35 27 35 17 C35 9 28 2 20 2 Z"
          fill="#2a2b2f"
          stroke="#333538"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Inner circle */}
        <circle cx="20" cy="16" r="8" fill="#161719" stroke="#333538" strokeWidth="0.7" />
        {/* GREEN inner dot — YOUR location, FULL OPACITY */}
        <circle cx="20" cy="16" r="4.5" fill="#388839" opacity="1.0" />
        <circle cx="20" cy="16" r="2" fill="#4caf50" opacity="0.6" />
      </g>

    </svg>
  );
}
