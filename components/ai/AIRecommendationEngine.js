import { useState } from 'react';
import { FiMessageCircle, FiSend, FiStar, FiUser, FiCalendar, FiActivity } from 'react-icons/fi';

export default function AIRecommendationEngine({ currentPhase, onNewRecommendation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentInputs, setRecentInputs] = useState([]);

  const generateAIRecommendation = async (input, phase) => {
    setIsGenerating(true);
    
    try {
      // Option 1: Use your existing Mistral API endpoint 
      const useMistral = true; // Set to true to use your Mistral API
      
      let recommendation;
      
      if (useMistral) {
        // Use your existing Mistral API
        const prompt = `You are a women's health and menstrual cycle expert. A woman in her ${phase} phase says: "${input}"

Generate a personalized recommendation in this exact JSON format:
{
  "title": "Clear, helpful title",
  "description": "Brief explanation of why this helps during ${phase} phase",
  "tips": ["specific actionable tip 1", "specific actionable tip 2", "specific actionable tip 3"],
  "category": "nutrition|exercise|self-care|productivity",
  "icon": "relevant emoji"
}

Focus on evidence-based, practical advice that addresses their specific concerns during the ${phase} phase.`;

        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: prompt,
            model: 'mistral-small',
            temperature: 0.7,
            max_tokens: 400
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to get Mistral AI recommendation');
        }
        
        const data = await response.json();
        const aiResponse = JSON.parse(data.content);
        
        recommendation = {
          ...aiResponse,
          timestamp: new Date(),
          confidence: calculateConfidence(input),
          aiGenerated: true,
          userInput: input,
          phase: phase
        };
      } else {
        // Fallback to local mock
        recommendation = await mockAIRecommendation(input, phase);
      }
      
      // Add to recent inputs for learning
      setRecentInputs(prev => [
        { 
          input, 
          phase, 
          timestamp: new Date(),
          recommendation 
        },
        ...prev.slice(0, 9) // Keep last 10
      ]);
      
      // Send to parent component
      onNewRecommendation(recommendation);
      
      setUserInput('');
    } catch (error) {
      console.error('Error generating AI recommendation:', error);
      // Fallback to mock on error
      try {
        const recommendation = await mockAIRecommendation(input, phase);
        onNewRecommendation(recommendation);
        setUserInput('');
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Calculate confidence based on input quality
  const calculateConfidence = (input) => {
    const wordCount = input.split(' ').length;
    const hasSpecificSymptoms = /(pain|cramp|tired|mood|craving|bloated|energy)/i.test(input);
    
    let confidence = 0.7; // Base confidence for Mistral AI
    
    if (wordCount > 10) confidence += 0.15; // More detailed input
    if (hasSpecificSymptoms) confidence += 0.1; // Specific symptoms mentioned
    if (wordCount > 20) confidence += 0.05; // Very detailed
    
    return Math.min(confidence, 0.95); // Cap at 95%
  };

  // Mock AI function - fallback when Mistral fails
  const mockAIRecommendation = async (input, phase) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Analyze input for keywords and sentiment
    const analysis = analyzeUserInput(input, phase);
    
    return {
      title: analysis.title,
      description: analysis.description,
      tips: analysis.tips,
      icon: analysis.icon,
      category: analysis.category,
      confidence: analysis.confidence,
      aiGenerated: true,
      userInput: input,
      phase: phase,
      timestamp: new Date()
    };
  };

  const analyzeUserInput = (input, phase) => {
    const lowerInput = input.toLowerCase();
    
    // Pain/discomfort keywords
    const painKeywords = ['pain', 'cramp', 'hurt', 'ache', 'sore', 'uncomfortable', 'bloated'];
    const energyKeywords = ['tired', 'exhausted', 'energy', 'fatigue', 'sleepy', 'drained'];
    const moodKeywords = ['sad', 'happy', 'anxious', 'stressed', 'moody', 'emotional', 'irritated'];
    const hungerKeywords = ['hungry', 'craving', 'appetite', 'food', 'eat', 'snack'];
    
    const hasPain = painKeywords.some(keyword => lowerInput.includes(keyword));
    const hasEnergyIssues = energyKeywords.some(keyword => lowerInput.includes(keyword));
    const hasMoodIssues = moodKeywords.some(keyword => lowerInput.includes(keyword));
    const hasHungerIssues = hungerKeywords.some(keyword => lowerInput.includes(keyword));
    
    // Generate recommendations based on analysis
    if (hasPain) {
      return {
        title: 'Pain Relief & Comfort',
        description: `Based on your experience with discomfort during your ${phase} phase, here are personalized suggestions`,
        tips: [
          'Try gentle heat therapy with a heating pad for 15-20 minutes',
          'Consider magnesium-rich foods like dark leafy greens and nuts',
          'Practice deep breathing exercises to help manage pain',
          'Stay hydrated with warm herbal teas like chamomile or ginger'
        ],
        icon: '🤗',
        category: 'self-care',
        confidence: 0.85
      };
    }
    
    if (hasEnergyIssues) {
      return {
        title: 'Energy Support',
        description: `Tailored energy-boosting strategies for your ${phase} phase based on how you're feeling`,
        tips: [
          'Focus on iron-rich foods if you mentioned feeling drained',
          'Try gentle movement like a 10-minute walk to boost circulation',
          'Ensure you\'re getting 7-9 hours of quality sleep',
          'Consider B-vitamin rich foods like eggs and leafy greens'
        ],
        icon: '⚡',
        category: 'nutrition',
        confidence: 0.82
      };
    }
    
    if (hasMoodIssues) {
      return {
        title: 'Mood Balance',
        description: `Emotional wellness support customized for your ${phase} phase and current feelings`,
        tips: [
          'Practice 5-minute mindfulness meditation',
          'Include omega-3 rich foods like salmon or walnuts',
          'Try journaling to process emotions',
          'Gentle yoga or stretching can help regulate mood'
        ],
        icon: '🌈',
        category: 'self-care',
        confidence: 0.78
      };
    }
    
    if (hasHungerIssues) {
      return {
        title: 'Nourishment Guide',
        description: `Smart nutrition choices based on your ${phase} phase hunger and cravings`,
        tips: [
          'Honor cravings but add nutritious components',
          'Try protein-rich snacks to maintain stable blood sugar',
          'Include healthy fats like avocado or nuts',
          'Stay hydrated as thirst can sometimes feel like hunger'
        ],
        icon: '🍎',
        category: 'nutrition',
        confidence: 0.80
      };
    }
    
    // Default recommendation based on phase
    const phaseDefaults = {
      menstrual: {
        title: 'Menstrual Phase Support',
        description: 'Gentle care recommendations for your menstrual phase',
        tips: [
          'Rest when your body needs it',
          'Stay warm and comfortable',
          'Eat iron-rich foods to replenish',
          'Practice self-compassion'
        ],
        icon: '🌙',
        category: 'self-care'
      },
      follicular: {
        title: 'Growth Phase Energy',
        description: 'Harness your rising energy during the follicular phase',
        tips: [
          'Try new activities or hobbies',
          'Focus on strength-building exercises',
          'Eat fresh, light foods',
          'Plan creative projects'
        ],
        icon: '🌱',
        category: 'productivity'
      },
      ovulatory: {
        title: 'Peak Energy Optimization',
        description: 'Make the most of your peak energy during ovulation',
        tips: [
          'Schedule important meetings or presentations',
          'Try high-intensity workouts',
          'Connect with friends and family',
          'Take on challenging projects'
        ],
        icon: '✨',
        category: 'productivity'
      },
      luteal: {
        title: 'Luteal Phase Balance',
        description: 'Maintain balance and comfort during your luteal phase',
        tips: [
          'Focus on steady, complex carbohydrates',
          'Practice stress-reduction techniques',
          'Prepare for the upcoming menstrual phase',
          'Listen to your body\'s needs'
        ],
        icon: '🍂',
        category: 'nutrition'
      }
    };
    
    return {
      ...phaseDefaults[phase] || phaseDefaults.follicular,
      confidence: 0.65
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      generateAIRecommendation(userInput.trim(), currentPhase);
    }
  };

  return (
    <div className="mb-6">
      {/* AI Input Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
        <div className="flex items-center space-x-2 mb-4">
          <FiStar className="text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            AI-Powered Personal Recommendations
          </h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          Tell me how you're feeling today, what symptoms you're experiencing, or what you need help with. 
          I'll create personalized recommendations just for you.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <FiCalendar className="w-4 h-4" />
            <span>Current phase: {currentPhase}</span>
            <FiUser className="w-4 h-4 ml-4" />
            <span>Personalized for you</span>
          </div>
          
          <div className="relative">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Example: 'I'm feeling really tired today and having bad cramps. I usually love my morning coffee but it's making me feel jittery...'"
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows="4"
              disabled={isGenerating}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {recentInputs.length > 0 && `${recentInputs.length} previous inputs helping personalize your experience`}
            </span>
            <button
              type="submit"
              disabled={!userInput.trim() || isGenerating}
              className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  <span>Get AI Recommendations</span>
                </>
              )}
            </button>
          </div>
        </form>
        
        {/* Quick Prompts */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Quick prompts:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "I'm having bad cramps today",
              "Feeling really tired and low energy",
              "Craving chocolate and sweets",
              "Can't sleep well lately",
              "Feeling emotional and moody"
            ].map((prompt, index) => (
              <button
                key={index}
                onClick={() => setUserInput(prompt)}
                className="text-xs bg-white text-purple-600 px-3 py-1 rounded-full border border-purple-200 hover:bg-purple-50 transition-colors"
                disabled={isGenerating}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}