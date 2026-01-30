/**
 * Setup Wizard Step 5: Billing
 *
 * Shows pricing summary and payment options:
 * - Setup fee: 3,500 NIS (one-time)
 * - Monthly subscription: 350 NIS/month
 * - Total first payment: 3,850 NIS
 *
 * Two options:
 * 1. Pay now via PayPlus hosted page
 * 2. Start 14-day trial (no payment required)
 *
 * Per SETUP-05 and BILLING requirements.
 */

interface Step5Data {
  tenantId: string;
  setupFeeAgorot: number;
  monthlyFeeAgorot: number;
  error?: string;
}

/**
 * Formats agorot amount to NIS with thousands separator.
 *
 * @param agorot - Amount in agorot (1 NIS = 100 agorot)
 * @returns Formatted string like "3,500"
 */
function formatNIS(agorot: number): string {
  const nis = agorot / 100;
  return nis.toLocaleString('he-IL');
}

/**
 * Renders the billing step with pricing summary and payment options.
 *
 * @param data - Tenant ID and pricing information
 * @returns HTML string for step 5 form
 */
export function renderStep5Billing(data: Step5Data): string {
  const { tenantId, setupFeeAgorot, monthlyFeeAgorot, error } = data;
  const totalFirstPayment = setupFeeAgorot + monthlyFeeAgorot;

  return `
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">&#1514;&#1513;&#1500;&#1493;&#1501; &#1493;&#1492;&#1508;&#1506;&#1500;&#1492;</h2>
        <p class="text-gray-600">&#1513;&#1500;&#1489; &#1488;&#1495;&#1512;&#1493;&#1503; &#1500;&#1508;&#1504;&#1497; &#1513;-Findo &#1502;&#1514;&#1495;&#1497;&#1500; &#1500;&#1506;&#1489;&#1493;&#1491; &#1506;&#1489;&#1493;&#1512;&#1499;&#1501;</p>
      </div>

      ${error ? `
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          ${error}
        </div>
      ` : ''}

      <!-- Pricing Summary Card -->
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">&#1505;&#1497;&#1499;&#1493;&#1501; &#1502;&#1495;&#1497;&#1512;&#1497;&#1501;</h3>

        <div class="space-y-3">
          <!-- Setup Fee -->
          <div class="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <p class="font-medium text-gray-800">&#1491;&#1502;&#1497; &#1492;&#1511;&#1502;&#1492; (&#1495;&#1491; &#1508;&#1506;&#1502;&#1497;)</p>
              <p class="text-sm text-gray-500">&#1492;&#1490;&#1491;&#1512;&#1514; &#1492;&#1502;&#1506;&#1512;&#1499;&#1514; &#1493;&#1495;&#1497;&#1489;&#1493;&#1512; &#1500;&#1508;&#1500;&#1496;&#1508;&#1493;&#1512;&#1502;&#1493;&#1514;</p>
            </div>
            <p class="text-lg font-semibold text-gray-800">${formatNIS(setupFeeAgorot)} &#8362;</p>
          </div>

          <!-- Monthly Subscription -->
          <div class="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <p class="font-medium text-gray-800">&#1502;&#1504;&#1493;&#1497; &#1495;&#1493;&#1491;&#1513;&#1497;</p>
              <p class="text-sm text-gray-500">24/7 &#1508;&#1506;&#1497;&#1500;&#1493;&#1514; &#1488;&#1493;&#1496;&#1493;&#1504;&#1493;&#1502;&#1497;&#1514;</p>
            </div>
            <p class="text-lg font-semibold text-gray-800">${formatNIS(monthlyFeeAgorot)} &#8362;/&#1495;&#1493;&#1491;&#1513;</p>
          </div>

          <!-- Total First Payment -->
          <div class="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4 -mx-2">
            <div>
              <p class="font-semibold text-blue-800">&#1505;&#1492;&#34;&#1499; &#1500;&#1514;&#1513;&#1500;&#1493;&#1501; &#1512;&#1488;&#1513;&#1493;&#1503;</p>
              <p class="text-sm text-blue-600">&#1491;&#1502;&#1497; &#1492;&#1511;&#1502;&#1492; + &#1495;&#1493;&#1491;&#1513; &#1512;&#1488;&#1513;&#1493;&#1503;</p>
            </div>
            <p class="text-2xl font-bold text-blue-800">${formatNIS(totalFirstPayment)} &#8362;</p>
          </div>
        </div>
      </div>

      <!-- Payment Options -->
      <div class="space-y-4">
        <!-- Pay Now Button -->
        <form method="POST" action="/setup/step/5/pay">
          <input type="hidden" name="tenantId" value="${tenantId}" />
          <button
            type="submit"
            class="w-full py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-3"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>&#1500;&#1514;&#1513;&#1500;&#1493;&#1501; &#1502;&#1488;&#1493;&#1489;&#1496;&#1495;</span>
          </button>
        </form>

        <!-- Security Badges -->
        <div class="flex items-center justify-center gap-4 text-gray-500 text-sm">
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
            <span>SSL</span>
          </div>
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>PCI DSS</span>
          </div>
        </div>

        <p class="text-center text-xs text-gray-400">
          &#1492;&#1514;&#1513;&#1500;&#1493;&#1501; &#1502;&#1488;&#1493;&#1489;&#1496;&#1495; &#1489;&#1505;&#1496;&#1504;&#1491;&#1512;&#1496; PCI DSS &#1489;&#1488;&#1502;&#1510;&#1506;&#1493;&#1514; PayPlus
        </p>

        <!-- Divider -->
        <div class="relative py-4">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center">
            <span class="bg-gray-50 px-4 text-sm text-gray-500">&#1488;&#1493;</span>
          </div>
        </div>

        <!-- Trial Option -->
        <form method="POST" action="/setup/step/5/trial">
          <input type="hidden" name="tenantId" value="${tenantId}" />
          <button
            type="submit"
            class="w-full py-4 bg-white border-2 border-blue-500 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
          >
            &#1492;&#1514;&#1495;&#1500; &#1514;&#1511;&#1493;&#1508;&#1514; &#1504;&#1497;&#1505;&#1497;&#1493;&#1503; - 14 &#1497;&#1493;&#1501;
          </button>
        </form>

        <p class="text-center text-sm text-gray-500">
          &#1500;&#1500;&#1488; &#1510;&#1493;&#1512;&#1498; &#1489;&#1499;&#1512;&#1496;&#1497;&#1505; &#1488;&#1513;&#1512;&#1488;&#1497; &#183; &#1489;&#1497;&#1496;&#1493;&#1500; &#1489;&#1499;&#1500; &#1506;&#1514;
        </p>
      </div>

      <!-- Navigation -->
      <div class="pt-4">
        <a
          href="/setup/step/4"
          class="text-gray-600 hover:text-gray-800 transition-colors"
        >
          &#8594; &#1495;&#1494;&#1512;&#1492; &#1500;&#1489;&#1495;&#1497;&#1512;&#1514; &#1496;&#1500;&#1508;&#1493;&#1503;
        </a>
      </div>
    </div>
  `;
}
