"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import styles from "./scrollytelling.module.css";

interface TypewriterTextProps {
  /** Text to display with typewriter effect */
  text: string;
  /** Progress from 0 to 1 controlling visible characters */
  progress: number;
  /** Additional CSS classes */
  className?: string;
  /** Whether this line should have emphasis styling */
  emphasis?: boolean;
}

/**
 * Scroll-driven typewriter text reveal for Hebrew (RTL)
 * Characters reveal from right to left as progress increases
 */
export function TypewriterText({
  text,
  progress,
  className,
  emphasis = false,
}: TypewriterTextProps) {
  // Split text into characters, preserving spaces
  const chars = useMemo(() => text.split(""), [text]);

  // Calculate how many characters should be visible
  const visibleCount = Math.floor(chars.length * Math.min(1, Math.max(0, progress)));

  return (
    <span
      className={cn(
        styles.typewriter,
        styles.phaseLine,
        emphasis && styles.emphasis,
        className
      )}
      dir="rtl"
    >
      {chars.map((char, i) => {
        const isVisible = i < visibleCount;
        const isCurrent = i === visibleCount && progress < 1;

        return (
          <span
            key={i}
            className={cn(
              styles.char,
              isVisible && styles.visible,
              isCurrent && styles.current
            )}
          >
            {/* Use non-breaking space for actual spaces to preserve them */}
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </span>
  );
}

interface TypewriterLinesProps {
  /** Array of text lines to display */
  lines: string[];
  /** Progress from 0 to 1 for the entire block */
  progress: number;
  /** Additional CSS classes for the container */
  className?: string;
  /** Indices of lines that should have emphasis */
  emphasisLines?: number[];
}

/**
 * Multiple lines with typewriter effect
 * Each line starts after the previous one completes
 */
export function TypewriterLines({
  lines,
  progress,
  className,
  emphasisLines = [],
}: TypewriterLinesProps) {
  // Calculate total character count for progress distribution
  const totalChars = useMemo(
    () => lines.reduce((sum, line) => sum + line.length, 0),
    [lines]
  );

  // Calculate progress for each line
  const lineProgresses = useMemo(() => {
    let charsSoFar = 0;
    const totalProgress = progress * totalChars;

    return lines.map((line) => {
      const lineStart = charsSoFar;
      const lineEnd = charsSoFar + line.length;
      charsSoFar = lineEnd;

      if (totalProgress <= lineStart) return 0;
      if (totalProgress >= lineEnd) return 1;
      return (totalProgress - lineStart) / line.length;
    });
  }, [lines, progress, totalChars]);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {lines.map((line, i) => (
        <TypewriterText
          key={i}
          text={line}
          progress={lineProgresses[i]}
          emphasis={emphasisLines.includes(i)}
        />
      ))}
    </div>
  );
}
