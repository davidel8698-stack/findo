/**
 * Reusable Motion variants for consistent animations
 * Uses spring physics for playful character
 */

import { Variants } from "motion/react";
import { springBouncy, springGentle, springSnappy, stagger } from "@/lib/animation";

// Fade up - most common entrance animation
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: springGentle,
  },
};

// Fade in from different directions
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: springGentle },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: springGentle },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: springGentle },
};

// Scale in - for emphasis
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springBouncy,
  },
};

// Pop - bouncy scale for micro-interactions
export const pop: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: springBouncy,
  },
  tap: { scale: 0.95 },
  hover: { scale: 1.02 },
};

// Stagger container - orchestrates children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.normal,
      delayChildren: 0.1,
    },
  },
};

// Fast stagger for dense content
export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.fast,
      delayChildren: 0.05,
    },
  },
};

// Slow stagger for theatrical effect
export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.slow,
      delayChildren: 0.2,
    },
  },
};

// ===== HOVER VARIANTS =====

// Button hover - playful scale with spring
export const buttonHover: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: springBouncy,
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

// Card hover - elevation with shadow
export const cardHover: Variants = {
  initial: {
    y: 0,
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)",
  },
  hover: {
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
    transition: springGentle,
  },
};

// Icon spin on hover (for decorative icons)
export const iconSpin: Variants = {
  initial: { rotate: 0 },
  hover: {
    rotate: 15,
    transition: springBouncy,
  },
};

// Link underline expand
export const linkUnderline: Variants = {
  initial: { width: 0 },
  hover: {
    width: "100%",
    transition: { duration: 0.2 },
  },
};

// Bounce in (for attention-grabbing elements)
export const bounceIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      ...springBouncy,
      opacity: { duration: 0.2 },
    },
  },
};

// Slide in from side (RTL-aware)
export const slideInEnd: Variants = {
  hidden: {
    opacity: 0,
    x: 50, // Positive = from end in RTL
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: springGentle,
  },
};

export const slideInStart: Variants = {
  hidden: {
    opacity: 0,
    x: -50, // Negative = from start in RTL
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: springGentle,
  },
};
