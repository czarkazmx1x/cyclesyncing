"use client";

import { useState, useEffect } from 'react';
import { aiService } from '../lib/aiService';
import { useCycle } from '../contexts/CycleContext';
import { FiRefreshCw, FiStar } from 'react-icons/fi';

export default function AIInsights() {
  const { cycleData, symptoms, moods } = useCycle();
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const aiInsights = await aiService.getHealthInsights(
        cycleData,
        symptoms.slice(0, 10),
        moods.slice(0, 10)
      );
      
      if (aiInsights) {
        setInsights(aiInsights);
      } else {
        setError('Unable to generate insights at this time.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch insights on component mount
  useEffect(() => {
    if (cycleData.currentPhase) {
      fetchInsights();
    }
  }, [cycleData.currentPhase]);

  if (!cycleData.currentPhase) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-200 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FiStar className="mr-2 text-purple-500" />
          AI Health Insights
        </h3>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="text-purple-600 hover:text-purple-700 transition-colors"
        >
          <FiRefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2 text-purple-600">
            <div className="animate-pulse">✨</div>
            <span>Generating personalized insights...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">
          {error}
        </div>
      )}

      {insights && !loading && (
        <div className="space-y-4">
          <div className="prose prose-sm max-w-none text-gray-700">
            {insights.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-3 leading-relaxed">
                  {paragraph}
                </p>
              )
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-purple-200">
        <p className="text-xs text-gray-500 italic">
          Powered by AI • For informational purposes only
        </p>
      </div>
    </div>
  );
}