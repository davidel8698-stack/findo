"use client";

import { useRef, type ReactNode } from "react";
import { m, useInView, type Variants, type UseInViewOptions } from "motion/react";
import { cn } from "@/lib/utils";
import { fadeInUp } from "./variants";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  /** How far from viewport edge to trigger (negative = trigger before visible) */
  margin?: UseInViewOptions["margin"];
  /** Only animate once, or every time element enters viewport */
  once?: boolean;
}

export function ScrollReveal({
  children,
  className,
  variants = fadeInUp,
  delay = 0,
  margin = "-100px" as UseInViewOptions["margin"],
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin });

  return (
    <m.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </m.div>
  );
}
