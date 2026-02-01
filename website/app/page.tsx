"use client";

import Hero from "@/components/sections/hero";
import { StickyCtaBar } from "@/components/sections/hero";
// Direct imports to avoid Next.js 16 Turbopack SSR barrel re-export issues
import { SocialProofCounters } from "@/components/sections/social-proof/SocialProofCounters";
import { TestimonialsCarousel } from "@/components/sections/social-proof/TestimonialsCarousel";
import { VideoTestimonial } from "@/components/sections/social-proof/VideoTestimonial";
import { TrustBadges } from "@/components/sections/social-proof/TrustBadges";
import { GuaranteeBadge } from "@/components/sections/social-proof/GuaranteeBadge";
import { FloatingActivityWidget } from "@/components/sections/social-proof/FloatingActivityWidget";
import { TeamSection } from "@/components/sections/trust/TeamSection";
import { ContactSection } from "@/components/sections/trust/ContactSection";
// Phase 16 - Offer & Objection sections (direct imports for SSR)
import { ROICalculator } from "@/components/sections/offer/ROICalculator";
import { PricingSection } from "@/components/sections/offer/PricingSection";
import { ZeroRiskSummary } from "@/components/sections/offer/ZeroRiskSummary";
import { FAQSection } from "@/components/sections/offer/FAQSection";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section - Phase 14 */}
      <Hero />

      {/* Guarantee Badge - Below Hero */}
      <section className="container py-8">
        <div className="flex justify-center">
          <GuaranteeBadge variant="inline" />
        </div>
      </section>

      {/* Social Proof Counters - Metrics that matter (PROOF-06) */}
      <section className={cn("py-16 md:py-24", "bg-muted/30")}>
        <div className="container">
          <SocialProofCounters />
        </div>
      </section>

      {/* Testimonials Carousel - Text testimonials (PROOF-01/02/03) */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            מה הלקוחות שלנו אומרים
          </h2>
          <TestimonialsCarousel />
          {/* Guarantee Badge - After testimonials */}
          <div className="flex justify-center mt-8">
            <GuaranteeBadge variant="inline" />
          </div>
        </div>
      </section>

      {/* Video Testimonial - Video proof (PROOF-04) */}
      <section className={cn("py-16 md:py-24", "bg-muted/30")}>
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            סיפור הצלחה
          </h2>
          <VideoTestimonial
            src="/videos/testimonial.mp4"
            poster="/videos/testimonial-poster.jpg"
          />
        </div>
      </section>

      {/* ROI Calculator - Show value before price (OFFER-02) - Phase 16 */}
      <ROICalculator />

      {/* Pricing Section - Transparent pricing (OFFER-03) - Phase 16 */}
      <PricingSection className="bg-muted/30" />

      {/* Zero Risk Summary - Eliminate risk (OBJ-01) - Phase 16 */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-xl mx-auto">
            <ZeroRiskSummary />
          </div>
        </div>
      </section>

      {/* Trust Badges - Authority signals (PROOF-08) */}
      <section className={cn("py-16 md:py-24", "bg-muted/30")}>
        <div className="container">
          <TrustBadges />
        </div>
      </section>

      {/* FAQ Section - Address objections (OBJ-02) - Phase 16 */}
      <FAQSection />

      {/* Team Section - Real people (TRUST-02) */}
      <section className={cn("py-16 md:py-24", "bg-muted/30")}>
        <div className="container">
          <TeamSection />
        </div>
      </section>

      {/* Contact Section - Easy contact (TRUST-01) */}
      <section className="py-16 md:py-24">
        <div className="container">
          <ContactSection />
        </div>
      </section>

      {/* Footer Guarantee Badge */}
      <section className={cn("py-12", "bg-muted/30")}>
        <div className="container">
          <div className="flex flex-col items-center gap-4">
            <GuaranteeBadge variant="full" />
          </div>
        </div>
      </section>

      {/* Sticky CTA Bar - Phase 14 */}
      <StickyCtaBar />

      {/* Floating Activity Widget - Ambient proof (PROOF-05) */}
      <FloatingActivityWidget />
    </main>
  );
}
