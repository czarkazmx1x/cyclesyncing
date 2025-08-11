"use client";

import { useState } from 'react';
import { 
  FiDroplet, 
  FiAlertCircle, 
  FiActivity, 
  FiHeart, 
  FiMoon, 
  FiThermometer,
  FiPlus
} from 'react-icons/fi';

export default function DailyTracker() {
  // State for managing which tracker is expanded
  const [expandedTracker, setExpandedTracker] = useState(null);

  const toggleTracker = (tracker) => {
    setExpandedTracker(expandedTracker === tracker ? null : tracker);
  };

  // Define tracking categories
  const trackingOptions = [
    {
      id: 'period',
      name: 'Period Flow',
      icon: FiDroplet,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      hoverColor: 'hover:bg-red-200',
      options: ['Light', 'Medium', 'Heavy', 'Spotting', 'None']
    },
    {
      id: 'symptoms',
      name: 'Symptoms',
      icon: FiAlertCircle,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      hoverColor: 'hover:bg-purple-200',
      options: ['Cramps', 'Headache', 'Bloating', 'Fatigue', 'Acne', 'Breast Tenderness', 'Backache', 'Nausea']
    },
    {
      id: 'energy',
      name: 'Energy Level',
      icon: FiActivity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      hoverColor: 'hover:bg-blue-200',
      options: ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
    },
    {
      id: 'mood',
      name: 'Mood',
      icon: FiHeart,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      hoverColor: 'hover:bg-yellow-200',
      options: ['Happy', 'Calm', 'Sensitive', 'Irritable', 'Anxious', 'Sad', 'Motivated']
    },
    {
      id: 'sleep',
      name: 'Sleep Quality',
      icon: FiMoon,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100',
      hoverColor: 'hover:bg-indigo-200',
      options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
    },
    {
      id: 'temperature',
      name: 'BBT',
      icon: FiThermometer,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
      hoverColor: 'hover:bg-orange-200',
      options: ['Log Temperature']
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 p-4">
        {trackingOptions.map((option) => (
          <div key={option.id} className="flex flex-col">
            <button
              onClick={() => toggleTracker(option.id)}
              className={`${option.bgColor} ${option.hoverColor} transition-colors duration-200 rounded-lg p-3 flex flex-col items-center justify-center h-20`}
            >
              <option.icon className={`${option.color} h-6 w-6 mb-1`} />
              <span className="text-sm font-medium text-gray-700">{option.name}</span>
            </button>
            
            {expandedTracker === option.id && (
              <div className="mt-2 bg-white rounded-lg shadow-lg p-3 absolute z-10 w-64 border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">{option.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {option.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        console.log(`Tracking ${option.name}: ${opt}`);
                        // In a real app, this would save to backend
                      }}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                  <button 
                    className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700"
                    onClick={() => setExpandedTracker(null)}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="px-4 pb-4">
        <button className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
          <FiPlus className="mr-2" />
          Add Custom Tracker
        </button>
      </div>
    </div>
  );
}
