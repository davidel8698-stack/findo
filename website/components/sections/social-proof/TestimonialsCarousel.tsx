"use client";

import { m, type Variants, useReducedMotion } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TestimonialCard, type Testimonial } from "./TestimonialCard";
import { SectionReveal, SectionRevealItem, reducedMotionFade } from "@/components/motion";
import { useDirection, getSlideX } from "@/lib/hooks";
import { springGentle } from "@/lib/animation";

/**
 * Placeholder testimonials with variety per CONTEXT.md:
 * - PROOF-01: Metric-focused (lead increase)
 * - PROOF-02: Different industry (clinic/salon)
 * - PROOF-03: Emotional outcome (peace of mind)
 */
const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "מאז שהתחלנו להשתמש ב-Findo, הגדלנו את כמות הלידים ב-40%. הלקוחות מקבלים מענה מיידי גם כשאני עסוק במטבח.",
    name: "יוסי כהן",
    business: "מסעדת הים",
    metric: "הגדלנו את כמות הלידים ב-40%",
    avatarSrc: "/testimonials/avatar-1.jpg",
    industry: "מסעדנות",
  },
  {
    id: "2",
    quote:
      "הלקוחות שלי מרוצים יותר כי הם מקבלים תשובות מיידיות. ה-Google Reviews שלנו עלו מ-4.2 ל-4.8 כוכבים.",
    name: "מיכל לוי",
    business: "קליניקת יופי מיכל",
    metric: "מ-4.2 ל-4.8 כוכבים בגוגל",
    avatarSrc: "/testimonials/avatar-2.jpg",
    industry: "קוסמטיקה וטיפוח",
  },
  {
    id: "3",
    quote:
      "סוף סוף יש לי שקט נפשי. אני יודע שאף שיחה לא הולכת לאיבוד, גם כשאני בטיפול עם לקוח.",
    name: "דני אברהם",
    business: "מספרת דני",
    metric: "סוף סוף יש לי שקט נפשי",
    avatarSrc: "/testimonials/avatar-3.jpg",
    industry: "עיצוב שיער",
  },
];

interface TestimonialsCarouselProps {
  className?: string;
}

/**
 * Testimonials carousel with RTL support.
 * Displays customer testimonials in a horizontally swipeable carousel.
 *
 * Animation per CONTEXT.md:
 * - Testimonials: slide from sides (alternating pattern)
 * - Fast cascade (65ms stagger) for unified group feel
 * - RTL-aware slide direction via useDirection hook
 *
 * Note: This component does NOT include section wrapper.
 * Parent page.tsx provides the section and container wrapper.
 */
export function TestimonialsCarousel({ className }: TestimonialsCarouselProps) {
  const prefersReducedMotion = useReducedMotion();
  const direction = useDirection();
  const isRTL = direction === "rtl";

  /**
   * Create alternating slide variants based on card index
   * Even indices (0, 2) slide from start, odd indices (1) slide from end
   */
  const getSlideVariant = (index: number): Variants => {
    if (prefersReducedMotion) {
      return reducedMotionFade;
    }

    // Alternate: even from start, odd from end
    const fromStart = index % 2 === 0;
    const xOffset = getSlideX(fromStart ? "start" : "end", 50, isRTL);

    return {
      hidden: { opacity: 0, x: xOffset },
      visible: {
        opacity: 1,
        x: 0,
        transition: springGentle,
      },
    };
  };

  return (
    <SectionReveal className={className}>
      <div className="w-full">
        {/* Section heading */}
        <SectionRevealItem>
          <h2 className="text-3xl font-bold text-center mb-8">
            מה הלקוחות שלנו אומרים
          </h2>
        </SectionRevealItem>

        {/* Carousel container with padding for navigation arrows (56px = w-14) */}
        <div className="relative px-16 md:px-20">
          <Carousel
            dir="rtl"
            opts={{
              direction: "rtl",
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ms-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={testimonial.id}
                  className="ps-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <m.div
                    variants={getSlideVariant(index)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <TestimonialCard
                      quote={testimonial.quote}
                      name={testimonial.name}
                      business={testimonial.business}
                      metric={testimonial.metric}
                      avatarSrc={testimonial.avatarSrc}
                      industry={testimonial.industry}
                    />
                  </m.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation arrows - rotate 180deg for RTL */}
            <CarouselPrevious className="rtl:rotate-180" />
            <CarouselNext className="rtl:rotate-180" />
          </Carousel>
        </div>
      </div>
    </SectionReveal>
  );
}
