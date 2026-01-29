/**
 * Health Status Component
 *
 * Renders the dashboard health status indicator with traffic light and component breakdown.
 * Per CONTEXT.md: "Traffic light (green/yellow/red) PLUS component breakdown (WhatsApp checkmark, Google checkmark, Reviews warning)"
 *
 * Hebrew RTL layout inherits from parent html[dir=rtl].
 */

import type { HealthStatus, OverallStatus, ComponentStatus } from '../../services/dashboard/health-checker';

/**
 * Traffic light colors by overall status.
 */
const STATUS_COLORS: Record<OverallStatus, string> = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
};

/**
 * Hebrew status labels.
 */
const STATUS_LABELS: Record<OverallStatus, string> = {
  green: 'הכל תקין',
  yellow: 'יש להתייחס',
  red: 'נדרשת פעולה',
};

/**
 * Component status icons and colors.
 */
const COMPONENT_ICONS: Record<ComponentStatus, { icon: string; color: string }> = {
  ok: { icon: '&#10003;', color: 'text-green-600' },     // Checkmark
  warning: { icon: '&#9888;', color: 'text-yellow-600' }, // Warning triangle
  error: { icon: '&#10007;', color: 'text-red-600' },     // X mark
};

/**
 * Hebrew component names.
 */
const COMPONENT_NAMES: Record<string, string> = {
  whatsapp: 'WhatsApp',
  google: 'Google',
  reviews: 'ביקורות',
};

/**
 * Renders a single component status item.
 */
function renderComponentItem(name: string, status: ComponentStatus, message?: string): string {
  const { icon, color } = COMPONENT_ICONS[status];
  const componentName = COMPONENT_NAMES[name] || name;
  const messageHtml = message ? `<span class="text-xs text-gray-500 block">${message}</span>` : '';

  return `
    <div class="flex flex-col items-center gap-1">
      <div class="flex items-center gap-2">
        <span class="${color} text-xl">${icon}</span>
        <span class="text-sm font-medium text-gray-700">${componentName}</span>
      </div>
      ${messageHtml}
    </div>
  `;
}

/**
 * Renders the health status component.
 *
 * @param health - HealthStatus object from health-checker service
 * @returns HTML string for the health status component
 */
export function renderHealthStatus(health: HealthStatus): string {
  const statusColor = STATUS_COLORS[health.overall];
  const statusLabel = STATUS_LABELS[health.overall];

  const { whatsapp, google, reviews } = health.components;

  return `
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <!-- Traffic Light -->
      <div class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 ${statusColor} rounded-full flex items-center justify-center shadow-lg">
          <span class="text-white text-2xl font-bold">
            ${health.overall === 'green' ? '&#10003;' : health.overall === 'yellow' ? '!' : '&#10007;'}
          </span>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-800">${statusLabel}</h2>
          <p class="text-sm text-gray-500">סטטוס המערכת</p>
        </div>
      </div>

      <!-- Component Breakdown -->
      <div class="flex justify-around items-start pt-4 border-t border-gray-100">
        ${renderComponentItem('whatsapp', whatsapp.status, whatsapp.message)}
        ${renderComponentItem('google', google.status, google.message)}
        ${renderComponentItem('reviews', reviews.status, reviews.message)}
      </div>
    </div>
  `;
}
