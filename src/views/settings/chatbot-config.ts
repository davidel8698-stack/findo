/**
 * Chatbot Configuration Component
 *
 * Renders chatbot question customization UI.
 * Per CONTEXT.md: "Full chatbot customization - owner can change everything:
 * add questions, edit texts, reorder"
 *
 * Features:
 * - List of questions with drag handle for reorder
 * - Each question editable: text input, type dropdown
 * - Required toggle and active toggle per question
 * - Add/delete question buttons
 * - Preview section
 */

export interface ChatbotQuestion {
  id: string;
  text: string;
  expectedType: 'text' | 'phone' | 'choice';
  order: number;
  isRequired: boolean;
  isActive: boolean;
}

const defaultQuestions: ChatbotQuestion[] = [
  { id: 'name', text: 'איך קוראים לך?', expectedType: 'text', order: 1, isRequired: true, isActive: true },
  { id: 'need', text: 'במה אוכל לעזור לך?', expectedType: 'text', order: 2, isRequired: true, isActive: true },
  { id: 'preference', text: 'מתי נוח לך שנחזור אליך?', expectedType: 'text', order: 3, isRequired: false, isActive: true },
];

/**
 * Renders a single question card with edit controls.
 */
function renderQuestionCard(question: ChatbotQuestion, index: number): string {
  const typeOptions = [
    { value: 'text', label: 'טקסט חופשי' },
    { value: 'phone', label: 'מספר טלפון' },
    { value: 'choice', label: 'בחירה מרשימה' },
  ];

  return `
    <div class="question-card bg-gray-50 rounded-lg p-4 border border-gray-200" data-question-id="${question.id}" data-order="${question.order}">
      <!-- Header with drag handle and delete -->
      <div class="flex items-center gap-3 mb-3">
        <button
          type="button"
          class="drag-handle cursor-grab text-gray-400 hover:text-gray-600"
          title="גרור לשינוי סדר"
        >
          <span class="text-lg">&#9776;</span>
        </button>
        <span class="text-sm font-medium text-gray-500">שאלה ${index + 1}</span>
        <div class="flex-1"></div>
        <button
          type="button"
          onclick="deleteQuestion('${question.id}')"
          class="text-red-400 hover:text-red-600 transition-colors"
          title="מחק שאלה"
        >
          <span class="text-lg">&#128465;</span>
        </button>
      </div>

      <!-- Question text input -->
      <div class="mb-3">
        <label class="block text-xs text-gray-500 mb-1">טקסט השאלה</label>
        <input
          type="text"
          value="${escapeHtml(question.text)}"
          onchange="updateQuestion('${question.id}', 'text', this.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="הקלד את השאלה..."
        >
      </div>

      <!-- Type and toggles row -->
      <div class="flex flex-wrap gap-4 items-center">
        <!-- Type dropdown -->
        <div class="flex-1 min-w-[140px]">
          <label class="block text-xs text-gray-500 mb-1">סוג תשובה</label>
          <select
            onchange="updateQuestion('${question.id}', 'expectedType', this.value)"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            ${typeOptions
              .map(
                (opt) => `
              <option value="${opt.value}" ${opt.value === question.expectedType ? 'selected' : ''}>
                ${opt.label}
              </option>
            `
              )
              .join('')}
          </select>
        </div>

        <!-- Required toggle -->
        <div class="flex items-center gap-2">
          <label class="text-xs text-gray-600">חובה</label>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              ${question.isRequired ? 'checked' : ''}
              onchange="updateQuestion('${question.id}', 'isRequired', this.checked)"
              class="sr-only peer"
            >
            <div class="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <!-- Active toggle -->
        <div class="flex items-center gap-2">
          <label class="text-xs text-gray-600">פעיל</label>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              ${question.isActive ? 'checked' : ''}
              onchange="updateQuestion('${question.id}', 'isActive', this.checked)"
              class="sr-only peer"
            >
            <div class="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the preview section showing how questions will appear.
 */
function renderPreview(questions: ChatbotQuestion[]): string {
  const activeQuestions = questions.filter((q) => q.isActive).sort((a, b) => a.order - b.order);

  if (activeQuestions.length === 0) {
    return `
      <div class="text-center py-4 text-gray-500">
        <p>אין שאלות פעילות להציג</p>
      </div>
    `;
  }

  return `
    <div class="space-y-3">
      ${activeQuestions
        .map(
          (q, i) => `
        <div class="flex gap-2">
          <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
            ${i + 1}
          </div>
          <div class="bg-white rounded-lg rounded-tr-none px-4 py-2 shadow-sm border border-gray-100 flex-1">
            <p class="text-gray-800 text-sm">${escapeHtml(q.text)}</p>
            ${q.isRequired ? '<span class="text-xs text-red-500">*</span>' : ''}
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

/**
 * HTML escape helper.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Renders the chatbot configuration form HTML.
 *
 * @param questions - Current chatbot questions (or defaults)
 * @returns HTML string for the chatbot configuration form
 */
export function renderChatbotConfig(questions?: ChatbotQuestion[]): string {
  const qs = questions ?? defaultQuestions;
  const sortedQuestions = [...qs].sort((a, b) => a.order - b.order);

  return `
    <div class="space-y-6">
      <!-- Questions List -->
      <div>
        <h3 class="text-sm font-medium text-gray-700 mb-3">שאלות הסמכה</h3>
        <div id="questionsList" class="space-y-3">
          ${sortedQuestions.map((q, i) => renderQuestionCard(q, i)).join('')}
        </div>

        <!-- Add Question Button -->
        <button
          type="button"
          onclick="addQuestion()"
          class="mt-4 w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <span class="text-lg">&#43;</span>
          <span>הוסף שאלה</span>
        </button>
      </div>

      <!-- Preview Section -->
      <div class="border-t border-gray-200 pt-6">
        <h3 class="text-sm font-medium text-gray-700 mb-3">תצוגה מקדימה</h3>
        <div class="bg-gradient-to-b from-gray-100 to-gray-50 rounded-xl p-4">
          <div class="max-w-sm mx-auto">
            <div class="text-center text-xs text-gray-500 mb-4">כך יראו השאלות בצ'אט</div>
            <div id="chatbotPreview">
              ${renderPreview(sortedQuestions)}
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onclick="saveChatbotConfig()"
          class="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          שמור שינויים
        </button>
        <button
          type="button"
          onclick="resetChatbotConfig()"
          class="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          אפס לברירת מחדל
        </button>
      </div>
    </div>

<!-- Drag and Drop is handled by main.ts script -->
  `;
}
