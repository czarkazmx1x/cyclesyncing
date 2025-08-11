"use client";

import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useCycle } from '../contexts/CycleContext';

export default function MoodModal({ isOpen, onClose }) {
  const { logMood } = useCycle();
  const [selectedMood, setSelectedMood] = useState('');
  const [energyLevel, setEnergyLevel] = useState(3);
  const [notes, setNotes] = useState('');

  const moodOptions = [
    { id: 'happy', name: 'Happy', emoji: '😊' },
    { id: 'calm', name: 'Calm', emoji: '😌' },
    { id: 'energetic', name: 'Energetic', emoji: '⚡' },
    { id: 'anxious', name: 'Anxious', emoji: '😰' },
    { id: 'sad', name: 'Sad', emoji: '😢' },
    { id: 'irritated', name: 'Irritated', emoji: '😤' },
    { id: 'tired', name: 'Tired', emoji: '😴' },
    { id: 'productive', name: 'Productive', emoji: '💪' }
  ];

  const handleSubmit = () => {
    if (selectedMood) {
      logMood({
        mood: selectedMood,
        energy: energyLevel,
        notes: notes
      });
      
      // Reset form
      setSelectedMood('');
      setEnergyLevel(3);
      setNotes('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">How are you feeling?</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">Select your mood</p>
            <div className="grid grid-cols-4 gap-3">
              {moodOptions.map(mood => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedMood === mood.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-1">{mood.emoji}</div>
                  <div className="text-xs font-medium">{mood.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Energy Level: {energyLevel}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #7300e6 0%, #7300e6 ${(energyLevel - 1) * 25}%, #e5e7eb ${(energyLevel - 1) * 25}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="3"
              placeholder="Any thoughts or feelings to note..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              disabled={!selectedMood}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Save Mood
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