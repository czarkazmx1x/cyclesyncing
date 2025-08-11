"use client";

import { FiInfo } from 'react-icons/fi';

export default function CyclePhaseCard({ phase, cycleDay, daysUntilPeriod, cycleProgress }) {
  // Phase-specific information
  const phaseInfo = {
    menstrual: {
      title: "Menstrual Phase",
      description: "Your body is shedding the uterine lining. Focus on rest and gentle movement during this time.",
      color: "bg-red-100 border-red-500",
      textColor: "text-red-800",
      progressColor: "bg-red-500",
      icon: "🌹"
    },
    follicular: {
      title: "Follicular Phase",
      description: "Rising estrogen gives you increased energy and creativity. Great time for new projects and challenges.",
      color: "bg-blue-100 border-blue-500",
      textColor: "text-blue-800",
      progressColor: "bg-blue-500",
      icon: "🌱"
    },
    ovulatory: {
      title: "Ovulatory Phase",
      description: "Peak energy and confidence! Great for challenging workouts, important presentations, and social events.",
      color: "bg-yellow-100 border-yellow-500",
      textColor: "text-yellow-800",
      progressColor: "bg-yellow-500",
      icon: "⭐"
    },
    luteal: {
      title: "Luteal Phase",
      description: "Progesterone rises, potentially affecting your mood and energy. Focus on self-care and preparation.",
      color: "bg-purple-100 border-purple-500",
      textColor: "text-purple-800",
      progressColor: "bg-purple-500",
      icon: "🌙"
    },
    unknown: {
      title: "Cycle Phase",
      description: "Track your cycle to get more accurate predictions and insights.",
      color: "bg-gray-100 border-gray-500",
      textColor: "text-gray-800",
      progressColor: "bg-gray-500",
      icon: "📆"
    }
  };

  const currentPhase = phaseInfo[phase] || phaseInfo.unknown;

  return (
    <div className={`rounded-lg p-5 ${currentPhase.color} border-l-4 shadow-sm`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center">
            <h2 className={`text-xl font-bold ${currentPhase.textColor}`}>
              {currentPhase.title}
            </h2>
            <button 
              className="ml-2 text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label="Learn more about this phase"
            >
              <FiInfo />
            </button>
          </div>
          <p className="mt-1 text-gray-600">{currentPhase.description}</p>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Day {cycleDay} of cycle</span>
              <span>
                {daysUntilPeriod > 0 
                  ? `${daysUntilPeriod} days until next period` 
                  : 'Period active'}
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${currentPhase.progressColor} rounded-full`} 
                style={{ width: `${cycleProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="text-4xl ml-4">
          {currentPhase.icon}
        </div>
      </div>
    </div>
  );
}
