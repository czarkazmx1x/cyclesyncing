import { useState } from 'react';
import { format } from 'date-fns';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiBrain, 
  FiHeart, 
  FiCalendar,
  FiActivity,
  FiStar,
  FiTarget,
  FiLightbulb,
  FiBarChart3,
  FiRefreshCw
} from 'react-icons/fi';

export default function PersonalizedInsightsDisplay({ 
  insights, 
  isLoading, 
  onRegenerateInsights,
  currentMonth 
}) {
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Analyzing your patterns...</span>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <FiBrain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Start tracking to get personalized insights</p>
          <p className="text-sm text-gray-500">
            Log symptoms, moods, and notes to see AI-powered recommendations
          </p>
        </div>
      </div>
    );
  }

  const { personalizedSuggestions, phaseAnalysis, symptomPatterns, moodPatterns, cycleInsights } = insights;

  const getPhaseColor = (phase) => {
    const colors = {
      menstrual: 'bg-red-100 text-red-800 border-red-200',
      follicular: 'bg-blue-100 text-blue-800 border-blue-200',
      ovulatory: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      luteal: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[phase] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      nutrition: '🥗',
      exercise: '🏃‍♀️',
      'self-care': '🛁',
      lifestyle: '🌟'
    };
    return icons[category] || '💡';
  };

  const getCategoryColor = (category) => {
    const colors = {
      nutrition: 'bg-green-50 border-green-200',
      exercise: 'bg-orange-50 border-orange-200',
      'self-care': 'bg-pink-50 border-pink-200',
      lifestyle: 'bg-blue-50 border-blue-200'
    };
    return colors[category] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FiBrain className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Your Personalized Insights
              </h2>
              <p className="text-sm text-gray-600">
                {format(currentMonth, 'MMMM yyyy')} • Based on your tracking data
              </p>
            </div>
          </div>
          <button
            onClick={onRegenerateInsights}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 text-sm"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: 'overview', label: 'Overview', icon: FiBarChart3 },
          { id: 'recommendations', label: 'Recommendations', icon: FiTarget },
          { id: 'patterns', label: 'Patterns', icon: FiTrendingUp },
          { id: 'phases', label: 'Phase Insights', icon: FiCalendar }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Insight */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100">
              <div className="flex items-start space-x-3">
                <FiLightbulb className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Key Insight</h3>
                  <p className="text-gray-700">
                    {personalizedSuggestions?.overallInsight || "Continue tracking to discover patterns!"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiActivity className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Active Days</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {insights.activeDays}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiHeart className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-600">Wellness Score</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {cycleInsights?.overallWellness || 'N/A'}/10
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiTrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">Symptoms</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {symptomPatterns?.totalUniqueSymptoms || 0}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiStar className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">Mood Stability</span>
                </div>
                <div className="text-lg font-bold text-gray-900 mt-1">
                  {moodPatterns?.moodStability || 'N/A'}
                </div>
              </div>
            </div>

            {/* Next Month Focus */}
            {personalizedSuggestions?.nextMonthFocus && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Next Month Focus</h4>
                <p className="text-blue-800">{personalizedSuggestions.nextMonthFocus}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {personalizedSuggestions?.topRecommendations?.map((rec, index) => (
              <div 
                key={index} 
                className={`p-5 rounded-lg border-2 ${getCategoryColor(rec.category)}`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getCategoryIcon(rec.category)}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                      <span className="text-xs bg-white px-2 py-1 rounded-full border">
                        {rec.category}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{rec.description}</p>
                    <div className="bg-white p-3 rounded border">
                      <span className="text-sm font-medium text-gray-600">Action: </span>
                      <span className="text-sm text-gray-800">{rec.action}</span>
                    </div>
                  </div>
                </div>
              </div>
            )) || (
              <p className="text-gray-600 text-center py-8">
                No specific recommendations yet. Continue tracking to get personalized advice!
              </p>
            )}
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="space-y-6">
            {/* Discovered Patterns */}
            {personalizedSuggestions?.patterns && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Patterns Discovered</h3>
                <div className="space-y-3">
                  {personalizedSuggestions.patterns.map((pattern, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FiTrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                      <p className="text-gray-700">{pattern}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Symptom Patterns */}
            {symptomPatterns?.mostCommon && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Most Common Symptoms</h3>
                <div className="space-y-2">
                  {symptomPatterns.mostCommon.slice(0, 5).map(([symptom, count], index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="font-medium text-gray-900">{symptom}</span>
                      <span className="text-sm text-gray-600">{count} times</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mood Patterns */}
            {moodPatterns?.dominantMoods && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Dominant Moods</h3>
                <div className="space-y-2">
                  {moodPatterns.dominantMoods.slice(0, 3).map(([mood, count], index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium text-gray-900">{mood}</span>
                      <span className="text-sm text-gray-600">{count} times</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'phases' && (
          <div className="space-y-4">
            {Object.entries(personalizedSuggestions?.phaseSpecificTips || {}).map(([phase, tips]) => (
              <div key={phase} className={`p-5 rounded-lg border-2 ${getPhaseColor(phase)}`}>
                <h3 className="font-semibold mb-3 capitalize">
                  {phase} Phase Recommendations
                </h3>
                <div className="space-y-2">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-sm font-bold text-gray-600 mt-1">•</span>
                      <span className="text-sm text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
                
                {/* Phase Data */}
                {phaseAnalysis?.[phase] && (
                  <div className="mt-4 p-3 bg-white bg-opacity-60 rounded border">
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Common symptoms: {phaseAnalysis[phase].commonSymptoms.join(', ') || 'None logged'}</div>
                      <div>Average intensity: {phaseAnalysis[phase].averageSymptomIntensity}</div>
                      <div>Common moods: {phaseAnalysis[phase].commonMoods.join(', ') || 'None logged'}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}