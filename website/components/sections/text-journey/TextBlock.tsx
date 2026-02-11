"use client";

import { useScrollFade } from "./useScrollFade";
import styles from "./text-journey.module.css";

interface TextBlockProps {
  lines: string[];
  variant?: "normal" | "resolution";
}

export function TextBlock({ lines, variant = "normal" }: TextBlockProps) {
  const { ref, isVisible } = useScrollFade();

  const blockClasses = [
    styles.block,
    isVisible ? styles.visible : "",
    variant === "resolution" ? styles.resolution : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={blockClasses}>
      {lines.map((line, index) => (
        <p
          key={index}
          className={styles.line}
          style={{ "--line-index": index } as React.CSSProperties}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
