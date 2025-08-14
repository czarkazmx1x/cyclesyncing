import { NextResponse } from 'next/server';

// This is a placeholder API endpoint for AI recommendations
// In production, you would integrate with OpenAI, Claude, or another AI service
export async function POST(request) {
  try {
    const { userInput, currentPhase, userHistory } = await request.json();

    // Validate input
    if (!userInput || !currentPhase) {
      return NextResponse.json(
        { error: 'Missing required fields: userInput and currentPhase' },
        { status: 400 }
      );
    }

    // Here you would call your AI service
    // Example with OpenAI:
    /*
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a women's health and cycle expert. The user is in their ${currentPhase} phase. 
                   Provide personalized recommendations based on their input. 
                   Format your response as JSON with: title, description, tips (array), category, icon (emoji).`
        },
        {
          role: "user",
          content: userInput
        }
      ],
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);
    */

    // For now, return a mock response
    const mockResponse = generateMockRecommendation(userInput, currentPhase);

    return NextResponse.json({
      success: true,
      recommendation: {
        ...mockResponse,
        timestamp: new Date().toISOString(),
        confidence: calculateConfidence(userInput),
        aiGenerated: true,
        userInput: userInput,
        phase: currentPhase
      }
    });

  } catch (error) {
    console.error('AI Recommendation API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendation' },
      { status: 500 }
    );
  }
}

function generateMockRecommendation(input, phase) {
  const lowerInput = input.toLowerCase();
  
  // Analyze keywords in the input
  const painKeywords = ['pain', 'cramp', 'hurt', 'ache', 'sore', 'uncomfortable', 'bloated'];
  const energyKeywords = ['tired', 'exhausted', 'energy', 'fatigue', 'sleepy', 'drained'];
  const moodKeywords = ['sad', 'happy', 'anxious', 'stressed', 'moody', 'emotional', 'irritated'];
  const hungerKeywords = ['hungry', 'craving', 'appetite', 'food', 'eat', 'snack'];
  
  const hasPain = painKeywords.some(keyword => lowerInput.includes(keyword));
  const hasEnergyIssues = energyKeywords.some(keyword => lowerInput.includes(keyword));
  const hasMoodIssues = moodKeywords.some(keyword => lowerInput.includes(keyword));
  const hasHungerIssues = hungerKeywords.some(keyword => lowerInput.includes(keyword));
  
  // Generate contextual recommendations
  if (hasPain) {
    return {
      title: 'Targeted Pain Relief',
      description: `Based on your description of discomfort during your ${phase} phase, here are evidence-based suggestions to help you feel better`,
      tips: [
        'Apply heat therapy for 15-20 minutes to reduce muscle tension',
        'Try gentle stretches focusing on your lower back and hips',
        'Consider anti-inflammatory foods like turmeric and ginger',
        'Practice deep breathing to help your body relax and manage pain'
      ],
      icon: '🤗',
      category: 'self-care'
    };
  }
  
  if (hasEnergyIssues) {
    return {
      title: 'Natural Energy Boost',
      description: `Gentle, sustainable ways to support your energy levels during your ${phase} phase`,
      tips: [
        'Focus on iron-rich foods like spinach, beans, and lean meats',
        'Take short 5-10 minute walks to improve circulation',
        'Ensure consistent sleep schedule of 7-9 hours',
        'Try energizing but gentle yoga poses like cat-cow stretches'
      ],
      icon: '⚡',
      category: 'nutrition'
    };
  }
  
  if (hasMoodIssues) {
    return {
      title: 'Emotional Wellness Support',
      description: `Mood-supporting strategies tailored for your ${phase} phase and how you're feeling right now`,
      tips: [
        'Practice 5-10 minutes of mindfulness or meditation',
        'Include mood-supporting foods like dark chocolate and nuts',
        'Try journaling to process and understand your emotions',
        'Connect with supportive friends or family members'
      ],
      icon: '🌈',
      category: 'self-care'
    };
  }
  
  if (hasHungerIssues) {
    return {
      title: 'Smart Nourishment Strategy',
      description: `Balanced nutrition approach for managing hunger and cravings during your ${phase} phase`,
      tips: [
        'Combine cravings with nutritious additions (e.g., dark chocolate with nuts)',
        'Focus on protein and healthy fats to maintain satiety',
        'Stay hydrated as dehydration can mimic hunger',
        'Plan regular, balanced meals to prevent extreme hunger'
      ],
      icon: '🍎',
      category: 'nutrition'
    };
  }
  
  // Default phase-based recommendation
  const phaseDefaults = {
    menstrual: {
      title: 'Gentle Menstrual Support',
      description: 'Nurturing care recommendations for your menstrual phase',
      tips: [
        'Honor your need for rest and slower pace',
        'Use heat therapy for comfort',
        'Eat warming, iron-rich foods',
        'Practice extra self-compassion'
      ],
      icon: '🌙',
      category: 'self-care'
    },
    follicular: {
      title: 'Growth & Renewal Energy',
      description: 'Harness your natural renewal energy during the follicular phase',
      tips: [
        'Try new activities or learn something new',
        'Focus on strength-building exercises',
        'Eat fresh, seasonal foods',
        'Plan creative or challenging projects'
      ],
      icon: '🌱',
      category: 'productivity'
    },
    ovulatory: {
      title: 'Peak Performance Optimization',
      description: 'Make the most of your natural peak energy during ovulation',
      tips: [
        'Schedule important conversations or presentations',
        'Try your most challenging workouts',
        'Focus on social connections and networking',
        'Take on ambitious goals or projects'
      ],
      icon: '✨',
      category: 'productivity'
    },
    luteal: {
      title: 'Balanced Transition Support',
      description: 'Maintain comfort and balance during your luteal phase',
      tips: [
        'Focus on complex carbohydrates for steady energy',
        'Practice stress-reduction and mindfulness',
        'Prepare mentally and physically for menstruation',
        'Listen carefully to your body\'s changing needs'
      ],
      icon: '🍂',
      category: 'nutrition'
    }
  };
  
  return phaseDefaults[phase] || phaseDefaults.follicular;
}

function calculateConfidence(input) {
  // Simple confidence calculation based on input specificity
  const wordCount = input.split(' ').length;
  const hasSpecificSymptoms = /(pain|cramp|tired|mood|craving|bloated|energy)/i.test(input);
  
  let confidence = 0.5; // Base confidence
  
  if (wordCount > 10) confidence += 0.2; // More detailed input
  if (hasSpecificSymptoms) confidence += 0.2; // Specific symptoms mentioned
  if (wordCount > 20) confidence += 0.1; // Very detailed
  
  return Math.min(confidence, 0.95); // Cap at 95%
}