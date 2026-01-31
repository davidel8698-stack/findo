export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">פינדו</h1>
      <p className="text-base sm:text-lg text-gray-600 mb-8">
        הבסיס הטכני מוכן
      </p>

      {/* RTL Test: Logical properties */}
      <div className="w-full max-w-2xl space-y-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="font-bold mb-2">בדיקת RTL - Logical Properties</h2>
          <div className="flex gap-4">
            {/* ps = padding-start (right in RTL) */}
            <div className="bg-blue-500 text-white p-3 ps-8 rounded">
              ps-8 (padding-start)
            </div>
            {/* pe = padding-end (left in RTL) */}
            <div className="bg-green-500 text-white p-3 pe-8 rounded">
              pe-8 (padding-end)
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-bold mb-2">בדיקת Margin - Logical</h2>
          <div className="flex gap-4">
            {/* ms = margin-start (right in RTL) */}
            <div className="bg-purple-500 text-white p-3 ms-8 rounded">
              ms-8 (margin-start)
            </div>
            {/* me = margin-end (left in RTL) */}
            <div className="bg-orange-500 text-white p-3 me-8 rounded">
              me-8 (margin-end)
            </div>
          </div>
        </div>

        <div className="bg-green-100 p-4 rounded-lg text-start">
          <h2 className="font-bold mb-2">כיוון טקסט</h2>
          <p className="text-start">text-start = ימין ב-RTL</p>
          <p className="text-end">text-end = שמאל ב-RTL</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded-lg">
          <h2 className="font-bold mb-2">Inset Properties</h2>
          <div className="relative h-20 bg-gray-200 rounded">
            {/* start-0 = right:0 in RTL */}
            <div className="absolute start-0 top-0 bg-red-500 text-white p-2 rounded-ss-lg">
              start-0
            </div>
            {/* end-0 = left:0 in RTL */}
            <div className="absolute end-0 bottom-0 bg-blue-500 text-white p-2 rounded-ee-lg">
              end-0
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <div className="p-4 bg-blue-500 text-white rounded-lg">
          Tailwind 4.0 + RTL
        </div>
        <div className="p-4 bg-green-500 text-white rounded-lg">
          Next.js 16 Ready
        </div>
      </div>
    </main>
  );
}
