"use client";

import { MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const faqItems = [
  {
    question: "כמה זמן לוקח להתחיל?",
    answer:
      "הגדרה תוך 2 דקות. מחברים את חשבון Google Business שלכם ומתחילים לעבוד מיד.",
  },
  {
    question: "אפשר לבטל בכל רגע?",
    answer: "כן. ללא התחייבות, ללא דמי ביטול. מבטלים בקליק אחד.",
  },
  {
    question: "מה ההבדל מלעשות לבד?",
    answer:
      "Findo עובד 24/7 בלי הפסקה. עונה לביקורות, לוכד לידים, ומבקש ביקורות - הכל אוטומטי בזמן שאתם מתמקדים בעסק.",
  },
  {
    question: "מה אם זה לא עובד לעסק שלי?",
    answer:
      "יש לנו אחריות 14 יום. לא מרוצים? החזר מלא ללא שאלות. בנוסף, אנחנו מתחייבים ל-10 ביקורות חדשות בחודש הראשון.",
  },
  {
    question: "אני צריך עזרה, יש תמיכה?",
    answer:
      "כן! צוות התמיכה שלנו זמין בוואטסאפ. שאלה? שלחו הודעה ונחזור אליכם תוך דקות.",
  },
];

export function FAQSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-3xl font-bold text-center mb-12">שאלות נפוצות</h2>
        </ScrollReveal>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible>
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* WhatsApp CTA at bottom */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">עדיין יש לכם שאלות?</p>
            <Button variant="outline" asChild>
              <a href="https://wa.me/972XXXXXXXXX?text=שלום, יש לי שאלה על Findo">
                <MessageCircle className="me-2 h-4 w-4" />
                שלחו לנו הודעה בוואטסאפ
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
