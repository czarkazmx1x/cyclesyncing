"use client";

import { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import DayModal from '../../../components/DayModal';
import DataDebugPanel from '../../../components/DataDebugPanel';
import { useCycle } from '../../../contexts/CycleContext';
import { getPhaseForDay, isPeriodDay, isOvulationDay, isFertileDay } from '../../../lib/cycleCalculations';

// Force this page to be dynamic
export const dynamic = 'force-dynamic';
import { 
  FiChevronLeft, 
  FiChevronRight,
  FiDroplet,
  FiSun,
  FiStar,
  FiMoon,
  FiPlus
} from 'react-icons/fi';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export default function Calendar() {
  const { userProfile, cycleData, symptoms, moods, logSymptom, logMood } = useCycle();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dayNotes, setDayNotes] = useState([]); // Local state for notes

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate phase for any given day using the utility function
  const getPhaseForDayCalendar = (date) => {
    return getPhaseForDay(date, userProfile);
  };

  // Get events for a specific day
  const getDayEvents = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const daySymptoms = symptoms.filter(s => format(new Date(s.date), 'yyyy-MM-dd') === dateStr);
    const dayMoods = moods.filter(m => format(new Date(m.date), 'yyyy-MM-dd') === dateStr);
    const dayNotesForDate = dayNotes.filter(n => format(new Date(n.date), 'yyyy-MM-dd') === dateStr);
    
    return { symptoms: daySymptoms, moods: dayMoods, notes: dayNotesForDate };
  };

  // Handle clicking on a day
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  // Handle adding a note
  const handleAddNote = (noteData) => {
    setDayNotes(prev => [...prev, noteData]);
  };

  // Adapter functions to match context expectations
  const handleAddSymptom = (symptomData) => {
    // Convert DayModal format to context format
    const adaptedSymptom = {
      type: symptomData.symptom,
      severity: symptomData.intensity,
      notes: `Logged on ${format(symptomData.date, 'MMM dd, yyyy')}`,
      date: symptomData.date
    };
    logSymptom(adaptedSymptom);
  };

  const handleAddMood = (moodData) => {
    // Convert DayModal format to context format
    const adaptedMood = {
      mood: moodData.mood,
      energy: 5, // Default energy level
      notes: `Logged on ${format(moodData.date, 'MMM dd, yyyy')}`,
      date: moodData.date
    };
    logMood(adaptedMood);
  };

  // Handle deleting events
  const handleDeleteEvent = (eventType, index) => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    if (eventType === 'note') {
      setDayNotes(prev => 
        prev.filter((note, i) => 
          !(format(new Date(note.date), 'yyyy-MM-dd') === dateStr && i === index)
        )
      );
    }
    // For symptoms and moods, you'd need to implement delete functions in the context
    // This is a simplified version
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

          {/* Debug Panel - Remove this after testing */}
          <DataDebugPanel />

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

            {/* Quick Actions */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Click on any day to log symptoms, mood, or notes
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FiPlus className="w-4 h-4" />
                <span>Click to add</span>
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
                const phase = getPhaseForDayCalendar(day);
                const PhaseIcon = phaseIcons[phase];
                const events = getDayEvents(day);
                const isToday = isSameDay(day, new Date());
                const isPeriod = isPeriodDay(day, userProfile);
                const isOvulation = isOvulationDay(day, userProfile);
                const isFertile = isFertileDay(day, userProfile);

                // Enhanced styling based on special days
                let specialDayClass = '';
                if (isPeriod) {
                  specialDayClass = 'ring-2 ring-red-400';
                } else if (isOvulation) {
                  specialDayClass = 'ring-2 ring-yellow-400';
                } else if (isFertile) {
                  specialDayClass = 'ring-1 ring-yellow-200';
                }

                return (
                  <div
                    key={day.toString()}
                    onClick={() => handleDayClick(day)}
                    className={`h-24 p-2 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      isToday ? 'border-primary-500 border-2' : 'border-gray-200'
                    } ${phaseColors[phase]} ${specialDayClass} relative overflow-hidden`}
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
                      {events.notes.length > 0 && (
                        <div className="text-xs bg-white bg-opacity-70 rounded px-1 py-0.5">
                          📝 {events.notes.length} note{events.notes.length > 1 ? 's' : ''}
                        </div>
                      )}
                      {(events.symptoms.length > 0 || events.moods.length > 0 || events.notes.length > 0) && (
                        <div className="absolute bottom-1 right-1">
                          <FiPlus className="w-3 h-3 text-gray-500" />
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
                  In {cycleData.daysUntilNextPeriod || 0} days
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

        {/* Day Modal */}
        <DayModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
          phase={selectedDate ? getPhaseForDayCalendar(selectedDate) : 'follicular'}
          events={selectedDate ? getDayEvents(selectedDate) : {}}
          onAddSymptom={handleAddSymptom}
          onAddMood={handleAddMood}
          onAddNote={handleAddNote}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>
    </DashboardLayout>
  );
}