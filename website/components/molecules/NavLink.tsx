"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types";

interface NavLinkProps extends NavItem {
  className?: string;
  onClick?: () => void;
}

export function NavLink({
  href,
  title,
  disabled,
  className,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  if (disabled) {
    return (
      <span
        className={cn(
          "text-muted-foreground cursor-not-allowed opacity-50",
          className
        )}
      >
        {title}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        // Base styles with padding for touch target and background area
        "px-3 py-2 rounded-md",
        "text-foreground",
        // Hover: background fill (per CONTEXT.md - different from inline links)
        "hover:bg-accent hover:text-accent-foreground",
        // Transition for smooth background fill (MICRO-07, MICRO-08)
        "transition-[background-color,color] duration-200 ease-out",
        // Focus visible
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // Active state
        isActive && "bg-accent text-accent-foreground font-medium",
        className
      )}
    >
      {title}
    </Link>
  );
}
