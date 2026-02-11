"use client";

import { m, useTransform, type MotionValue } from "motion/react";
import styles from "./text-journey.module.css";

/* --------------------------------------------------------------------------
   ProgressLine — Linear-style vertical progress indicator

   A thin vertical track with scroll-driven fill and node dots that sits
   to the left of the centered RTL text content. Each node represents a
   journey block and activates as the user scrolls past it.

   - Static track: 1px ghost line at barely-visible opacity
   - Active fill: scaleY(0→1) driven by sectionProgress, GPU-composited
   - 7 node dots: opacity transitions from ghost → active as scroll passes
   - Active node: subtle green glow ring
   - Hidden on tablet and below (not enough horizontal space)
   - Reduced motion: static track + all nodes visible, no fill animation
   -------------------------------------------------------------------------- */

// Approximate vertical positions of each block (as % of section height)
const NODE_POSITIONS = [8, 22, 36, 50, 62, 74, 90];

interface ProgressLineProps {
  sectionProgress: MotionValue<number>;
}

function ProgressNode({
  position,
  sectionProgress,
}: {
  position: number;
  sectionProgress: MotionValue<number>;
}) {
  // Threshold at which this node activates (slightly before its position)
  const threshold = position / 100;

  // Node opacity: ghost → active as scroll passes this position
  const opacity = useTransform(
    sectionProgress,
    [threshold - 0.06, threshold, threshold + 0.04],
    [0.06, 0.3, 0.4]
  );

  // Glow intensity: peaks when scroll is near this node, fades when passed
  const glowOpacity = useTransform(
    sectionProgress,
    [threshold - 0.06, threshold - 0.02, threshold + 0.02, threshold + 0.08],
    [0, 0, 0.6, 0]
  );

  return (
    <m.div
      className={styles.progressNode}
      style={{
        top: `${position}%`,
        opacity,
      }}
    >
      <m.div
        className={styles.progressNodeGlow}
        style={{ opacity: glowOpacity }}
      />
    </m.div>
  );
}

export function ProgressLine({ sectionProgress }: ProgressLineProps) {
  // Fill scaleY: 0 → 1 mapped to section scroll progress
  const fillScaleY = useTransform(sectionProgress, [0.02, 0.95], [0, 1]);

  // Fill color transitions from neutral to brand green as it approaches bottom
  const fillColor = useTransform(
    sectionProgress,
    [0, 0.5, 0.85, 1],
    [
      "rgba(148,150,152,0.15)",
      "rgba(148,150,152,0.15)",
      "rgba(56,136,57,0.25)",
      "rgba(56,136,57,0.25)",
    ]
  );

  return (
    <div className={styles.progressContainer} aria-hidden="true">
      {/* Static ghost track */}
      <div className={styles.progressTrack} />

      {/* Active fill — scaleY driven by scroll, GPU-composited */}
      <m.div
        className={styles.progressFill}
        style={{
          scaleY: fillScaleY,
          backgroundColor: fillColor,
        }}
      />

      {/* Node dots — one per journey block */}
      {NODE_POSITIONS.map((pos, i) => (
        <ProgressNode
          key={i}
          position={pos}
          sectionProgress={sectionProgress}
        />
      ))}
    </div>
  );
}
