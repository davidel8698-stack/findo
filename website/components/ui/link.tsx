import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface AnimatedLinkProps extends React.ComponentProps<typeof Link> {
  /**
   * Underline animation style
   * - "center": underline scales from center outward (default for inline links)
   * - "none": no underline animation
   */
  underline?: "center" | "none";
  /** Show external link indicator (arrow icon) */
  external?: boolean;
}

/**
 * AnimatedLink - inline link with animated underline
 *
 * Uses CSS utility classes from globals.css (.link-underline)
 * RTL support: underline animates correctly in RTL via inset-inline-* properties
 *
 * @example
 * <AnimatedLink href="/about">Learn more</AnimatedLink>
 * <AnimatedLink href="https://example.com" external>Visit site</AnimatedLink>
 */
const AnimatedLink = React.forwardRef<HTMLAnchorElement, AnimatedLinkProps>(
  ({ className, underline = "center", external, children, ...props }, ref) => {
    const underlineClass = underline === "center" ? "link-underline" : "";

    const externalProps = external
      ? {
          target: "_blank" as const,
          rel: "noopener noreferrer",
        }
      : {};

    return (
      <Link
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1",
          "text-foreground",
          // Transition for text brightness on hover
          "transition-[filter] duration-200 ease-out",
          "hover:brightness-110",
          // Focus visible state
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm",
          underlineClass,
          className
        )}
        {...externalProps}
        {...props}
      >
        {children}
        {external && (
          <svg
            className="h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </Link>
    );
  }
);

AnimatedLink.displayName = "AnimatedLink";

export { AnimatedLink };
