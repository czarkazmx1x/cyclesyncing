import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { FiCalendar, FiActivity, FiHeart, FiFileText, FiTrendingUp } from 'react-icons/fi';

export default function MonthlyDataSummary({ 
  symptoms, 
  moods, 
  notes, 
  currentMonth,
  aiRecommendations = [] 
}) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Filter data for current month
  const monthSymptoms = symptoms.filter(s => {
    const symptomDate = new Date(s.date);
    return symptomDate >= monthStart && symptomDate <= monthEnd;
  });

  const monthMoods = moods.filter(m => {
    const moodDate = new Date(m.date);
    return moodDate >= monthStart && moodDate <= monthEnd;
  });

  const monthNotes = notes.filter(n => {
    const noteDate = new Date(n.date);
    return noteDate >= monthStart && noteDate <= monthEnd;
  });

  // Calculate active days
  const activeDays = new Set();
  [...monthSymptoms, ...monthMoods, ...monthNotes].forEach(entry => {
    activeDays.add(format(new Date(entry.date), 'yyyy-MM-dd'));
  });

  // Get most common symptoms and moods
  const symptomCounts = {};
  monthSymptoms.forEach(s => {
    symptomCounts[s.symptom] = (symptomCounts[s.symptom] || 0) + 1;
  });

  const moodCounts = {};
  monthMoods.forEach(m => {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
  });

  const topSymptoms = Object.entries(symptomCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const topMoods = Object.entries(moodCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
      <div className="flex items-center space-x-3 mb-6">
        <FiCalendar className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Data Analysis
          </h3>
          <p className="text-sm text-gray-600">
            {format(currentMonth, 'MMMM yyyy')} • AI analyzing {activeDays.size} active days
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-2 mb-2">
            <FiActivity className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-gray-700">Symptoms</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{monthSymptoms.length}</div>
          <div className="text-xs text-gray-500">logged this month</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-2 mb-2">
            <FiHeart className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium text-gray-700">Moods</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{monthMoods.length}</div>
          <div className="text-xs text-gray-500">entries recorded</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-2 mb-2">
            <FiFileText className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Notes</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{monthNotes.length}</div>
          <div className="text-xs text-gray-500">personal notes</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-2 mb-2">
            <FiTrendingUp className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">AI Insights</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{aiRecommendations.length}</div>
          <div className="text-xs text-gray-500">generated</div>
        </div>
      </div>

      {(topSymptoms.length > 0 || topMoods.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topSymptoms.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium text-gray-900 mb-3">Most Common Symptoms</h4>
              <div className="space-y-2">
                {topSymptoms.map(([symptom, count], index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{symptom}</span>
                    <span className="text-sm font-medium text-gray-900">{count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {topMoods.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium text-gray-900 mb-3">Dominant Moods</h4>
              <div className="space-y-2">
                {topMoods.map(([mood, count], index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{mood}</span>
                    <span className="text-sm font-medium text-gray-900">{count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeDays.size === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">📊</div>
          <p className="text-gray-600 text-sm">
            Start logging symptoms, moods, and notes to see monthly analysis
          </p>
          <p className="text-gray-500 text-xs mt-1">
            AI needs data to generate personalized insights
          </p>
        </div>
      )}
    </div>
  );
}