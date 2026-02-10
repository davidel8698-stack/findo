/**
 * Unified component exports
 *
 * NOTE: Due to a Next.js 16 Turbopack SSR issue with barrel re-exports,
 * prefer direct imports from subfolders in page components:
 *   import { Button } from "@/components/ui/button";
 *   import { Logo } from "@/components/atoms";
 *
 * This barrel file is still useful for:
 * - Client components with "use client"
 * - Storybook stories
 * - Test files
 */

// UI Components (shadcn/ui)
export { Button, buttonVariants } from "./ui/button";
export { Input } from "./ui/input";
export { Label } from "./ui/label";
export { Badge, badgeVariants } from "./ui/badge";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

// Atomic Components
export { Logo } from "./atoms";
export { Icon, iconSizes } from "./atoms";

// Molecule Components
export { CTAGroup } from "./molecules";
export { StatItem } from "./molecules";
export { NavLink } from "./molecules";
export { FormField } from "./molecules";

// Motion Components
export { ScrollReveal } from "./motion/ScrollReveal";
export { FadeIn } from "./motion/FadeIn";
export { StaggerContainer } from "./motion/StaggerContainer";
export {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  pop,
  staggerContainer,
  staggerContainerFast,
  staggerContainerSlow,
} from "./motion/variants";

