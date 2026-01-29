/**
 * Main Dashboard View
 *
 * Composes the full dashboard page with health status, stats cards, and activity feed.
 * Per CONTEXT.md: "Quick glance tells if everything is OK"
 *
 * Layout:
 * - Health status at top (full width)
 * - Two-column layout on desktop: stats on left, activity on right
 * - Single column on mobile: stats above activity
 *
 * Data loaded via JavaScript fetch from /api/dashboard/* endpoints.
 * Activity feed has real-time SSE updates via /api/activity/stream.
 */

import { renderActivityFeed } from './activity-feed';
import { renderReviewApproval } from './review-approval';
import { renderPhotoUpload } from './photo-upload';
import { renderPostContent } from './post-content';

/**
 * Renders the main dashboard HTML page.
 *
 * @param tenantId - Tenant UUID for API calls
 * @returns Full HTML page string
 */
export function renderMainDashboard(tenantId: string): string {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Findo - לוח בקרה</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .metric-card {
      transition: all 0.2s;
    }
    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1);
    }
  </style>
</head>
<body class="bg-gray-50 min-h-screen">
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">לוח הבקרה</h1>
        <p class="text-gray-500 mt-1">סקירה כללית של העסק שלך</p>
      </div>
      <a href="/dashboard/settings" class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors">
        <span>&#9881;</span>
        <span>הגדרות</span>
      </a>
    </div>

    <!-- Loading State -->
    <div id="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">טוען נתונים...</p>
    </div>

    <!-- Dashboard Content -->
    <div id="dashboard" class="hidden space-y-6">
      <!-- Health Status Section (Full Width) -->
      <section id="healthSection">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <!-- Traffic Light -->
          <div class="flex items-center gap-4 mb-6">
            <div id="trafficLight" class="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-gray-300">
              <span id="trafficIcon" class="text-white text-2xl font-bold">?</span>
            </div>
            <div>
              <h2 id="statusLabel" class="text-xl font-bold text-gray-800">טוען...</h2>
              <p class="text-sm text-gray-500">סטטוס המערכת</p>
            </div>
          </div>

          <!-- Component Breakdown -->
          <div class="flex justify-around items-start pt-4 border-t border-gray-100">
            <div class="flex flex-col items-center gap-1">
              <div class="flex items-center gap-2">
                <span id="whatsappIcon" class="text-gray-400 text-xl">&#8226;</span>
                <span class="text-sm font-medium text-gray-700">WhatsApp</span>
              </div>
              <span id="whatsappMessage" class="text-xs text-gray-500"></span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <div class="flex items-center gap-2">
                <span id="googleIcon" class="text-gray-400 text-xl">&#8226;</span>
                <span class="text-sm font-medium text-gray-700">Google</span>
              </div>
              <span id="googleMessage" class="text-xs text-gray-500"></span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <div class="flex items-center gap-2">
                <span id="reviewsIcon" class="text-gray-400 text-xl">&#8226;</span>
                <span class="text-sm font-medium text-gray-700">ביקורות</span>
              </div>
              <span id="reviewsMessage" class="text-xs text-gray-500"></span>
            </div>
          </div>
        </div>
      </section>

      <!-- Two Column Layout: Stats (1 col) + Activity Feed (2 cols) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Stats Section (1 column on desktop) -->
        <section id="statsSection" class="lg:col-span-1">
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-gray-800">סטטיסטיקות</h2>
              <a href="/dashboard/reports" class="text-blue-600 hover:underline text-sm">דוחות מפורטים &#8594;</a>
            </div>

            <!-- Period Toggle -->
            <div class="flex gap-2 mb-4">
              <button
                id="todayBtn"
                class="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm transition-colors"
                onclick="setPeriod('today')"
              >
                היום
              </button>
              <button
                id="weekBtn"
                class="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 text-sm transition-colors"
                onclick="setPeriod('week')"
              >
                השבוע
              </button>
              <button
                id="monthBtn"
                class="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 text-sm transition-colors"
                onclick="setPeriod('month')"
              >
                החודש
              </button>
            </div>

            <!-- Metric Cards Stack -->
            <div class="space-y-3">
              <!-- Missed Calls -->
              <div class="metric-card bg-gray-50 rounded-lg p-4">
                <p class="text-gray-500 text-sm mb-1">שיחות שלא נענו</p>
                <p id="missedCalls" class="text-2xl font-bold text-gray-800">-</p>
              </div>

              <!-- WhatsApp Sent -->
              <div class="metric-card bg-gray-50 rounded-lg p-4">
                <p class="text-gray-500 text-sm mb-1">הודעות WhatsApp</p>
                <p id="whatsappSent" class="text-2xl font-bold text-gray-800">-</p>
              </div>

              <!-- New Reviews -->
              <div class="metric-card bg-gray-50 rounded-lg p-4">
                <p class="text-gray-500 text-sm mb-1">ביקורות חדשות</p>
                <p id="newReviews" class="text-2xl font-bold text-gray-800">-</p>
              </div>

              <!-- Current Rating -->
              <div class="metric-card bg-gray-50 rounded-lg p-4">
                <p class="text-gray-500 text-sm mb-1">דירוג נוכחי</p>
                <div class="flex items-center gap-2">
                  <p id="currentRating" class="text-2xl font-bold text-gray-800">-</p>
                  <span id="ratingStars" class="text-yellow-500 text-lg"></span>
                </div>
              </div>

              <!-- Qualified Leads -->
              <div class="metric-card bg-gray-50 rounded-lg p-4">
                <p class="text-gray-500 text-sm mb-1">לידים מאושרים</p>
                <p id="qualifiedLeads" class="text-2xl font-bold text-gray-800">-</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Activity Feed Section (2 columns on desktop) -->
        <section id="activitySection" class="lg:col-span-2">
          ${renderActivityFeed(tenantId)}
        </section>
      </div>

      <!-- Actions Section -->
      <section id="actionsSection" class="mt-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">פעולות</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Pending Reviews Card -->
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onclick="openActionModal('reviews')">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span class="text-2xl">&#9733;</span>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-500">ביקורות לאישור</p>
                <p id="pendingReviewsCount" class="text-2xl font-bold text-gray-800">-</p>
              </div>
              <span class="text-blue-600">&#8592;</span>
            </div>
          </div>

          <!-- Photo Upload Card -->
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onclick="openActionModal('photos')">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span class="text-2xl">&#128247;</span>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-500">תמונות</p>
                <p id="photoStatus" class="text-lg font-medium text-gray-800">-</p>
              </div>
              <span class="text-blue-600">&#8592;</span>
            </div>
          </div>

          <!-- Post Content Card -->
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onclick="openActionModal('posts')">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span class="text-2xl">&#128221;</span>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-500">תוכן חודשי</p>
                <p id="postStatus" class="text-lg font-medium text-gray-800">-</p>
              </div>
              <span class="text-blue-600">&#8592;</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Action Modals -->
    <div id="actionModalOverlay" class="hidden fixed inset-0 bg-black bg-opacity-50 z-40" onclick="closeActionModal()"></div>

    <div id="reviewsModal" class="hidden fixed inset-4 md:inset-10 bg-white rounded-xl z-50 overflow-y-auto">
      <div class="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
        <h3 class="text-lg font-semibold">ביקורות לאישור</h3>
        <button onclick="closeActionModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&#10005;</button>
      </div>
      <div class="p-4">
        ${renderReviewApproval()}
      </div>
    </div>

    <div id="photosModal" class="hidden fixed inset-4 md:inset-10 bg-white rounded-xl z-50 overflow-y-auto">
      <div class="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
        <h3 class="text-lg font-semibold">העלאת תמונות</h3>
        <button onclick="closeActionModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&#10005;</button>
      </div>
      <div class="p-4">
        ${renderPhotoUpload()}
      </div>
    </div>

    <div id="postsModal" class="hidden fixed inset-4 md:inset-10 bg-white rounded-xl z-50 overflow-y-auto">
      <div class="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
        <h3 class="text-lg font-semibold">תוכן חודשי</h3>
        <button onclick="closeActionModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&#10005;</button>
      </div>
      <div class="p-4">
        ${renderPostContent()}
      </div>
    </div>

    <!-- Error State -->
    <div id="errorState" class="hidden text-center py-12">
      <p class="text-red-600 mb-4">שגיאה בטעינת הנתונים</p>
      <button onclick="loadDashboard()" class="px-4 py-2 bg-blue-600 text-white rounded-lg">נסה שוב</button>
    </div>
  </div>

  <script>
    const tenantId = '${tenantId}';
    let currentPeriod = 'today';

    // Component status icons
    const STATUS_ICONS = {
      ok: { icon: '&#10003;', color: 'text-green-600' },
      warning: { icon: '&#9888;', color: 'text-yellow-600' },
      error: { icon: '&#10007;', color: 'text-red-600' }
    };

    // Traffic light colors
    const TRAFFIC_COLORS = {
      green: { bg: 'bg-green-500', icon: '&#10003;', label: 'הכל תקין' },
      yellow: { bg: 'bg-yellow-500', icon: '!', label: 'יש להתייחס' },
      red: { bg: 'bg-red-500', icon: '&#10007;', label: 'נדרשת פעולה' }
    };

    function formatNumber(n) {
      if (n === null || n === undefined) return '-';
      return n.toLocaleString('he-IL');
    }

    function renderStars(rating) {
      if (!rating) return '';
      const fullStars = Math.floor(rating);
      const hasHalf = rating - fullStars >= 0.5;
      const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
      let stars = '';
      for (let i = 0; i < fullStars; i++) stars += '&#9733;';
      if (hasHalf) stars += '&#9734;';
      for (let i = 0; i < emptyStars; i++) stars += '&#9734;';
      return stars;
    }

    function updateComponentStatus(id, status, message) {
      const iconEl = document.getElementById(id + 'Icon');
      const msgEl = document.getElementById(id + 'Message');
      const { icon, color } = STATUS_ICONS[status] || STATUS_ICONS.error;
      iconEl.innerHTML = icon;
      iconEl.className = color + ' text-xl';
      if (msgEl) msgEl.textContent = message || '';
    }

    async function loadHealth() {
      try {
        const res = await fetch('/api/dashboard/health', {
          headers: { 'X-Tenant-ID': tenantId }
        });
        const data = await res.json();

        if (data.health) {
          const { overall, components } = data.health;

          // Update traffic light
          const light = TRAFFIC_COLORS[overall] || TRAFFIC_COLORS.red;
          const trafficEl = document.getElementById('trafficLight');
          trafficEl.className = 'w-16 h-16 rounded-full flex items-center justify-center shadow-lg ' + light.bg;
          document.getElementById('trafficIcon').innerHTML = light.icon;
          document.getElementById('statusLabel').textContent = light.label;

          // Update component statuses
          updateComponentStatus('whatsapp', components.whatsapp.status, components.whatsapp.message);
          updateComponentStatus('google', components.google.status, components.google.message);
          updateComponentStatus('reviews', components.reviews.status, components.reviews.message);
        }
      } catch (err) {
        console.error('Failed to load health:', err);
      }
    }

    async function loadStats() {
      try {
        const res = await fetch('/api/dashboard/stats?period=' + currentPeriod, {
          headers: { 'X-Tenant-ID': tenantId }
        });
        const data = await res.json();

        if (data.stats) {
          const { missedCalls, whatsappSent, newReviews, currentRating, qualifiedLeads } = data.stats;

          document.getElementById('missedCalls').textContent = formatNumber(missedCalls);
          document.getElementById('whatsappSent').textContent = formatNumber(whatsappSent);
          document.getElementById('newReviews').textContent = formatNumber(newReviews);
          document.getElementById('qualifiedLeads').textContent = formatNumber(qualifiedLeads);

          if (currentRating !== null) {
            document.getElementById('currentRating').textContent = currentRating.toFixed(1);
            document.getElementById('ratingStars').innerHTML = renderStars(currentRating);
          } else {
            document.getElementById('currentRating').textContent = '-';
            document.getElementById('ratingStars').innerHTML = '';
          }
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    }

    function setPeriod(period) {
      currentPeriod = period;

      // Update button styles
      ['today', 'week', 'month'].forEach(p => {
        const btn = document.getElementById(p + 'Btn');
        if (p === period) {
          btn.className = 'px-4 py-2 rounded-lg bg-blue-600 text-white transition-colors';
        } else {
          btn.className = 'px-4 py-2 rounded-lg bg-gray-200 text-gray-700 transition-colors';
        }
      });

      loadStats();
    }

    async function loadDashboard() {
      document.getElementById('loading').classList.remove('hidden');
      document.getElementById('dashboard').classList.add('hidden');
      document.getElementById('errorState').classList.add('hidden');

      try {
        await Promise.all([loadHealth(), loadStats()]);
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('errorState').classList.remove('hidden');
      }
    }

    // Load action statuses
    async function loadActionStatuses() {
      try {
        // Load pending reviews count
        const reviewsRes = await fetch('/api/dashboard/pending-reviews', {
          headers: { 'X-Tenant-ID': tenantId }
        });
        const reviewsData = await reviewsRes.json();
        const count = reviewsData.reviews?.length || 0;
        document.getElementById('pendingReviewsCount').textContent = count > 0 ? count.toString() : 'אין';

        // Load photo request status
        const photoRes = await fetch('/api/dashboard/photo-request', {
          headers: { 'X-Tenant-ID': tenantId }
        });
        const photoData = await photoRes.json();
        document.getElementById('photoStatus').textContent = photoData.hasPending ? 'יש בקשה' : 'אין בקשות';

        // Load post request status
        const postRes = await fetch('/api/dashboard/post-request', {
          headers: { 'X-Tenant-ID': tenantId }
        });
        const postData = await postRes.json();
        if (postData.hasPending && postData.post?.status === 'pending_approval') {
          document.getElementById('postStatus').textContent = 'ממתין לאישור';
        } else if (postData.hasPending) {
          document.getElementById('postStatus').textContent = 'ממתין לתוכן';
        } else {
          document.getElementById('postStatus').textContent = 'אין פעיל';
        }
      } catch (err) {
        console.error('Failed to load action statuses:', err);
      }
    }

    // Modal functions
    let currentModal = null;

    function openActionModal(type) {
      closeActionModal();
      currentModal = type;
      document.getElementById('actionModalOverlay').classList.remove('hidden');
      document.getElementById(type + 'Modal').classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      // Trigger reload of modal content
      if (type === 'reviews' && typeof loadPendingReviews === 'function') {
        loadPendingReviews();
      } else if (type === 'photos' && typeof loadPhotoRequestStatus === 'function') {
        loadPhotoRequestStatus();
      } else if (type === 'posts' && typeof loadPostStatus === 'function') {
        loadPostStatus();
      }
    }

    function closeActionModal() {
      document.getElementById('actionModalOverlay').classList.add('hidden');
      if (currentModal) {
        document.getElementById(currentModal + 'Modal').classList.add('hidden');
      }
      currentModal = null;
      document.body.style.overflow = '';

      // Refresh action statuses after closing
      loadActionStatuses();
    }

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && currentModal) {
        closeActionModal();
      }
    });

    // Make tenantId available globally for action components
    window.tenantId = tenantId;

    // Load dashboard on page load
    loadDashboard();
    loadActionStatuses();
  </script>
</body>
</html>`;
}
