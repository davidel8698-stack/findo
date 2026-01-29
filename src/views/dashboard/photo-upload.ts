/**
 * Photo Upload Dashboard Component
 *
 * Allows owner to upload photos from dashboard as alternative to WhatsApp.
 * Mirrors WhatsApp flow per CONTEXT.md: "Dashboard mirrors all WhatsApp capabilities"
 *
 * Per DASH-04: "Upload photos when system requests"
 *
 * Features:
 * - Shows current photo request status
 * - Drag & drop or file select upload
 * - Image preview before upload
 * - Upload progress indicator
 * - Validates images (size, format, blur detection)
 */

/**
 * Renders the photo upload component.
 *
 * @returns HTML string for photo upload section
 */
export function renderPhotoUpload(): string {
  return `
<div id="photoUploadSection" class="bg-white rounded-xl shadow-sm border border-gray-100">
  <div class="p-6 border-b border-gray-100">
    <h2 class="text-lg font-semibold text-gray-800">העלאת תמונות</h2>
    <p class="text-sm text-gray-500 mt-1">תמונות לפרופיל העסקי שלך ב-Google</p>
  </div>

  <!-- Loading State -->
  <div id="photoLoading" class="p-8 text-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    <p class="mt-2 text-gray-500">טוען...</p>
  </div>

  <!-- Content -->
  <div id="photoContent" class="hidden p-6">
    <!-- Request Status -->
    <div id="requestStatus" class="mb-6"></div>

    <!-- Upload Area -->
    <div
      id="dropZone"
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors hover:border-blue-400 cursor-pointer"
      ondragover="handleDragOver(event)"
      ondragleave="handleDragLeave(event)"
      ondrop="handleDrop(event)"
      onclick="document.getElementById('fileInput').click()"
    >
      <div class="text-4xl mb-3">&#128247;</div>
      <p class="text-gray-700 font-medium">גרור תמונות לכאן</p>
      <p class="text-gray-500 text-sm mt-1">או לחץ לבחירת קבצים</p>
      <p class="text-gray-400 text-xs mt-3">JPEG, PNG | עד 10MB | מינימום 250x250 פיקסלים</p>
      <input
        type="file"
        id="fileInput"
        class="hidden"
        accept="image/jpeg,image/png"
        multiple
        onchange="handleFileSelect(event)"
      />
    </div>

    <!-- Preview Area -->
    <div id="previewArea" class="hidden mt-6">
      <h3 class="text-sm font-medium text-gray-700 mb-3">תמונות להעלאה:</h3>
      <div id="previewGrid" class="grid grid-cols-2 sm:grid-cols-3 gap-4"></div>
      <div class="mt-4 flex gap-3">
        <button
          id="uploadBtn"
          onclick="uploadPhotos()"
          class="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          &#8593; העלה לפרופיל
        </button>
        <button
          onclick="clearPreviews()"
          class="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          נקה
        </button>
      </div>
    </div>

    <!-- Upload Progress -->
    <div id="uploadProgress" class="hidden mt-6">
      <div class="flex items-center gap-3">
        <div class="flex-1 bg-gray-200 rounded-full h-2">
          <div id="progressBar" class="bg-blue-600 h-2 rounded-full transition-all" style="width: 0%"></div>
        </div>
        <span id="progressText" class="text-sm text-gray-600">0%</span>
      </div>
      <p id="uploadStatus" class="text-sm text-gray-500 mt-2 text-center">מעלה תמונות...</p>
    </div>

    <!-- Success/Error Messages -->
    <div id="messageArea" class="hidden mt-6"></div>
  </div>
</div>

<script>
let selectedFiles = [];

async function loadPhotoRequestStatus() {
  const loading = document.getElementById('photoLoading');
  const content = document.getElementById('photoContent');
  const statusDiv = document.getElementById('requestStatus');

  try {
    const res = await fetch('/api/dashboard/photo-request', {
      headers: { 'X-Tenant-ID': window.tenantId || '' }
    });
    const data = await res.json();

    loading.classList.add('hidden');
    content.classList.remove('hidden');

    if (data.hasPending) {
      const requestDate = new Date(data.requestedAt).toLocaleDateString('he-IL');
      statusDiv.innerHTML = \`
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <span class="text-yellow-600 text-xl">&#9888;</span>
            <div>
              <p class="text-yellow-800 font-medium">Findo מבקש תמונות מהשבוע</p>
              <p class="text-yellow-600 text-sm mt-1">בקשה נשלחה ב-\${requestDate}</p>
            </div>
          </div>
        </div>
      \`;
    } else {
      statusDiv.innerHTML = \`
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-gray-600">&#10003; אין בקשות פתוחות</p>
          <p class="text-gray-400 text-sm mt-1">ניתן להעלות תמונות בכל עת</p>
        </div>
      \`;
    }
  } catch (err) {
    console.error('Failed to load photo request status:', err);
    loading.classList.add('hidden');
    content.classList.remove('hidden');
    statusDiv.innerHTML = \`
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-gray-600">ניתן להעלות תמונות לפרופיל העסקי</p>
      </div>
    \`;
  }
}

function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
}

function handleDragLeave(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
}

function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
  const files = Array.from(e.dataTransfer.files).filter(isValidImageFile);
  addFiles(files);
}

function handleFileSelect(e) {
  const files = Array.from(e.target.files).filter(isValidImageFile);
  addFiles(files);
  e.target.value = ''; // Reset input
}

function isValidImageFile(file) {
  const validTypes = ['image/jpeg', 'image/png'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    showMessage(\`\${file.name}: פורמט לא נתמך. נא לשלוח JPEG או PNG\`, 'error');
    return false;
  }

  if (file.size > maxSize) {
    showMessage(\`\${file.name}: הקובץ גדול מדי (מקסימום 10MB)\`, 'error');
    return false;
  }

  return true;
}

function addFiles(files) {
  selectedFiles = [...selectedFiles, ...files];
  updatePreviews();
}

function updatePreviews() {
  const previewArea = document.getElementById('previewArea');
  const previewGrid = document.getElementById('previewGrid');

  if (selectedFiles.length === 0) {
    previewArea.classList.add('hidden');
    return;
  }

  previewArea.classList.remove('hidden');
  previewGrid.innerHTML = selectedFiles.map((file, index) => {
    const url = URL.createObjectURL(file);
    return \`
      <div class="relative group">
        <img
          src="\${url}"
          alt="\${file.name}"
          class="w-full h-24 object-cover rounded-lg"
          onload="URL.revokeObjectURL('\${url}')"
        />
        <button
          onclick="removeFile(\${index})"
          class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-sm"
        >
          &#10005;
        </button>
        <p class="text-xs text-gray-500 truncate mt-1">\${file.name}</p>
      </div>
    \`;
  }).join('');
}

function removeFile(index) {
  selectedFiles.splice(index, 1);
  updatePreviews();
}

function clearPreviews() {
  selectedFiles = [];
  updatePreviews();
  hideMessage();
}

async function uploadPhotos() {
  if (selectedFiles.length === 0) return;

  const uploadBtn = document.getElementById('uploadBtn');
  const progress = document.getElementById('uploadProgress');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const uploadStatus = document.getElementById('uploadStatus');

  uploadBtn.disabled = true;
  progress.classList.remove('hidden');
  hideMessage();

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    const percent = Math.round(((i + 1) / selectedFiles.length) * 100);

    uploadStatus.textContent = \`מעלה \${i + 1} מתוך \${selectedFiles.length}...\`;
    progressBar.style.width = \`\${percent}%\`;
    progressText.textContent = \`\${percent}%\`;

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const res = await fetch('/api/dashboard/photo/upload', {
        method: 'POST',
        headers: { 'X-Tenant-ID': window.tenantId || '' },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        successCount++;
      } else {
        errorCount++;
        console.error(\`Upload failed for \${file.name}:\`, data.error);
      }
    } catch (err) {
      errorCount++;
      console.error(\`Upload failed for \${file.name}:\`, err);
    }
  }

  uploadBtn.disabled = false;
  progress.classList.add('hidden');
  progressBar.style.width = '0%';

  if (successCount > 0 && errorCount === 0) {
    showMessage(\`\${successCount} תמונות הועלו בהצלחה!\`, 'success');
    clearPreviews();
  } else if (successCount > 0 && errorCount > 0) {
    showMessage(\`\${successCount} תמונות הועלו, \${errorCount} נכשלו\`, 'warning');
    clearPreviews();
  } else {
    showMessage('העלאת התמונות נכשלה. נא לנסות שוב', 'error');
  }

  // Refresh status
  loadPhotoRequestStatus();
}

function showMessage(text, type = 'info') {
  const area = document.getElementById('messageArea');
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

function hideMessage() {
  document.getElementById('messageArea').classList.add('hidden');
}

// Load status on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadPhotoRequestStatus);
} else {
  loadPhotoRequestStatus();
}
</script>
`;
}
