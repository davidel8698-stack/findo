"use client";

import { m } from "motion/react";
import { useBlockScroll } from "./useBlockScroll";
import { JourneyLine } from "./JourneyLine";
import styles from "./text-journey.module.css";

/* --------------------------------------------------------------------------
   TextBlock — scroll-linked animated block container

   Uses useBlockScroll for continuous scroll-linked opacity, y, blur, and
   optional scale (resolution variant). Each line gets staggered motion
   values via getLineStyle.

   Resolution variant uses word-level animation: each word in the single
   line gets its own scroll-linked opacity and y stagger for dramatic
   word-by-word reveal.
   -------------------------------------------------------------------------- */

interface TextBlockProps {
  lines: string[];
  variant?: "normal" | "resolution";
}

export function TextBlock({ lines, variant = "normal" }: TextBlockProps) {
  const { blockRef, blockStyle, getLineStyle, getWordStyle, resolutionLineStyle } =
    useBlockScroll({
      lineCount: lines.length,
      variant,
    });

  const blockClasses = [
    styles.block,
    variant === "resolution" ? styles.resolution : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Resolution: split the single line into words for word-level animation
  // Uses m.p to receive scroll-driven letterSpacing ("focusing" effect)
  if (variant === "resolution" && lines.length === 1) {
    const words = lines[0].split(" ");
    return (
      <m.div ref={blockRef} className={blockClasses} style={blockStyle}>
        <m.p
          className={`${styles.line} ${styles.resolutionWords}`}
          style={resolutionLineStyle}
        >
          {words.map((word, i) => (
            <m.span
              key={i}
              className={styles.resolutionWord}
              style={getWordStyle(i)}
            >
              {word}
            </m.span>
          ))}
        </m.p>
      </m.div>
    );
  }

  return (
    <m.div ref={blockRef} className={blockClasses} style={blockStyle}>
      {lines.map((line, index) => (
        <JourneyLine key={index} text={line} style={getLineStyle(index)} />
      ))}
    </m.div>
  );
}
