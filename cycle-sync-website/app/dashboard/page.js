"use client";

import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import SymptomModal from '../../components/SymptomModal';
import MoodModal from '../../components/MoodModal';
import AIInsights from '../../components/AIInsights';
import { useCycle } from '../../contexts/CycleContext';
import { 
  FiHeart, 
  FiDroplet, 
  FiCalendar, 
  FiTrendingUp,
  FiActivity,
  FiSun,
  FiMoon,
  FiStar
} from 'react-icons/fi';

export default function Dashboard() {
  const { userProfile, cycleData, symptoms, moods } = useCycle();
  const [symptomModalOpen, setSymptomModalOpen] = useState(false);
  const [moodModalOpen, setMoodModalOpen] = useState(false);

  // Phase information with feminine colors
  const phaseInfo = {
    menstrual: {
      name: 'Menstrual',
      emoji: '🌹',
      color: 'bg-gradient-to-br from-red-400 to-pink-400',
      lightColor: 'bg-gradient-to-br from-red-50 to-pink-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-300',
      description: 'Time to rest and honor your body. You are powerful. 💕',
      tips: ['Rest and recharge', 'Gentle movement', 'Nourishing foods']
    },
    follicular: {
      name: 'Follicular',
      emoji: '🌸',
      color: 'bg-gradient-to-br from-blue-400 to-purple-400',
      lightColor: 'bg-gradient-to-br from-blue-50 to-purple-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-300',
      description: 'Fresh energy blooming! Time for new beginnings. ✨',
      tips: ['Try new activities', 'Social connections', 'Fresh foods']
    },
    ovulatory: {
      name: 'Ovulatory',
      emoji: '☀️',
      color: 'bg-gradient-to-br from-yellow-400 to-orange-400',
      lightColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-300',
      description: 'You\'re radiant! Your energy is magnetic. 🌟',
      tips: ['High-energy activities', 'Important conversations', 'Vibrant foods']
    },
    luteal: {
      name: 'Luteal',
      emoji: '🌙',
      color: 'bg-gradient-to-br from-purple-400 to-indigo-400',
      lightColor: 'bg-gradient-to-br from-purple-50 to-indigo-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-300',
      description: 'Turning inward. Time for self-care and reflection. 🦋',
      tips: ['Gentle yoga', 'Cozy activities', 'Comfort foods']
    }
  };

  const currentPhaseData = phaseInfo[cycleData.currentPhase];

  // Calculate days until next period
  const daysUntilPeriod = cycleData.nextPeriodDate 
    ? Math.ceil((new Date(cycleData.nextPeriodDate) - new Date()) / (1000 * 60 * 60 * 24))
    : userProfile?.cycleLength ? userProfile.cycleLength - cycleData.currentDay : 28 - cycleData.currentDay;

  // Quick actions with gradient colors
  const quickActions = [
    {
      title: 'Log Symptoms',
      emoji: '🌺',
      action: () => setSymptomModalOpen(true),
      gradient: 'from-green-400 to-teal-400'
    },
    {
      title: 'Track Mood',
      emoji: '💕',
      action: () => setMoodModalOpen(true),
      gradient: 'from-pink-400 to-rose-400'
    },
    {
      title: 'View Calendar',
      emoji: '📅',
      action: () => window.location.href = '/dashboard/calendar',
      gradient: 'from-indigo-400 to-purple-400'
    },
    {
      title: 'Get Tips',
      emoji: '✨',
      action: () => window.location.href = '/dashboard/recommendations',
      gradient: 'from-orange-400 to-pink-400'
    }
  ];

  // Phase-specific recommendations
  const getPhaseRecommendations = () => {
    const recommendations = {
      menstrual: [
        {
          category: 'Self-Care',
          emoji: '🛁',
          title: 'Warm Bath Ritual',
          description: 'Draw a bath with rose petals and essential oils',
          gradient: 'from-pink-400 to-red-400'
        },
        {
          category: 'Nutrition',
          emoji: '🍫',
          title: 'Dark Chocolate',
          description: 'Treat yourself to magnesium-rich dark chocolate',
          gradient: 'from-amber-400 to-orange-400'
        },
        {
          category: 'Movement',
          emoji: '🧘‍♀️',
          title: 'Gentle Yoga',
          description: 'Restorative poses to ease discomfort',
          gradient: 'from-purple-400 to-pink-400'
        }
      ],
      follicular: [
        {
          category: 'Exercise',
          emoji: '💪',
          title: 'Strength Training',
          description: 'Your body is ready to build muscle!',
          gradient: 'from-blue-400 to-purple-400'
        },
        {
          category: 'Nutrition',
          emoji: '🥗',
          title: 'Fresh Salads',
          description: 'Light, energizing foods to match your mood',
          gradient: 'from-green-400 to-teal-400'
        },
        {
          category: 'Productivity',
          emoji: '🚀',
          title: 'Start New Projects',
          description: 'Your creativity is peaking!',
          gradient: 'from-indigo-400 to-purple-400'
        }
      ],
      ovulatory: [
        {
          category: 'Social',
          emoji: '💃',
          title: 'Social Activities',
          description: 'Your charisma is at its peak!',
          gradient: 'from-yellow-400 to-orange-400'
        },
        {
          category: 'Exercise',
          emoji: '🏃‍♀️',
          title: 'HIIT Workouts',
          description: 'Channel your high energy!',
          gradient: 'from-red-400 to-pink-400'
        },
        {
          category: 'Beauty',
          emoji: '✨',
          title: 'Glow Up',
          description: 'Your skin is naturally radiant',
          gradient: 'from-pink-400 to-purple-400'
        }
      ],
      luteal: [
        {
          category: 'Rest',
          emoji: '🕯️',
          title: 'Cozy Evening',
          description: 'Light candles and read a good book',
          gradient: 'from-purple-400 to-indigo-400'
        },
        {
          category: 'Nutrition',
          emoji: '🍵',
          title: 'Herbal Teas',
          description: 'Chamomile and lavender for calm',
          gradient: 'from-green-400 to-teal-400'
        },
        {
          category: 'Self-Care',
          emoji: '💆‍♀️',
          title: 'Face Mask',
          description: 'Pamper your skin with a hydrating mask',
          gradient: 'from-pink-400 to-rose-400'
        }
      ]
    };

    return recommendations[cycleData.currentPhase] || recommendations.follicular;
  };

  const todaysRecommendations = getPhaseRecommendations();

  // Get recent activity
  const getRecentActivity = () => {
    const activities = [];
    
    // Add recent symptoms
    symptoms.slice(-2).forEach(symptom => {
      activities.push({
        type: 'symptom',
        text: `Logged ${symptom.type.toLowerCase()}`,
        time: new Date(symptom.date).toLocaleString(),
        icon: FiActivity,
        color: 'text-green-500',
        bgColor: 'bg-green-100'
      });
    });

    // Add recent moods
    moods.slice(-2).forEach(mood => {
      activities.push({
        type: 'mood',
        text: `Tracked mood: ${mood.mood}`,
        time: new Date(mood.date).toLocaleString(),
        icon: FiHeart,
        color: 'text-pink-500',
        bgColor: 'bg-pink-100'
      });
    });

    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 3);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-800">
            Hello beautiful{userProfile?.name ? `, ${userProfile.name}` : ''}! 🌺
          </h1>
          <p className="text-gray-600 mt-1">Here's your wellness journey today</p>
        </div>
        {/* Current Phase Card */}
        <div className={`${currentPhaseData.lightColor} rounded-3xl p-8 mb-8 border-2 ${currentPhaseData.borderColor} shadow-soft`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start space-x-4 mb-6 lg:mb-0">
              <div className={`${currentPhaseData.color} rounded-2xl p-4 shadow-lg`}>
                <span className="text-4xl">{currentPhaseData.emoji}</span>
              </div>
              <div>
                <h2 className={`text-2xl font-semibold ${currentPhaseData.textColor} mb-2`}>
                  {currentPhaseData.name} Phase
                </h2>
                <p className="text-gray-700 font-medium">Day {cycleData.currentDay} of your cycle</p>
                <p className="text-gray-600 mt-2 italic">{currentPhaseData.description}</p>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <div className="text-sm text-gray-600 mb-1">Next period in</div>
              <div className="text-4xl font-bold gradient-text">{daysUntilPeriod}</div>
              <div className="text-sm text-gray-600">days</div>
            </div>
          </div>

          {/* Phase Tips */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Today's gentle reminders:</h3>
            <div className="flex flex-wrap gap-2">
              {currentPhaseData.tips.map((tip, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/80 text-gray-700 shadow-sm"
                >
                  <span className="mr-2">•</span>
                  {tip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="group relative bg-white rounded-2xl p-6 shadow-soft hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-pink-100 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative">
                <div className="text-4xl mb-3">{action.emoji}</div>
                <h3 className="text-sm font-medium text-gray-800">{action.title}</h3>
              </div>
            </button>
          ))}
        </div>

        {/* Today's Recommendations */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft p-8 mb-8 border border-pink-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="mr-2">💫</span>
            Today's Wellness Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {todaysRecommendations.map((rec, index) => (
              <div key={index} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-br ${rec.gradient} opacity-5 rounded-2xl`}></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:border-primary-300 transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-3xl">{rec.emoji}</span>
                    <span className="text-xs bg-gradient-to-r from-primary-100 to-pink-100 text-primary-700 px-3 py-1 rounded-full font-medium">
                      {rec.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{rec.title}</h3>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cycle Overview and AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cycle Progress */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft p-6 border border-pink-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🌸</span>
              Cycle Progress
            </h2>
            <div className="relative">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Day 1</span>
                <span>Day {userProfile?.cycle_length || 28}</span>
              </div>
              <div className="w-full bg-gradient-to-r from-pink-100 to-purple-100 rounded-full h-4 mb-4 overflow-hidden">
                <div 
                  className={`${currentPhaseData.color} h-4 rounded-full transition-all duration-500 shadow-inner`}
                  style={{ width: `${(cycleData.currentDay / (userProfile?.cycle_length || 28)) * 100}%` }}
                ></div>
              </div>
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  {Math.round((cycleData.currentDay / (userProfile?.cycle_length || 28)) * 100)}% through your cycle
                </span>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <AIInsights />
        </div>

        {/* Recent Activity */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft p-6 border border-pink-100 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">✨</span>
            Recent Activity
          </h2>
          <div className="space-y-3">
            {getRecentActivity().length > 0 ? (
              getRecentActivity().map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`${activity.bgColor} rounded-full p-2`}>
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Start tracking to see your journey! 🌟</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SymptomModal isOpen={symptomModalOpen} onClose={() => setSymptomModalOpen(false)} />
      <MoodModal isOpen={moodModalOpen} onClose={() => setMoodModalOpen(false)} />
    </DashboardLayout>
  );
}