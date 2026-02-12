/**
 * OrganicIllustration — Tab 2: "Organic Marketing Takes 6-12 Months"
 *
 * Visual metaphor: An analytics dashboard showing a painfully flat growth line
 * with "6-12" as the dominant hero number, content effort markers below,
 * and a progress bar barely started at 22%.
 *
 * 3-second read: "6-12 MONTHS" (huge) + flat line + barely-filled progress = SLOW.
 *
 * Design spec compliance:
 * - ViewBox: 0 0 400 260
 * - ~25 SVG elements (simplest tab)
 * - 1.5px+ stroke widths for all visible lines
 * - Hero element: 0.60-0.70 white opacity
 * - Orange #885c38 as primary accent
 * - "Extends beyond frame" clipping on growth line
 * - 60-30-10 hierarchy: hero text (60%), curve + effort (30%), atmosphere (10%)
 */
function OrganicIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">

      <defs>
        {/* Clip to keep elements inside the card frame */}
        <clipPath id="organic-frame-clip">
          <rect x="14" y="10" width="372" height="240" rx="10" />
        </clipPath>
        {/* Area fill under the flat growth curve */}
        <linearGradient id="organic-area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#885c38" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#885c38" stopOpacity="0" />
        </linearGradient>
        {/* Progress bar fill */}
        <linearGradient id="organic-bar-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#885c38" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#885c38" stopOpacity="0.45" />
        </linearGradient>
        {/* Subtle glow behind hero text */}
        <radialGradient id="organic-hero-glow" cx="50%" cy="42%" r="38%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.025)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* ═══ CARD BACKGROUND ═══ */}
      <rect x="14" y="10" width="372" height="240" rx="10" fill="#0c0d0f" stroke="#1a1b1e" strokeWidth="0.5" />

      {/* Everything clipped to frame */}
      <g clipPath="url(#organic-frame-clip)">

        {/* ═══ ATMOSPHERE: faint horizontal grid (2 lines) ═══ */}
        <line x1="28" y1="88" x2="386" y2="88" stroke="#161719" strokeWidth="0.5" />
        <line x1="28" y1="168" x2="386" y2="168" stroke="#161719" strokeWidth="0.5" />

        {/* ═══ ATMOSPHERE: subtle glow behind hero ═══ */}
        <ellipse cx="200" cy="105" rx="160" ry="80" fill="url(#organic-hero-glow)" />

        {/* ═══ HERO (60%): "6-12" massive number ═══ */}
        <text
          x="200"
          y="128"
          textAnchor="middle"
          fill="rgba(255,255,255,0.68)"
          fontSize="92"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-5"
        >
          6-12
        </text>
        <text
          x="200"
          y="158"
          textAnchor="middle"
          fill="rgba(255,255,255,0.28)"
          fontSize="22"
          fontWeight="500"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="6"
        >
          MONTHS
        </text>

        {/* ═══ SUPPORTING (30%): Flat growth curve ═══ */}
        {/* The line: barely rises across the entire width — communicates stagnation */}
        <path
          d="M28 208 C90 207.5 160 207 230 206 C290 205 340 203 386 200"
          stroke="#5a5b60"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Area fill beneath curve */}
        <path
          d="M28 208 C90 207.5 160 207 230 206 C290 205 340 203 386 200 L386 230 L28 230 Z"
          fill="url(#organic-area-grad)"
        />
        {/* Data points on the curve */}
        <circle cx="110" cy="207" r="4.5" fill="#2a2b2f" stroke="#885c38" strokeWidth="1.5" />
        <circle cx="230" cy="206" r="4.5" fill="#2a2b2f" stroke="#885c38" strokeWidth="1.5" />
        <circle cx="340" cy="203" r="4.5" fill="#2a2b2f" stroke="#885c38" strokeWidth="1.5" />

        {/* Dashed continuation — extends beyond frame (clipped) */}
        <path
          d="M386 200 C400 198 415 195 430 190"
          stroke="#5a5b60"
          strokeWidth="2"
          strokeDasharray="5 5"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* ═══ SUPPORTING: Progress bar — barely started ═══ */}
        <g transform="translate(28, 26)">
          <text
            x="0"
            y="-4"
            fill="rgba(255,255,255,0.22)"
            fontSize="10"
            fontWeight="500"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="1.5"
          >
            PROGRESS
          </text>
          {/* Track */}
          <rect x="0" y="2" width="140" height="14" rx="7" fill="#111214" stroke="#1c1d20" strokeWidth="0.8" />
          {/* Fill — 22% of 140 ~= 31px */}
          <rect x="2" y="4" width="29" height="10" rx="5" fill="url(#organic-bar-grad)" />
          {/* Percentage label */}
          <text
            x="150"
            y="14"
            fill="rgba(136,92,56,0.8)"
            fontSize="14"
            fontWeight="700"
            fontFamily="system-ui, -apple-system, monospace"
          >
            22%
          </text>
        </g>

        {/* ═══ SUPPORTING: Content effort indicators (blog posts = sustained work) ═══ */}
        {/* 4 small "content page" icons in upper-right — showing effort being poured in */}
        <g transform="translate(290, 20)" opacity="0.55">
          {/* Page 1 (posted) */}
          <rect x="0" y="0" width="22" height="28" rx="3" fill="#1c1d20" stroke="#2a2b2f" strokeWidth="1.5" />
          <rect x="4" y="5" width="14" height="2" rx="1" fill="#3a3b3f" />
          <rect x="4" y="10" width="10" height="2" rx="1" fill="#2a2b2f" />
          <rect x="4" y="15" width="12" height="2" rx="1" fill="#2a2b2f" />

          {/* Page 2 (posted) */}
          <rect x="28" y="4" width="22" height="28" rx="3" fill="#1c1d20" stroke="#2a2b2f" strokeWidth="1.5" />
          <rect x="32" y="9" width="14" height="2" rx="1" fill="#3a3b3f" />
          <rect x="32" y="14" width="10" height="2" rx="1" fill="#2a2b2f" />
          <rect x="32" y="19" width="12" height="2" rx="1" fill="#2a2b2f" />

          {/* Page 3 (dimmer — future) */}
          <rect x="56" y="8" width="22" height="28" rx="3" fill="#161719" stroke="#222326" strokeWidth="1.5" />
          <rect x="60" y="13" width="14" height="2" rx="1" fill="#2a2b2f" />
          <rect x="60" y="18" width="10" height="2" rx="1" fill="#222326" />
        </g>

        {/* ═══ ACCENT: Orange warning dot — top-left corner ═══ */}
        <circle cx="36" cy="18" r="4" fill="#885c38" opacity="0.7" />

        {/* ═══ TIMELINE: Month markers along the bottom ═══ */}
        <line x1="28" y1="236" x2="386" y2="236" stroke="#1c1d20" strokeWidth="0.8" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = 52 + i * 62;
          const isActive = i < 2;
          const labels = ["2m", "4m", "6m", "8m", "10m", "12m"];
          return (
            <g key={`tm-${i}`}>
              <line
                x1={x}
                y1="232"
                x2={x}
                y2="240"
                stroke={isActive ? "#885c38" : "#2a2b2f"}
                strokeWidth={isActive ? 2 : 1}
                strokeLinecap="round"
              />
              <text
                x={x}
                y="251"
                textAnchor="middle"
                fill={isActive ? "rgba(136,92,56,0.7)" : "rgba(255,255,255,0.12)"}
                fontSize="10"
                fontWeight={isActive ? "600" : "400"}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {labels[i]}
              </text>
            </g>
          );
        })}

      </g>
    </svg>
  );
}
