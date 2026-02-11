"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import {
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

/* --------------------------------------------------------------------------
   useBlockScroll — scroll-linked animation hook for TextJourney blocks

   Provides continuous scroll-linked motion values per block:
   - Block-level: opacity, y, blur (and scale for resolution variant)
   - Line-level: per-line staggered opacity and y

   Apple-level motion philosophy:
   - Minimal blur (2px max) — text materializes, not defocuses
   - Subtle translateY (30px) — directional cue, not a slide-in
   - Wide rest zone — text sits confidently at full visibility
   - Higher-damped springs — organic smoothing, zero bounce
   -------------------------------------------------------------------------- */

interface UseBlockScrollOptions {
  lineCount: number;
  variant: "normal" | "resolution";
}

interface BlockStyle {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  filter: MotionValue<string>;
  color: MotionValue<string>;
  scale?: MotionValue<number>;
}

interface LineStyle {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}

interface UseBlockScrollResult {
  blockRef: React.RefObject<HTMLDivElement | null>;
  blockStyle: BlockStyle;
  getLineStyle: (index: number) => LineStyle;
  getWordStyle: (index: number) => LineStyle;
  resolutionLineStyle?: { letterSpacing: MotionValue<string> };
}

// Spring configs — higher damping = smoother, zero bounce, organic settle
const SPRING_BLOCK_OPACITY = { stiffness: 90, damping: 35, mass: 0.5 };
const SPRING_BLOCK_Y = { stiffness: 110, damping: 32, mass: 0.5 };
const SPRING_RES_SCALE = { stiffness: 160, damping: 18, mass: 0.9 };
const SPRING_LINE_Y = { stiffness: 90, damping: 28, mass: 0.3 };

// Mobile detection hook — defaults to false (desktop) for SSR hydration safety
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);
  return isMobile;
}

export function useBlockScroll({
  lineCount,
  variant,
}: UseBlockScrollOptions): UseBlockScrollResult {
  const blockRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: ["start end", "end start"],
  });

  // --- Normal block keyframes ---
  // Wider rest zone [0.3–0.7] = text holds visible longer, feels confident
  // Reduced translateY and blur = materialization, not slide-in
  const normalKeyframes = isMobile
    ? {
        scrollKeys: [0.0, 0.15, 0.3, 0.7, 0.85, 1.0],
        opacity: [0.0, 0.0, 1.0, 1.0, 0.0, 0.0],
        y: [20, 20, 0, 0, -8, -8],
        blur: [1, 1, 0, 0, 0, 0],
      }
    : {
        scrollKeys: [0.0, 0.12, 0.3, 0.7, 0.88, 1.0],
        opacity: [0.0, 0.0, 1.0, 1.0, 0.0, 0.0],
        y: [30, 30, 0, 0, -15, -15],
        blur: [2, 2, 0, 0, 1, 1],
      };

  // --- Resolution block keyframes ---
  // More delayed entry (0.3) = longer anticipation before climax
  // Reduced translateY (50px) and blur (4px) = more focused arrival
  const resolutionKeyframes = isMobile
    ? {
        scrollKeys: [0.0, 0.25, 0.5, 0.85, 1.0],
        opacity: [0.0, 0.0, 1.0, 1.0, 1.0],
        y: [25, 25, 0, 0, 0],
        blur: [2, 2, 0, 0, 0],
      }
    : {
        scrollKeys: [0.0, 0.3, 0.55, 0.85, 1.0],
        opacity: [0.0, 0.0, 1.0, 1.0, 1.0],
        y: [50, 50, 0, 0, 0],
        blur: [4, 4, 0, 0, 0],
      };

  const kf = variant === "resolution" ? resolutionKeyframes : normalKeyframes;

  // Block-level motion values
  const rawOpacity = useTransform(scrollYProgress, kf.scrollKeys, kf.opacity);
  const opacity = useSpring(rawOpacity, SPRING_BLOCK_OPACITY);

  const rawY = useTransform(scrollYProgress, kf.scrollKeys, kf.y);
  const y = useSpring(rawY, SPRING_BLOCK_Y);

  const rawBlur = useTransform(scrollYProgress, kf.scrollKeys, kf.blur);
  const filter = useMotionTemplate`blur(${rawBlur}px)`;

  // Color illumination — text brightens from muted charcoal as it enters
  // Normal blocks: dim gray → secondary gray → bright white (symmetric enter/exit)
  // Resolution: dim → green-tinted mid-tone → bright white (no exit fade)
  const colorKeyframes =
    variant === "resolution"
      ? isMobile
        ? {
            keys: [0.0, 0.25, 0.38, 0.5, 0.85, 1.0],
            values: [
              "rgb(55, 57, 58)",
              "rgb(55, 57, 58)",
              "rgb(100, 140, 100)",
              "rgb(254, 255, 254)",
              "rgb(254, 255, 254)",
              "rgb(254, 255, 254)",
            ],
          }
        : {
            keys: [0.0, 0.3, 0.42, 0.55, 0.85, 1.0],
            values: [
              "rgb(55, 57, 58)",
              "rgb(55, 57, 58)",
              "rgb(100, 140, 100)",
              "rgb(254, 255, 254)",
              "rgb(254, 255, 254)",
              "rgb(254, 255, 254)",
            ],
          }
      : isMobile
        ? {
            keys: [0.0, 0.15, 0.25, 0.3, 0.7, 0.85, 1.0],
            values: [
              "rgb(55, 57, 58)",
              "rgb(55, 57, 58)",
              "rgb(120, 122, 124)",
              "rgb(254, 255, 254)",
              "rgb(254, 255, 254)",
              "rgb(120, 122, 124)",
              "rgb(55, 57, 58)",
            ],
          }
        : {
            keys: [0.0, 0.12, 0.22, 0.3, 0.7, 0.88, 1.0],
            values: [
              "rgb(55, 57, 58)",
              "rgb(55, 57, 58)",
              "rgb(120, 122, 124)",
              "rgb(254, 255, 254)",
              "rgb(254, 255, 254)",
              "rgb(120, 122, 124)",
              "rgb(55, 57, 58)",
            ],
          };

  const color = useTransform(
    scrollYProgress,
    colorKeyframes.keys,
    colorKeyframes.values
  );

  // Resolution scale (desktop only) — 0.92 -> 1.0
  // No overshoot — controlled, confident arrival (Apple-level restraint)
  const rawScale = useTransform(
    scrollYProgress,
    [0.3, 0.55, 0.65],
    variant === "resolution" && !isMobile ? [0.92, 1.0, 1.0] : [1.0, 1.0, 1.0]
  );
  const scale = useSpring(rawScale, SPRING_RES_SCALE);

  // Resolution letter-spacing — subtle "focusing" as text materializes
  // Starts tighter (-0.04em) and relaxes to final tracking (-0.03em)
  const rawLetterSpacing = useTransform(
    scrollYProgress,
    [0.3, 0.55, 0.65],
    variant === "resolution" && !isMobile
      ? ["-0.04em", "-0.03em", "-0.03em"]
      : ["-0.02em", "-0.02em", "-0.02em"]
  );

  // Line stagger config — slightly wider stagger for more pronounced cascade
  const LINE_STAGGER = isMobile ? 0.02 : 0.035;
  const lineEntryY = isMobile ? 10 : 15;
  const lineExitY = isMobile ? -5 : -8;

  // Word stagger config — wider than line stagger for dramatic resolution reveal
  // Each word gets its own moment: "הגעתם" ... "למקום" ... "הנכון."
  const WORD_STAGGER = isMobile ? 0.04 : 0.07;
  const WORD_COUNT = 3; // "הגעתם" "למקום" "הנכון."
  const wordEntryY = isMobile ? 15 : 28;

  // Pre-compute line styles for all lines in this block
  const lineTransforms = useMemo(() => {
    const transforms: Array<{
      opacityKeys: number[];
      opacityValues: number[];
      yKeys: number[];
      yValues: number[];
    }> = [];

    for (let i = 0; i < lineCount; i++) {
      const offset = i * LINE_STAGGER;

      if (variant === "resolution") {
        // Resolution lines: stagger enter only, no exit
        transforms.push({
          opacityKeys: [0.3 + offset, 0.55 + offset, 0.85, 1.0],
          opacityValues: [0.0, 1.0, 1.0, 1.0],
          yKeys: [0.3 + offset, 0.55 + offset, 0.85, 1.0],
          yValues: [lineEntryY, 0, 0, 0],
        });
      } else {
        // Normal lines: stagger both enter and exit
        transforms.push({
          opacityKeys: [
            0.12 + offset,
            0.3 + offset,
            0.7 - offset,
            0.88 - offset,
          ],
          opacityValues: [0.0, 1.0, 1.0, 0.0],
          yKeys: [
            0.12 + offset,
            0.3 + offset,
            0.7 - offset,
            0.88 - offset,
          ],
          yValues: [lineEntryY, 0, 0, lineExitY],
        });
      }
    }

    return transforms;
  }, [lineCount, LINE_STAGGER, variant, lineEntryY, lineExitY]);

  // Individual line scroll transforms — must be called unconditionally
  const line0Opacity = useTransform(
    scrollYProgress,
    lineTransforms[0]?.opacityKeys ?? [0, 1],
    lineTransforms[0]?.opacityValues ?? [1, 1]
  );
  const line0Y = useTransform(
    scrollYProgress,
    lineTransforms[0]?.yKeys ?? [0, 1],
    lineTransforms[0]?.yValues ?? [0, 0]
  );
  const line0SmoothY = useSpring(line0Y, SPRING_LINE_Y);

  const line1Opacity = useTransform(
    scrollYProgress,
    lineTransforms[1]?.opacityKeys ?? [0, 1],
    lineTransforms[1]?.opacityValues ?? [1, 1]
  );
  const line1Y = useTransform(
    scrollYProgress,
    lineTransforms[1]?.yKeys ?? [0, 1],
    lineTransforms[1]?.yValues ?? [0, 0]
  );
  const line1SmoothY = useSpring(line1Y, SPRING_LINE_Y);

  const line2Opacity = useTransform(
    scrollYProgress,
    lineTransforms[2]?.opacityKeys ?? [0, 1],
    lineTransforms[2]?.opacityValues ?? [1, 1]
  );
  const line2Y = useTransform(
    scrollYProgress,
    lineTransforms[2]?.yKeys ?? [0, 1],
    lineTransforms[2]?.yValues ?? [0, 0]
  );
  const line2SmoothY = useSpring(line2Y, SPRING_LINE_Y);

  const line3Opacity = useTransform(
    scrollYProgress,
    lineTransforms[3]?.opacityKeys ?? [0, 1],
    lineTransforms[3]?.opacityValues ?? [1, 1]
  );
  const line3Y = useTransform(
    scrollYProgress,
    lineTransforms[3]?.yKeys ?? [0, 1],
    lineTransforms[3]?.yValues ?? [0, 0]
  );
  const line3SmoothY = useSpring(line3Y, SPRING_LINE_Y);

  // Store all line styles in an array for index lookup
  const allLineStyles: LineStyle[] = [
    { opacity: line0Opacity, y: line0SmoothY },
    { opacity: line1Opacity, y: line1SmoothY },
    { opacity: line2Opacity, y: line2SmoothY },
    { opacity: line3Opacity, y: line3SmoothY },
  ];

  // --- Word-level transforms for resolution block ---
  // Each word gets its own staggered opacity and y for dramatic word-by-word reveal
  const wordTransforms = useMemo(() => {
    const transforms: Array<{
      opacityKeys: number[];
      opacityValues: number[];
      yKeys: number[];
      yValues: number[];
    }> = [];

    for (let i = 0; i < WORD_COUNT; i++) {
      const offset = i * WORD_STAGGER;
      transforms.push({
        opacityKeys: [0.3 + offset, 0.55 + offset, 0.85, 1.0],
        opacityValues: [0.0, 1.0, 1.0, 1.0],
        yKeys: [0.3 + offset, 0.55 + offset, 0.85, 1.0],
        yValues: [wordEntryY, 0, 0, 0],
      });
    }

    return transforms;
  }, [WORD_STAGGER, wordEntryY]);

  const word0Opacity = useTransform(
    scrollYProgress,
    wordTransforms[0]?.opacityKeys ?? [0, 1],
    wordTransforms[0]?.opacityValues ?? [1, 1]
  );
  const word0Y = useTransform(
    scrollYProgress,
    wordTransforms[0]?.yKeys ?? [0, 1],
    wordTransforms[0]?.yValues ?? [0, 0]
  );
  const word0SmoothY = useSpring(word0Y, SPRING_LINE_Y);

  const word1Opacity = useTransform(
    scrollYProgress,
    wordTransforms[1]?.opacityKeys ?? [0, 1],
    wordTransforms[1]?.opacityValues ?? [1, 1]
  );
  const word1Y = useTransform(
    scrollYProgress,
    wordTransforms[1]?.yKeys ?? [0, 1],
    wordTransforms[1]?.yValues ?? [0, 0]
  );
  const word1SmoothY = useSpring(word1Y, SPRING_LINE_Y);

  const word2Opacity = useTransform(
    scrollYProgress,
    wordTransforms[2]?.opacityKeys ?? [0, 1],
    wordTransforms[2]?.opacityValues ?? [1, 1]
  );
  const word2Y = useTransform(
    scrollYProgress,
    wordTransforms[2]?.yKeys ?? [0, 1],
    wordTransforms[2]?.yValues ?? [0, 0]
  );
  const word2SmoothY = useSpring(word2Y, SPRING_LINE_Y);

  const allWordStyles: LineStyle[] = [
    { opacity: word0Opacity, y: word0SmoothY },
    { opacity: word1Opacity, y: word1SmoothY },
    { opacity: word2Opacity, y: word2SmoothY },
  ];

  // Static motion values for reduced motion fallback
  const staticOpacity = useMotionValue(1);
  const staticY = useMotionValue(0);
  const staticFilter = useMotionValue("blur(0px)");
  const staticColor = useMotionValue("rgb(254, 255, 254)");
  const staticLetterSpacing = useMotionValue("-0.03em");

  // Reduced motion: return static values — no scroll tracking, no springs
  if (prefersReducedMotion) {
    return {
      blockRef,
      blockStyle: {
        opacity: staticOpacity,
        y: staticY,
        filter: staticFilter,
        color: staticColor,
      },
      getLineStyle: () => ({
        opacity: staticOpacity,
        y: staticY,
      }),
      getWordStyle: () => ({
        opacity: staticOpacity,
        y: staticY,
      }),
      resolutionLineStyle:
        variant === "resolution"
          ? { letterSpacing: staticLetterSpacing }
          : undefined,
    };
  }

  const blockStyle: BlockStyle = {
    opacity,
    y,
    filter,
    color,
  };

  if (variant === "resolution" && !isMobile) {
    blockStyle.scale = scale;
  }

  const getLineStyle = (index: number): LineStyle => {
    if (index < allLineStyles.length) {
      return allLineStyles[index];
    }
    return allLineStyles[allLineStyles.length - 1];
  };

  const getWordStyle = (index: number): LineStyle => {
    if (index < allWordStyles.length) {
      return allWordStyles[index];
    }
    return allWordStyles[allWordStyles.length - 1];
  };

  return {
    blockRef,
    blockStyle,
    getLineStyle,
    getWordStyle,
    resolutionLineStyle:
      variant === "resolution" && !isMobile
        ? { letterSpacing: rawLetterSpacing }
        : undefined,
  };
}
