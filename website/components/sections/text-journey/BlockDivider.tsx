"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import styles from "./text-journey.module.css";

interface BlockDividerProps {
  isMobile: boolean;
}

export function BlockDivider({ isMobile }: BlockDividerProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Center dot appears first
  const dotOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.35, 0.7, 0.85],
    [0, 0.5, 0.5, 0]
  );

  // Line extends from center outward
  const lineScaleX = useTransform(
    scrollYProgress,
    [0.25, 0.45, 0.65, 0.8],
    [0, 1, 1, 0]
  );

  const lineOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.4, 0.65, 0.8],
    [0, 0.12, 0.12, 0]
  );

  if (isMobile) {
    // Mobile: just a subtle static-animated dot
    return (
      <m.div ref={ref} className={styles.dividerContainer}>
        <m.div className={styles.dividerDot} style={{ opacity: dotOpacity }} />
      </m.div>
    );
  }

  return (
    <m.div ref={ref} className={styles.dividerContainer}>
      <m.div className={styles.dividerDot} style={{ opacity: dotOpacity }} />
      <m.div
        className={styles.dividerLine}
        style={{ scaleX: lineScaleX, opacity: lineOpacity }}
      />
    </m.div>
  );
}
