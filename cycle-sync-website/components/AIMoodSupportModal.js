"use client";

import { useState } from 'react';
import { FiX, FiHeart } from 'react-icons/fi';
import { aiService } from '../lib/aiService';

export default function AIMoodSupportModal({ isOpen, onClose, currentMood, currentEnergy }) {
  const [support, setSupport] = useState('');
  const [loading, setLoading] = useState(false);

  const getMoodSupport = async () => {
    setLoading(true);
    try {
      const supportMessage = await aiService.getMoodSupport(currentMood, currentEnergy);
      setSupport(supportMessage || 'Remember, you are strong and capable. This feeling will pass. 💕');
    } catch (error) {
      setSupport('You are doing amazing. Be gentle with yourself today. 💕');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Get support when modal opens
  if (isOpen && !support && !loading) {
    getMoodSupport();
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-pink-100 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 px-6 py-5 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiHeart className="mr-2 text-pink-500" />
            A Message For You
          </h2>
          <button
            onClick={() => {
              setSupport('');
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse text-3xl mb-4">💭</div>
              <p className="text-gray-600">Creating a personalized message for you...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {support}
                </p>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => {
                    setSupport('');
                    onClose();
                  }}
                  className="btn btn-primary"
                >
                  Thank You 💕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}