import { useState } from 'react';
import { FiStar, FiCpu, FiClock, FiUser } from 'react-icons/fi';

export default function AIRecommendationCard({ recommendation, onDismiss, onSave }) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    onSave && onSave(recommendation);
  };

  const handleDismiss = () => {
    onDismiss && onDismiss(recommendation);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-sm p-6 border-l-4 border-purple-400">
      {/* Header with AI indicator */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{recommendation.icon}</span>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">{recommendation.title}</h3>
              <div className="flex items-center space-x-1">
                <FiStar className="w-4 h-4 text-purple-500" />
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                  AI Generated
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {recommendation.category.charAt(0).toUpperCase() + recommendation.category.slice(1)}
              </span>
              <div className="flex items-center space-x-1">
                <FiClock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {formatTimestamp(recommendation.timestamp)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Confidence indicator */}
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(recommendation.confidence)}`}>
          {Math.round(recommendation.confidence * 100)}% match
        </div>
      </div>
      
      {/* User input context */}
      {recommendation.userInput && (
        <div className="mb-4 p-3 bg-white/60 rounded-lg border border-purple-100">
          <div className="flex items-center space-x-2 mb-2">
            <FiUser className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Your input:</span>
          </div>
          <p className="text-sm text-gray-600 italic">"{recommendation.userInput}"</p>
        </div>
      )}
      
      <p className="text-gray-700 mb-4">{recommendation.description}</p>
      
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-medium text-gray-700 flex items-center space-x-1">
          <FiCpu className="w-4 h-4" />
          <span>AI-Tailored Tips:</span>
        </h4>
        <ul className="space-y-1">
          {recommendation.tips.map((tip, tipIndex) => (
            <li key={tipIndex} className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span className="text-sm text-gray-700">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Action buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            isSaved
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isSaved ? '✓ Saved' : 'Save Recommendation'}
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Dismiss
        </button>
      </div>
      
      {/* Phase indicator */}
      <div className="mt-3 pt-3 border-t border-purple-100">
        <span className="text-xs text-gray-500">
          Generated for your <strong>{recommendation.phase}</strong> phase • 
          Based on your personal input and cycle data
        </span>
      </div>
    </div>
  );
}