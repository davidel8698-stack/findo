"use client";

import { useRef, useState, useEffect } from "react";

interface ScrollFadeResult {
  ref: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
  hasExited: boolean;
}

export function useScrollFade(): ScrollFadeResult {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasExited, setHasExited] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setHasExited(false);
          } else if (entry.boundingClientRect.top < 0) {
            // Element has scrolled above viewport
            setHasExited(true);
          } else {
            // Element is below viewport (scrolled back up past it)
            setIsVisible(false);
            setHasExited(false);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "-20% 0px -20% 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, isVisible, hasExited };
}
