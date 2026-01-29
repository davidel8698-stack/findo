/**
 * Stats Cards Component
 *
 * Renders the dashboard stats cards with period toggle.
 * Per CONTEXT.md: "Switchable time periods - Tabs or dropdown: Today / This Week / This Month"
 * Per DASH-01: "Main screen shows daily stats (calls received, unanswered, WhatsApp sent, new reviews, current rating)"
 *
 * Data is loaded via JavaScript fetch; this component renders the structure.
 */

/**
 * Renders the stats cards component with period toggle and metric cards.
 *
 * @returns HTML string for the stats cards section
 */
export function renderStatsCards(): string {
  return `
    <div class="space-y-6">
      <!-- Period Toggle -->
      <div class="flex gap-2">
        <button
          id="todayBtn"
          class="px-4 py-2 rounded-lg bg-blue-600 text-white transition-colors"
          onclick="setPeriod('today')"
        >
          היום
        </button>
        <button
          id="weekBtn"
          class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 transition-colors"
          onclick="setPeriod('week')"
        >
          השבוע
        </button>
        <button
          id="monthBtn"
          class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 transition-colors"
          onclick="setPeriod('month')"
        >
          החודש
        </button>
      </div>

      <!-- Metric Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Missed Calls -->
        <div class="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p class="text-gray-500 text-sm mb-1">שיחות שלא נענו</p>
          <p id="missedCalls" class="text-3xl font-bold text-gray-800">-</p>
        </div>

        <!-- WhatsApp Sent -->
        <div class="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p class="text-gray-500 text-sm mb-1">הודעות WhatsApp</p>
          <p id="whatsappSent" class="text-3xl font-bold text-gray-800">-</p>
        </div>

        <!-- New Reviews -->
        <div class="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p class="text-gray-500 text-sm mb-1">ביקורות חדשות</p>
          <p id="newReviews" class="text-3xl font-bold text-gray-800">-</p>
        </div>

        <!-- Current Rating -->
        <div class="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p class="text-gray-500 text-sm mb-1">דירוג נוכחי</p>
          <div class="flex items-center gap-2">
            <p id="currentRating" class="text-3xl font-bold text-gray-800">-</p>
            <span id="ratingStars" class="text-yellow-500 text-xl"></span>
          </div>
        </div>

        <!-- Qualified Leads -->
        <div class="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p class="text-gray-500 text-sm mb-1">לידים מאושרים</p>
          <p id="qualifiedLeads" class="text-3xl font-bold text-gray-800">-</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generates star rating HTML based on numeric rating.
 *
 * @param rating - Numeric rating (0-5)
 * @returns HTML string with star icons
 */
export function renderStars(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  let stars = '';
  for (let i = 0; i < fullStars; i++) {
    stars += '&#9733;'; // Full star
  }
  if (hasHalf) {
    stars += '&#9734;'; // Half star (using empty star as approximation)
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += '&#9734;'; // Empty star
  }

  return stars;
}
