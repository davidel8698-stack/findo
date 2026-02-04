"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { type ReactNode, useRef, useState, useEffect } from "react";
import { m, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";

interface PhoneMockupProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Premium 3D phone mockup with pre-rendered image, multi-layer shadows, screen glow,
 * scroll parallax, and mouse parallax (desktop only).
 * Uses Next.js Image for optimized loading (AVIF/WebP automatic).
 * Activity feed renders inside the screen overlay area.
 */
export function PhoneMockup({ children, className }: PhoneMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);

  // ----- Scroll Parallax -----
  // Track scroll progress from hero start to hero exit
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Map scroll to Y offset (0 to 40px - phone moves slower than scroll)
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  // ----- Mouse Parallax (Desktop Only) -----
  // Mouse position normalized to -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring for natural feel
  const springConfig = { stiffness: 100, damping: 30 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [3, -3]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-3, 3]),
    springConfig
  );

  // Detect mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mouse tracking for desktop only
  useEffect(() => {
    if (isMobile) return;

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX / innerWidth - 0.5);
      mouseY.set(e.clientY / innerHeight - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile, mouseX, mouseY]);

  return (
    <m.div
      ref={containerRef}
      className={cn(
        "relative",
        "contain-layout", // Prevents CLS from parallax transforms
        className
      )}
      style={{
        y: scrollY,
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Screen Glow - behind phone, brand orange tint */}
      <div
        className={cn(
          "absolute inset-0 -z-10",
          "blur-[40px] scale-110",
          "bg-[radial-gradient(ellipse_at_center,hsl(24.6_95%_53.1%_/_0.2)_0%,transparent_70%)]"
        )}
        aria-hidden="true"
      />

      {/* Phone Container - NEW mockup 515x1020, aspect ratio 0.505 */}
      <div
        className={cn(
          "relative",
          // Mobile: 230x456px, Desktop: 270x535px (exact 515:1020 ratio)
          "w-[230px] h-[456px] md:w-[270px] md:h-[535px]",
          // Multi-layer shadow for realistic depth
          "drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]",
          "drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]",
          "drop-shadow-[0_16px_32px_rgba(0,0,0,0.08)]",
          "drop-shadow-[0_32px_64px_rgba(0,0,0,0.06)]"
        )}
      >
        {/* Screen Content - BEHIND the phone frame (z-0) */}
        {/* Reduced top/bottom further to close remaining gaps */}
        <div
          className={cn(
            "absolute overflow-hidden bg-background",
            // Corner radius matching screen corners
            "rounded-[20px] md:rounded-[24px]",
            // FINAL positioning - top gap closed
            // Mobile (230x456): left/right=13px, top=14px, bottom=13px
            // Desktop (270x535): left/right=15px, top=17px, bottom=16px
            "left-[13px] right-[13px] top-[14px] bottom-[13px]",
            "md:left-[15px] md:right-[15px] md:top-[17px] md:bottom-[16px]"
          )}
        >
          {/* Content fills entire screen area */}
          <div className="h-full w-full overflow-hidden flex flex-col">
            {children}
          </div>
        </div>

        {/* Phone Frame Image - ON TOP with multiply blend to show content through white screen */}
        <Image
          src="/images/phone-mockup.png"
          alt=""
          width={270}
          height={535}
          priority
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          style={{ mixBlendMode: "multiply" }}
        />

        {/* Rim Light - subtle top edge highlight for dark mode */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none z-20",
            "border-t border-t-white/5 rounded-[2rem]"
          )}
          aria-hidden="true"
        />
      </div>
    </m.div>
  );
}
