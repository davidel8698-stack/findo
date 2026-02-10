"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import styles from "./scrollytelling.module.css";

/**
 * Typography size variants for different contexts
 */
type TypographySize = "massive" | "terminal";

interface SplitTextRevealProps {
  /** Text to reveal character by character */
  text: string;
  /** Scroll progress from 0 to 1 */
  progress: number;
  /** Typography size variant */
  size?: TypographySize;
  /** Additional CSS classes */
  className?: string;
  /** Whether text is emphasized (colored) */
  emphasis?: boolean;
}

/**
 * SplitTextReveal - Terminal-quality character-by-character text reveal
 *
 * Features:
 * - Hebrew RTL support with proper character flow
 * - Massive typography (up to 10rem)
 * - Scroll-synced character reveal
 * - Bouncy entrance animation
 * - GPU-accelerated transforms
 */
export function SplitTextReveal({
  text,
  progress,
  size = "massive",
  className,
  emphasis = false,
}: SplitTextRevealProps) {
  // Split text into words, then characters
  // This preserves word boundaries for better line breaking
  const words = useMemo(() => {
    return text.split(" ").map((word, wordIndex) => ({
      word,
      chars: word.split(""),
      startIndex: text
        .split(" ")
        .slice(0, wordIndex)
        .reduce((acc, w) => acc + w.length + 1, 0), // +1 for space
    }));
  }, [text]);

  // Total character count (including spaces)
  const totalChars = text.length;

  // Calculate which characters should be visible based on progress
  const getCharVisibility = (globalIndex: number): boolean => {
    // For Hebrew RTL, characters still reveal in reading order (right to left)
    // The CSS handles the visual RTL direction
    const revealThreshold = (globalIndex + 1) / totalChars;
    return progress >= revealThreshold;
  };

  // Track global character index across words
  let globalCharIndex = 0;

  return (
    <div
      className={cn(
        styles.splitTextContainer,
        size === "massive" && styles.splitTextMassive,
        size === "terminal" && styles.splitTextTerminal,
        emphasis && styles.emphasis,
        className
      )}
      dir="rtl"
      aria-label={text}
    >
      {words.map((wordData, wordIndex) => (
        <span key={wordIndex} className={styles.splitWord}>
          {wordData.chars.map((char, charIndex) => {
            const currentIndex = globalCharIndex++;
            const isVisible = getCharVisibility(currentIndex);

            return (
              <span
                key={`${wordIndex}-${charIndex}`}
                className={cn(
                  styles.splitChar,
                  isVisible && styles.visible
                )}
                aria-hidden={!isVisible}
              >
                {char}
              </span>
            );
          })}
          {/* Add space after word (except last word) */}
          {wordIndex < words.length - 1 && (
            <span
              className={cn(
                styles.splitChar,
                styles.splitCharSpace,
                getCharVisibility(globalCharIndex++) && styles.visible
              )}
              aria-hidden="true"
            >
              {"\u00A0"}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

/**
 * Multi-line split text reveal
 * Each line reveals sequentially based on progress
 */
interface SplitTextLinesProps {
  /** Array of text lines to reveal */
  lines: string[];
  /** Scroll progress from 0 to 1 */
  progress: number;
  /** Typography size variant */
  size?: TypographySize;
  /** Additional CSS classes */
  className?: string;
  /** Indices of lines to emphasize */
  emphasisLines?: number[];
}

export function SplitTextLines({
  lines,
  progress,
  size = "massive",
  className,
  emphasisLines = [],
}: SplitTextLinesProps) {
  // Calculate progress per line
  const getLineProgress = (lineIndex: number): number => {
    const lineStart = lineIndex / lines.length;
    const lineEnd = (lineIndex + 1) / lines.length;

    if (progress < lineStart) return 0;
    if (progress >= lineEnd) return 1;
    return (progress - lineStart) / (lineEnd - lineStart);
  };

  return (
    <div className={cn(styles.splitTextContainer, className)}>
      {lines.map((line, index) => (
        <SplitTextReveal
          key={index}
          text={line}
          progress={getLineProgress(index)}
          size={size}
          emphasis={emphasisLines.includes(index)}
        />
      ))}
    </div>
  );
}
