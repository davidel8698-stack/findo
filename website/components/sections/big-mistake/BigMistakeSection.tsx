"use client";

import { useRef } from "react";
import { m, useInView } from "motion/react";
import styles from "./big-mistake.module.css";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── SVG Illustrations for Card Visual Areas ──
   CLARITY UPGRADE: Each illustration must be instantly understood
   without ANY mental effort. Zero ambiguity. Crystal clear in 3 seconds.
   Tab 1 (red): Budget stops → traffic crashes to ZERO
   Tab 2 (orange): 6-12 months of effort, barely any results
   Tab 3 (green): Search → Find → Contact instantly (PREFERRED)
── */

/**
 * PaidAdIllustration — "Budget stops → Everything crashes to ZERO"
 *
 * Visual story: Dashboard with chart line split by "BUDGET OFF" divider.
 * LEFT = healthy traffic (stable line near top).
 * RIGHT = dramatic cliff-drop to ZERO (red danger zone, flatline).
 * Large $ coin prominent in healthy zone. Red "PAUSED" pill in header.
 *
 * 5-Element Clarity Test:
 * 1. THE STORY: Dramatic cliff-drop line from high to flatline-at-zero
 * 2. THE CONTEXT: Dashboard frame with chart grid
 * 3. THE EMOTION: Red accent on crash zone + "PAUSED" badge = danger
 * 4. THE TEXTURE: Faint grid lines, area fills
 * 5. THE FRAME: Dashboard border with header bar
 */
function PaidAdIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">

      <defs>
        <linearGradient id="paid-healthyArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2b2f" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#1c1d20" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0e0f11" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="paid-crashZone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#883839" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#883839" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#883839" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="paid-coinGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <clipPath id="paid-frameClip">
          <rect x="24" y="10" width="352" height="240" rx="12" />
        </clipPath>
      </defs>

      {/* ═══ Dashboard Frame ═══ */}
      <rect x="24" y="10" width="352" height="240" rx="12" fill="#0e0f11" stroke="#2a2b2f" strokeWidth="1.5" />

      {/* ── Header Bar ── */}
      <rect x="24" y="10" width="352" height="36" rx="12" fill="#0c0d0f" />
      <rect x="24" y="34" width="352" height="12" fill="#0c0d0f" />
      <line x1="24" y1="46" x2="376" y2="46" stroke="#1c1d20" strokeWidth="1.5" />
      <circle cx="44" cy="28" r="5" fill="#1c1d20" />
      <circle cx="60" cy="28" r="5" fill="#1c1d20" />
      <circle cx="76" cy="28" r="5" fill="#1c1d20" />

      {/* ── Red "PAUSED" Status Pill — campaign is dead ── */}
      <rect x="268" y="16" width="100" height="24" rx="12" fill="#1c1d20" stroke="#883839" strokeWidth="1.5" />
      <circle cx="286" cy="28" r="4" fill="#883839" />
      <text x="318" y="32" textAnchor="middle" fill="#883839" fontSize="12" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700">PAUSED</text>

      {/* ═══ Chart Area (clipped) ═══ */}
      <g clipPath="url(#paid-frameClip)">
        <rect x="38" y="54" width="338" height="186" rx="8" fill="#0c0d0f" stroke="#1c1d20" strokeWidth="0.8" />

        {/* ── Grid Lines (atmospheric) ── */}
        <line x1="60" y1="88" x2="360" y2="88" stroke="#1c1d20" strokeWidth="0.6" strokeDasharray="4 6" />
        <line x1="60" y1="122" x2="360" y2="122" stroke="#1c1d20" strokeWidth="0.6" strokeDasharray="4 6" />
        <line x1="60" y1="156" x2="360" y2="156" stroke="#1c1d20" strokeWidth="0.6" strokeDasharray="4 6" />
        <line x1="60" y1="190" x2="360" y2="190" stroke="#1c1d20" strokeWidth="0.6" strokeDasharray="4 6" />
        <line x1="60" y1="224" x2="360" y2="224" stroke="#1c1d20" strokeWidth="0.6" strokeDasharray="4 6" />

        {/* ═══ Area Fills ═══ */}
        <path d="M60 82 C80 80 90 79 100 78 C120 77 130 80 140 80 C160 79 170 77 180 76 C190 76 195 77 200 78 L200 230 L60 230 Z" fill="url(#paid-healthyArea)" />
        <path d="M200 78 C201 84 202 100 204 120 C206 145 208 170 212 190 C216 206 222 218 232 225 C242 230 256 230 270 230 L370 230 L370 232 L200 232 Z" fill="url(#paid-crashZone)" />

        {/* ═══ THE LINE — HERO ELEMENT ═══ */}
        {/* Healthy phase: stable near top — bright gray */}
        <path
          d="M60 82 C80 80 90 79 100 78 C120 77 130 80 140 80 C160 79 170 77 180 76 C190 76 195 77 200 78"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* CRASH phase: dramatic vertical cliff-drop — RED */}
        <path
          d="M200 78 C201 84 202 100 204 120 C206 145 208 170 212 190 C216 206 222 218 232 225 C242 230 256 230 270 230"
          stroke="#883839"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Flatline at zero — dead */}
        <path d="M270 230 L340 230 L370 230" stroke="#883839" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />

        {/* ═══ Data Points ═══ */}
        <circle cx="60" cy="82" r="6" fill="#5a5b60" stroke="#0c0d0f" strokeWidth="2" />
        <circle cx="200" cy="78" r="7" fill="rgba(255,255,255,0.5)" stroke="#0c0d0f" strokeWidth="2.5" />
        <circle cx="270" cy="230" r="6" fill="#883839" stroke="#0c0d0f" strokeWidth="2" opacity="0.8" />

        {/* ═══ "BUDGET OFF" Vertical Divider — positioned ABOVE the turning point ═══ */}
        <line x1="200" y1="54" x2="200" y2="240" stroke="#885c38" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" opacity="0.6" />
        <rect x="158" y="100" width="84" height="22" rx="6" fill="#111214" stroke="#885c38" strokeWidth="1.5" />
        <text x="200" y="115" textAnchor="middle" fill="#885c38" fontSize="11" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" letterSpacing="0.8">BUDGET OFF</text>

        {/* ═══ $ Money Symbol — prominent in healthy zone ═══ */}
        <g opacity="0.75">
          <circle cx="90" cy="110" r="20" fill="#111214" stroke="#3a3b3f" strokeWidth="1.5" />
          <circle cx="90" cy="110" r="14" stroke="#2a2b2f" strokeWidth="0.8" fill="none" />
          <text x="90" y="119" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="24" fontFamily="monospace, system-ui, -apple-system" fontWeight="700">$</text>
        </g>

        {/* Second $ coin — clips at dashboard frame edge */}
        <g opacity="0.4" transform="translate(350, 200)">
          <circle cx="0" cy="0" r="28" fill="#111214" stroke="#2a2b2f" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="20" stroke="#1c1d20" strokeWidth="0.8" fill="none" />
          <text x="0" y="9" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="26" fontFamily="monospace, system-ui, -apple-system" fontWeight="700">$</text>
        </g>

        {/* ═══ "0" label at crash bottom — zero results ═══ */}
        <text x="320" y="222" textAnchor="middle" fill="#b04a4b" fontSize="20" fontFamily="monospace, system-ui, -apple-system" fontWeight="800" opacity="0.8">0</text>
      </g>

    </svg>
  );
}

/**
 * OrganicIllustration — "6-12 MONTHS of effort, barely any results"
 *
 * Visual story: Analytics dashboard with painfully flat growth line,
 * "6-12" as the MASSIVE hero number, content effort markers (blog pages),
 * and a progress bar stuck at 22%.
 *
 * 3-second read: "6-12 MONTHS" (huge) + flat line + barely-filled progress = SLOW.
 *
 * 5-Element Clarity Test:
 * 1. THE STORY: "6-12 MONTHS" dominating the center
 * 2. THE CONTEXT: Flat growth curve, content pages being produced
 * 3. THE EMOTION: Orange warning accents = patience/frustration
 * 4. THE TEXTURE: Faint grid lines, timeline markers
 * 5. THE FRAME: Card background containing the scene
 */
function OrganicIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">

      <defs>
        <clipPath id="organic-frame-clip">
          <rect x="14" y="10" width="372" height="246" rx="12" />
        </clipPath>
        <linearGradient id="organic-area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#885c38" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#885c38" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="organic-bar-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#885c38" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#885c38" stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id="organic-hero-glow" cx="50%" cy="42%" r="38%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.025)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* ═══ Background ═══ */}
      <rect x="14" y="10" width="372" height="246" rx="12" fill="#0c0d0f" stroke="#1a1b1e" strokeWidth="0.5" />

      {/* ═══ Clipped content area (curve, hero text, grid) ═══ */}
      <g clipPath="url(#organic-frame-clip)">

        {/* ═══ Atmosphere: faint grid + hero glow ═══ */}
        <line x1="28" y1="88" x2="386" y2="88" stroke="#1c1d20" strokeWidth="0.5" />
        <line x1="28" y1="168" x2="386" y2="168" stroke="#1c1d20" strokeWidth="0.5" />
        <ellipse cx="200" cy="105" rx="160" ry="80" fill="url(#organic-hero-glow)" />

        {/* ═══ HERO: "6-12 MONTHS" — THE dominant focal point ═══ */}
        <text
          x="200"
          y="128"
          textAnchor="middle"
          fill="rgba(255,255,255,0.78)"
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

        {/* ═══ Flat Growth Curve — barely rises (stagnation) ═══ */}
        <path
          d="M28 208 C90 207.5 160 207 230 206 C290 205 340 203 386 200"
          stroke="#5a5b60"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M28 208 C90 207.5 160 207 230 206 C290 205 340 203 386 200 L386 230 L28 230 Z"
          fill="url(#organic-area-grad)"
        />
        {/* Data points — aligned precisely ON the curve path */}
        <circle cx="110" cy="207.5" r="4.5" fill="#2a2b2f" stroke="#885c38" strokeWidth="1.5" />
        <circle cx="230" cy="206" r="4.5" fill="#2a2b2f" stroke="#885c38" strokeWidth="1.5" />
        <circle cx="340" cy="203" r="4.5" fill="#2a2b2f" stroke="#885c38" strokeWidth="1.5" />
        {/* Dashed continuation — clean exit at clip edge */}
        <path d="M386 200 C400 198 415 195 430 190" stroke="#5a5b60" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" opacity="0.35" />

      </g>

      {/* ═══ Progress Bar — single horizontal card ═══ */}
      <g transform="translate(40, 22)">
        {/* Single card container */}
        <rect x="0" y="0" width="180" height="32" rx="8" fill="#0e0f11" stroke="#1c1d20" strokeWidth="1.2" />
        {/* Progress bar track - starts after some padding */}
        <rect x="10" y="10" width="110" height="12" rx="6" fill="#111214" stroke="#1c1d20" strokeWidth="0.6" />
        {/* Progress bar fill - 22% of 110 = ~24px */}
        <rect x="12" y="12" width="24" height="8" rx="4" fill="url(#organic-bar-grad)" />
        {/* Percentage label */}
        <text x="130" y="21" fill="rgba(136,92,56,0.95)" fontSize="13" fontWeight="700" fontFamily="system-ui, -apple-system, monospace">22%</text>
      </g>

      {/* ═══ Content Effort Indicators — blog posts (larger, better contrast) ═══ */}
      <g transform="translate(282, 18)" opacity="0.6">
        <rect x="0" y="0" width="26" height="34" rx="3" fill="#1c1d20" stroke="#2a2b2f" strokeWidth="1.5" />
        <rect x="5" y="6" width="16" height="2.5" rx="1" fill="#3a3b3f" />
        <rect x="5" y="12" width="12" height="2.5" rx="1" fill="#2a2b2f" />
        <rect x="5" y="18" width="14" height="2.5" rx="1" fill="#2a2b2f" />
        <rect x="32" y="4" width="26" height="34" rx="3" fill="#1c1d20" stroke="#2a2b2f" strokeWidth="1.5" />
        <rect x="37" y="10" width="16" height="2.5" rx="1" fill="#3a3b3f" />
        <rect x="37" y="16" width="12" height="2.5" rx="1" fill="#2a2b2f" />
        <rect x="37" y="22" width="14" height="2.5" rx="1" fill="#2a2b2f" />
        <rect x="64" y="8" width="26" height="34" rx="3" fill="#161719" stroke="#222326" strokeWidth="1.5" />
        <rect x="69" y="14" width="16" height="2.5" rx="1" fill="#2a2b2f" />
        <rect x="69" y="20" width="12" height="2.5" rx="1" fill="#222326" />
      </g>


      {/* ═══ Timeline — 6 bi-monthly markers (OUTSIDE clip so labels are fully visible) ═══ */}
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

    </svg>
  );
}

/**
 * DecisionIllustration — Google Business Profile (THE FINDO TAB — PREFERRED)
 *
 * Visual story in 3 seconds:
 *   "Someone searched → found a COMPLETE, TRUSTED, AVAILABLE business → ready to call NOW."
 *
 * This tab is the RICHEST, most COLORFUL, most ALIVE of all 3.
 * Tab 1 = RED (dead) → Tab 2 = ORANGE (stalled) → Tab 3 = GREEN (thriving)
 *
 * 5-Element Clarity Test:
 * 1. THE STORY: A complete business profile ready for contact
 * 2. THE CONTEXT: Found via a Google-style search bar
 * 3. THE EMOTION: Green everywhere = alive, open, verified, ready
 * 4. THE TEXTURE: Subtle map grid in background
 * 5. THE FRAME: Green ambient glow wrapping the card
 */
function DecisionIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">

      <defs>
        <linearGradient id="dec-card-border" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(56,136,57,0.4)" />
          <stop offset="50%" stopColor="rgba(56,136,57,0.15)" />
          <stop offset="100%" stopColor="rgba(56,136,57,0.35)" />
        </linearGradient>
        <linearGradient id="dec-cta-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(56,136,57,0.3)" />
          <stop offset="100%" stopColor="rgba(56,136,57,0.12)" />
        </linearGradient>
        <linearGradient id="dec-arrow-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#388839" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#388839" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id="dec-green-glow" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#388839" stopOpacity="0.16" />
          <stop offset="50%" stopColor="#388839" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#388839" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dec-photo-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1d20" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0e0f11" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="dec-pin-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a2b2f" />
          <stop offset="100%" stopColor="#1c1d20" />
        </linearGradient>
      </defs>

      {/* ═══ Background Map Grid (atmospheric) ═══ */}
      <g opacity="0.06">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={`vg-${i}`} x1={50 + i * 50} y1="0" x2={50 + i * 50} y2="260" stroke="#2a2b2f" strokeWidth="0.4" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`hg-${i}`} x1="0" y1={30 + i * 50} x2="400" y2={30 + i * 50} stroke="#2a2b2f" strokeWidth="0.4" />
        ))}
      </g>

      {/* ═══ Green ambient glow — PROMINENT, creates warmth ═══ */}
      <ellipse cx="195" cy="155" rx="200" ry="130" fill="url(#dec-green-glow)" />

      {/* ═══ Search Bar (Google-style pill) ═══ */}
      <g transform="translate(40, 2)">
        <rect x="0" y="0" width="320" height="46" rx="23" fill="#111214" stroke="#2a2b2f" strokeWidth="1" />
        {/* Magnifying glass — LARGE, clearly recognizable */}
        <circle cx="30" cy="22" r="10" stroke="#5a5b60" strokeWidth="2.2" fill="none" />
        <line x1="38" y1="30" x2="45" y2="37" stroke="#5a5b60" strokeWidth="2.2" strokeLinecap="round" />
        {/* Search query placeholder bars */}
        <rect x="58" y="11" width="160" height="9" rx="4" fill="#333538" />
        <rect x="58" y="26" width="95" height="7" rx="3" fill="#262728" />
      </g>

      {/* ═══ Connector — search → result (GREEN flow) ═══ */}
      <line x1="200" y1="53" x2="200" y2="74" stroke="url(#dec-arrow-grad)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M191 67 L200 78 L209 67" stroke="#388839" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />

      {/* ═══ Main Business Profile Card (THE HERO, ~65% of SVG) ═══ */}
      <g transform="translate(22, 82)">
        <rect x="0" y="0" width="304" height="170" rx="12" fill="#161719" stroke="url(#dec-card-border)" strokeWidth="1.8" />

        {/* ── Profile Photo Area ── */}
        <rect x="14" y="14" width="90" height="58" rx="8" fill="url(#dec-photo-grad)" stroke="#222326" strokeWidth="0.7" />
        <rect x="36" y="30" width="28" height="32" fill="#1c1d20" />
        <rect x="40" y="24" width="20" height="8" rx="2" fill="#222326" opacity="0.7" />
        <rect x="46" y="44" width="10" height="16" rx="2" fill="#161719" />

        {/* ── Business Name ── */}
        <rect x="118" y="16" width="138" height="14" rx="3" fill="#4a4b50" />

        {/* ── Verified Badge — LARGE green checkmark ── */}
        <circle cx="272" cy="23" r="15" fill="rgba(56,136,57,0.28)" stroke="rgba(56,136,57,0.6)" strokeWidth="1.5" />
        <path d="M264 23 L269 28.5 L280 16" stroke="#388839" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* ── Category line ── */}
        <rect x="118" y="36" width="105" height="7" rx="2" fill="#2a2b2f" />

        {/* ── 5 Gold Stars — warm, premium trust signal ── */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`star-${i}`} transform={`translate(${118 + i * 25}, 50)`}>
            <path
              d="M9.5 0.5 L12 6.8 L19 6.8 L13.5 11 L15.5 17.2 L9.5 13 L3.5 17.2 L5.5 11 L0 6.8 L7 6.8 Z"
              fill="#C19552"
              opacity="0.95"
            />
          </g>
        ))}
        {/* Review count pill */}
        <rect x="245" y="54" width="44" height="12" rx="6" fill="#1c1d20" stroke="#222326" strokeWidth="0.6" />
        <rect x="251" y="58" width="32" height="4" rx="2" fill="#4a4b50" opacity="0.7" />

        {/* ── Divider ── */}
        <line x1="14" y1="80" x2="290" y2="80" stroke="#222326" strokeWidth="0.7" />

        {/* ── "Open Now" Badge — GREEN, pulsing, ALIVE ── */}
        <g transform="translate(14, 92)">
          <rect x="0" y="0" width="116" height="36" rx="18" fill="#111214" stroke="rgba(56,136,57,0.45)" strokeWidth="1.3" />
          <circle cx="26" cy="18" r="10" fill="rgba(56,136,57,0.12)" />
          <circle cx="26" cy="18" r="7" fill="#388839" />
          <circle cx="26" cy="18" r="3.5" fill="#4caf50" opacity="0.7" />
          <rect x="42" y="11" width="62" height="10" rx="3" fill="#4a4b50" />
        </g>

        {/* ── "Call Now" CTA — GREEN, PRIMARY ACTION ── */}
        <g transform="translate(142, 92)">
          <rect x="0" y="0" width="148" height="36" rx="18" fill="url(#dec-cta-fill)" stroke="rgba(56,136,57,0.55)" strokeWidth="1.5" />
          <g transform="translate(14, 5) scale(1.15)">
            <path
              d="M0 4.5 C0 4.5 0.5 1.5 2.8 2.8 L5 4.2 C6 5 5.5 6.5 5 7 C5 7 6 9.5 8.5 12 C11 14.5 13.5 15.5 13.5 15.5 C14 15 15.5 14.5 16.3 15.5 L17.5 17 C18 18 16.5 19 16.5 19 C14 20 11 17.5 8 14.5 C5 11.5 3 8.5 2.5 6.5 C2 5 0 4.5 0 4.5 Z"
              fill="#388839"
              opacity="0.85"
            />
          </g>
          <rect x="44" y="12" width="72" height="10" rx="3" fill="#388839" opacity="0.5" />
          <path d="M116 18 L129 18 M125 12 L130 18 L125 24" stroke="#388839" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
        </g>

        {/* ── Rating summary bar (bottom) ── */}
        <g transform="translate(14, 142)">
          <rect x="0" y="0" width="276" height="22" rx="6" fill="#111214" stroke="#1c1d20" strokeWidth="0.5" />
          <path d="M18 5 L19.5 9 L23.5 9 L20.5 11.5 L21.5 15.5 L18 13 L14.5 15.5 L15.5 11.5 L12.5 9 L16.5 9 Z" fill="#C19552" opacity="0.75" />
          <rect x="28" y="7" width="28" height="7" rx="2" fill="#4a4b50" />
          <circle cx="64" cy="11" r="1.5" fill="#3a3b3f" />
          <rect x="72" y="7" width="48" height="7" rx="2" fill="#333538" />
          <circle cx="128" cy="11" r="1.5" fill="#3a3b3f" />
          <rect x="136" y="7" width="64" height="7" rx="2" fill="#2a2b2f" />
        </g>
      </g>

      {/* ═══ Map Pin — LARGE, vivid green marker ═══ */}
      <g transform="translate(338, 58) scale(1.5)">
        <ellipse cx="18" cy="52" rx="10" ry="3" fill="#0c0d0f" opacity="0.5" />
        <path
          d="M18 2 C11 2 5 8.5 5 15.5 C5 25 18 48 18 48 C18 48 31 25 31 15.5 C31 8.5 25 2 18 2 Z"
          fill="url(#dec-pin-body)"
          stroke="#3a3b3f"
          strokeWidth="1"
        />
        <circle cx="18" cy="15" r="8.5" fill="#161719" stroke="#3a3b3f" strokeWidth="0.7" />
        <circle cx="18" cy="15" r="6" fill="#388839" />
        <circle cx="18" cy="15" r="3" fill="#4caf50" opacity="0.7" />
      </g>

    </svg>
  );
}

/* ── Card Data ── */

interface CardData {
  id: string;
  tag?: string; // Only for Findo card
  Illustration: React.FC<{ className?: string }>;
  title: string;
  description: string;
  isFindo?: boolean;
}

const cards: CardData[] = [
  {
    id: "paid",
    Illustration: PaidAdIllustration,
    title: "שיווק ממומן",
    description: "מביא תנועה כשמפעילים - נעצר כשנגמר הכסף.",
  },
  {
    id: "organic",
    Illustration: OrganicIllustration,
    title: "שיווק אורגני",
    description: "מצוין לטווח ארוך, אבל דורש הרבה ידע ותפעול שוטף.",
  },
  {
    id: "findo",
    tag: "ההצעה של Findo",
    Illustration: DecisionIllustration,
    title: "חיפוש מקומי (גוגל ביזנס)",
    description: "לקוחות שכבר מחפשים פתרון מידיי וצריך רק ליצור רושם טוב, אמון וזמינות - והלקוח פונה.",
    isFindo: true,
  },
];

/* ── Card Component ── */

function Card({
  card,
  index,
  inView,
}: {
  card: CardData;
  index: number;
  inView: boolean;
}) {
  return (
    <m.article
      className={card.isFindo ? styles.cardFindo : styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.4,
        delay: 0.2 + index * 0.12,
        ease,
      }}
    >
      {/* Tag badge on card top edge (Findo only) */}
      {card.tag && <span className={styles.cardTag}>{card.tag}</span>}

      {/* Visual area — sophisticated monochrome illustration */}
      <div className={styles.cardVisual}>
        <card.Illustration className={styles.cardIllustration} />
      </div>

      {/* Text content area with title, description */}
      <div className={styles.cardContent}>
        <div className={styles.cardTextGroup}>
          <h3 className={styles.cardTitle}>{card.title}</h3>
          <p className={styles.cardDesc}>{card.description}</p>
        </div>
        <div className={styles.cardFooter}>
          <span />
          <button className={styles.cardExpand} aria-label="הרחב" type="button">+</button>
        </div>
      </div>
    </m.article>
  );
}

/* ── Main Component ── */

export function BigMistakeSection() {
  const headerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Section Header — Centered stacked layout */}
        <header ref={headerRef} className={styles.sectionHeader}>
          {/* Main title */}
          <m.h2
            className={styles.displayTitle}
            initial={{ opacity: 0, y: 8 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease }}
          >
            הטעות הגדולה
          </m.h2>

          {/* Subtitle */}
          <m.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 8 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.06, ease }}
          >
            של רוב העסקים הקטנים
          </m.p>

          {/* Explanation line */}
          <m.p
            className={styles.bodyText}
            initial={{ opacity: 0, y: 8 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.12, ease }}
          >
            רוב בעלי העסקים חושבים שיש רק שתי דרכים להביא לקוחות.
          </m.p>

          {/* Final emphasized line */}
          <m.p
            className={styles.accentText}
            initial={{ opacity: 0, y: 8 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.18, ease }}
          >
            אבל יש אפשרות שלישית!
          </m.p>
        </header>

        {/* Card Grid — NO separator, NO glows */}
        <div ref={gridRef} className={styles.grid}>
          {cards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              index={index}
              inView={gridInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BigMistakeSection;
