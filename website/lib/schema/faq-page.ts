import type { FAQPage, WithContext } from "schema-dts";

/**
 * FAQPage JSON-LD Schema
 * Matches the FAQ items displayed in FAQSection component
 *
 * @see https://schema.org/FAQPage
 */
export const faqPageSchema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "כמה זמן לוקח להתחיל?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "הגדרה תוך 2 דקות. מחברים את חשבון Google Business שלכם ומתחילים לעבוד מיד.",
      },
    },
    {
      "@type": "Question",
      name: "אפשר לבטל בכל רגע?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "כן. ללא התחייבות, ללא דמי ביטול. מבטלים בקליק אחד.",
      },
    },
    {
      "@type": "Question",
      name: "מה ההבדל מלעשות לבד?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Findo עובד 24/7 בלי הפסקה. עונה לביקורות, לוכד לידים, ומבקש ביקורות - הכל אוטומטי בזמן שאתם מתמקדים בעסק.",
      },
    },
    {
      "@type": "Question",
      name: "מה אם זה לא עובד לעסק שלי?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "יש לנו אחריות 14 יום. לא מרוצים? החזר מלא ללא שאלות. בנוסף, אנחנו מתחייבים ל-10 ביקורות חדשות בחודש הראשון.",
      },
    },
    {
      "@type": "Question",
      name: "אני צריך עזרה, יש תמיכה?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "כן! צוות התמיכה שלנו זמין בוואטסאפ. שאלה? שלחו הודעה ונחזור אליכם תוך דקות.",
      },
    },
  ],
};
