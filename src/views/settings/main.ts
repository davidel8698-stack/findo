/**
 * Main Settings Page
 *
 * Composes the full settings page with tab navigation.
 * Tabs: timing | notifications | chatbot
 *
 * JavaScript handles:
 * - Fetching GET /api/settings on load
 * - Populating forms with current values
 * - Saving changes via PUT to relevant endpoints
 * - Toast notifications for success/error
 */

import { renderTimingSettings } from './timing-settings';
import { renderNotificationPrefs } from './notification-prefs';
import { renderChatbotConfig } from './chatbot-config';

/**
 * Renders the main settings page HTML.
 *
 * @param tenantId - Tenant UUID for API calls
 * @returns Full HTML page string
 */
export function renderSettingsPage(tenantId: string): string {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Findo - הגדרות</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .tab-active {
      border-bottom-color: #2563eb;
      color: #2563eb;
    }
    .toast {
      animation: slideIn 0.3s ease-out;
    }
    @keyframes slideIn {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  </style>
</head>
<body class="bg-gray-50 min-h-screen">
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <!-- Header with back link -->
    <div class="mb-6">
      <a href="/dashboard" class="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
        <span>&#8592;</span>
        <span>חזרה ללוח הבקרה</span>
      </a>
    </div>

    <!-- Page Title -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">הגדרות</h1>
      <p class="text-gray-500 mt-1">התאם את Findo לצרכי העסק שלך</p>
    </div>

    <!-- Toast Container -->
    <div id="toastContainer" class="fixed top-4 left-1/2 -translate-x-1/2 z-50"></div>

    <!-- Loading State -->
    <div id="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">טוען הגדרות...</p>
    </div>

    <!-- Settings Content -->
    <div id="settingsContent" class="hidden">
      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="flex gap-6">
          <button
            id="tabTiming"
            onclick="setActiveTab('timing')"
            class="py-3 px-1 border-b-2 font-medium text-sm transition-colors border-transparent text-gray-500 hover:text-gray-700"
          >
            תזמון
          </button>
          <button
            id="tabNotifications"
            onclick="setActiveTab('notifications')"
            class="py-3 px-1 border-b-2 font-medium text-sm transition-colors border-transparent text-gray-500 hover:text-gray-700"
          >
            התראות
          </button>
          <button
            id="tabChatbot"
            onclick="setActiveTab('chatbot')"
            class="py-3 px-1 border-b-2 font-medium text-sm transition-colors border-transparent text-gray-500 hover:text-gray-700"
          >
            צ'אטבוט
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div id="timingContent" class="hidden">
          ${renderTimingSettings()}
        </div>
        <div id="notificationsContent" class="hidden">
          ${renderNotificationPrefs()}
        </div>
        <div id="chatbotContent" class="hidden">
          ${renderChatbotConfig()}
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div id="errorState" class="hidden text-center py-12">
      <p class="text-red-600 mb-4">שגיאה בטעינת ההגדרות</p>
      <button onclick="loadSettings()" class="px-4 py-2 bg-blue-600 text-white rounded-lg">נסה שוב</button>
    </div>
  </div>

  <script>
    const tenantId = '${tenantId}';
    let currentTab = 'timing';
    let settingsData = null;
    let chatbotQuestions = [];
    let pendingNotificationChanges = {};

    // --- Tab Management ---
    function setActiveTab(tab) {
      currentTab = tab;

      // Update tab button styles
      ['timing', 'notifications', 'chatbot'].forEach(t => {
        const btn = document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1));
        const content = document.getElementById(t + 'Content');

        if (t === tab) {
          btn.classList.add('tab-active', 'border-blue-600', 'text-blue-600');
          btn.classList.remove('border-transparent', 'text-gray-500');
          content.classList.remove('hidden');
        } else {
          btn.classList.remove('tab-active', 'border-blue-600', 'text-blue-600');
          btn.classList.add('border-transparent', 'text-gray-500');
          content.classList.add('hidden');
        }
      });
    }

    // --- Toast Notifications ---
    function showToast(message, type = 'success') {
      const container = document.getElementById('toastContainer');
      const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
      };

      const toast = document.createElement('div');
      toast.className = 'toast px-4 py-3 rounded-lg text-white shadow-lg mb-2 ' + colors[type];
      toast.textContent = message;

      container.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 3000);
    }

    // --- API Helpers ---
    async function apiRequest(method, path, body = null) {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': tenantId
        }
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const res = await fetch('/api/settings' + path, options);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    }

    // --- Load Settings ---
    async function loadSettings() {
      document.getElementById('loading').classList.remove('hidden');
      document.getElementById('settingsContent').classList.add('hidden');
      document.getElementById('errorState').classList.add('hidden');

      try {
        const data = await apiRequest('GET', '');
        settingsData = data.settings;
        chatbotQuestions = data.settings.chatbot || [];

        populateForms(settingsData);

        document.getElementById('loading').classList.add('hidden');
        document.getElementById('settingsContent').classList.remove('hidden');
        setActiveTab('timing');
      } catch (err) {
        console.error('Failed to load settings:', err);
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('errorState').classList.remove('hidden');
      }
    }

    // --- Populate Forms ---
    function populateForms(settings) {
      // Timing
      const delaySelect = document.getElementById('reviewRequestDelay');
      const reminderSelect = document.getElementById('reviewReminderDelay');

      if (delaySelect) delaySelect.value = settings.timing.reviewRequestDelayHours;
      if (reminderSelect) reminderSelect.value = settings.timing.reviewReminderDelayDays;

      // Notifications
      const notifFields = [
        'notifyNewLead', 'notifyLeadQualified', 'notifyLeadUnresponsive',
        'notifyNewReview', 'notifyNegativeReview', 'notifyReviewPosted',
        'notifyPhotoRequest', 'notifyPostApproval',
        'notifySystemAlert', 'notifyWeeklyReport'
      ];

      notifFields.forEach(field => {
        const checkbox = document.getElementById(field);
        if (checkbox) {
          checkbox.checked = settings.notifications[field];
        }
      });

      // Reset pending changes
      pendingNotificationChanges = {};
    }

    // --- Timing Settings ---
    async function saveTimingSettings() {
      const delaySelect = document.getElementById('reviewRequestDelay');
      const reminderSelect = document.getElementById('reviewReminderDelay');

      try {
        await apiRequest('PUT', '/timing', {
          reviewRequestDelayHours: parseInt(delaySelect.value, 10),
          reviewReminderDelayDays: parseInt(reminderSelect.value, 10)
        });

        showToast('הגדרות התזמון נשמרו');
      } catch (err) {
        showToast(err.message || 'שגיאה בשמירת ההגדרות', 'error');
      }
    }

    async function resetTimingSettings() {
      try {
        const data = await apiRequest('POST', '/reset', { section: 'timing' });
        settingsData = data.settings;
        populateForms(settingsData);
        showToast('הגדרות התזמון אופסו');
      } catch (err) {
        showToast(err.message || 'שגיאה באיפוס ההגדרות', 'error');
      }
    }

    // --- Notification Settings ---
    function onNotificationToggle(field, value) {
      pendingNotificationChanges[field] = value;
    }

    async function saveNotificationPrefs() {
      try {
        // Collect current state of all toggles
        const notifFields = [
          'notifyNewLead', 'notifyLeadQualified', 'notifyLeadUnresponsive',
          'notifyNewReview', 'notifyNegativeReview', 'notifyReviewPosted',
          'notifyPhotoRequest', 'notifyPostApproval',
          'notifySystemAlert', 'notifyWeeklyReport'
        ];

        const prefs = {};
        notifFields.forEach(field => {
          const checkbox = document.getElementById(field);
          if (checkbox && !checkbox.disabled) {
            prefs[field] = checkbox.checked;
          }
        });

        await apiRequest('PUT', '/notifications', prefs);
        showToast('העדפות ההתראות נשמרו');
        pendingNotificationChanges = {};
      } catch (err) {
        showToast(err.message || 'שגיאה בשמירת ההגדרות', 'error');
      }
    }

    async function resetNotificationPrefs() {
      try {
        const data = await apiRequest('POST', '/reset', { section: 'notifications' });
        settingsData = data.settings;
        populateForms(settingsData);
        showToast('העדפות ההתראות אופסו');
      } catch (err) {
        showToast(err.message || 'שגיאה באיפוס ההגדרות', 'error');
      }
    }

    // --- Chatbot Settings ---
    function updateQuestion(id, field, value) {
      const question = chatbotQuestions.find(q => q.id === id);
      if (question) {
        question[field] = value;
        updatePreview();
      }
    }

    function deleteQuestion(id) {
      if (chatbotQuestions.length <= 1) {
        showToast('חייבת להיות לפחות שאלה אחת', 'error');
        return;
      }

      chatbotQuestions = chatbotQuestions.filter(q => q.id !== id);

      // Re-render the questions list
      renderQuestionsList();
      updatePreview();
    }

    function addQuestion() {
      const newId = 'q_' + Date.now();
      const maxOrder = Math.max(...chatbotQuestions.map(q => q.order), 0);

      chatbotQuestions.push({
        id: newId,
        text: '',
        expectedType: 'text',
        order: maxOrder + 1,
        isRequired: false,
        isActive: true
      });

      // Re-render the questions list
      renderQuestionsList();
    }

    function renderQuestionsList() {
      const sorted = [...chatbotQuestions].sort((a, b) => a.order - b.order);
      const list = document.getElementById('questionsList');

      list.innerHTML = sorted.map((q, i) => renderQuestionCard(q, i)).join('');

      // Re-attach drag handlers
      initDragDrop();
    }

    function renderQuestionCard(question, index) {
      const typeOptions = [
        { value: 'text', label: 'טקסט חופשי' },
        { value: 'phone', label: 'מספר טלפון' },
        { value: 'choice', label: 'בחירה מרשימה' }
      ];

      return \`
        <div class="question-card bg-gray-50 rounded-lg p-4 border border-gray-200" data-question-id="\${question.id}" data-order="\${question.order}">
          <div class="flex items-center gap-3 mb-3">
            <button type="button" class="drag-handle cursor-grab text-gray-400 hover:text-gray-600" title="גרור לשינוי סדר">
              <span class="text-lg">&#9776;</span>
            </button>
            <span class="text-sm font-medium text-gray-500">שאלה \${index + 1}</span>
            <div class="flex-1"></div>
            <button type="button" onclick="deleteQuestion('\${question.id}')" class="text-red-400 hover:text-red-600 transition-colors" title="מחק שאלה">
              <span class="text-lg">&#128465;</span>
            </button>
          </div>

          <div class="mb-3">
            <label class="block text-xs text-gray-500 mb-1">טקסט השאלה</label>
            <input
              type="text"
              value="\${escapeHtml(question.text)}"
              onchange="updateQuestion('\${question.id}', 'text', this.value)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="הקלד את השאלה..."
            >
          </div>

          <div class="flex flex-wrap gap-4 items-center">
            <div class="flex-1 min-w-[140px]">
              <label class="block text-xs text-gray-500 mb-1">סוג תשובה</label>
              <select
                onchange="updateQuestion('\${question.id}', 'expectedType', this.value)"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                \${typeOptions.map(opt => \`<option value="\${opt.value}" \${opt.value === question.expectedType ? 'selected' : ''}>\${opt.label}</option>\`).join('')}
              </select>
            </div>

            <div class="flex items-center gap-2">
              <label class="text-xs text-gray-600">חובה</label>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" \${question.isRequired ? 'checked' : ''} onchange="updateQuestion('\${question.id}', 'isRequired', this.checked)" class="sr-only peer">
                <div class="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center gap-2">
              <label class="text-xs text-gray-600">פעיל</label>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" \${question.isActive ? 'checked' : ''} onchange="updateQuestion('\${question.id}', 'isActive', this.checked)" class="sr-only peer">
                <div class="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        </div>
      \`;
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text || '';
      return div.innerHTML;
    }

    function updatePreview() {
      const preview = document.getElementById('chatbotPreview');
      const activeQuestions = chatbotQuestions.filter(q => q.isActive).sort((a, b) => a.order - b.order);

      if (activeQuestions.length === 0) {
        preview.innerHTML = '<div class="text-center py-4 text-gray-500"><p>אין שאלות פעילות להציג</p></div>';
        return;
      }

      preview.innerHTML = '<div class="space-y-3">' + activeQuestions.map((q, i) => \`
        <div class="flex gap-2">
          <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">\${i + 1}</div>
          <div class="bg-white rounded-lg rounded-tr-none px-4 py-2 shadow-sm border border-gray-100 flex-1">
            <p class="text-gray-800 text-sm">\${escapeHtml(q.text) || '(שאלה ריקה)'}</p>
            \${q.isRequired ? '<span class="text-xs text-red-500">*</span>' : ''}
          </div>
        </div>
      \`).join('') + '</div>';
    }

    async function saveChatbotConfig() {
      // Validate at least one required active question
      const hasRequired = chatbotQuestions.some(q => q.isRequired && q.isActive);
      if (!hasRequired) {
        showToast('חייבת להיות לפחות שאלה פעילה אחת שמסומנת כחובה', 'error');
        return;
      }

      // Validate all questions have text
      const emptyQuestion = chatbotQuestions.find(q => q.isActive && !q.text.trim());
      if (emptyQuestion) {
        showToast('כל השאלות הפעילות חייבות להכיל טקסט', 'error');
        return;
      }

      try {
        await apiRequest('PUT', '/chatbot', { questions: chatbotQuestions });
        showToast('הגדרות הצאטבוט נשמרו');
      } catch (err) {
        showToast(err.message || 'שגיאה בשמירת ההגדרות', 'error');
      }
    }

    async function resetChatbotConfig() {
      try {
        const data = await apiRequest('POST', '/reset', { section: 'chatbot' });
        settingsData = data.settings;
        chatbotQuestions = data.settings.chatbot || [];
        renderQuestionsList();
        updatePreview();
        showToast('הגדרות הצאטבוט אופסו');
      } catch (err) {
        showToast(err.message || 'שגיאה באיפוס ההגדרות', 'error');
      }
    }

    // --- Drag and Drop ---
    let draggedElement = null;

    function initDragDrop() {
      document.querySelectorAll('.drag-handle').forEach(handle => {
        const card = handle.closest('.question-card');

        handle.onmousedown = () => {
          card.setAttribute('draggable', 'true');
        };

        card.ondragstart = (e) => {
          draggedElement = card;
          card.style.opacity = '0.5';
        };

        card.ondragend = () => {
          card.style.opacity = '1';
          card.setAttribute('draggable', 'false');
          draggedElement = null;
          updateQuestionOrders();
        };

        card.ondragover = (e) => {
          e.preventDefault();
          const list = document.getElementById('questionsList');
          const afterElement = getDragAfterElement(list, e.clientY);

          if (afterElement == null) {
            list.appendChild(draggedElement);
          } else {
            list.insertBefore(draggedElement, afterElement);
          }
        };
      });
    }

    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll('.question-card:not([style*="opacity: 0.5"])')];

      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function updateQuestionOrders() {
      const cards = document.querySelectorAll('.question-card');
      cards.forEach((card, index) => {
        const id = card.dataset.questionId;
        const question = chatbotQuestions.find(q => q.id === id);
        if (question) {
          question.order = index + 1;
        }
      });
      updatePreview();
    }

    // --- Initialize ---
    loadSettings();
  </script>
</body>
</html>`;
}
