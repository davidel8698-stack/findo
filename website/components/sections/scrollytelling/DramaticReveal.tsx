"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import styles from "./scrollytelling.module.css";

interface DramaticRevealProps {
  /** Text to reveal dramatically */
  text: string;
  /** Progress from 0 to 1 */
  progress: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Dramatic large letter reveal for the finale
 * Letters appear one by one with scale and glow effects
 * "הגעתם למקום הנכון." in Hebrew RTL
 */
export function DramaticReveal({
  text,
  progress,
  className,
}: DramaticRevealProps) {
  // Split text into characters (including spaces)
  const chars = useMemo(() => text.split(""), [text]);

  // Calculate which characters should be visible
  // Use a staggered reveal - each character takes 1/chars.length of progress
  const getCharProgress = (index: number) => {
    const charStart = index / chars.length;
    const charEnd = (index + 1) / chars.length;

    if (progress < charStart) return 0;
    if (progress >= charEnd) return 1;
    return (progress - charStart) / (charEnd - charStart);
  };

  // Determine if reveal is active (started) and complete
  const isActive = progress > 0;
  const isComplete = progress >= 1;

  return (
    <div
      className={cn(
        styles.dramaticReveal,
        isActive && styles.active,
        isComplete && styles.complete,
        className
      )}
      dir="rtl"
      aria-label={text}
    >
      <div className={styles.dramaticText}>
        {chars.map((char, i) => {
          const charProgress = getCharProgress(i);
          const isVisible = charProgress > 0.5; // Snap visibility at 50%
          const isSpace = char === " ";

          return (
            <span
              key={i}
              className={cn(
                styles.dramaticLetter,
                isVisible && styles.visible,
                isSpace && styles.space
              )}
              style={{
                transitionDelay: `${i * 0.05}s`,
              }}
              aria-hidden={!isVisible}
            >
              {isSpace ? "\u00A0" : char}
            </span>
          );
        })}
      </div>
    </div>
  );
}
