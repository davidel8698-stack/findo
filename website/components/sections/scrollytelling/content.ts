/**
 * Hebrew content for the Emotional Scrollytelling Section
 * Phase 33 - Terminal Industries-inspired scroll experience
 */

export interface ScrollPhase {
  id: string;
  lines: string[];
  /** Scroll progress range [start, end] as 0-1 */
  range: [number, number];
}

export const scrollytellingContent = {
  phases: [
    {
      id: "hook",
      lines: ["אם הגעתם לכאן,", "יתכן שמשהו בשיווק של העסק שלכם לא מרגיש יציב."],
      range: [0, 0.15] as [number, number],
    },
    {
      id: "pain",
      lines: ["יש תקופות עם פניות", "ויש תקופות שפחות."],
      range: [0.15, 0.3] as [number, number],
    },
    {
      id: "confusion",
      lines: [
        "לא תמיד ברור:",
        "מה באמת מביא לקוחות?",
        "על מה שווה להשקיע?",
        "ומה סתם שטויות...",
      ],
      range: [0.3, 0.5] as [number, number],
    },
    {
      id: "problem",
      lines: [
        "הפתרונות הקיימים היום דורשים:",
        "הרבה כסף",
        "הרבה ניהול שוטף",
        "הרבה ידע.",
      ],
      range: [0.5, 0.65] as [number, number],
    },
    {
      id: "mismatch",
      lines: ["וזה לא מותאם", "לאופן שבו עסק קטן באמת מתנהל."],
      range: [0.65, 0.75] as [number, number],
    },
    {
      id: "tease",
      lines: [
        "אם אתם מחפשים שיווק אמיתי",
        "שמתאים בדיוק לאופן שבו עסק קטן מתנהל.",
      ],
      range: [0.75, 0.88] as [number, number],
    },
  ] satisfies ScrollPhase[],

  finale: {
    text: "הגעתם למקום הנכון.",
    range: [0.88, 1] as [number, number],
  },
} as const;

/** Total scroll distance in pixels */
export const SCROLL_DISTANCE = 5000;

/** Mobile scroll distance (shorter for better UX) */
export const SCROLL_DISTANCE_MOBILE = 3000;

/** Particle counts */
export const PARTICLE_COUNT_DESKTOP = 60;
export const PARTICLE_COUNT_MOBILE = 25;
