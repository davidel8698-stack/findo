export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Findo</h1>
      <p className="text-base sm:text-lg text-gray-600">
        Technical foundation ready
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <div className="p-4 bg-blue-500 text-white rounded-lg">
          Tailwind 4.0 Working
        </div>
        <div className="p-4 bg-green-500 text-white rounded-lg">
          Next.js 16 Ready
        </div>
      </div>
    </main>
  );
}
