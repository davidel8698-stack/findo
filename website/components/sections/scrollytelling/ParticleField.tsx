"use client";

import { useMemo } from "react";
import styles from "./scrollytelling.module.css";
import {
  PARTICLE_COUNT_DESKTOP,
  PARTICLE_COUNT_MOBILE,
} from "./content";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface ParticleFieldProps {
  /** Override particle count */
  count?: number;
  /** Whether to use mobile count */
  isMobile?: boolean;
}

/**
 * Floating particle system using CSS animations
 * Creates ambient floating dots with Findo orange accent
 */
export function ParticleField({ count, isMobile = false }: ParticleFieldProps) {
  const particleCount =
    count ?? (isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP);

  // Generate particles with deterministic seed for hydration safety
  // Using a seeded approach based on index
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      // Deterministic pseudo-random based on index
      const seed = (i * 9301 + 49297) % 233280;
      const random = (offset: number) => {
        const val = ((seed + offset * 127) % 233280) / 233280;
        return val;
      };

      return {
        id: i,
        x: random(1) * 100,
        y: random(2) * 100,
        size: 2 + random(3) * 4, // 2-6px
        opacity: 0.15 + random(4) * 0.35, // 0.15-0.5
        duration: 15 + random(5) * 20, // 15-35s
        delay: random(6) * 15, // 0-15s delay
      };
    });
  }, [particleCount]);

  return (
    <div className={styles.particleField} aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={styles.particle}
          style={
            {
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              "--size": `${particle.size}px`,
              "--opacity": particle.opacity,
              "--duration": `${particle.duration}s`,
              "--delay": `${particle.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
