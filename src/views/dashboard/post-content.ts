/**
 * Post Content Dashboard Component
 *
 * Allows owner to enter promotional content and approve posts from dashboard.
 * Mirrors WhatsApp flow per CONTEXT.md: "Dashboard mirrors all WhatsApp capabilities"
 *
 * Per DASH-05: "Enter promotional content for monthly posts"
 *
 * Features:
 * - Show current post request status
 * - Form to enter promotional content
 * - AI-generated post preview
 * - Approve/edit drafted posts
 */

/**
 * Renders the post content component.
 *
 * @returns HTML string for post content section
 */
export function renderPostContent(): string {
  return `
<div id="postContentSection" class="bg-white rounded-xl shadow-sm border border-gray-100">
  <div class="p-6 border-b border-gray-100">
    <h2 class="text-lg font-semibold text-gray-800">תוכן חודשי</h2>
    <p class="text-sm text-gray-500 mt-1">פוסטים לפרופיל העסקי שלך ב-Google</p>
  </div>

  <!-- Loading State -->
  <div id="postLoading" class="p-8 text-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    <p class="mt-2 text-gray-500">טוען...</p>
  </div>

  <!-- Content -->
  <div id="postContent" class="hidden p-6">
    <!-- Status Section -->
    <div id="postStatus" class="mb-6"></div>

    <!-- Content Form (shown when awaiting content) -->
    <div id="contentForm" class="hidden">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        מה תרצה לשתף החודש?
      </label>
      <textarea
        id="ownerContent"
        rows="4"
        maxlength="1500"
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        dir="rtl"
        placeholder="למשל: מבצע מיוחד, אירוע קרוב, חדשות מהעסק..."
      ></textarea>
      <div class="flex justify-between items-center mt-2">
        <span id="charCount" class="text-xs text-gray-400">0/1500</span>
        <p class="text-xs text-gray-400">הAI יכתוב פוסט מקצועי מהתוכן שלך</p>
      </div>
      <button
        id="generateBtn"
        onclick="generatePost()"
        class="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        &#9733; צור פוסט
      </button>
    </div>

    <!-- Draft Approval (shown when draft pending) -->
    <div id="draftApproval" class="hidden">
      <div class="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 class="text-sm font-medium text-gray-700 mb-2">הפוסט שנוצר:</h3>
        <p id="draftContent" class="text-gray-800 whitespace-pre-wrap"></p>
      </div>

      <div class="flex gap-3 mb-3">
        <button
          id="approvePostBtn"
          onclick="approvePost()"
          class="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          &#10003; אשר ופרסם
        </button>
        <button
          onclick="enableEdit()"
          id="editBtn"
          class="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          &#9998; ערוך
        </button>
      </div>
      <div class="flex gap-3" id="secondaryActions">
        <button
          id="regenerateBtn"
          onclick="regeneratePost()"
          class="flex-1 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm"
        >
          &#8635; הצעה חדשה
        </button>
        <button
          id="deletePostBtn"
          onclick="deletePost()"
          class="flex-1 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm"
        >
          &#10005; מחק הצעה
        </button>
      </div>

      <!-- Edit Mode -->
      <div id="editMode" class="hidden mt-4">
        <textarea
          id="editContent"
          rows="4"
          maxlength="1500"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          dir="rtl"
        ></textarea>
        <div class="flex justify-between items-center mt-2">
          <span id="editCharCount" class="text-xs text-gray-400">0/1500</span>
        </div>
        <div class="flex gap-3 mt-3">
          <button
            id="saveEditBtn"
            onclick="approvePost(true)"
            class="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            &#10003; אשר ופרסם
          </button>
          <button
            onclick="cancelEdit()"
            class="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            בטל
          </button>
        </div>
      </div>
    </div>

    <!-- Processing State -->
    <div id="processingState" class="hidden text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-gray-600">יוצר פוסט...</p>
    </div>

    <!-- Message Area -->
    <div id="postMessage" class="hidden mt-4"></div>
  </div>
</div>

<script>
let currentPostId = null;
let currentDraftContent = null;

async function loadPostStatus() {
  const loading = document.getElementById('postLoading');
  const content = document.getElementById('postContent');
  const statusDiv = document.getElementById('postStatus');
  const contentForm = document.getElementById('contentForm');
  const draftApproval = document.getElementById('draftApproval');

  try {
    const res = await fetch('/api/dashboard/post-request', {
      headers: { 'X-Tenant-ID': window.tenantId || '' }
    });
    const data = await res.json();

    loading.classList.add('hidden');
    content.classList.remove('hidden');

    if (data.hasPending && data.post?.status === 'pending_approval') {
      // Draft ready for approval
      currentPostId = data.post.id;
      currentDraftContent = data.post.content;

      statusDiv.innerHTML = \`
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div class="flex items-start gap-3">
            <span class="text-blue-600 text-xl">&#128221;</span>
            <div>
              <p class="text-blue-800 font-medium">יש פוסט ממתין לאישור</p>
              <p class="text-blue-600 text-sm mt-1">צפה ואשר את הפוסט לפרסום</p>
            </div>
          </div>
        </div>
      \`;

      document.getElementById('draftContent').textContent = data.post.content;
      contentForm.classList.add('hidden');
      draftApproval.classList.remove('hidden');
    } else if (data.hasPending && data.post?.status === 'requested') {
      // Awaiting content from owner
      currentPostId = data.post.id;
      currentDraftContent = null;

      statusDiv.innerHTML = \`
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div class="flex items-start gap-3">
            <span class="text-yellow-600 text-xl">&#9888;</span>
            <div>
              <p class="text-yellow-800 font-medium">Findo מבקש תוכן לפוסט החודשי</p>
              <p class="text-yellow-600 text-sm mt-1">הזן תוכן שתרצה לשתף</p>
            </div>
          </div>
        </div>
      \`;

      contentForm.classList.remove('hidden');
      draftApproval.classList.add('hidden');
    } else {
      // No pending request
      currentPostId = null;
      currentDraftContent = null;

      const nextDate = getNextPostDate();
      statusDiv.innerHTML = \`
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-gray-600">&#10003; הפוסט הבא יתוזמן ל-\${nextDate}</p>
          <p class="text-gray-400 text-sm mt-1">ניתן ליצור פוסט בכל עת</p>
        </div>
      \`;

      // Allow manual post creation
      contentForm.classList.remove('hidden');
      draftApproval.classList.add('hidden');
    }
  } catch (err) {
    console.error('Failed to load post status:', err);
    loading.classList.add('hidden');
    content.classList.remove('hidden');
    statusDiv.innerHTML = \`
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-gray-600">ניתן ליצור פוסט לפרופיל העסקי</p>
      </div>
    \`;
    contentForm.classList.remove('hidden');
    draftApproval.classList.add('hidden');
  }
}

function getNextPostDate() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });
}

// Character counter for content textarea
document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('ownerContent');
  const counter = document.getElementById('charCount');
  const editTextarea = document.getElementById('editContent');
  const editCounter = document.getElementById('editCharCount');

  if (textarea && counter) {
    textarea.addEventListener('input', () => {
      counter.textContent = \`\${textarea.value.length}/1500\`;
    });
  }

  if (editTextarea && editCounter) {
    editTextarea.addEventListener('input', () => {
      editCounter.textContent = \`\${editTextarea.value.length}/1500\`;
    });
  }
});

async function generatePost() {
  const content = document.getElementById('ownerContent').value.trim();

  if (!content) {
    showPostMessage('נא להזין תוכן לפוסט', 'error');
    return;
  }

  const btn = document.getElementById('generateBtn');
  const processing = document.getElementById('processingState');
  const contentForm = document.getElementById('contentForm');

  btn.disabled = true;
  contentForm.classList.add('hidden');
  processing.classList.remove('hidden');
  hidePostMessage();

  try {
    const res = await fetch('/api/dashboard/post/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': window.tenantId || ''
      },
      body: JSON.stringify({ content })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'שגיאה ביצירת הפוסט');
    }

    // Show draft for approval
    currentPostId = data.postId;
    currentDraftContent = data.content;

    document.getElementById('draftContent').textContent = data.content;
    document.getElementById('draftApproval').classList.remove('hidden');
    processing.classList.add('hidden');

    // Update status
    document.getElementById('postStatus').innerHTML = \`
      <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div class="flex items-start gap-3">
          <span class="text-green-600 text-xl">&#10003;</span>
          <div>
            <p class="text-green-800 font-medium">הפוסט נוצר בהצלחה!</p>
            <p class="text-green-600 text-sm mt-1">צפה ואשר לפרסום</p>
          </div>
        </div>
      </div>
    \`;
  } catch (err) {
    console.error('Failed to generate post:', err);
    showPostMessage(err.message || 'שגיאה ביצירת הפוסט', 'error');
    contentForm.classList.remove('hidden');
    processing.classList.add('hidden');
  } finally {
    btn.disabled = false;
  }
}

function enableEdit() {
  document.getElementById('editContent').value = currentDraftContent || '';
  document.getElementById('editCharCount').textContent = \`\${(currentDraftContent || '').length}/1500\`;
  document.getElementById('editMode').classList.remove('hidden');
  document.getElementById('editBtn').classList.add('hidden');
  document.getElementById('approvePostBtn').classList.add('hidden');
}

function cancelEdit() {
  document.getElementById('editMode').classList.add('hidden');
  document.getElementById('editBtn').classList.remove('hidden');
  document.getElementById('approvePostBtn').classList.remove('hidden');
}

async function approvePost(isEdited = false) {
  if (!currentPostId) {
    showPostMessage('לא נמצא פוסט לאישור', 'error');
    return;
  }

  const btn = isEdited ? document.getElementById('saveEditBtn') : document.getElementById('approvePostBtn');
  const content = isEdited ? document.getElementById('editContent').value.trim() : null;

  if (isEdited && !content) {
    showPostMessage('נא להזין תוכן', 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="animate-spin inline-block">&#8635;</span> מפרסם...';

  try {
    const body = content ? { customContent: content } : {};

    const res = await fetch(\`/api/dashboard/post/\${currentPostId}/approve\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': window.tenantId || ''
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'שגיאה בפרסום הפוסט');
    }

    showPostMessage('הפוסט פורסם בהצלחה!', 'success');

    // Reload status
    setTimeout(() => {
      loadPostStatus();
    }, 2000);
  } catch (err) {
    console.error('Failed to approve post:', err);
    showPostMessage(err.message || 'שגיאה בפרסום הפוסט', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '&#10003; אשר ופרסם';
  }
}

function showPostMessage(text, type = 'info') {
  const area = document.getElementById('postMessage');
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  area.innerHTML = \`
    <div class="border rounded-lg p-4 \${colors[type]}">
      \${text}
    </div>
  \`;
  area.classList.remove('hidden');
}

function hidePostMessage() {
  document.getElementById('postMessage').classList.add('hidden');
}

async function regeneratePost() {
  if (!currentPostId) {
    showPostMessage('אין פוסט ליצירה מחדש', 'error');
    return;
  }

  const btn = document.getElementById('regenerateBtn');
  const processing = document.getElementById('processingState');
  const draftApproval = document.getElementById('draftApproval');

  btn.disabled = true;
  btn.innerHTML = '<span class="animate-spin inline-block">&#8635;</span> יוצר...';
  draftApproval.classList.add('hidden');
  processing.classList.remove('hidden');

  try {
    const res = await fetch(\`/api/dashboard/post/\${currentPostId}/regenerate\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': window.tenantId || ''
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'שגיאה ביצירה מחדש');
    }

    // Update draft content
    currentDraftContent = data.content;
    document.getElementById('draftContent').textContent = data.content;
    draftApproval.classList.remove('hidden');
    processing.classList.add('hidden');

    showPostMessage('הצעה חדשה נוצרה בהצלחה', 'success');
  } catch (err) {
    console.error('Failed to regenerate post:', err);
    showPostMessage(err.message || 'שגיאה ביצירה מחדש', 'error');
    draftApproval.classList.remove('hidden');
    processing.classList.add('hidden');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '&#8635; הצעה חדשה';
  }
}

async function deletePost() {
  if (!currentPostId) {
    showPostMessage('אין פוסט למחיקה', 'error');
    return;
  }

  if (!confirm('האם למחוק את ההצעה? ניתן ליצור הצעה חדשה בכל עת.')) {
    return;
  }

  const btn = document.getElementById('deletePostBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="animate-spin inline-block">&#8635;</span> מוחק...';

  try {
    const res = await fetch(\`/api/dashboard/post/\${currentPostId}\`, {
      method: 'DELETE',
      headers: {
        'X-Tenant-ID': window.tenantId || ''
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'שגיאה במחיקת הפוסט');
    }

    showPostMessage('ההצעה נמחקה', 'info');
    currentPostId = null;
    currentDraftContent = null;

    // Reload status to show content form
    setTimeout(() => {
      loadPostStatus();
    }, 1500);
  } catch (err) {
    console.error('Failed to delete post:', err);
    showPostMessage(err.message || 'שגיאה במחיקת הפוסט', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '&#10005; מחק הצעה';
  }
}

// Load status on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadPostStatus);
} else {
  loadPostStatus();
}
</script>
`;
}
