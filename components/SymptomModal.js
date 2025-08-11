"use client";

import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useCycle } from '../contexts/CycleContext';

export default function SymptomModal({ isOpen, onClose }) {
  const { logSymptom } = useCycle();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [notes, setNotes] = useState('');

  const symptomOptions = [
    { id: 'cramps', name: 'Cramps', icon: '😣' },
    { id: 'headache', name: 'Headache', icon: '🤕' },
    { id: 'bloating', name: 'Bloating', icon: '🎈' },
    { id: 'fatigue', name: 'Fatigue', icon: '😴' },
    { id: 'mood_swings', name: 'Mood Swings', icon: '🎭' },
    { id: 'breast_tenderness', name: 'Breast Tenderness', icon: '💗' },
    { id: 'acne', name: 'Acne', icon: '🌟' },
    { id: 'cravings', name: 'Cravings', icon: '🍫' },
    { id: 'insomnia', name: 'Insomnia', icon: '🌙' },
    { id: 'nausea', name: 'Nausea', icon: '🤢' },
    { id: 'back_pain', name: 'Back Pain', icon: '💢' },
    { id: 'anxiety', name: 'Anxiety', icon: '😰' }
  ];

  const severityLevels = [
    { value: 1, label: 'Mild', color: 'bg-green-100 text-green-800' },
    { value: 2, label: 'Moderate', color: 'bg-yellow-100 text-yellow-800' },
    { value: 3, label: 'Severe', color: 'bg-red-100 text-red-800' }
  ];

  const handleSymptomToggle = (symptomId) => {
    setSelectedSymptoms(prev => {
      const existing = prev.find(s => s.id === symptomId);
      if (existing) {
        return prev.filter(s => s.id !== symptomId);
      } else {
        return [...prev, { id: symptomId, severity: 1 }];
      }
    });
  };

  const handleSeverityChange = (symptomId, severity) => {
    setSelectedSymptoms(prev =>
      prev.map(s => s.id === symptomId ? { ...s, severity } : s)
    );
  };

  const handleSubmit = () => {
    selectedSymptoms.forEach(symptom => {
      const symptomData = symptomOptions.find(opt => opt.id === symptom.id);
      logSymptom({
        type: symptomData.name,
        severity: symptom.severity,
        notes: notes
      });
    });
    
    // Reset form
    setSelectedSymptoms([]);
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-pink-100">
        <div className="sticky top-0 bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-200 px-6 py-5 flex justify-between items-center rounded-t-3xl">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <span className="mr-2">🌺</span>
            How are you feeling today?
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-primary-500 transition-colors duration-300"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Select all symptoms you're experiencing today
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {symptomOptions.map(symptom => {
              const isSelected = selectedSymptoms.some(s => s.id === symptom.id);
              const selectedSymptom = selectedSymptoms.find(s => s.id === symptom.id);
              
              return (
                <div key={symptom.id} className="space-y-2">
                  <button
                    onClick={() => handleSymptomToggle(symptom.id)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      isSelected
                        ? 'border-primary-400 bg-gradient-to-br from-primary-50 to-pink-50 shadow-md'
                        : 'border-gray-200 hover:border-pink-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-2xl">{symptom.icon}</span>
                      <span className="text-sm font-medium">{symptom.name}</span>
                    </div>
                  </button>
                  
                  {isSelected && (
                    <div className="flex justify-center space-x-1">
                      {severityLevels.map(level => (
                        <button
                          key={level.value}
                          onClick={() => handleSeverityChange(symptom.id, level.value)}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            selectedSymptom.severity === level.value
                              ? level.color
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="3"
              placeholder="Any additional details..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              disabled={selectedSymptoms.length === 0}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Log Symptoms
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}