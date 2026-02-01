"use client";

import Hero from "@/components/sections/hero";
import { StickyCtaBar } from "@/components/sections/hero";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <StickyCtaBar />

      {/* Placeholder sections below hero */}
      <section className="container py-20">
        <p className="text-muted-foreground text-center">
          More sections coming in Phase 15+
        </p>
      </section>
    </main>
  );
}
