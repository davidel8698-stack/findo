"use client";

import { useRef, useState } from "react";
import { useInView } from "motion/react";
import { Play, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface InteractiveDemoProps {
  /** Storylane demo ID (from embed URL) */
  demoId: string;
  /** Poster image shown before interaction */
  poster: string;
  /** Additional CSS classes */
  className?: string;
  /** Show full-screen button */
  showFullscreen?: boolean;
}

export function InteractiveDemo({
  demoId,
  poster,
  className,
  showFullscreen = true,
}: InteractiveDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActivated, setIsActivated] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Track visibility for potential preloading (not used yet but available)
  const isInView = useInView(containerRef, { amount: 0.3 });

  const handleActivate = () => {
    setIsActivated(true);
  };

  const handleFullscreen = () => {
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  // Storylane embed URL - inline embed mode
  const embedUrl = `https://app.storylane.io/demo/${demoId}?embed=inline`;

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "relative aspect-video rounded-2xl overflow-hidden bg-muted",
          className
        )}
      >
        {!isActivated ? (
          // Poster with play button - iframe only loads on click
          <button
            onClick={handleActivate}
            className="absolute inset-0 w-full h-full group cursor-pointer"
            aria-label="התחל הדגמה אינטראקטיבית"
          >
            <img
              src={poster}
              alt="תצוגה מקדימה של ההדגמה"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-3 group-hover:bg-black/40 transition-colors">
              <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-10 h-10 text-primary ms-1" />
              </div>
              <span className="text-white font-medium text-lg">
                לחץ לנסות בעצמך
              </span>
            </div>
          </button>
        ) : (
          // Storylane iframe - loads only after user clicks
          <>
            <iframe
              src={embedUrl}
              allow="fullscreen"
              loading="lazy"
              className="absolute inset-0 w-full h-full border-none"
              title="הדגמה אינטראקטיבית של Findo"
            />
            {showFullscreen && (
              <Button
                variant="secondary"
                size="icon"
                onClick={handleFullscreen}
                className="absolute top-4 end-4 bg-white/90 hover:bg-white shadow-lg"
                aria-label="פתח במסך מלא"
              >
                <Maximize2 className="w-5 h-5" />
              </Button>
            )}
          </>
        )}
      </div>

      {/* Fullscreen modal for immersive experience */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={handleCloseFullscreen}
          role="dialog"
          aria-modal="true"
          aria-label="הדגמה במסך מלא"
        >
          <div
            className="relative w-full max-w-6xl aspect-video rounded-xl overflow-hidden bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={embedUrl}
              allow="fullscreen"
              className="w-full h-full border-none"
              title="הדגמה אינטראקטיבית של Findo - מסך מלא"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCloseFullscreen}
              className="absolute top-4 end-4 bg-white/90 hover:bg-white gap-2"
            >
              <X className="w-4 h-4" />
              סגור
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
