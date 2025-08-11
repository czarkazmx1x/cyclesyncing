// Client-side AI service that calls our API route
export const aiService = {
  // Make API call to our backend
  async callAI(prompt, options = {}) {
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          ...options
        }),
      });

      if (!response.ok) {
        throw new Error('AI request failed');
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Error calling AI:', error);
      return null;
    }
  },

  // Generate personalized health insights based on cycle data
  async getHealthInsights(cycleData, symptoms, moods) {
    try {
      const prompt = `You are a compassionate women's health advisor. Based on the following cycle data, provide personalized insights and recommendations.

Cycle Information:
- Current Phase: ${cycleData.currentPhase}
- Cycle Day: ${cycleData.currentDay}
- Days until next period: ${cycleData.daysUntilPeriod || 'calculating...'}

Recent Symptoms: ${symptoms.slice(0, 5).map(s => `${s.type} (severity: ${s.severity}/3)`).join(', ') || 'None logged'}

Recent Moods: ${moods.slice(0, 5).map(m => `${m.mood} (energy: ${m.energy}/5)`).join(', ') || 'None logged'}

Please provide:
1. A brief insight about their current phase
2. 2-3 specific wellness tips based on their symptoms/moods
3. One encouraging affirmation
4. A gentle reminder about self-care

Keep the tone warm, supportive, and empowering. Use emojis sparingly for a feminine touch.`;

      return await this.callAI(prompt, {
        temperature: 0.7,
        max_tokens: 500
      });
    } catch (error) {
      console.error('Error getting AI insights:', error);
      return null;
    }
  },

  // Generate personalized recommendations
  async getPersonalizedRecommendations(phase, symptoms) {
    try {
      const prompt = `As a women's wellness expert, provide specific recommendations for someone in their ${phase} phase experiencing: ${symptoms.join(', ')}.

Please provide:
1. One nutrition recommendation with specific foods
2. One exercise suggestion appropriate for their phase
3. One self-care ritual
4. One productivity tip

Format each with an emoji and keep it concise and actionable.`;

      return await this.callAI(prompt, {
        temperature: 0.6,
        max_tokens: 300
      });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return null;
    }
  },

  // Analyze symptom patterns
  async analyzeSymptomPatterns(symptoms, cycleLength) {
    try {
      const symptomsByPhase = {
        menstrual: [],
        follicular: [],
        ovulatory: [],
        luteal: []
      };

      // Group symptoms by phase
      symptoms.forEach(symptom => {
        const phase = getPhaseFromCycleDay(symptom.cycle_day, cycleLength);
        if (phase && symptomsByPhase[phase]) {
          symptomsByPhase[phase].push(symptom.type);
        }
      });

      const prompt = `Analyze these symptom patterns across menstrual cycle phases and provide insights:

${Object.entries(symptomsByPhase).map(([phase, symp]) => 
  `${phase}: ${symp.join(', ') || 'No symptoms'}`
).join('\n')}

Provide:
1. Key patterns you notice
2. What this might indicate about hormonal balance
3. One lifestyle suggestion to address the most common symptoms
4. When to consider consulting a healthcare provider

Keep it informative but not medical advice.`;

      return await this.callAI(prompt, {
        temperature: 0.5,
        max_tokens: 400
      });
    } catch (error) {
      console.error('Error analyzing patterns:', error);
      return null;
    }
  },

  // Get mood support messages
  async getMoodSupport(mood, energy) {
    try {
      const prompt = `Provide a supportive message for someone feeling ${mood} with ${energy}/5 energy during their menstrual cycle. 

Include:
1. Validation of their feelings
2. A gentle suggestion for mood support
3. An empowering affirmation

Keep it under 100 words, warm and sister-like.`;

      return await this.callAI(prompt, {
        temperature: 0.8,
        max_tokens: 150
      });
    } catch (error) {
      console.error('Error getting mood support:', error);
      return null;
    }
  }
};

// Helper function to determine phase from cycle day
function getPhaseFromCycleDay(day, cycleLength) {
  const periodLength = 5;
  if (day <= periodLength) return 'menstrual';
  if (day <= cycleLength * 0.5) return 'follicular';
  if (day <= cycleLength * 0.6) return 'ovulatory';
  return 'luteal';
}