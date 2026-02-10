"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import styles from "./scrollytelling.module.css";

/**
 * Orb configuration for parallax background
 * Each orb has different size, color, position, and scroll speed
 */
interface OrbConfig {
  id: number;
  /** Size in pixels (desktop) */
  size: number;
  /** Size in pixels (mobile) */
  sizeMobile: number;
  /** Background color with opacity */
  color: string;
  /** Initial X position (CSS value) */
  initialX: string;
  /** Initial Y position (CSS value) */
  initialY: string;
  /** How much the orb moves relative to scroll (0-1) */
  scrollMultiplier: number;
  /** Blur amount in pixels (desktop) */
  blur: number;
  /** Blur amount in pixels (mobile) */
  blurMobile: number;
  /** Whether to hide on mobile */
  desktopOnly?: boolean;
}

const ORBS: OrbConfig[] = [
  {
    id: 1,
    size: 600,
    sizeMobile: 400,
    color: "rgba(56, 136, 57, 0.25)", // Findo green
    initialX: "-10%",
    initialY: "15%",
    scrollMultiplier: 0.3,
    blur: 120,
    blurMobile: 60,
  },
  {
    id: 2,
    size: 500,
    sizeMobile: 350,
    color: "rgba(249, 115, 22, 0.18)", // Findo orange
    initialX: "75%",
    initialY: "55%",
    scrollMultiplier: 0.5,
    blur: 100,
    blurMobile: 50,
  },
  {
    id: 3,
    size: 400,
    sizeMobile: 300,
    color: "rgba(62, 56, 136, 0.2)", // Subtle purple
    initialX: "45%",
    initialY: "80%",
    scrollMultiplier: 0.4,
    blur: 80,
    blurMobile: 40,
    desktopOnly: true, // Hide on mobile for performance
  },
];

interface GradientOrbsProps {
  /** Scroll progress from 0 to 1 */
  scrollProgress: number;
  /** Whether on mobile viewport */
  isMobile: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * GradientOrbs - Animated background orbs with scroll parallax
 *
 * Creates a premium abstract background with large blurred spheres
 * that move at different speeds as the user scrolls.
 * Inspired by Linear/Stripe design patterns.
 */
export function GradientOrbs({
  scrollProgress,
  isMobile,
  className,
}: GradientOrbsProps) {
  // Filter orbs for mobile
  const visibleOrbs = useMemo(() => {
    return isMobile ? ORBS.filter((orb) => !orb.desktopOnly) : ORBS;
  }, [isMobile]);

  return (
    <div
      className={cn(styles.gradientOrbsContainer, className)}
      aria-hidden="true"
    >
      {visibleOrbs.map((orb) => {
        // Calculate vertical movement based on scroll progress
        // Orbs move upward as user scrolls down
        const yOffset = scrollProgress * orb.scrollMultiplier * 100;

        // Size and blur based on viewport
        const size = isMobile ? orb.sizeMobile : orb.size;
        const blur = isMobile ? orb.blurMobile : orb.blur;

        return (
          <div
            key={orb.id}
            className={styles.gradientOrb}
            style={{
              width: size,
              height: size,
              background: orb.color,
              left: orb.initialX,
              top: orb.initialY,
              filter: `blur(${blur}px)`,
              transform: `translate3d(0, -${yOffset}vh, 0)`,
            }}
          />
        );
      })}
    </div>
  );
}
