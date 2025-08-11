"use client";

import { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { useCycle } from '../../../contexts/CycleContext';

// Force this page to be dynamic
export const dynamic = 'force-dynamic';
import { 
  FiChevronLeft, 
  FiChevronRight,
  FiDroplet,
  FiSun,
  FiStar,
  FiMoon
} from 'react-icons/fi';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export default function Calendar() {
  const { userProfile, cycleData, symptoms, moods } = useCycle();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate phase for any given day
  const getPhaseForDay = (date) => {
    if (!userProfile?.lastPeriodStart) return 'follicular'; // Default phase
    
    const lastPeriod = new Date(userProfile.lastPeriodStart);
    const daysSinceLastPeriod = Math.floor((date - lastPeriod) / (1000 * 60 * 60 * 24));
    const cycleDay = (daysSinceLastPeriod % (userProfile.cycleLength || 28)) + 1;

    if (cycleDay <= (userProfile.periodLength || 5)) return 'menstrual';
    if (cycleDay <= (userProfile.cycleLength || 28) * 0.5) return 'follicular';
    if (cycleDay <= (userProfile.cycleLength || 28) * 0.6) return 'ovulatory';
    return 'luteal';
  };

  // Get events for a specific day
  const getDayEvents = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const daySymptoms = symptoms.filter(s => format(new Date(s.date), 'yyyy-MM-dd') === dateStr);
    const dayMoods = moods.filter(m => format(new Date(m.date), 'yyyy-MM-dd') === dateStr);
    
    return { symptoms: daySymptoms, moods: dayMoods };
  };

  const phaseColors = {
    menstrual: 'bg-red-100 text-red-800',
    follicular: 'bg-blue-100 text-blue-800',
    ovulatory: 'bg-yellow-100 text-yellow-800',
    luteal: 'bg-purple-100 text-purple-800'
  };

  const phaseIcons = {
    menstrual: FiDroplet,
    follicular: FiSun,
    ovulatory: FiStar,
    luteal: FiMoon
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Cycle Calendar</h1>

          {/* Calendar Navigation */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <div className="flex items-center space-x-2">
                <FiDroplet className="h-4 w-4 text-red-500" />
                <span>Menstrual</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiSun className="h-4 w-4 text-blue-500" />
                <span>Follicular</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiStar className="h-4 w-4 text-yellow-500" />
                <span>Ovulatory</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMoon className="h-4 w-4 text-purple-500" />
                <span>Luteal</span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for alignment */}
              {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                <div key={`empty-${index}`} className="h-24" />
              ))}

              {/* Calendar days */}
              {monthDays.map(day => {
                const phase = getPhaseForDay(day);
                const PhaseIcon = phaseIcons[phase];
                const events = getDayEvents(day);
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={day.toString()}
                    className={`h-24 p-2 border rounded-lg ${
                      isToday ? 'border-primary-500 border-2' : 'border-gray-200'
                    } ${phaseColors[phase]} relative overflow-hidden`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-medium ${isToday ? 'text-primary-700' : ''}`}>
                        {format(day, 'd')}
                      </span>
                      <PhaseIcon className="h-3 w-3" />
                    </div>
                    
                    {/* Day events */}
                    <div className="mt-1 space-y-1">
                      {events.symptoms.length > 0 && (
                        <div className="text-xs bg-white bg-opacity-70 rounded px-1 py-0.5">
                          {events.symptoms.length} symptom{events.symptoms.length > 1 ? 's' : ''}
                        </div>
                      )}
                      {events.moods.length > 0 && (
                        <div className="text-xs bg-white bg-opacity-70 rounded px-1 py-0.5">
                          Mood: {events.moods[0].mood}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FiDroplet className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900">Next Period</p>
                    <p className="text-sm text-gray-600">
                      {cycleData.nextPeriodDate && format(new Date(cycleData.nextPeriodDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  In {Math.ceil((new Date(cycleData.nextPeriodDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FiStar className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-gray-900">Fertile Window</p>
                    <p className="text-sm text-gray-600">
                      {cycleData.fertileWindowStart && 
                        `${format(new Date(cycleData.fertileWindowStart), 'MMM d')} - ${format(new Date(cycleData.fertileWindowEnd), 'MMM d')}`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}