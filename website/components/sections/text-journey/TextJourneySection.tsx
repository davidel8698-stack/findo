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
      "על מה שווה להשקיע",
      "ומה סתם רעש",
    ],
  },
  {
    id: "problem",
    lines: ["רוב הפתרונות דורשים", "הרבה כסף, ניהול שוטף וידע."],
  },
  {
    id: "mismatch",
    lines: ["וזה לא מותאם לאופן שבו", "עסק קטן באמת מתנהל."],
  },
  {
    id: "tease",
    lines: ["אם אתם מחפשים שיווק", "שלא יצריך ממכם התעסקות בשוטף."],
  },
];

const resolution = {
  id: "resolution",
  lines: ["הגעתם למקום הנכון."],
};

export function TextJourneySection() {
  return (
    <section className={styles.section}>
      {/* Pain point blocks */}
      {journeyContent.map((block) => (
        <JourneyBlock key={block.id} lines={block.lines} variant="normal" />
      ))}

      {/* Resolution - dramatic ending */}
      <JourneyBlock
        key={resolution.id}
        lines={resolution.lines}
        variant="resolution"
      />
    </section>
  );
}
