/**
 * Reports Page View
 *
 * Renders the performance reports page with Chart.js line charts.
 * Per DASH-06: "View weekly/monthly reports and performance trends with clear graphs"
 *
 * Features:
 * - Weekly/monthly period toggle
 * - Two line charts: Reviews+Leads, Messages+Rating
 * - Hebrew RTL layout with Chart.js RTL legend
 * - Empty state when no data
 */

/**
 * Renders the reports page HTML with Chart.js graphs.
 *
 * @param tenantId - Tenant UUID for API calls
 * @returns Full HTML page string
 */
export function renderReportsPage(tenantId: string): string {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Findo - דוחות ביצועים</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    .chart-card {
      transition: all 0.2s;
    }
    .chart-card:hover {
      box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1);
    }
    .chart-container {
      position: relative;
      height: 300px;
    }
  </style>
</head>
<body class="bg-gray-50 min-h-screen">
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">דוחות ביצועים</h1>
        <p class="text-gray-500 mt-1">מעקב אחר מגמות לאורך זמן</p>
      </div>
      <a href="/dashboard" class="text-blue-600 hover:underline">&#8592; חזרה ללוח הבקרה</a>
    </div>

    <!-- Period Toggle -->
    <div class="flex gap-2 mb-6">
      <button
        id="weeklyBtn"
        class="px-4 py-2 rounded-lg bg-blue-600 text-white transition-colors"
        onclick="setPeriod('weekly')"
      >
        שבועי
      </button>
      <button
        id="monthlyBtn"
        class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 transition-colors"
        onclick="setPeriod('monthly')"
      >
        חודשי
      </button>
    </div>

    <!-- Loading State -->
    <div id="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">טוען נתונים...</p>
    </div>

    <!-- Charts Container -->
    <div id="chartsContainer" class="hidden space-y-6">
      <!-- Reviews and Leads Chart -->
      <div class="chart-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">ביקורות ולידים</h2>
        <div class="chart-container">
          <canvas id="reviewsLeadsChart"></canvas>
        </div>
      </div>

      <!-- Messages and Rating Chart -->
      <div class="chart-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">הודעות ודירוג</h2>
        <div class="chart-container">
          <canvas id="messagesRatingChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div id="emptyState" class="hidden text-center py-12">
      <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-md mx-auto">
        <div class="text-gray-400 text-5xl mb-4">📊</div>
        <h2 class="text-xl font-semibold text-gray-800 mb-2">אין עדיין נתונים</h2>
        <p class="text-gray-500">הנתונים יתחילו להיאסף בשבוע הבא.</p>
        <a href="/dashboard" class="inline-block mt-4 text-blue-600 hover:underline">חזרה ללוח הבקרה</a>
      </div>
    </div>
  </div>

  <script>
    const tenantId = '${tenantId}';
    let currentPeriod = 'weekly';
    let reviewsLeadsChart = null;
    let messagesRatingChart = null;

    // Chart.js default RTL configuration
    Chart.defaults.font.family = 'system-ui, -apple-system, sans-serif';

    function setPeriod(period) {
      currentPeriod = period;

      // Update button styles
      document.getElementById('weeklyBtn').className = period === 'weekly'
        ? 'px-4 py-2 rounded-lg bg-blue-600 text-white transition-colors'
        : 'px-4 py-2 rounded-lg bg-gray-200 text-gray-700 transition-colors';
      document.getElementById('monthlyBtn').className = period === 'monthly'
        ? 'px-4 py-2 rounded-lg bg-blue-600 text-white transition-colors'
        : 'px-4 py-2 rounded-lg bg-gray-200 text-gray-700 transition-colors';

      loadCharts();
    }

    async function loadCharts() {
      document.getElementById('loading').classList.remove('hidden');
      document.getElementById('chartsContainer').classList.add('hidden');
      document.getElementById('emptyState').classList.add('hidden');

      try {
        const res = await fetch('/api/dashboard/trends?period=' + currentPeriod, {
          headers: { 'X-Tenant-ID': tenantId }
        });
        const data = await res.json();

        if (!data || !data.labels || data.labels.length === 0) {
          showEmptyState();
          return;
        }

        // Check if all data is zeros
        const hasData = data.reviews.some(v => v > 0) ||
                        data.leads.some(v => v > 0) ||
                        data.whatsappSent.some(v => v > 0) ||
                        data.rating.some(v => v !== null);

        if (!hasData) {
          showEmptyState();
          return;
        }

        // Destroy existing charts
        if (reviewsLeadsChart) reviewsLeadsChart.destroy();
        if (messagesRatingChart) messagesRatingChart.destroy();

        // Create Reviews and Leads chart
        const reviewsLeadsCtx = document.getElementById('reviewsLeadsChart').getContext('2d');
        reviewsLeadsChart = new Chart(reviewsLeadsCtx, {
          type: 'line',
          data: {
            labels: data.labels,
            datasets: [
              {
                label: 'ביקורות',
                data: data.reviews,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
              {
                label: 'לידים מאושרים',
                data: data.leads,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                rtl: true,
                textDirection: 'rtl',
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });

        // Create Messages and Rating chart
        const messagesRatingCtx = document.getElementById('messagesRatingChart').getContext('2d');
        messagesRatingChart = new Chart(messagesRatingCtx, {
          type: 'line',
          data: {
            labels: data.labels,
            datasets: [
              {
                label: 'הודעות WhatsApp',
                data: data.whatsappSent,
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
                yAxisID: 'y',
              },
              {
                label: 'דירוג ממוצע',
                data: data.rating,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: false,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
                yAxisID: 'y1',
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                rtl: true,
                textDirection: 'rtl',
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                position: 'right',
                title: {
                  display: true,
                  text: 'הודעות'
                }
              },
              y1: {
                beginAtZero: false,
                min: 0,
                max: 5,
                position: 'left',
                title: {
                  display: true,
                  text: 'דירוג'
                },
                grid: {
                  drawOnChartArea: false,
                },
              }
            }
          }
        });

        document.getElementById('loading').classList.add('hidden');
        document.getElementById('chartsContainer').classList.remove('hidden');

      } catch (err) {
        console.error('Failed to load trends:', err);
        showEmptyState();
      }
    }

    function showEmptyState() {
      document.getElementById('loading').classList.add('hidden');
      document.getElementById('chartsContainer').classList.add('hidden');
      document.getElementById('emptyState').classList.remove('hidden');
    }

    // Load charts on page load
    loadCharts();
  </script>
</body>
</html>`;
}
