"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Logo, Icon } from "@/components/atoms";
import { CTAGroup, StatItem, FormField } from "@/components/molecules";
import { ScrollReveal, StaggerContainer } from "@/components/motion";
import { Star, Users, TrendingUp, ArrowLeft, Phone } from "lucide-react";

export default function ComponentShowcase() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Logo size="md" />
          <Badge>Phase 13 Complete</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Section: Typography */}
        <ScrollReveal>
          <section className="space-y-4">
            <h1 className="text-5xl font-bold">כותרת ראשית - Typography</h1>
            <h2 className="text-3xl font-bold">כותרת משנית H2</h2>
            <h3 className="text-2xl font-bold">כותרת H3</h3>
            <p className="text-base leading-relaxed max-w-prose">
              זהו טקסט גוף בגודל 16px עם line-height של 1.625 - מותאם לעברית.
              הטיפוגרפיה עומדת בדרישות WCAG לקריאות ללא זום.
              This is body text at 16px with Hebrew-optimized line height.
            </p>
            <p className="text-sm text-muted-foreground">
              טקסט משני בגודל 14px - Secondary text
            </p>
          </section>
        </ScrollReveal>

        {/* Section: Buttons */}
        <ScrollReveal delay={0.1}>
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Buttons - 48px Touch Targets</h2>
            <div className="flex flex-wrap gap-4">
              <Button>כפתור ראשי - Primary</Button>
              <Button variant="outline">כפתור משני - Outline</Button>
              <Button variant="ghost">כפתור רוח - Ghost</Button>
              <Button size="lg">גדול - Large</Button>
              <Button size="sm">קטן - Small</Button>
              <Button size="icon">
                <Icon icon={Star} />
              </Button>
            </div>
            <div className="flex gap-4">
              <Button loading>טוען... Loading</Button>
              <Button disabled>מבוטל - Disabled</Button>
            </div>
          </section>
        </ScrollReveal>

        {/* Section: Inputs */}
        <ScrollReveal delay={0.2}>
          <section className="space-y-6 max-w-md">
            <h2 className="text-2xl font-bold">Form Inputs</h2>
            <FormField
              label="אימייל"
              type="email"
              placeholder="you@example.com"
              description="לא נשתף את האימייל שלך"
            />
            <FormField
              label="טלפון"
              type="tel"
              placeholder="050-123-4567"
            />
            <FormField
              label="שם"
              placeholder="השם שלך"
              error="שדה חובה"
            />
          </section>
        </ScrollReveal>

        {/* Section: Cards */}
        <ScrollReveal delay={0.3}>
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>כרטיס ראשון</CardTitle>
                  <CardDescription>תיאור הכרטיס בעברית</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>תוכן הכרטיס עם padding לוגי שעובד ב-RTL.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>כרטיס שני</CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge>תגית</Badge>
                  <Badge variant="outline" className="ms-2">Outline</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>כרטיס שלישי</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatItem value="97%" label="שביעות רצון" icon={Star} featured />
                </CardContent>
              </Card>
            </div>
          </section>
        </ScrollReveal>

        {/* Section: CTA Groups */}
        <ScrollReveal delay={0.4}>
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">CTA Groups</h2>
            <CTAGroup
              primaryText="התחל בחינם"
              primaryIcon={ArrowLeft}
              secondaryText="למד עוד"
            />
            <CTAGroup
              primaryText="צור קשר"
              primaryIcon={Phone}
              primaryLoading
              secondaryText="שאלות נפוצות"
            />
          </section>
        </ScrollReveal>

        {/* Section: Stats */}
        <ScrollReveal delay={0.5}>
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Stats - Social Proof</h2>
            <StaggerContainer className="flex flex-wrap justify-center gap-12">
              <StatItem value="500+" label="לקוחות מרוצים" icon={Users} />
              <StatItem value="98%" label="שביעות רצון" icon={Star} featured />
              <StatItem value="24/7" label="תמיכה" icon={TrendingUp} />
            </StaggerContainer>
          </section>
        </ScrollReveal>

        {/* Section: Focus States */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Focus States - Tab Through</h2>
          <p className="text-muted-foreground">
            השתמש ב-Tab כדי לראות את טבעות המיקוד על האלמנטים האינטראקטיביים
          </p>
          <div className="flex flex-wrap gap-4">
            <Button>Focus Me</Button>
            <Button variant="outline">Or Me</Button>
            <Input placeholder="Or this input" className="max-w-xs" />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>Phase 13: Design System Complete</p>
          <p className="text-sm mt-2">
            Dark mode default | RTL Hebrew | 48px touch targets | WCAG AA contrast
          </p>
        </footer>
      </div>
    </main>
  );
}
