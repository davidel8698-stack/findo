"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { Volume2, VolumeX } from "lucide-react";

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

  // Play when 50% of video is visible
  const isInView = useInView(containerRef, { amount: 0.5 });

  useEffect(() => {
    if (!videoRef.current) return;

    if (isInView) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked by browser - OK, user can click to play
      });
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

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

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-video rounded-2xl shadow-lg overflow-hidden bg-muted",
        className
      )}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        loop
        poster={poster}
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
        {/* WebM fallback for better compression */}
        <source src={src.replace(".mp4", ".webm")} type="video/webm" />
      </video>

      {/* Mute/unmute toggle button */}
      <button
        onClick={handleToggleMute}
        className={cn(
          "absolute bottom-4 end-4 p-2 rounded-full",
          "bg-black/60 text-white backdrop-blur-sm",
          "hover:bg-black/80 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        )}
        aria-label={isMuted ? "הפעל קול" : "השתק"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
