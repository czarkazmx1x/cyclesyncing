"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import PersonalizedInsightsDisplay from '../../../components/insights/PersonalizedInsightsDisplay';
import MonthlyInsightsAnalyzer from '../../../components/insights/MonthlyInsightsAnalyzer';
import { useCycle } from '../../../contexts/CycleContext';
import { 
  FiTrendingUp,
  FiCalendar,
  FiActivity,
  FiHeart,
  FiBarChart,
  FiTarget,
  FiClock,
  FiZap,
  FiCpu,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { format, addMonths, subMonths } from 'date-fns';

// Force this page to be dynamic
export const dynamic = 'force-dynamic';

export default function InsightsPage() {
  const { cycleData, symptoms, moods, userProfile } = useCycle();
  const [insights, setInsights] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [personalizedInsights, setPersonalizedInsights] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dayNotes, setDayNotes] = useState([]); // Would come from context in real app

  useEffect(() => {
    if (cycleData) {
      generateBasicInsights();
    }
  }, [cycleData]);

  const generateBasicInsights = () => {
    if (!cycleData) return;
    
    const calculatedInsights = [
      {
        id: 1,
        title: "Cycle Pattern Analysis",
        value: `${cycleData.cycleLength || 28} days`,
        change: "+2%",
        trend: "up",
        icon: FiTrendingUp,
        description: "Your average cycle length has been consistent"
      },
      {
        id: 2,
        title: "Symptoms Tracked",
        value: symptoms?.length || 0,
        change: symptoms?.length > 10 ? "+15%" : "-5%",
        trend: symptoms?.length > 10 ? "up" : "down",
        icon: FiActivity,
        description: `${symptoms?.length || 0} symptoms logged this month`
      },
      {
        id: 3,
        title: "Mood Entries",
        value: moods?.length || 0,
        change: moods?.length > 5 ? "+25%" : "0%",
        trend: moods?.length > 5 ? "up" : "stable",
        icon: FiHeart,
        description: `${moods?.length || 0} mood entries recorded`
      },
      {
        id: 4,
        title: "Data Quality",
        value: getDataQualityScore(),
        change: "+10%",
        trend: "up",
        icon: FiZap,
        description: "Comprehensive tracking improves insights"
      }
    ];

    setInsights(calculatedInsights);
  };

  const getDataQualityScore = () => {
    const symptomScore = Math.min(10, (symptoms?.length || 0) * 2);
    const moodScore = Math.min(10, (moods?.length || 0) * 4);
    const noteScore = Math.min(10, dayNotes.length * 5);
    const total = Math.round((symptomScore + moodScore + noteScore) / 3 * 10);
    return `${total}%`;
  };

  const handleInsightsGenerated = (newInsights) => {
    setPersonalizedInsights(newInsights);
  };

  const handleRegenerateInsights = () => {
    setPersonalizedInsights(null);
    // This will trigger the analyzer to regenerate insights
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Insights & Analytics</h1>
          <div className="flex items-center space-x-4">
            {/* Month Navigation */}
            <div className="flex items-center space-x-2 bg-white rounded-lg border px-3 py-2">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
              Export Report
            </button>
          </div>
        </div>

        {/* Hidden Analyzer Component */}
        <MonthlyInsightsAnalyzer
          symptoms={symptoms || []}
          moods={moods || []}
          notes={dayNotes}
          currentMonth={currentMonth}
          userProfile={userProfile}
          onInsightsGenerated={handleInsightsGenerated}
        />

        {/* AI-Powered Personalized Insights */}
        <PersonalizedInsightsDisplay
          insights={personalizedInsights}
          isLoading={isAnalyzing}
          onRegenerateInsights={handleRegenerateInsights}
          currentMonth={currentMonth}
        />

        {!cycleData ? (
          <div className="text-center py-12">
            <FiCpu className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-600">Start tracking your cycle to see insights</p>
            <p className="text-sm text-gray-500 mt-2">
              Log symptoms, moods, and notes to get AI-powered personalized recommendations
            </p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {insights.map((insight) => {
                const IconComponent = insight.icon;
                return (
                  <div key={insight.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <IconComponent className="text-2xl text-pink-600 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">{insight.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{insight.value}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${getTrendColor(insight.trend)}`}>
                        {getTrendIcon(insight.trend)} {insight.change}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{insight.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Cycle Progress Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Cycle Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Menstrual Phase</span>
                  <span className="text-sm text-gray-500">Days 1-5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{width: '18%'}}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Follicular Phase</span>
                  <span className="text-sm text-gray-500">Days 6-14</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '32%'}}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Ovulation Phase</span>
                  <span className="text-sm text-gray-500">Days 15-17</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '11%'}}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Luteal Phase</span>
                  <span className="text-sm text-gray-500">Days 18-28</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '39%'}}></div>
                </div>
              </div>
            </div>

            {/* Enhanced Predictions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                    <div className="flex items-center">
                      <FiCalendar className="text-pink-600 mr-2" />
                      <span className="text-sm font-medium">Next Period</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {cycleData.nextPeriodDate ? 
                        `In ${Math.ceil((new Date(cycleData.nextPeriodDate) - new Date()) / (1000 * 60 * 60 * 24))} days` : 
                        'Not predicted'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <FiTarget className="text-yellow-600 mr-2" />
                      <span className="text-sm font-medium">Fertile Window</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {cycleData.fertileWindowStart ? 'Active' : 'Not active'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <FiActivity className="text-blue-600 mr-2" />
                      <span className="text-sm font-medium">Symptoms Logged</span>
                    </div>
                    <span className="text-sm text-gray-600">{symptoms?.length || 0} this month</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <FiHeart className="text-green-600 mr-2" />
                      <span className="text-sm font-medium">Mood Entries</span>
                    </div>
                    <span className="text-sm text-gray-600">{moods?.length || 0} recorded</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}