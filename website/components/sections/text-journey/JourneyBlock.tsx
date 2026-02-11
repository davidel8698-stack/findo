"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./text-journey.module.css";

interface JourneyBlockProps {
  lines: string[];
  variant?: "normal" | "resolution";
  className?: string;
}

export function JourneyBlock({
  lines,
  variant = "normal",
  className,
}: JourneyBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "-50px 0px",
      }
    );

    if (blockRef.current) {
      observer.observe(blockRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={blockRef}
      className={cn(
        styles.block,
        variant === "resolution" && styles.resolution,
        className
      )}
    >
      {lines.map((line, index) => (
        <p
          key={index}
          className={cn(styles.line, isVisible && styles.visible)}
          style={{
            transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
          }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
