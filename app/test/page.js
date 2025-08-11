export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-primary-600 mb-4">Test Page</h1>
      <p className="text-gray-700">This is a test page to verify the site is working correctly.</p>
      <div className="mt-8 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900">Color Theme Test</h2>
          <div className="mt-2 flex space-x-2">
            <div className="w-20 h-20 bg-primary-500 rounded"></div>
            <div className="w-20 h-20 bg-menstrual rounded"></div>
            <div className="w-20 h-20 bg-follicular rounded"></div>
            <div className="w-20 h-20 bg-ovulatory rounded"></div>
            <div className="w-20 h-20 bg-luteal rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}