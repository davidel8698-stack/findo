"use client";

import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { m } from "motion/react";
import { staggerContainer, fadeInUp } from "@/components/motion/variants";
import { MessageCircle, Phone, Mail, Clock } from "lucide-react";
import { useRef } from "react";
import { useInView } from "motion/react";

// ============================================================================
// CONTENT - Easily replaceable contact information
// ============================================================================

const SECTION = {
  title: "דברו איתנו",
  subtitle: "אנחנו כאן לכל שאלה",
};

const CONTACT_METHODS = [
  {
    id: "whatsapp",
    icon: MessageCircle,
    label: "וואטסאפ",
    value: "050-123-4567",
    href: "https://wa.me/972501234567",
    /** WhatsApp uses green accent for brand recognition */
    isPrimary: true,
    accentColor: "bg-green-500",
    hoverAccent: "hover:bg-green-600",
  },
  {
    id: "phone",
    icon: Phone,
    label: "טלפון",
    value: "03-123-4567",
    href: "tel:+97231234567",
    isPrimary: false,
    accentColor: "bg-primary",
    hoverAccent: "hover:bg-primary/90",
  },
  {
    id: "email",
    icon: Mail,
    label: "אימייל",
    value: "hello@findo.co.il",
    href: "mailto:hello@findo.co.il",
    isPrimary: false,
    accentColor: "bg-primary",
    hoverAccent: "hover:bg-primary/90",
  },
] as const;

const BUSINESS_HOURS = {
  label: "שעות מענה",
  hours: "ראשון-חמישי 9:00-18:00",
};

// ============================================================================
// COMPONENT
// ============================================================================

interface ContactSectionProps {
  className?: string;
}

/**
 * Contact section displaying multiple ways to reach Findo.
 * WhatsApp is highlighted as the primary contact method (SMBs in Israel prefer WhatsApp).
 *
 * All contact methods use proper protocols:
 * - WhatsApp: wa.me deep link
 * - Phone: tel: protocol
 * - Email: mailto: protocol
 */
export function ContactSection({ className }: ContactSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {SECTION.title}
          </h2>
          <p className="text-muted-foreground text-lg">{SECTION.subtitle}</p>
        </ScrollReveal>

        {/* Contact Cards Grid with stagger animation */}
        <m.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            "gap-6",
            "max-w-4xl mx-auto"
          )}
        >
          {CONTACT_METHODS.map((method) => (
            <m.a
              key={method.id}
              href={method.href}
              target={method.id === "whatsapp" ? "_blank" : undefined}
              rel={method.id === "whatsapp" ? "noopener noreferrer" : undefined}
              variants={fadeInUp}
              className={cn(
                // Base card styling
                "group relative flex flex-col items-center",
                "p-6 rounded-xl",
                "bg-card border border-border",
                // Hover effects
                "transition-all duration-300 ease-out",
                "hover:scale-105 hover:shadow-lg hover:shadow-black/5",
                "hover:border-primary/30",
                // Touch-friendly size
                "min-h-[160px]",
                // Primary (WhatsApp) gets special treatment
                method.isPrimary && [
                  "border-green-500/30",
                  "hover:border-green-500/50",
                  "hover:shadow-green-500/10",
                ]
              )}
            >
              {/* Icon with colored background */}
              <div
                className={cn(
                  "flex items-center justify-center",
                  "w-14 h-14 rounded-full",
                  "mb-4",
                  "transition-colors duration-300",
                  method.accentColor,
                  method.hoverAccent
                )}
              >
                <method.icon
                  className="w-6 h-6 text-white"
                  aria-hidden="true"
                />
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-sm font-medium text-muted-foreground",
                  "mb-1"
                )}
              >
                {method.label}
              </span>

              {/* Value */}
              <span
                className={cn(
                  "text-lg font-semibold",
                  "group-hover:text-primary transition-colors",
                  // WhatsApp specific
                  method.isPrimary && "group-hover:text-green-500"
                )}
                dir="ltr"
              >
                {method.value}
              </span>

              {/* Primary badge for WhatsApp */}
              {method.isPrimary && (
                <span
                  className={cn(
                    "absolute top-3 end-3",
                    "text-xs font-medium",
                    "px-2 py-0.5 rounded-full",
                    "bg-green-500/10 text-green-600",
                    "dark:bg-green-500/20 dark:text-green-400"
                  )}
                >
                  מועדף
                </span>
              )}
            </m.a>
          ))}
        </m.div>

        {/* Business Hours */}
        <ScrollReveal className="mt-10 text-center" delay={0.3}>
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>
              {BUSINESS_HOURS.label}: {BUSINESS_HOURS.hours}
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
