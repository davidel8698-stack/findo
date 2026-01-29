/**
 * Activity Feed Component
 *
 * Renders the activity feed with smart grouping and real-time updates.
 * Per CONTEXT.md:
 * - "Summary only by default - Click to expand for details"
 * - "Chronological newest first"
 * - "Type filters available - Tabs: Reviews / Leads / Content / All"
 * - "Quick actions inline"
 *
 * Uses SSE for real-time updates via existing /api/activity/stream endpoint.
 */

import type { ActivityGroup, ActivityFilter } from '../../services/dashboard/activity-grouper';

/**
 * Format timestamp to relative Hebrew string.
 *
 * @param date - Date to format
 * @returns Hebrew relative time string (e.g., "לפני 5 דקות", "אתמול")
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'עכשיו';
  if (diffMinutes < 60) return `לפני ${diffMinutes} דקות`;
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  if (diffDays === 1) return 'אתמול';
  if (diffDays < 7) return `לפני ${diffDays} ימים`;

  // Format as date for older events
  return date.toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Render a single event item within a group.
 *
 * @param event - Activity event to render
 * @param isTimeline - Whether this is part of a timeline (journey)
 * @returns HTML string for the event
 */
function renderEventItem(event: { title: string; occurredAt: Date; eventType: string }, isTimeline: boolean): string {
  const timeStr = formatRelativeTime(new Date(event.occurredAt));

  if (isTimeline) {
    return `
      <div class="flex items-start gap-3 py-2">
        <div class="w-2 h-2 mt-2 rounded-full bg-blue-400 flex-shrink-0"></div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-700">${event.title}</p>
          <p class="text-xs text-gray-400 mt-1">${timeStr}</p>
        </div>
      </div>
    `;
  }

  return `
    <p class="text-sm text-gray-700">${event.title}</p>
    <p class="text-xs text-gray-400 mt-1">${timeStr}</p>
  `;
}

/**
 * Render quick action buttons based on event type.
 *
 * Per CONTEXT.md: "Quick actions inline - Each item has relevant action buttons"
 *
 * @param group - Activity group
 * @returns HTML string for action buttons
 */
function renderQuickActions(group: ActivityGroup): string {
  const latestEvent = group.events[group.events.length - 1];
  const metadata = latestEvent.metadata as Record<string, unknown> | null;

  // Review pending approval - show approve/edit buttons
  if (latestEvent.eventType === 'review.pending_approval' && metadata?.reviewId) {
    const reviewId = metadata.reviewId as string;
    return `
      <div class="flex gap-2 mt-3">
        <button
          onclick="approveReview('${reviewId}')"
          class="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          אשר
        </button>
        <button
          onclick="editReview('${reviewId}')"
          class="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ערוך
        </button>
      </div>
    `;
  }

  // Lead qualified - show contact button
  if (latestEvent.eventType === 'lead.qualified' && metadata?.leadId) {
    const leadId = metadata.leadId as string;
    const phone = metadata.phone as string | undefined;
    if (phone) {
      return `
        <div class="flex gap-2 mt-3">
          <a
            href="https://wa.me/${phone.replace('+', '')}"
            target="_blank"
            class="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            צור קשר
          </a>
        </div>
      `;
    }
  }

  return '';
}

/**
 * Render a single activity group (journey or single item).
 *
 * @param group - Activity group to render
 * @param index - Index for unique IDs
 * @returns HTML string for the group
 */
function renderActivityGroup(group: ActivityGroup, index: number): string {
  const timeStr = formatRelativeTime(group.latestAt);
  const expandId = `activity-expand-${index}`;

  // Icon based on journey type
  const iconMap: Record<string, string> = {
    lead: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`,
    review: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>`,
    content: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`,
  };
  const icon = group.journeyType ? iconMap[group.journeyType] : `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;

  // Background color based on journey type
  const bgColorMap: Record<string, string> = {
    lead: 'bg-blue-50',
    review: 'bg-yellow-50',
    content: 'bg-purple-50',
  };
  const bgColor = group.journeyType ? bgColorMap[group.journeyType] : 'bg-gray-50';

  // Icon color
  const iconColorMap: Record<string, string> = {
    lead: 'text-blue-500',
    review: 'text-yellow-500',
    content: 'text-purple-500',
  };
  const iconColor = group.journeyType ? iconColorMap[group.journeyType] : 'text-gray-500';

  if (group.type === 'single') {
    // Single event - no expand/collapse
    const event = group.events[0];
    return `
      <div class="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow">
        <div class="flex items-start gap-3">
          <div class="${bgColor} p-2 rounded-lg ${iconColor} flex-shrink-0">
            ${icon}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-gray-800 font-medium">${group.summary}</p>
            <p class="text-xs text-gray-400 mt-1">${timeStr}</p>
            ${renderQuickActions(group)}
          </div>
        </div>
      </div>
    `;
  }

  // Journey group - expandable with timeline
  return `
    <div class="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow">
      <button
        onclick="toggleExpand('${expandId}')"
        class="w-full p-4 flex items-start gap-3 text-right"
      >
        <div class="${bgColor} p-2 rounded-lg ${iconColor} flex-shrink-0">
          ${icon}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <p class="text-gray-800 font-medium">${group.summary}</p>
            <span id="${expandId}-arrow" class="text-gray-400 transform transition-transform">&#9660;</span>
          </div>
          <p class="text-xs text-gray-400 mt-1">${group.events.length} פעולות &middot; ${timeStr}</p>
        </div>
      </button>
      <div id="${expandId}" class="hidden border-t border-gray-100 px-4 py-3 bg-gray-50">
        <div class="border-r-2 border-blue-200 pr-4 mr-6">
          ${group.events.map(e => renderEventItem(e, true)).join('')}
        </div>
        ${renderQuickActions(group)}
      </div>
    </div>
  `;
}

/**
 * Render the activity feed filter tabs.
 *
 * Per CONTEXT.md: "Type filters available - Tabs: Reviews / Leads / Content / All"
 *
 * @param activeFilter - Currently active filter
 * @returns HTML string for filter tabs
 */
function renderFilterTabs(activeFilter: ActivityFilter): string {
  const filters: { id: ActivityFilter; label: string }[] = [
    { id: 'all', label: 'הכל' },
    { id: 'leads', label: 'לידים' },
    { id: 'reviews', label: 'ביקורות' },
    { id: 'content', label: 'תוכן' },
  ];

  return `
    <div class="flex gap-2 mb-4">
      ${filters.map(f => `
        <button
          onclick="setActivityFilter('${f.id}')"
          id="filter-${f.id}"
          class="${f.id === activeFilter
            ? 'px-4 py-2 rounded-lg bg-blue-600 text-white text-sm'
            : 'px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition-colors'
          }"
        >
          ${f.label}
        </button>
      `).join('')}
    </div>
  `;
}

/**
 * Render the full activity feed component.
 *
 * Per CONTEXT.md:
 * - Summary only by default - Click to expand for details
 * - Chronological newest first
 * - Type filters available
 * - Quick actions inline
 *
 * Includes JavaScript for:
 * - SSE real-time updates via /api/activity/stream
 * - Filter tab switching
 * - Expand/collapse groups
 * - Load more pagination
 *
 * @param tenantId - Tenant UUID for API calls
 * @returns HTML string for the activity feed component
 */
export function renderActivityFeed(tenantId: string): string {
  return `
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800">פעילות אחרונה</h2>
        <div id="activity-live-indicator" class="flex items-center gap-1 text-xs text-green-600">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          חי
        </div>
      </div>

      ${renderFilterTabs('all')}

      <div id="activity-loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-sm text-gray-500">טוען פעילות...</p>
      </div>

      <div id="activity-feed" class="space-y-3 hidden">
        <!-- Activity items will be inserted here -->
      </div>

      <div id="activity-empty" class="text-center py-8 hidden">
        <p class="text-gray-500">אין פעילות להצגה</p>
      </div>

      <button
        id="activity-load-more"
        onclick="loadMoreActivity()"
        class="hidden w-full mt-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        טען עוד
      </button>
    </div>

    <script>
      (function() {
        const tenantId = '${tenantId}';
        let currentFilter = 'all';
        let activityOffset = 0;
        const activityLimit = 50;
        let hasMore = false;
        let activityGroups = [];
        let eventSource = null;

        // Helper to format relative time
        function formatRelativeTime(dateStr) {
          const date = new Date(dateStr);
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

          if (diffMinutes < 1) return 'עכשיו';
          if (diffMinutes < 60) return 'לפני ' + diffMinutes + ' דקות';
          if (diffHours < 24) return 'לפני ' + diffHours + ' שעות';
          if (diffDays === 1) return 'אתמול';
          if (diffDays < 7) return 'לפני ' + diffDays + ' ימים';

          return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
        }

        // Render a single activity group
        function renderGroup(group, index) {
          const timeStr = formatRelativeTime(group.latestAt);
          const expandId = 'activity-expand-' + index;

          const icons = {
            lead: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>',
            review: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>',
            content: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
            default: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
          };

          const bgColors = { lead: 'bg-blue-50', review: 'bg-yellow-50', content: 'bg-purple-50', default: 'bg-gray-50' };
          const iconColors = { lead: 'text-blue-500', review: 'text-yellow-500', content: 'text-purple-500', default: 'text-gray-500' };

          const icon = icons[group.journeyType] || icons.default;
          const bgColor = bgColors[group.journeyType] || bgColors.default;
          const iconColor = iconColors[group.journeyType] || iconColors.default;

          if (group.type === 'single') {
            return '<div class="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow">' +
              '<div class="flex items-start gap-3">' +
                '<div class="' + bgColor + ' p-2 rounded-lg ' + iconColor + ' flex-shrink-0">' + icon + '</div>' +
                '<div class="flex-1 min-w-0">' +
                  '<p class="text-gray-800 font-medium">' + escapeHtml(group.summary) + '</p>' +
                  '<p class="text-xs text-gray-400 mt-1">' + timeStr + '</p>' +
                '</div>' +
              '</div>' +
            '</div>';
          }

          // Journey group with expand/collapse
          let eventsHtml = '';
          group.events.forEach(function(e) {
            const eTime = formatRelativeTime(e.occurredAt);
            eventsHtml += '<div class="flex items-start gap-3 py-2">' +
              '<div class="w-2 h-2 mt-2 rounded-full bg-blue-400 flex-shrink-0"></div>' +
              '<div class="flex-1 min-w-0">' +
                '<p class="text-sm text-gray-700">' + escapeHtml(e.title) + '</p>' +
                '<p class="text-xs text-gray-400 mt-1">' + eTime + '</p>' +
              '</div>' +
            '</div>';
          });

          return '<div class="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow">' +
            '<button onclick="toggleExpand(\\'' + expandId + '\\')" class="w-full p-4 flex items-start gap-3 text-right">' +
              '<div class="' + bgColor + ' p-2 rounded-lg ' + iconColor + ' flex-shrink-0">' + icon + '</div>' +
              '<div class="flex-1 min-w-0">' +
                '<div class="flex items-center justify-between">' +
                  '<p class="text-gray-800 font-medium">' + escapeHtml(group.summary) + '</p>' +
                  '<span id="' + expandId + '-arrow" class="text-gray-400 transform transition-transform">&#9660;</span>' +
                '</div>' +
                '<p class="text-xs text-gray-400 mt-1">' + group.events.length + ' פעולות &middot; ' + timeStr + '</p>' +
              '</div>' +
            '</button>' +
            '<div id="' + expandId + '" class="hidden border-t border-gray-100 px-4 py-3 bg-gray-50">' +
              '<div class="border-r-2 border-blue-200 pr-4 mr-6">' + eventsHtml + '</div>' +
            '</div>' +
          '</div>';
        }

        function escapeHtml(str) {
          const div = document.createElement('div');
          div.textContent = str;
          return div.innerHTML;
        }

        // Toggle expand/collapse
        window.toggleExpand = function(id) {
          const el = document.getElementById(id);
          const arrow = document.getElementById(id + '-arrow');
          if (el && arrow) {
            el.classList.toggle('hidden');
            arrow.style.transform = el.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
          }
        };

        // Filter change
        window.setActivityFilter = function(filter) {
          currentFilter = filter;
          activityOffset = 0;

          // Update button styles
          ['all', 'leads', 'reviews', 'content'].forEach(function(f) {
            const btn = document.getElementById('filter-' + f);
            if (btn) {
              btn.className = f === filter
                ? 'px-4 py-2 rounded-lg bg-blue-600 text-white text-sm'
                : 'px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition-colors';
            }
          });

          loadActivity();
        };

        // Load more
        window.loadMoreActivity = function() {
          activityOffset += activityLimit;
          loadActivity(true);
        };

        // Main load function
        async function loadActivity(append) {
          if (!append) {
            document.getElementById('activity-loading').classList.remove('hidden');
            document.getElementById('activity-feed').classList.add('hidden');
            document.getElementById('activity-empty').classList.add('hidden');
          }

          try {
            const params = new URLSearchParams({
              tenantId: tenantId,
              limit: activityLimit.toString(),
              offset: activityOffset.toString(),
              filter: currentFilter
            });

            const res = await fetch('/api/dashboard/activity?' + params.toString());
            const data = await res.json();

            if (!data.groups || data.groups.length === 0) {
              if (!append) {
                document.getElementById('activity-loading').classList.add('hidden');
                document.getElementById('activity-empty').classList.remove('hidden');
                document.getElementById('activity-load-more').classList.add('hidden');
              }
              return;
            }

            // Store groups for SSE updates
            if (!append) {
              activityGroups = data.groups;
            } else {
              activityGroups = activityGroups.concat(data.groups);
            }

            hasMore = data.hasMore;

            // Render groups
            const feedEl = document.getElementById('activity-feed');
            if (!append) {
              feedEl.innerHTML = '';
            }

            const startIndex = append ? feedEl.children.length : 0;
            data.groups.forEach(function(group, i) {
              const html = renderGroup(group, startIndex + i);
              const wrapper = document.createElement('div');
              wrapper.innerHTML = html;
              feedEl.appendChild(wrapper.firstElementChild);
            });

            // Keep max 100 items in DOM to prevent memory issues
            while (feedEl.children.length > 100) {
              feedEl.removeChild(feedEl.lastChild);
            }

            document.getElementById('activity-loading').classList.add('hidden');
            document.getElementById('activity-feed').classList.remove('hidden');
            document.getElementById('activity-load-more').classList.toggle('hidden', !hasMore);

          } catch (err) {
            console.error('[activity-feed] Load error:', err);
            document.getElementById('activity-loading').classList.add('hidden');
            document.getElementById('activity-empty').classList.remove('hidden');
          }
        }

        // Setup SSE for real-time updates
        function setupSSE() {
          if (eventSource) {
            eventSource.close();
          }

          eventSource = new EventSource('/api/activity/stream?tenantId=' + tenantId);

          eventSource.onopen = function() {
            const indicator = document.getElementById('activity-live-indicator');
            if (indicator) {
              indicator.querySelector('span').classList.add('animate-pulse');
            }
          };

          eventSource.onmessage = function(e) {
            try {
              const event = JSON.parse(e.data);

              // Skip connection message
              if (event.type === 'connected') return;

              // Reload activity to show new event with proper grouping
              activityOffset = 0;
              loadActivity();

            } catch (err) {
              console.error('[activity-feed] SSE parse error:', err);
            }
          };

          eventSource.onerror = function() {
            const indicator = document.getElementById('activity-live-indicator');
            if (indicator) {
              indicator.querySelector('span').classList.remove('animate-pulse');
              indicator.querySelector('span').classList.add('bg-gray-400');
            }

            // Reconnect after 5 seconds
            setTimeout(setupSSE, 5000);
          };
        }

        // Quick action handlers
        window.approveReview = function(reviewId) {
          fetch('/api/reviews/' + reviewId + '/approve', { method: 'POST' })
            .then(function() { loadActivity(); })
            .catch(function(err) { console.error('Approve error:', err); });
        };

        window.editReview = function(reviewId) {
          window.location.href = '/dashboard/reviews/' + reviewId + '/edit';
        };

        // Initialize
        loadActivity();
        setupSSE();

        // Cleanup on page unload
        window.addEventListener('beforeunload', function() {
          if (eventSource) {
            eventSource.close();
          }
        });
      })();
    </script>
  `;
}
