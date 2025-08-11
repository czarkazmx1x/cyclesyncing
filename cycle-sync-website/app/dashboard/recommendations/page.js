"use client";

import { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { useCycle } from '../../../contexts/CycleContext';
import { 
  FiActivity, 
  FiHeart,
  FiSun,
  FiMoon,
  FiBook,
  FiShoppingBag
} from 'react-icons/fi';

export default function Recommendations() {
  const { cycleData } = useCycle();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: null },
    { id: 'nutrition', name: 'Nutrition', icon: '🥗' },
    { id: 'exercise', name: 'Exercise', icon: '🏃‍♀️' },
    { id: 'self-care', name: 'Self-Care', icon: '🛁' },
    { id: 'productivity', name: 'Productivity', icon: '📚' },
    { id: 'social', name: 'Social', icon: '👥' }
  ];

  const phaseRecommendations = {
    menstrual: {
      nutrition: [
        {
          title: 'Iron-Rich Foods',
          description: 'Replenish iron lost during menstruation with spinach, red meat, and lentils',
          tips: ['Add spinach to smoothies', 'Have lean beef 2-3 times this week', 'Snack on pumpkin seeds'],
          icon: '🥬'
        },
        {
          title: 'Anti-Inflammatory Foods',
          description: 'Reduce cramping and inflammation with omega-3 rich foods',
          tips: ['Eat fatty fish like salmon', 'Add turmeric to meals', 'Enjoy dark chocolate (70%+ cacao)'],
          icon: '🐟'
        }
      ],
      exercise: [
        {
          title: 'Gentle Yoga',
          description: 'Light stretching and restorative poses to ease discomfort',
          tips: ['Child\'s pose for cramps', 'Cat-cow for back pain', '20-30 minute sessions'],
          icon: '🧘‍♀️'
        }
      ],
      'self-care': [
        {
          title: 'Warm Bath Therapy',
          description: 'Soothe cramps and relax muscles with heat therapy',
          tips: ['Add Epsom salts', 'Use lavender oil', '20-minute soaks'],
          icon: '🛁'
        }
      ]
    },
    follicular: {
      nutrition: [
        {
          title: 'Fresh & Light Foods',
          description: 'Support rising energy with nutrient-dense, fresh foods',
          tips: ['Colorful salads', 'Fresh fruit smoothies', 'Fermented foods for gut health'],
          icon: '🥗'
        }
      ],
      exercise: [
        {
          title: 'Strength Training',
          description: 'Take advantage of increased muscle-building potential',
          tips: ['3-4 weight sessions/week', 'Focus on progressive overload', 'Try new exercises'],
          icon: '🏋️‍♀️'
        }
      ],
      'self-care': [
        {
          title: 'Skincare Routine',
          description: 'Your skin is clearer - perfect time for treatments',
          tips: ['Try new serums', 'Book a facial', 'Exfoliate gently'],
          icon: '✨'
        }
      ]
    },
    ovulatory: {
      nutrition: [
        {
          title: 'Anti-Oxidant Rich Foods',
          description: 'Support your body during peak fertility',
          tips: ['Berries and citrus fruits', 'Colorful vegetables', 'Green tea'],
          icon: '🫐'
        }
      ],
      exercise: [
        {
          title: 'High-Intensity Training',
          description: 'Your energy is at its peak - go all out!',
          tips: ['HIIT workouts', 'Sprint intervals', 'Bootcamp classes'],
          icon: '🔥'
        }
      ],
      'self-care': [
        {
          title: 'Minimal Routine',
          description: 'You\'re naturally glowing - keep it simple',
          tips: ['Light moisturizer', 'SPF protection', 'Enjoy your natural radiance'],
          icon: '☀️'
        }
      ]
    },
    luteal: {
      nutrition: [
        {
          title: 'Complex Carbohydrates',
          description: 'Stabilize mood and energy with steady fuel',
          tips: ['Sweet potatoes', 'Quinoa and brown rice', 'Oatmeal for breakfast'],
          icon: '🍠'
        }
      ],
      exercise: [
        {
          title: 'Gentle Movement',
          description: 'Support your body as energy naturally declines',
          tips: ['Yoga or Pilates', 'Swimming', 'Nature walks'],
          icon: '🧘‍♀️'
        }
      ],
      'self-care': [
        {
          title: 'Cozy Comfort',
          description: 'Embrace the need for comfort and warmth',
          tips: ['Warm baths', 'Comfortable clothes', 'Heating pads'],
          icon: '🕯️'
        }
      ]
    }
  };
  // Add productivity and social recommendations for other phases
  const addMissingCategories = (recs) => {
    if (!recs.productivity) {
      recs.productivity = [{
        title: 'Focus on Your Strengths',
        description: 'Align your tasks with your energy levels',
        tips: ['Plan according to your phase', 'Be flexible with deadlines', 'Honor your needs'],
        icon: '📊'
      }];
    }
    if (!recs.social) {
      recs.social = [{
        title: 'Social Balance',
        description: 'Choose social activities that match your energy',
        tips: ['Listen to your body', 'Set boundaries', 'Quality over quantity'],
        icon: '👥'
      }];
    }
    return recs;
  };

  const currentRecommendations = addMissingCategories(
    phaseRecommendations[cycleData.currentPhase] || phaseRecommendations.follicular
  );
  
  const getFilteredRecommendations = () => {
    if (activeCategory === 'all') {
      return Object.entries(currentRecommendations).flatMap(([category, items]) => 
        items.map(item => ({ ...item, category }))
      );
    }
    return currentRecommendations[activeCategory]?.map(item => ({ ...item, category: activeCategory })) || [];
  };

  const filteredRecommendations = getFilteredRecommendations();

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Personalized Recommendations
            </h1>
            <p className="text-gray-600">Based on your {cycleData.currentPhase} phase</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.icon && <span className="mr-1">{category.icon}</span>}
                {category.name}
              </button>
            ))}
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRecommendations.map((rec, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{rec.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {rec.category.charAt(0).toUpperCase() + rec.category.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{rec.description}</p>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Tips:</h4>
                  <ul className="space-y-1">
                    {rec.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start">
                        <span className="text-primary-500 mr-2">•</span>
                        <span className="text-sm text-gray-600">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button className="mt-4 w-full bg-primary-50 text-primary-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-100 transition-colors">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}