"use client";

import { JourneyBlock } from "./JourneyBlock";
import styles from "./text-journey.module.css";

// Content blocks - emotional journey from pain to solution
const journeyContent = [
  {
    id: "hook",
    lines: [
      "אם הגעתם לכאן",
      "יתכן שמשהו בשיווק של העסק שלכם",
      "לא מרגיש יציב.",
    ],
  },
  {
    id: "pain",
    lines: ["יש תקופות עם פניות", "ויש תקופות שפחות."],
  },
  {
    id: "confusion",
    lines: [
      "לא תמיד ברור:",
      "מה באמת מביא לקוחות",
      "ועל מה שווה להשקיע.",
    ],
  },
  {
    id: "problem",
    lines: [
      "רוב הפתרונות דורשים הרבה כסף, ניהול שוטף וידע.",
      "וזה לא מותאם לאופן שבו עסק קטן באמת מתנהל.",
    ],
  },
  {
    id: "tease",
    lines: [
      "אם אתם מחפשים שיווק",
      "שמתאים לאופן שבו עסק קטן באמת מתנהל?",
      "הגעתם למקום הנכון.",
    ],
  },
];

export function TextJourneySection() {
  return (
    <section className={styles.section}>
      {/* Pain point blocks */}
      {journeyContent.map((block) => (
        <JourneyBlock key={block.id} lines={block.lines} variant="normal" />
      ))}

    </section>
  );
}
