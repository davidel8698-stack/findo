/**
 * Progressive profiling questions.
 *
 * These questions are sent to business owners weekly via WhatsApp
 * to collect additional business details post-setup. The goal is
 * to keep initial setup minimal (2 minutes) while gradually
 * building a richer business profile.
 *
 * Questions are sent:
 * - One per week, Monday 10:00 AM Israel time
 * - Maximum 4 questions total (weeks 1-4)
 * - System stops after 2 consecutive ignored questions
 */

/**
 * Progressive question definition.
 */
export interface ProgressiveQuestion {
  /** Week number (1-4) when this question is sent */
  week: number;
  /** Hebrew question text */
  question: string;
  /** Field name where answer is stored in tenant profile */
  field: string;
  /** Response type - text or quick reply buttons */
  type: 'text' | 'quick_reply';
  /** Options for quick_reply type */
  options?: string[];
}

/**
 * Progressive profiling questions for weeks 1-4.
 * All questions in Hebrew for Israeli market.
 */
export const PROGRESSIVE_QUESTIONS: ProgressiveQuestion[] = [
  {
    week: 1,
    question: 'מה השירותים העיקריים שאתם מציעים? (לדוגמה: תיקוני צנרת, התקנת דוד שמש...)',
    field: 'services',
    type: 'text',
  },
  {
    week: 2,
    question: 'מה מייחד את העסק שלכם מהמתחרים?',
    field: 'uniqueValue',
    type: 'text',
  },
  {
    week: 3,
    question: 'יש לכם חניה ללקוחות? נגישות לנכים?',
    field: 'amenities',
    type: 'quick_reply',
    options: ['יש חניה', 'יש נגישות', 'שניהם', 'אף אחד'],
  },
  {
    week: 4,
    question: 'האם יש ימים או שעות שבהם העסק סגור באופן קבוע? (חגים, ימי שישי...)',
    field: 'specialClosures',
    type: 'text',
  },
];

/**
 * Get the question for a specific week.
 *
 * @param week - Week number (1-4)
 * @returns Question for that week, or undefined if no question exists
 */
export function getQuestionForWeek(week: number): ProgressiveQuestion | undefined {
  return PROGRESSIVE_QUESTIONS.find(q => q.week === week);
}
