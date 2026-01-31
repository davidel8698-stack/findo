/**
 * Animation constants and spring presets for Findo
 * Playful & delightful character per CONTEXT.md
 */

// Spring presets - bouncy and expressive
export const springBouncy = {
  type: "spring" as const,
  stiffness: 200,
  damping: 15,
};

export const springGentle = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
};

export const springSnappy = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
};

// Duration presets for non-spring animations
export const duration = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
};

// Stagger delays for theatrical cascade effect
export const stagger = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
};

// Easing for CSS transitions (backup for non-Motion elements)
export const easing = {
  easeOut: "cubic-bezier(0.33, 1, 0.68, 1)",
  easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  bounce: "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
};
