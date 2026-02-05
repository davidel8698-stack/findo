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
import { ConversionSection } from "@/components/sections/conversion/ConversionSection";
// Phase 18 - Emotional Journey sections (direct imports for SSR)
import { PainPointSection } from "@/components/sections/emotional/PainPointSection";
import { ReliefSection } from "@/components/sections/emotional/ReliefSection";
import { DemoSection } from "@/components/sections/demo/DemoSection";
// Phase 19 - SEO structured data
import { StructuredData } from "@/components/seo/StructuredData";
// Phase 25 - Section scroll reveals
import { SectionReveal, SectionRevealItem } from "@/components/motion/SectionReveal";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <main className="min-h-screen text-foreground relative z-10">
      {/* SEO Structured Data - Phase 19 */}
      <StructuredData />

      {/* Hero Section - Phase 14 */}
      <Hero />

      {/* Hero Form - Phase 17 (target for StickyCtaBar scroll) */}
      <section className="py-8 -mt-16 relative z-10">
        <div className="container">
          <div className="flex justify-center">
            <ConversionSection id="hero-form" variant="hero" showTrustText={false} />
          </div>
        </div>
      </section>

      {/* Pain Point Section - Phase 18 (EMOTION-01) */}
      <PainPointSection />

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

      {/* Relief Section - Phase 18 (EMOTION-02/03/04) */}
      <ReliefSection />

      {/* CTA After Social Proof - Phase 17 (ACTION-01) */}
      <section className="py-12">
        <div className="container">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold">מוכן להצטרף?</h3>
            <ConversionSection variant="section" />
          </div>
        </div>
      </section>

      {/* Testimonials Carousel - Text testimonials (PROOF-01/02/03) */}
      <section className="py-16 md:py-24">
        <div className="container">
          <TestimonialsCarousel />
          {/* Guarantee Badge - After testimonials */}
          <div className="flex justify-center mt-8">
            <GuaranteeBadge variant="inline" />
          </div>
        </div>
      </section>

      {/* Demo Section - Interactive product demo (DEMO-01/02/03) - Phase 18 */}
      <SectionReveal>
        <SectionRevealItem>
          <DemoSection className="bg-muted/30" />
        </SectionRevealItem>
      </SectionReveal>

      {/* Video Testimonial - Video proof (PROOF-04) */}
      <section className={cn("py-16 md:py-24", "bg-muted/30")}>
        <div className="container">
          <SectionReveal>
            <SectionRevealItem>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                סיפור הצלחה
              </h2>
            </SectionRevealItem>
            <SectionRevealItem>
              <VideoTestimonial
                src="/videos/testimonial.mp4"
                poster="/videos/testimonial-poster.jpg"
              />
            </SectionRevealItem>
          </SectionReveal>
        </div>
      </section>

      {/* ROI Calculator - Show value before price (OFFER-02) - Phase 16 */}
      <SectionReveal>
        <SectionRevealItem>
          <ROICalculator />
        </SectionRevealItem>
      </SectionReveal>

      {/* Pricing Section - Transparent pricing (OFFER-03) - Phase 16 */}
      <SectionReveal>
        <SectionRevealItem>
          <PricingSection className="bg-muted/30" />
        </SectionRevealItem>
      </SectionReveal>

      {/* CTA After Pricing - Phase 17 (ACTION-01) */}
      <section className="py-16">
        <div className="container">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold">התחל היום, בחינם</h3>
            <p className="text-muted-foreground">ללא כרטיס אשראי. ללא התחייבות.</p>
            <ConversionSection variant="section" />
          </div>
        </div>
      </section>

      {/* Zero Risk Summary - Eliminate risk (OBJ-01) - Phase 16 */}
      <section className="py-16 md:py-24">
        <div className="container">
          <SectionReveal>
            <SectionRevealItem>
              {/* Component has its own max-w-lg mx-auto for proper centering */}
              <ZeroRiskSummary />
            </SectionRevealItem>
          </SectionReveal>
        </div>
      </section>

      {/* Trust Badges - Authority signals (PROOF-08) */}
      <section className={cn("py-16 md:py-24", "bg-muted/30")}>
        <div className="container">
          <SectionReveal>
            <SectionRevealItem>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                למה לבחור ב-Findo
              </h2>
            </SectionRevealItem>
            <SectionRevealItem>
              <TrustBadges />
            </SectionRevealItem>
          </SectionReveal>
        </div>
      </section>

      {/* FAQ Section - Address objections (OBJ-02) - Phase 16 */}
      <SectionReveal>
        <SectionRevealItem>
          <FAQSection />
        </SectionRevealItem>
      </SectionReveal>

      {/* CTA After FAQ - Phase 17 (ACTION-01) */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold">יש לך עוד שאלות?</h3>
            <p className="text-muted-foreground">התחל בחינם או צור קשר עם הצוות שלנו</p>
            <ConversionSection variant="section" />
          </div>
        </div>
      </section>

      {/* Team Section - Real people (TRUST-02) */}
      <section className={cn("py-16 md:py-24", "bg-muted/30")}>
        <div className="container">
          <SectionReveal>
            <SectionRevealItem>
              <TeamSection />
            </SectionRevealItem>
          </SectionReveal>
        </div>
      </section>

      {/* Contact Section - Easy contact (TRUST-01) */}
      <section className="py-16 md:py-24">
        <div className="container">
          <SectionReveal>
            <SectionRevealItem>
              <ContactSection />
            </SectionRevealItem>
          </SectionReveal>
        </div>
      </section>

      {/* Footer Guarantee Badge */}
      <section className={cn("py-12 pb-20 md:pb-12", "bg-muted/30")}>
        <div className="container">
          <SectionReveal noStagger>
            <SectionRevealItem>
              <div className="flex flex-col items-center gap-4">
                <GuaranteeBadge variant="full" />
              </div>
            </SectionRevealItem>
          </SectionReveal>
        </div>
      </section>

      {/* Sticky CTA Bar - Phase 14 */}
      <StickyCtaBar />

      {/* Floating Activity Widget - Ambient proof (PROOF-05) */}
      <FloatingActivityWidget />
    </main>
  );
}
