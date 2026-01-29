/**
 * Metrics Dashboard View
 *
 * Renders the GBP performance metrics dashboard with Hebrew localization.
 * Shows visibility, reviews, content, and review request metrics.
 * Includes trend arrows, period toggle, and baseline comparison.
 *
 * Per CONTEXT.md: Card grid layout, big numbers, trend arrows, week/month toggle.
 */

/**
 * Renders the metrics dashboard HTML.
 */
export function renderMetricsDashboard(tenantId: string): string {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Findo - מדדי ביצועים</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .trend-up { color: #22c55e; }
    .trend-down { color: #ef4444; }
    .trend-flat { color: #6b7280; }
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
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800">מדדי ביצועים</h1>
      <div class="flex gap-2">
        <button id="weekBtn" class="px-4 py-2 rounded-lg bg-blue-600 text-white" onclick="setPeriod('week')">שבועי</button>
        <button id="monthBtn" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700" onclick="setPeriod('month')">חודשי</button>
      </div>
    </div>

    <div id="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">טוען נתונים...</p>
    </div>

    <div id="dashboard" class="hidden">
      <!-- Visibility Section -->
      <h2 class="text-xl font-semibold text-gray-700 mb-4">נראות</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">צפיות בפרופיל</p>
              <p id="impressions" class="text-3xl font-bold text-gray-800 mt-1">-</p>
            </div>
            <span id="impressionsTrend" class="text-2xl">-</span>
          </div>
        </div>
        <div class="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">חיפושים</p>
              <p id="searches" class="text-3xl font-bold text-gray-800 mt-1">-</p>
            </div>
            <span id="searchesTrend" class="text-2xl">-</span>
          </div>
        </div>
        <div class="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">פעולות</p>
              <p id="actions" class="text-3xl font-bold text-gray-800 mt-1">-</p>
            </div>
            <span id="actionsTrend" class="text-2xl">-</span>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <h2 class="text-xl font-semibold text-gray-700 mb-4">ביקורות</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p class="text-gray-500 text-sm">דירוג ממוצע</p>
          <p id="avgRating" class="text-3xl font-bold text-gray-800 mt-1">-</p>
        </div>
        <div class="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">ביקורות חדשות</p>
              <p id="reviewCount" class="text-3xl font-bold text-gray-800 mt-1">-</p>
            </div>
            <span id="reviewCountTrend" class="text-2xl">-</span>
          </div>
        </div>
        <div class="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p class="text-gray-500 text-sm">סה"כ ביקורות</p>
          <p id="totalReviews" class="text-3xl font-bold text-gray-800 mt-1">-</p>
        </div>
        <div class="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p class="text-gray-500 text-sm">אחוז מענה</p>
          <p id="responseRate" class="text-3xl font-bold text-gray-800 mt-1">-</p>
        </div>
      </div>

      <!-- Content Section -->
      <h2 class="text-xl font-semibold text-gray-700 mb-4">תוכן</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div class="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">תמונות בפרופיל</p>
              <p id="imageCount" class="text-3xl font-bold text-gray-800 mt-1">-</p>
            </div>
            <span id="imageCountTrend" class="text-2xl">-</span>
          </div>
        </div>
        <div class="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p class="text-gray-500 text-sm">צפיות בתמונות</p>
          <p id="imageViews" class="text-3xl font-bold text-gray-800 mt-1">-</p>
        </div>
      </div>

      <!-- Review Requests Section -->
      <h2 class="text-xl font-semibold text-gray-700 mb-4">בקשות לביקורת</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p class="text-gray-500 text-sm">נשלחו</p>
          <p id="requestsSent" class="text-3xl font-bold text-gray-800 mt-1">-</p>
        </div>
        <div class="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p class="text-gray-500 text-sm">הושלמו</p>
          <p id="requestsCompleted" class="text-3xl font-bold text-gray-800 mt-1">-</p>
        </div>
        <div class="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">אחוז המרה</p>
              <p id="conversionRate" class="text-3xl font-bold text-gray-800 mt-1">-</p>
            </div>
            <span id="conversionTrend" class="text-2xl">-</span>
          </div>
        </div>
      </div>

      <!-- Baseline comparison -->
      <div id="baselineSection" class="mt-8 p-4 bg-blue-50 rounded-lg hidden">
        <h3 class="font-semibold text-blue-800 mb-2">השוואה לממוצע שלך</h3>
        <p id="baselineText" class="text-blue-700"></p>
      </div>
    </div>

    <div id="noData" class="hidden text-center py-12">
      <p class="text-gray-600">אין עדיין נתונים. הנתונים יתחילו להיאסף בשבוע הבא.</p>
    </div>
  </div>

  <script>
    const tenantId = '${tenantId}';
    let currentPeriod = 'week';

    function trendIcon(trend) {
      if (trend === 'up') return '<span class="trend-up">&#9650;</span>';
      if (trend === 'down') return '<span class="trend-down">&#9660;</span>';
      return '<span class="trend-flat">&#8212;</span>';
    }

    function formatNumber(n) {
      if (n === null || n === undefined) return '-';
      return n.toLocaleString('he-IL');
    }

    function setPeriod(period) {
      currentPeriod = period;
      document.getElementById('weekBtn').className = period === 'week'
        ? 'px-4 py-2 rounded-lg bg-blue-600 text-white'
        : 'px-4 py-2 rounded-lg bg-gray-200 text-gray-700';
      document.getElementById('monthBtn').className = period === 'month'
        ? 'px-4 py-2 rounded-lg bg-blue-600 text-white'
        : 'px-4 py-2 rounded-lg bg-gray-200 text-gray-700';
      loadMetrics();
    }

    async function loadMetrics() {
      document.getElementById('loading').classList.remove('hidden');
      document.getElementById('dashboard').classList.add('hidden');
      document.getElementById('noData').classList.add('hidden');

      try {
        const res = await fetch('/api/metrics?tenantId=' + tenantId + '&period=' + currentPeriod);
        const data = await res.json();

        if (!data.current) {
          document.getElementById('loading').classList.add('hidden');
          document.getElementById('noData').classList.remove('hidden');
          return;
        }

        // Visibility
        document.getElementById('impressions').textContent = formatNumber(data.current.impressions);
        document.getElementById('searches').textContent = formatNumber(data.current.searches);
        document.getElementById('actions').textContent = formatNumber(data.current.actions);

        // Reviews
        document.getElementById('avgRating').textContent = data.current.averageRating
          ? parseFloat(data.current.averageRating).toFixed(1)
          : '-';
        document.getElementById('reviewCount').textContent = formatNumber(data.current.reviewCount);
        document.getElementById('totalReviews').textContent = formatNumber(data.current.totalReviews);
        document.getElementById('responseRate').textContent = data.current.responsePercentage
          ? parseFloat(data.current.responsePercentage).toFixed(0) + '%'
          : '-';

        // Content
        document.getElementById('imageCount').textContent = formatNumber(data.current.imageCount);
        document.getElementById('imageViews').textContent = formatNumber(data.current.imageViews);

        // Review Requests
        document.getElementById('requestsSent').textContent = formatNumber(data.current.reviewRequestsSent);
        document.getElementById('requestsCompleted').textContent = formatNumber(data.current.reviewRequestsCompleted);
        document.getElementById('conversionRate').textContent = data.current.conversionRate
          ? parseFloat(data.current.conversionRate).toFixed(0) + '%'
          : '-';

        // Trends
        if (data.trends) {
          document.getElementById('impressionsTrend').innerHTML = trendIcon(data.trends.impressions);
          document.getElementById('actionsTrend').innerHTML = trendIcon(data.trends.actions);
          document.getElementById('reviewCountTrend').innerHTML = trendIcon(data.trends.reviewCount);
          document.getElementById('imageCountTrend').innerHTML = trendIcon(data.trends.imageCount);
          document.getElementById('conversionTrend').innerHTML = trendIcon(data.trends.conversionRate);
        }

        // Searches trend (not in API trends but shown in visibility)
        document.getElementById('searchesTrend').innerHTML = trendIcon('flat');

        // Baseline
        if (data.baseline && data.baseline.reviewRate && data.current.reviewCount !== null) {
          const baselineRate = parseFloat(data.baseline.reviewRate);
          const diff = data.current.reviewCount - baselineRate;
          if (baselineRate > 0) {
            const pct = ((diff / baselineRate) * 100).toFixed(0);
            const text = diff > 0
              ? 'קצב הביקורות שלך גבוה ב-' + pct + '% מהממוצע שלך!'
              : 'קצב הביקורות שלך נמוך ב-' + Math.abs(parseInt(pct)) + '% מהממוצע שלך';
            document.getElementById('baselineText').textContent = text;
            document.getElementById('baselineSection').classList.remove('hidden');
          }
        }

        document.getElementById('loading').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
      } catch (err) {
        console.error(err);
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('noData').classList.remove('hidden');
      }
    }

    loadMetrics();
  </script>
</body>
</html>`;
}
