"use client";

import styles from "./scrollytelling.module.css";

interface GridPatternProps {
  /** Grid visibility intensity (0-1) */
  intensity?: number;
}

/**
 * Background grid pattern with accent dots at intersections
 * Inspired by Terminal Industries' geometric background
 */
export function GridPattern({ intensity = 0.3 }: GridPatternProps) {
  return (
    <div
      className={styles.grid}
      style={{ "--grid-intensity": intensity } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className={styles.gridLines} />
      <div className={styles.gridDots} />
    </div>
  );
}
