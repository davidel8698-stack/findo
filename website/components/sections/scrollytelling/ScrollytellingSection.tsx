"use client";

import { useRef, useState, useEffect } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsapConfig";
import { cn } from "@/lib/utils";
import { GradientOrbs } from "./GradientOrbs";
import { GridPattern } from "./GridPattern";
import { ParticleField } from "./ParticleField";
import { TypewriterLines } from "./TypewriterText";
import { DramaticReveal } from "./DramaticReveal";
import {
  scrollytellingContent,
  SCROLL_DISTANCE,
  SCROLL_DISTANCE_MOBILE,
} from "./content";
import styles from "./scrollytelling.module.css";

/**
 * Emotional Scrollytelling Section - Enhanced
 * Terminal Industries-inspired scroll experience for Hebrew content
 * Phase 33 Enhanced - Gradient orbs + premium typography
 */
export function ScrollytellingSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Setup ScrollTrigger
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const scrollDistance = isMobile ? SCROLL_DISTANCE_MOBILE : SCROLL_DISTANCE;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${scrollDistance}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });

      // Cleanup
      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [isMobile] }
  );

  // Calculate which phase is active based on progress
  const getActivePhaseIndex = () => {
    const { phases } = scrollytellingContent;
    for (let i = phases.length - 1; i >= 0; i--) {
      if (progress >= phases[i].range[0]) {
        return i;
      }
    }
    return 0;
  };

  // Calculate progress within a specific phase
  const getPhaseProgress = (phaseIndex: number) => {
    const phase = scrollytellingContent.phases[phaseIndex];
    if (!phase) return 0;

    const [start, end] = phase.range;
    if (progress < start) return 0;
    if (progress >= end) return 1;
    return (progress - start) / (end - start);
  };

  // Calculate finale progress
  const getFinaleProgress = () => {
    const { finale } = scrollytellingContent;
    const [start, end] = finale.range;
    if (progress < start) return 0;
    if (progress >= end) return 1;
    return (progress - start) / (end - start);
  };

  const activePhaseIndex = getActivePhaseIndex();
  const finaleProgress = getFinaleProgress();
  const isInFinale = progress >= scrollytellingContent.finale.range[0];

  // Grid intensity - subtle background, reduced from before
  const gridIntensity = 0.1 + progress * 0.1;

  return (
    <section
      ref={containerRef}
      className={styles.container}
      aria-label="הסיפור שלנו"
    >
      {/* Hero transition - seamless blend from above */}
      <div className={styles.heroTransition} aria-hidden="true" />

      {/* Background layers - ordered by z-index */}
      {/* 1. Gradient orbs - primary abstract background */}
      <GradientOrbs
        scrollProgress={progress}
        isMobile={isMobile}
      />

      {/* 2. Grid pattern - subtle texture overlay */}
      <GridPattern intensity={gridIntensity} />

      {/* 3. Particles - subtle floating elements (optional, can disable on mobile) */}
      {!isMobile && <ParticleField isMobile={isMobile} />}

      {/* Content phases */}
      <div className={styles.content}>
        {scrollytellingContent.phases.map((phase, index) => {
          const isActive = index === activePhaseIndex && !isInFinale;
          const phaseProgress = getPhaseProgress(index);

          return (
            <div
              key={phase.id}
              className={cn(styles.phase, isActive && styles.active)}
            >
              <TypewriterLines
                lines={phase.lines}
                progress={isActive ? phaseProgress : index < activePhaseIndex ? 1 : 0}
                emphasisLines={
                  // Emphasize specific lines based on phase
                  phase.id === "confusion"
                    ? [1, 2, 3] // Questions
                    : phase.id === "problem"
                      ? [1, 2, 3] // Requirements
                      : []
                }
              />
            </div>
          );
        })}
      </div>

      {/* Dramatic finale */}
      <DramaticReveal
        text={scrollytellingContent.finale.text}
        progress={finaleProgress}
      />
    </section>
  );
}
