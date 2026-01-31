"use client";

import { type ReactNode } from "react";
import { m, type Variants, type UseInViewOptions } from "motion/react";
import { cn } from "@/lib/utils";
import { staggerContainer } from "./variants";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  /** Trigger when in viewport instead of immediately */
  viewport?: boolean;
}

export function StaggerContainer({
  children,
  className,
  variants = staggerContainer,
  viewport = false,
}: StaggerContainerProps) {
  return (
    <m.div
      initial="hidden"
      animate={viewport ? undefined : "visible"}
      whileInView={viewport ? "visible" : undefined}
      viewport={
        viewport
          ? { once: true, margin: "-100px" as UseInViewOptions["margin"] }
          : undefined
      }
      variants={variants}
      className={cn(className)}
    >
      {children}
    </m.div>
  );
}
