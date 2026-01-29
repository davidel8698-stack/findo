/**
 * Review Approval Dashboard Component
 *
 * Allows owner to approve/edit negative review responses from dashboard.
 * Mirrors WhatsApp flow per CONTEXT.md: "Dashboard mirrors all WhatsApp capabilities"
 *
 * Per DASH-03: "Approve/edit negative review responses before posting"
 *
 * Features:
 * - List pending reviews awaiting approval
 * - View review details (reviewer name, rating, comment)
 * - Edit draft reply
 * - Approve and post reply to Google
 */

/**
 * Renders the review approval component.
 *
 * @returns HTML string for review approval section
 */
export function renderReviewApproval(): string {
  return `
<div id="reviewApprovalSection" class="bg-white rounded-xl shadow-sm border border-gray-100">
  <div class="p-6 border-b border-gray-100">
    <h2 class="text-lg font-semibold text-gray-800">ביקורות לאישור</h2>
    <p class="text-sm text-gray-500 mt-1">ביקורות שליליות ממתינות לאישור לפני פרסום התשובה</p>
  </div>

  <!-- Loading State -->
  <div id="reviewsLoading" class="p-8 text-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    <p class="mt-2 text-gray-500">טוען ביקורות...</p>
  </div>

  <!-- Empty State -->
  <div id="reviewsEmpty" class="hidden p-8 text-center">
    <div class="text-4xl mb-2">&#10003;</div>
    <p class="text-gray-600">אין ביקורות ממתינות לאישור</p>
    <p class="text-sm text-gray-400 mt-1">ביקורות חדשות יופיעו כאן</p>
  </div>

  <!-- Reviews List -->
  <div id="reviewsList" class="hidden divide-y divide-gray-100"></div>
</div>

<!-- Review Approval Modal -->
<div id="reviewModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div class="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
    <div class="p-6 border-b border-gray-100">
      <div class="flex justify-between items-start">
        <h3 class="text-lg font-semibold text-gray-800">אישור תגובה לביקורת</h3>
        <button onclick="closeReviewModal()" class="text-gray-400 hover:text-gray-600">&#10005;</button>
      </div>
    </div>

    <div class="p-6 space-y-4">
      <!-- Review Details -->
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span id="modalReviewerInitial" class="text-gray-600 font-semibold">?</span>
          </div>
          <div>
            <p id="modalReviewerName" class="font-medium text-gray-800">-</p>
            <div id="modalRating" class="text-yellow-500"></div>
          </div>
        </div>
        <p id="modalComment" class="text-gray-600 text-sm"></p>
        <p id="modalWaitTime" class="text-xs text-gray-400 mt-2"></p>
      </div>

      <!-- Draft Reply -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">התשובה המוצעת</label>
        <textarea
          id="modalReplyText"
          rows="5"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          dir="rtl"
          placeholder="תשובה לביקורת..."
        ></textarea>
        <p class="text-xs text-gray-400 mt-1">ניתן לערוך את התשובה לפני הפרסום</p>
      </div>
    </div>

    <div class="p-6 border-t border-gray-100 flex gap-3">
      <button
        onclick="approveReview()"
        id="approveBtn"
        class="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
      >
        &#10003; אשר ופרסם
      </button>
      <button
        onclick="closeReviewModal()"
        class="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        בטל
      </button>
    </div>
  </div>
</div>

<script>
let currentReviewId = null;
let currentDraftReply = null;

async function loadPendingReviews() {
  const loading = document.getElementById('reviewsLoading');
  const empty = document.getElementById('reviewsEmpty');
  const list = document.getElementById('reviewsList');

  loading.classList.remove('hidden');
  empty.classList.add('hidden');
  list.classList.add('hidden');

  try {
    const res = await fetch('/api/dashboard/pending-reviews', {
      headers: { 'X-Tenant-ID': window.tenantId || '' }
    });
    const data = await res.json();

    loading.classList.add('hidden');

    if (!data.reviews || data.reviews.length === 0) {
      empty.classList.remove('hidden');
      return;
    }

    list.innerHTML = data.reviews.map(review => renderReviewItem(review)).join('');
    list.classList.remove('hidden');
  } catch (err) {
    console.error('Failed to load pending reviews:', err);
    loading.classList.add('hidden');
    empty.classList.remove('hidden');
  }
}

function renderReviewItem(review) {
  const stars = '&#9733;'.repeat(review.starRating) + '&#9734;'.repeat(5 - review.starRating);
  const waitTime = formatWaitTime(review.approvalSentAt);
  const initial = review.reviewerName ? review.reviewerName.charAt(0).toUpperCase() : '?';

  return \`
    <div class="p-4 hover:bg-gray-50 cursor-pointer" onclick="openReviewModal('\${review.reviewId}')">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-gray-600 font-semibold">\${initial}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-800">\${review.reviewerName || 'אנונימי'}</span>
            <span class="text-yellow-500 text-sm">\${stars}</span>
          </div>
          <p class="text-sm text-gray-600 truncate mt-1">\${review.comment || 'ללא תגובה'}</p>
          <p class="text-xs text-gray-400 mt-1">\${waitTime}</p>
        </div>
        <span class="text-blue-600 text-sm">&#8592;</span>
      </div>
    </div>
  \`;
}

function formatWaitTime(approvalSentAt) {
  if (!approvalSentAt) return '';
  const sent = new Date(approvalSentAt);
  const now = new Date();
  const hours = Math.floor((now.getTime() - sent.getTime()) / (1000 * 60 * 60));
  if (hours < 1) return 'לפני פחות משעה';
  if (hours < 24) return \`לפני \${hours} שעות\`;
  const days = Math.floor(hours / 24);
  return \`לפני \${days} ימים\`;
}

async function openReviewModal(reviewId) {
  const modal = document.getElementById('reviewModal');
  modal.classList.remove('hidden');

  try {
    const res = await fetch('/api/dashboard/pending-reviews', {
      headers: { 'X-Tenant-ID': window.tenantId || '' }
    });
    const data = await res.json();
    const review = data.reviews?.find(r => r.reviewId === reviewId);

    if (!review) {
      alert('הביקורת לא נמצאה');
      closeReviewModal();
      return;
    }

    currentReviewId = reviewId;
    currentDraftReply = review.draftReply || '';

    document.getElementById('modalReviewerName').textContent = review.reviewerName || 'אנונימי';
    document.getElementById('modalReviewerInitial').textContent =
      review.reviewerName ? review.reviewerName.charAt(0).toUpperCase() : '?';
    document.getElementById('modalRating').innerHTML =
      '&#9733;'.repeat(review.starRating) + '&#9734;'.repeat(5 - review.starRating);
    document.getElementById('modalComment').textContent = review.comment || 'ללא תגובה';
    document.getElementById('modalWaitTime').textContent = formatWaitTime(review.approvalSentAt);
    document.getElementById('modalReplyText').value = review.draftReply || '';
  } catch (err) {
    console.error('Failed to load review:', err);
    alert('שגיאה בטעינת הביקורת');
    closeReviewModal();
  }
}

function closeReviewModal() {
  const modal = document.getElementById('reviewModal');
  modal.classList.add('hidden');
  currentReviewId = null;
  currentDraftReply = null;
}

async function approveReview() {
  if (!currentReviewId) return;

  const btn = document.getElementById('approveBtn');
  const replyText = document.getElementById('modalReplyText').value.trim();

  if (!replyText) {
    alert('נא להזין תשובה');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="animate-spin inline-block">&#8635;</span> מפרסם...';

  try {
    const body = {};
    if (replyText !== currentDraftReply) {
      body.customReply = replyText;
    }

    const res = await fetch(\`/api/dashboard/review/\${currentReviewId}/approve\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': window.tenantId || ''
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'שגיאה בפרסום התשובה');
    }

    closeReviewModal();
    loadPendingReviews();
    alert('התשובה פורסמה בהצלחה!');
  } catch (err) {
    console.error('Failed to approve review:', err);
    alert(err.message || 'שגיאה בפרסום התשובה');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '&#10003; אשר ופרסם';
  }
}

// Load reviews on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadPendingReviews);
} else {
  loadPendingReviews();
}
</script>
`;
}
