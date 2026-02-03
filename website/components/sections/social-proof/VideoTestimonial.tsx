"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { Volume2, VolumeX, Play, Video } from "lucide-react";

interface VideoTestimonialProps {
  /** Video source URL */
  src: string;
  /** Poster image to show before video loads */
  poster: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * VideoTestimonial - Autoplay video component with viewport detection
 *
 * Plays muted when 50% visible in viewport, pauses when scrolled out.
 * User can click to unmute/mute. Subtitles are burned-in (no toggle needed).
 * Shows placeholder when video fails to load.
 *
 * Requirements:
 * - PROOF-04: Video plays automatically when scrolled into view
 * - PROOF-05: Video pauses when scrolled out of view
 */
export function VideoTestimonial({
  src,
  poster,
  className,
}: VideoTestimonialProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Play when 50% of video is visible
  const isInView = useInView(containerRef, { amount: 0.5 });

  useEffect(() => {
    if (!videoRef.current || hasError) return;

    if (isInView && isLoaded) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked by browser - OK, user can click to play
      });
    } else {
      videoRef.current.pause();
    }
  }, [isInView, hasError, isLoaded]);

  const handleToggleMute = () => {
    if (!videoRef.current) return;

    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);

    // If unmuting, ensure video is playing
    if (!newMutedState) {
      videoRef.current.play().catch(() => {
        // Play failed - revert to muted
        videoRef.current!.muted = true;
        setIsMuted(true);
      });
    }
  };

  const handleError = () => {
    setHasError(true);
  };

  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-video rounded-2xl shadow-lg overflow-hidden bg-muted",
        "max-w-4xl mx-auto",
        className
      )}
    >
      {/* Placeholder state when video fails or not loaded */}
      {(hasError || !isLoaded) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 z-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Video className="w-10 h-10 text-primary" />
            </div>
            {!hasError && (
              <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-primary/40 animate-ping" />
            )}
          </div>
          <p className="text-lg font-medium text-foreground mb-1">
            {hasError ? "סרטון עדות לקוח" : "טוען סרטון..."}
          </p>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            {hasError
              ? "הסרטון יעלה בקרוב - בינתיים, קראו את העדויות שלנו למעלה"
              : "אנא המתינו"}
          </p>
        </div>
      )}

      <video
        ref={videoRef}
        muted
        playsInline
        loop
        poster={poster}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          hasError ? "opacity-0" : "opacity-100"
        )}
        onError={handleError}
        onLoadedData={handleLoadedData}
      >
        <source src={src} type="video/mp4" />
        {/* WebM fallback for better compression */}
        <source src={src.replace(".mp4", ".webm")} type="video/webm" />
      </video>

      {/* Mute/unmute toggle button - only show when video is loaded */}
      {isLoaded && !hasError && (
        <button
          onClick={handleToggleMute}
          className={cn(
            "absolute bottom-4 end-4 p-3 rounded-full",
            "bg-black/60 text-white backdrop-blur-sm",
            "hover:bg-black/80 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          )}
          aria-label={isMuted ? "הפעל קול" : "השתק"}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </button>
      )}
    </div>
  );
}
