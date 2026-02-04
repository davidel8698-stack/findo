/**
 * Animation constants and spring presets for Findo
 * Playful & delightful character per CONTEXT.md
 *
 * PERFORMANCE OPTIMIZATIONS (Phase 19):
 * - GPU-optimized springs for 60fps performance
 * - Only animate transform and opacity (compositor-only)
 * - will-change hints for GPU acceleration
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

/**
 * GPU-OPTIMIZED SPRING - Phase 19
 * Higher stiffness/damping for snappy 60fps performance
 * Use for performance-critical animations
 */
export const gpuSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 1,
};

/**
 * GPU-OPTIMIZED TWEEN - Phase 19
 * Short duration with CSS ease-out for quick transitions
 * Use for simple opacity/transform changes
 */
export const gpuDuration = {
  duration: 0.3,
  ease: [0.33, 1, 0.68, 1], // CSS ease-out as cubic bezier
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

/**
 * STAGGER CONFIG - Phase 19
 * Optimized stagger timing for smooth cascade
 */
export const staggerConfig = {
  staggerChildren: 0.05,
  delayChildren: 0,
};

/**
 * VIEWPORT CONFIG - Phase 19
 * Optimized viewport detection for scroll animations
 */
export const viewportConfig = {
  once: true,      // Animate only once (performance)
  amount: 0.2,     // Trigger at 20% visibility
  margin: "-50px", // Start slightly before visible
};

// Easing for CSS transitions (backup for non-Motion elements)
export const easing = {
  easeOut: "cubic-bezier(0.33, 1, 0.68, 1)",
  easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  bounce: "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
};

/**
 * MICRO-INTERACTION CONFIG - Phase 24
 * Snappy & precise feel (150-200ms per CONTEXT.md)
 * For button hover, card lift, link underlines
 */
export const microInteraction = {
  duration: 0.15, // 150ms - fast and snappy
  ease: [0, 0, 0.2, 1], // ease-out cubic-bezier
};

/**
 * Shadow-lift hover effect for buttons
 * Primary effect per CONTEXT.md: translateY + shadow increase, NOT scale
 */
export const shadowLiftHover = {
  y: -1,
  boxShadow: "var(--shadow-hover)",
};

/**
 * Press/tap feedback for buttons
 * Scale down + reduced shadow
 */
export const shadowLiftTap = {
  scale: 0.98,
  boxShadow: "var(--shadow-elevation-medium)",
};

/**
 * Card lift on hover
 * Already implemented in card.tsx, exported for consistency
 */
export const cardLiftHover = {
  y: -4,
  boxShadow: "var(--shadow-hover)",
};
