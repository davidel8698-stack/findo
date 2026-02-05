"use client";

import { type ReactNode } from "react";
import { m, type Variants, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { sectionViewport } from "@/lib/animation";
import {
  fadeInRise,
  reducedMotionFade,
} from "./variants";

type SectionPersonality = "fade" | "scaleIn";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  /** Section personality - default 'fade' */
  personality?: SectionPersonality;
  /** Trigger threshold (0-1) - default 0.2 per CONTEXT.md */
  threshold?: number;
  /** Stagger delay between children (ms) - default 65ms per CONTEXT.md */
  staggerMs?: number;
  /** Disable stagger for single-child sections */
  noStagger?: boolean;
}

/**
 * SectionReveal - Scroll-triggered section reveal with personality
 *
 * Implements CONTEXT.md scroll reveal behavior:
 * - Early trigger (20-30% visible)
 * - Animate once only
 * - Fast cascade (50-75ms) stagger
 * - Reduced motion fallback
 */
export function SectionReveal({
  children,
  className,
  personality = "fade",
  threshold = sectionViewport.amount,
  staggerMs = 65,
  noStagger = false,
}: SectionRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: noStagger
        ? {}
        : {
            staggerChildren: prefersReducedMotion ? 0.05 : staggerMs / 1000,
            delayChildren: 0.1,
          },
    },
  };

  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true, // Per CONTEXT.md: animate once only
        amount: threshold,
        margin: "-50px",
      }}
      variants={containerVariants}
      className={cn(className)}
    >
      {children}
    </m.div>
  );
}

interface SectionRevealItemProps {
  children: ReactNode;
  className?: string;
  /** Custom variants override */
  variants?: Variants;
}

/**
 * SectionRevealItem - Child element that animates within SectionReveal
 *
 * Uses fadeInRise by default (30px rise + fade)
 * Respects parent's stagger timing
 */
export function SectionRevealItem({
  children,
  className,
  variants,
}: SectionRevealItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const activeVariants =
    variants ?? (prefersReducedMotion ? reducedMotionFade : fadeInRise);

  return (
    <m.div variants={activeVariants} className={cn(className)}>
      {children}
    </m.div>
  );
}
