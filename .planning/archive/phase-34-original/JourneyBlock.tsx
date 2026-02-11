"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import styles from "./text-journey.module.css";

interface JourneyBlockProps {
  lines: string[];
  variant?: "normal" | "resolution";
  className?: string;
}

// Split Hebrew text into words
function splitIntoWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

// Calculate visual properties from progress (0-1)
// Creates "spotlight" effect: peak visibility at center of viewport
function calculateVisuals(progress: number) {
  // Spotlight curve: peak at 0.5
  const distanceFromCenter = Math.abs(progress - 0.5) * 2; // 0 at center, 1 at edges

  // Ease the curve for smoother transitions
  const eased = 1 - Math.pow(distanceFromCenter, 1.5);

  return {
    opacity: 0.15 + eased * 0.85, // 0.15 → 1.0 → 0.15
    blur: 10 * (1 - eased), // 10px → 0 → 10px
    scale: 0.94 + eased * 0.06, // 0.94 → 1.0 → 0.94
    y:
      progress < 0.5
        ? 30 * (1 - progress * 2) // +30 → 0
        : -20 * (progress - 0.5) * 2, // 0 → -20
  };
}

export function JourneyBlock({
  lines,
  variant = "normal",
  className,
}: JourneyBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Set up ScrollTrigger for this block
  useEffect(() => {
    if (!blockRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setProgress(0.5); // Show at full visibility
      setHasScrolled(true);
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: blockRef.current,
      start: "top 85%",
      end: "bottom 15%",
      scrub: variant === "resolution" ? 0.5 : 0.3, // Slower for resolution
      onUpdate: (self) => {
        setProgress(self.progress);
        if (!hasScrolled && self.progress > 0) {
          setHasScrolled(true);
        }
      },
    });

    return () => trigger.kill();
  }, [variant, hasScrolled]);

  // Calculate visual properties from scroll progress
  const visuals = useMemo(() => calculateVisuals(progress), [progress]);

  // Flatten all words with global index for stagger calculation
  const wordsWithIndices = useMemo(() => {
    const result: Array<{
      word: string;
      lineIndex: number;
      globalIndex: number;
    }> = [];
    let globalIndex = 0;

    lines.forEach((line, lineIndex) => {
      splitIntoWords(line).forEach((word) => {
        result.push({ word, lineIndex, globalIndex: globalIndex++ });
      });
    });

    return result;
  }, [lines]);

  // Group words by line for rendering
  const lineGroups = useMemo(() => {
    const groups: Map<number, typeof wordsWithIndices> = new Map();
    wordsWithIndices.forEach((item) => {
      if (!groups.has(item.lineIndex)) {
        groups.set(item.lineIndex, []);
      }
      groups.get(item.lineIndex)!.push(item);
    });
    return groups;
  }, [wordsWithIndices]);

  return (
    <div
      ref={blockRef}
      className={cn(
        styles.block,
        variant === "resolution" && styles.resolution,
        hasScrolled && styles.scrolled,
        className
      )}
      style={{
        opacity: visuals.opacity,
        filter: `blur(${visuals.blur}px)`,
        transform: `translateY(${visuals.y}px) scale(${visuals.scale})`,
        // GPU acceleration
        willChange: "opacity, filter, transform",
      }}
    >
      {Array.from(lineGroups.entries()).map(([lineIndex, words]) => (
        <p key={lineIndex} className={styles.line}>
          {words.map(({ word, globalIndex }) => {
            // Line-level stagger: all words in a line appear together
            const wordProgress = Math.max(
              0,
              Math.min(1, progress * 2.5 - lineIndex * 0.15)
            );
            const wordOpacity = hasScrolled ? wordProgress : 0;

            return (
              <span
                key={globalIndex}
                className={styles.word}
                style={{
                  opacity: wordOpacity,
                  transform: `translateY(${(1 - wordOpacity) * 12}px)`,
                }}
              >
                {word}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
