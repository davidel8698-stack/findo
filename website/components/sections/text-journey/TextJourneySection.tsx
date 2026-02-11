"use client";

import { useRef, useState, useEffect, Fragment } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { TextBlock } from "./TextBlock";
import { BlockDivider } from "./BlockDivider";
import { ProgressLine } from "./ProgressLine";
import styles from "./text-journey.module.css";

/* --------------------------------------------------------------------------
   TextJourneySection — cinematic scroll-driven text reveal

   Section-level responsibilities:
   - Section scroll tracking for atmospheric effects
   - Ambient light that follows scroll position (wider, softer)
   - Resolution glow that builds toward the emotional climax
   - Edge gradient masks (CSS-only, multi-stop, top and bottom)
   - Data for all journey blocks

   Block and line animation is handled by TextBlock + useBlockScroll.
   -------------------------------------------------------------------------- */

interface JourneyBlockData {
  id: string;
  lines: string[];
}

const journeyBlocks: JourneyBlockData[] = [
  {
    id: "hook",
    lines: [
      "אם הגעתם לכאן",
      "יתכן שמשהו בשיווק של העסק שלכם",
      "לא מרגיש יציב.",
    ],
  },
  {
    id: "pain",
    lines: ["יש תקופות עם פניות", "ויש תקופות שפחות."],
  },
  {
    id: "confusion",
    lines: [
      "לא תמיד ברור:",
      "מה באמת מביא לקוחות",
      "על מה שווה להשקיע",
      "ומה סתם רעש",
    ],
  },
  {
    id: "problem",
    lines: ["רוב הפתרונות דורשים", "הרבה כסף, ניהול שוטף וידע."],
  },
  {
    id: "mismatch",
    lines: ["וזה לא מותאם לאופן שבו", "עסק קטן באמת מתנהל."],
  },
  {
    id: "tease",
    lines: [
      "אם אתם מחפשים שיווק",
      "שלא יצריך ממכם התעסקות בשוטף.",
    ],
  },
];

const resolution: JourneyBlockData = {
  id: "resolution",
  lines: ["הגעתם למקום הנכון."],
};

// Mobile detection — defaults to false (desktop) for SSR hydration safety
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);
  return isMobile;
}

export function TextJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  // Section-level scroll progress for atmospheric effects
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Ambient light — follows scroll position vertically
  // Smoother opacity curve: ramps up gently, holds, fades gently
  const ambientY = useTransform(sectionProgress, [0, 1], ["0%", "100%"]);
  const ambientOpacity = useTransform(
    sectionProgress,
    [0, 0.08, 0.15, 0.85, 0.92, 1],
    [0, 0, 0.35, 0.35, 0, 0]
  );

  // Resolution glow — builds gradually as user approaches the climax
  // Earlier start (0.62) builds subconscious anticipation before text appears
  // Higher peak (0.14) for more dramatic green atmospheric shift
  const resGlowOpacity = useTransform(
    sectionProgress,
    [0.62, 0.78, 0.88, 1.0],
    [0.0, 0.06, 0.14, 0.0]
  );

  // Inner resolution glow — concentrated core for dimensional light effect
  // Earlier start and stronger peak for more pronounced luminance center
  const resGlowInnerOpacity = useTransform(
    sectionProgress,
    [0.65, 0.80, 0.9, 1.0],
    [0.0, 0.08, 0.18, 0.0]
  );

  // Deep ambient light — wider, softer companion to primary ambient
  // Offset slightly behind primary for depth layering
  const deepAmbientY = useTransform(sectionProgress, [0, 1], ["5%", "95%"]);
  const deepAmbientOpacity = useTransform(
    sectionProgress,
    [0, 0.1, 0.2, 0.8, 0.9, 1],
    [0, 0, 0.25, 0.25, 0, 0]
  );

  // Color temperature shift — subtle warmth builds toward resolution
  // Ramps from 0 to 0.025 peak, creating subliminal emotional warmth
  const warmthOpacity = useTransform(
    sectionProgress,
    [0, 0.4, 0.75, 0.9, 1.0],
    [0, 0, 0.015, 0.025, 0]
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Film grain — CSS-only noise texture (all viewports, zero GPU cost) */}
      <div className={styles.grain} />

      {/* Cinematic vignette — edge darkening (desktop only) */}
      {!isMobile && <div className={styles.vignette} />}

      <div className={styles.topMask} />

      {/* Ambient light — scroll-reactive glow (desktop only) */}
      {!isMobile && (
        <m.div
          className={styles.ambientLight}
          style={{ top: ambientY, opacity: ambientOpacity }}
        />
      )}

      {/* Deep ambient light — wider atmospheric layer (desktop only) */}
      {!isMobile && (
        <m.div
          className={styles.deepAmbientLight}
          style={{ top: deepAmbientY, opacity: deepAmbientOpacity }}
        />
      )}

      {/* Progress line — vertical journey indicator (desktop only) */}
      {!isMobile && <ProgressLine sectionProgress={sectionProgress} />}

      {journeyBlocks.map((block, index) => (
        <Fragment key={block.id}>
          <TextBlock lines={block.lines} />
          {index < journeyBlocks.length - 1 && (
            <BlockDivider isMobile={isMobile} />
          )}
        </Fragment>
      ))}
      <TextBlock lines={resolution.lines} variant="resolution" />

      {/* Color temperature shift — subtle warmth toward resolution (desktop only) */}
      {!isMobile && (
        <m.div
          className={styles.warmthOverlay}
          style={{ opacity: warmthOpacity }}
        />
      )}

      {/* Resolution glow — green-tinted aura (desktop only) */}
      {!isMobile && (
        <m.div
          className={styles.resolutionGlow}
          style={{ opacity: resGlowOpacity }}
        />
      )}

      {/* Resolution inner glow — concentrated green core (desktop only) */}
      {!isMobile && (
        <m.div
          className={styles.resolutionGlowInner}
          style={{ opacity: resGlowInnerOpacity }}
        />
      )}

      <div className={styles.bottomMask} />
    </section>
  );
}
