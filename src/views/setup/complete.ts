/**
 * Setup Complete Page
 *
 * Success page shown after completing setup wizard.
 * Per SETUP-05: "Dashboard shows Findo is now working in the background"
 *
 * Key messages:
 * - Findo is active and working 24/7
 * - No action required from the owner
 * - Clear explanation of what happens now
 * - Link to dashboard for confidence window
 */

interface SetupCompleteData {
  tenantId: string;
  businessName?: string;
}

/**
 * Renders the setup complete success page.
 *
 * @param data - Tenant ID and optional business name for personalization
 * @returns Full HTML page string
 */
export function renderSetupComplete(data: SetupCompleteData): string {
  const { tenantId, businessName } = data;
  const displayName = businessName || 'העסק שלך';

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Findo - ההגדרה הושלמה</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes checkmark {
      0% {
        stroke-dashoffset: 100;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }
    @keyframes scale-in {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .success-checkmark {
      animation: scale-in 0.5s ease-out forwards;
    }
    .checkmark-path {
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
      animation: checkmark 0.5s 0.3s ease-out forwards;
    }
  </style>
</head>
<body class="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
    <!-- Success Animation -->
    <div class="success-checkmark w-24 h-24 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
      <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path class="checkmark-path" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>

    <h1 class="text-2xl font-bold text-gray-800 mb-3">
      &#1502;&#1506;&#1493;&#1500;&#1492;! Findo &#1506;&#1493;&#1489;&#1491; &#1506;&#1489;&#1493;&#1512;&#1499;&#1501;
    </h1>

    <p class="text-gray-600 mb-6 leading-relaxed">
      &#1502;&#1506;&#1499;&#1513;&#1497;&#1493; Findo &#1508;&#1493;&#1506;&#1500; &#1489;&#1512;&#1511;&#1506; 24/7.<br/>
      &#1488;&#1497;&#1503; &#1510;&#1493;&#1512;&#1498; &#1500;&#1506;&#1513;&#1493;&#1514; &#1513;&#1493;&#1501; &#1491;&#1489;&#1512; - &#1508;&#1513;&#1493;&#1496; &#1514;&#1502;&#1513;&#1497;&#1499;&#1493; &#1500;&#1506;&#1489;&#1493;&#1491;.
    </p>

    <!-- What's Happening Now Box -->
    <div class="bg-blue-50 rounded-xl p-5 mb-6 text-right">
      <h3 class="font-semibold text-blue-800 mb-3 flex items-center gap-2">
        <span>&#128161;</span>
        <span>&#1502;&#1492; &#1511;&#1493;&#1512;&#1492; &#1506;&#1499;&#1513;&#1497;&#1493;?</span>
      </h3>
      <ul class="space-y-3 text-sm text-blue-700">
        <li class="flex items-start gap-3">
          <span class="text-green-500 mt-0.5">&#10003;</span>
          <span><strong>&#1513;&#1497;&#1495;&#1493;&#1514; &#1513;&#1500;&#1488; &#1504;&#1506;&#1504;&#1493;</strong> - &#1492;&#1493;&#1491;&#1506;&#1514; WhatsApp &#1504;&#1513;&#1500;&#1495;&#1514; &#1500;&#1500;&#1511;&#1493;&#1495;</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-green-500 mt-0.5">&#10003;</span>
          <span><strong>&#1489;&#1497;&#1511;&#1493;&#1512;&#1493;&#1514; &#1495;&#1491;&#1513;&#1493;&#1514;</strong> - &#1502;&#1506;&#1504;&#1492; &#1488;&#1493;&#1496;&#1493;&#1502;&#1496;&#1497; &#1489;-Google</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-green-500 mt-0.5">&#10003;</span>
          <span><strong>&#1489;&#1511;&#1513;&#1493;&#1514; &#1500;&#1489;&#1497;&#1511;&#1493;&#1512;&#1493;&#1514;</strong> - &#1504;&#1513;&#1500;&#1495;&#1493;&#1514; &#1488;&#1495;&#1512;&#1497; &#1513;&#1497;&#1512;&#1493;&#1514;</span>
        </li>
      </ul>
    </div>

    <!-- Dashboard CTA -->
    <a
      href="/dashboard"
      class="block w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
    >
      &#1500;&#1510;&#1508;&#1497;&#1497;&#1492; &#1489;&#1500;&#1493;&#1495; &#1492;&#1489;&#1511;&#1512;&#1492;
    </a>

    <!-- Footer Notice -->
    <p class="text-xs text-gray-400 mt-6">
      &#1514;&#1511;&#1489;&#1500;&#1493; &#1506;&#1491;&#1499;&#1493;&#1504;&#1497;&#1501; &#1489;-WhatsApp &#1499;&#1513;&#1497;&#1492;&#1497;&#1493; &#1491;&#1489;&#1512;&#1497;&#1501; &#1513;&#1510;&#1512;&#1497;&#1499;&#1497;&#1501; &#1488;&#1514; &#1514;&#1513;&#1493;&#1502;&#1514; &#1500;&#1489;&#1499;&#1501;
    </p>
  </div>

  <!-- Confetti Animation (subtle) -->
  <script>
    // Simple confetti effect on page load
    function createConfetti() {
      const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EC4899'];
      const container = document.body;

      for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = \`
          position: fixed;
          width: 10px;
          height: 10px;
          background: \${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: 50%;
          top: -10px;
          left: \${Math.random() * 100}%;
          animation: fall \${2 + Math.random() * 2}s linear forwards;
          opacity: 0.8;
          pointer-events: none;
        \`;
        container.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
      }
    }

    // Add falling animation
    const style = document.createElement('style');
    style.textContent = \`
      @keyframes fall {
        to {
          transform: translateY(\${window.innerHeight + 100}px) rotate(720deg);
          opacity: 0;
        }
      }
    \`;
    document.head.appendChild(style);

    // Run confetti after a short delay
    setTimeout(createConfetti, 500);
  </script>
</body>
</html>`;
}
