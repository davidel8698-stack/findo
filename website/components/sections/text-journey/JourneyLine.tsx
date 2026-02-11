"use client";

import { m, type MotionValue } from "motion/react";
import styles from "./text-journey.module.css";

interface JourneyLineProps {
  text: string;
  style: {
    opacity: MotionValue<number>;
    y: MotionValue<number>;
  };
}

export function JourneyLine({ text, style }: JourneyLineProps) {
  return (
    <m.p className={styles.line} style={style}>
      {text}
    </m.p>
  );
}
