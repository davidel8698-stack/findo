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
        "text-foreground hover:text-primary transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm",
        isActive && "text-primary font-medium",
        className
      )}
    >
      {title}
    </Link>
  );
}
