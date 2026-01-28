/**
 * Review requests dashboard view.
 * Hebrew RTL layout following existing patterns.
 */

interface ReviewRequest {
  id: string;
  customerPhone: string | null;
  customerName: string | null;
  status: string;
  source: string;
  scheduledForAt: Date | null;
  createdAt: Date;
}

/**
 * Translate status enum to Hebrew display text.
 */
function translateStatus(status: string): string {
  const translations: Record<string, string> = {
    pending: 'ממתין',
    requested: 'נשלח',
    reminded: 'תזכורת נשלחה',
    completed: 'הושלם',
    stopped: 'הסתיים',
    skipped: 'דילוג',
  };
  return translations[status] || status;
}

/**
 * Translate source enum to Hebrew display text.
 */
function translateSource(source: string): string {
  const translations: Record<string, string> = {
    greeninvoice: 'חשבונית ירוקה',
    icount: 'iCount',
    manual: 'ידני',
    forwarded: 'העברה',
  };
  return translations[source] || source;
}

/**
 * Format date to Hebrew locale string.
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Escape HTML to prevent XSS.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Render the review requests dashboard page.
 * Provides form for manual request creation and table of recent requests.
 */
export function renderReviewRequestsPage(requests: ReviewRequest[]): string {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>בקשות ביקורת - Findo</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      color: #1a1a1a;
      margin-bottom: 24px;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card h2 {
      margin-bottom: 16px;
      color: #333;
    }
    .card p {
      color: #666;
      margin-bottom: 16px;
    }
    .form-group {
      margin-bottom: 16px;
    }
    label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: #333;
    }
    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      direction: ltr;
    }
    input:focus {
      outline: none;
      border-color: #4285F4;
    }
    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-primary {
      background: #4285F4;
      color: white;
    }
    .btn-primary:hover {
      background: #3367D6;
    }
    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .message {
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      display: none;
    }
    .message.success {
      background: #e8f5e9;
      color: #2e7d32;
      display: block;
    }
    .message.error {
      background: #ffebee;
      color: #c62828;
      display: block;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px;
      text-align: right;
      border-bottom: 1px solid #eee;
    }
    th {
      background: #f9f9f9;
      font-weight: 600;
    }
    .status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      display: inline-block;
    }
    .status-pending { background: #fff3e0; color: #e65100; }
    .status-requested { background: #e3f2fd; color: #1565c0; }
    .status-reminded { background: #f3e5f5; color: #7b1fa2; }
    .status-completed { background: #e8f5e9; color: #2e7d32; }
    .status-stopped { background: #fafafa; color: #757575; }
    .status-skipped { background: #ffebee; color: #c62828; }
    .source {
      font-size: 12px;
      color: #666;
    }
    .empty {
      text-align: center;
      padding: 40px;
      color: #666;
    }
    .back-link {
      display: inline-block;
      margin-bottom: 20px;
      color: #4285F4;
      text-decoration: none;
    }
    .back-link:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <a href="/" class="back-link">&#8594; חזרה לדף הבית</a>
    <h1>בקשות ביקורת</h1>

    <div class="card">
      <h2>בקשת ביקורת ידנית</h2>
      <p>
        הזן פרטי לקוח לשליחת בקשת ביקורת. הבקשה תישלח תוך 24 שעות.
      </p>

      <div id="message" class="message"></div>

      <form id="manualRequestForm">
        <div class="form-group">
          <label for="customerPhone">מספר טלפון *</label>
          <input
            type="tel"
            id="customerPhone"
            name="customerPhone"
            placeholder="050-1234567"
            required
          />
        </div>

        <div class="form-group">
          <label for="customerName">שם הלקוח</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            placeholder="ישראל ישראלי"
          />
        </div>

        <div class="form-group">
          <label for="customerEmail">אימייל</label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            placeholder="customer@example.com"
          />
        </div>

        <button type="submit" class="btn btn-primary" id="submitBtn">
          שלח בקשת ביקורת
        </button>
      </form>
    </div>

    <div class="card">
      <h2>בקשות אחרונות</h2>

      ${requests.length === 0 ? `
        <div class="empty">
          אין בקשות ביקורת עדיין
        </div>
      ` : `
        <table>
          <thead>
            <tr>
              <th>לקוח</th>
              <th>טלפון</th>
              <th>מקור</th>
              <th>סטטוס</th>
              <th>תאריך</th>
            </tr>
          </thead>
          <tbody>
            ${requests.map(r => `
              <tr>
                <td>${r.customerName ? escapeHtml(r.customerName) : '-'}</td>
                <td dir="ltr">${r.customerPhone ? escapeHtml(r.customerPhone) : '-'}</td>
                <td><span class="source">${translateSource(r.source)}</span></td>
                <td><span class="status status-${r.status}">${translateStatus(r.status)}</span></td>
                <td>${formatDate(r.createdAt)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  </div>

  <script>
    const form = document.getElementById('manualRequestForm');
    const message = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const customerPhone = document.getElementById('customerPhone').value;
      const customerName = document.getElementById('customerName').value;
      const customerEmail = document.getElementById('customerEmail').value;

      submitBtn.disabled = true;
      submitBtn.textContent = 'שולח...';
      message.className = 'message';
      message.style.display = 'none';

      try {
        const response = await fetch('/api/review-requests/manual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerPhone,
            customerName: customerName || undefined,
            customerEmail: customerEmail || undefined,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          message.className = 'message success';
          message.textContent = 'בקשת הביקורת נוצרה בהצלחה! תישלח ללקוח תוך 24 שעות.';
          message.style.display = 'block';
          form.reset();
          // Reload page after 2 seconds to show new request
          setTimeout(() => window.location.reload(), 2000);
        } else {
          message.className = 'message error';
          message.textContent = data.error || 'שגיאה ביצירת הבקשה';
          message.style.display = 'block';
        }
      } catch (error) {
        message.className = 'message error';
        message.textContent = 'שגיאת רשת. אנא נסה שוב.';
        message.style.display = 'block';
      }

      submitBtn.disabled = false;
      submitBtn.textContent = 'שלח בקשת ביקורת';
    });
  </script>
</body>
</html>`;
}
