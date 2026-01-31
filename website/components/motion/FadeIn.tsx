"use client";

import { type ReactNode } from "react";
import { m, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { fadeInUp } from "./variants";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
}

export function FadeIn({
  children,
  className,
  variants = fadeInUp,
  delay = 0,
}: FadeInProps) {
  return (
    <m.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </m.div>
  );
}
