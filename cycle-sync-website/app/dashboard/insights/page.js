"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { useCycle } from '../../../contexts/CycleContext';
import { 
  FiTrendingUp,
  FiCalendar,
  FiActivity,
  FiHeart,
  FiBarChart,
  FiTarget,
  FiClock,
  FiZap
} from 'react-icons/fi';

// Force this page to be dynamic
export const dynamic = 'force-dynamic';

export default function InsightsPage() {
  const { cycleData } = useCycle();
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (cycleData) {
      generateInsights();
    }
  }, [cycleData]);

  const generateInsights = () => {
    if (!cycleData) return;
    
    const currentCycle = cycleData.cycles?.[0];
    if (!currentCycle) return;

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
        title: "Symptom Frequency",
        value: "8/month",
        change: "-15%",
        trend: "down",
        icon: FiActivity,
        description: "Fewer symptoms recorded this month"
      },
      {
        id: 3,
        title: "Energy Levels",
        value: "High",
        change: "+25%",
        trend: "up",
        icon: FiZap,
        description: "Energy levels have improved significantly"
      },
      {
        id: 4,
        title: "Mood Stability",
        value: "Good",
        change: "+10%",
        trend: "up",
        icon: FiHeart,
        description: "More stable mood patterns observed"
      }
    ];

    setInsights(calculatedInsights);
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '↗' : '↘';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Insights & Analytics</h1>
          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
            Export Report
          </button>
        </div>

        {!cycleData ? (
          <div className="text-center py-12">
            <FiBarChart className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-600">Start tracking your cycle to see insights</p>
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

            {/* Predictions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                    <div className="flex items-center">
                      <FiCalendar className="text-pink-600 mr-2" />
                      <span className="text-sm font-medium">Next Period</span>
                    </div>
                    <span className="text-sm text-gray-600">In 12 days</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <FiTarget className="text-yellow-600 mr-2" />
                      <span className="text-sm font-medium">Ovulation</span>
                    </div>
                    <span className="text-sm text-gray-600">In 5 days</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Tips</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Hydration Reminder</p>
                    <p className="text-xs text-blue-700">Increase water intake during your luteal phase</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Exercise Suggestion</p>
                    <p className="text-xs text-green-700">Light yoga is perfect for this phase</p>
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