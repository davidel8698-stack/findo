/**
 * Setup Wizard Step 4: Telephony Selection
 *
 * Allows business owner to choose how they want to receive calls:
 * 1. New number from Voicenter (instant activation)
 * 2. Transfer existing number (3-5 business days)
 * 3. Use current mobile with call forwarding (instant)
 *
 * Per SETUP-04: Select telephony option with clear time expectations.
 */

export type TelephonyOption = 'new' | 'transfer' | 'current';

interface Step4Data {
  selected?: TelephonyOption;
  existingNumber?: string;
  error?: string;
}

/**
 * Renders the telephony selection step.
 *
 * @param data - Optional pre-filled data and error state
 * @returns HTML string for step 4 form
 */
export function renderStep4Telephony(data?: Step4Data): string {
  const selected = data?.selected || '';
  const existingNumber = data?.existingNumber || '';
  const error = data?.error || '';

  return `
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">הגדרת טלפון</h2>
        <p class="text-gray-600">איך תרצו לקבל שיחות מלקוחות?</p>
      </div>

      ${error ? `
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          ${error}
        </div>
      ` : ''}

      <form method="POST" action="/setup/step/4" class="space-y-4">
        <!-- Option 1: New Number -->
        <label class="block cursor-pointer">
          <input
            type="radio"
            name="telephonyOption"
            value="new"
            class="hidden peer"
            ${selected === 'new' ? 'checked' : ''}
            onchange="handleOptionChange(this)"
          />
          <div class="peer-checked:border-blue-500 peer-checked:bg-blue-50 border-2 border-gray-200 rounded-xl p-5 transition-all hover:border-gray-300">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-3xl">&#128222;</span>
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-800 text-lg">&#1502;&#1505;&#1508;&#1512; &#1495;&#1491;&#1513; &#1502;-Voicenter</p>
                <p class="text-gray-600">&#1502;&#1505;&#1508;&#1512; &#1497;&#1513;&#1512;&#1488;&#1500;&#1497; &#1495;&#1491;&#1513; - &#1502;&#1493;&#1508;&#1506;&#1500; &#1502;&#1497;&#1491;</p>
                <div class="mt-2 flex items-center gap-2 text-green-600 font-medium">
                  <span>&#9889;</span>
                  <span>&#1508;&#1506;&#1497;&#1500; &#1514;&#1493;&#1498; &#1491;&#1511;&#1493;&#1514;</span>
                </div>
              </div>
              <div class="peer-checked:opacity-100 opacity-0 text-blue-500">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </label>

        <!-- Option 2: Transfer Existing -->
        <label class="block cursor-pointer">
          <input
            type="radio"
            name="telephonyOption"
            value="transfer"
            class="hidden peer"
            ${selected === 'transfer' ? 'checked' : ''}
            onchange="handleOptionChange(this)"
          />
          <div class="peer-checked:border-blue-500 peer-checked:bg-blue-50 border-2 border-gray-200 rounded-xl p-5 transition-all hover:border-gray-300">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-3xl">&#128260;</span>
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-800 text-lg">&#1492;&#1506;&#1489;&#1512;&#1514; &#1502;&#1505;&#1508;&#1512; &#1511;&#1497;&#1497;&#1501;</p>
                <p class="text-gray-600">&#1504;&#1506;&#1489;&#1497;&#1512; &#1488;&#1514; &#1492;&#1502;&#1505;&#1508;&#1512; &#1492;&#1504;&#1493;&#1499;&#1495;&#1497; &#1513;&#1500;&#1499;&#1501;</p>
                <div class="mt-2 flex items-center gap-2 text-blue-600 font-medium">
                  <span>&#128197;</span>
                  <span>3-5 &#1497;&#1502;&#1497; &#1506;&#1489;&#1493;&#1491;&#1492;</span>
                </div>
              </div>
              <div class="peer-checked:opacity-100 opacity-0 text-blue-500">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <!-- Conditional phone input for transfer -->
            <div id="transferPhoneInput" class="mt-4 pt-4 border-t border-gray-200 ${selected === 'transfer' ? '' : 'hidden'}">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                &#1502;&#1505;&#1508;&#1512; &#1492;&#1496;&#1500;&#1508;&#1493;&#1503; &#1500;&#1492;&#1506;&#1489;&#1512;&#1492;
              </label>
              <input
                type="tel"
                name="existingNumber"
                value="${existingNumber}"
                placeholder="05X-XXXXXXX"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                dir="ltr"
                ${selected === 'transfer' ? 'required' : ''}
              />
              <p class="mt-1 text-sm text-gray-500">&#1508;&#1493;&#1512;&#1502;&#1496; &#1497;&#1513;&#1512;&#1488;&#1500;&#1497;</p>
            </div>
          </div>
        </label>

        <!-- Option 3: Use Current Mobile -->
        <label class="block cursor-pointer">
          <input
            type="radio"
            name="telephonyOption"
            value="current"
            class="hidden peer"
            ${selected === 'current' ? 'checked' : ''}
            onchange="handleOptionChange(this)"
          />
          <div class="peer-checked:border-blue-500 peer-checked:bg-blue-50 border-2 border-gray-200 rounded-xl p-5 transition-all hover:border-gray-300">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-3xl">&#128241;</span>
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-800 text-lg">&#1513;&#1497;&#1502;&#1493;&#1513; &#1489;&#1504;&#1497;&#1497;&#1491; &#1492;&#1504;&#1493;&#1499;&#1495;&#1497;</p>
                <p class="text-gray-600">&#1504;&#1490;&#1491;&#1497;&#1512; &#1492;&#1506;&#1489;&#1512;&#1514; &#1513;&#1497;&#1495;&#1493;&#1514; &#1502;&#1492;&#1504;&#1497;&#1497;&#1491; &#1513;&#1500;&#1499;&#1501;</p>
                <div class="mt-2 flex items-center gap-2 text-green-600 font-medium">
                  <span>&#9889;</span>
                  <span>&#1508;&#1506;&#1497;&#1500; &#1514;&#1493;&#1498; &#1491;&#1511;&#1493;&#1514;</span>
                </div>
              </div>
              <div class="peer-checked:opacity-100 opacity-0 text-blue-500">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <!-- Conditional phone input for current mobile -->
            <div id="currentPhoneInput" class="mt-4 pt-4 border-t border-gray-200 ${selected === 'current' ? '' : 'hidden'}">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                &#1502;&#1505;&#1508;&#1512; &#1492;&#1504;&#1497;&#1497;&#1491; &#1513;&#1500;&#1499;&#1501;
              </label>
              <input
                type="tel"
                name="existingNumber"
                value="${existingNumber}"
                placeholder="05X-XXXXXXX"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                dir="ltr"
                ${selected === 'current' ? 'required' : ''}
              />
              <p class="mt-1 text-sm text-gray-500">&#1508;&#1493;&#1512;&#1502;&#1496; &#1497;&#1513;&#1512;&#1488;&#1500;&#1497;</p>
            </div>
          </div>
        </label>

        <!-- Navigation -->
        <div class="flex justify-between items-center pt-6">
          <a
            href="/setup/step/3"
            class="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            &#8594; &#1495;&#1494;&#1512;&#1492;
          </a>
          <button
            type="submit"
            class="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            id="submitBtn"
          >
            &#1492;&#1502;&#1513;&#1498; &#1500;&#1514;&#1513;&#1500;&#1493;&#1501;
          </button>
        </div>
      </form>
    </div>

    <script>
      function handleOptionChange(radio) {
        // Hide all conditional inputs
        document.getElementById('transferPhoneInput').classList.add('hidden');
        document.getElementById('currentPhoneInput').classList.add('hidden');

        // Remove required from all phone inputs
        document.querySelectorAll('input[name="existingNumber"]').forEach(input => {
          input.required = false;
        });

        // Show and require the relevant input
        if (radio.value === 'transfer') {
          const container = document.getElementById('transferPhoneInput');
          container.classList.remove('hidden');
          container.querySelector('input').required = true;
        } else if (radio.value === 'current') {
          const container = document.getElementById('currentPhoneInput');
          container.classList.remove('hidden');
          container.querySelector('input').required = true;
        }
      }
    </script>
  `;
}
