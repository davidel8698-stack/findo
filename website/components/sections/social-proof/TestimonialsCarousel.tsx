"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TestimonialCard, type Testimonial } from "./TestimonialCard";
import { ScrollReveal } from "@/components";

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
 * Testimonials carousel section with RTL support.
 * Displays customer testimonials in a horizontally swipeable carousel.
 */
export function TestimonialsCarousel({ className }: TestimonialsCarouselProps) {
  return (
    <ScrollReveal>
      <section className={className}>
        {/* Section heading */}
        <h2 className="text-3xl font-bold text-center mb-8">
          מה הלקוחות שלנו אומרים
        </h2>

        {/* Carousel container with padding for navigation arrows */}
        <div className="relative px-12">
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
              {testimonials.map((testimonial) => (
                <CarouselItem
                  key={testimonial.id}
                  className="ps-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <TestimonialCard
                    quote={testimonial.quote}
                    name={testimonial.name}
                    business={testimonial.business}
                    metric={testimonial.metric}
                    avatarSrc={testimonial.avatarSrc}
                    industry={testimonial.industry}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation arrows - rotate 180deg for RTL */}
            <CarouselPrevious className="rtl:rotate-180" />
            <CarouselNext className="rtl:rotate-180" />
          </Carousel>
        </div>
      </section>
    </ScrollReveal>
  );
}
