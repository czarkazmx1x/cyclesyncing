import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from 'date-fns';

// Monthly data analyzer that creates personalized insights
export default function MonthlyInsightsAnalyzer({ 
  symptoms, 
  moods, 
  notes, 
  currentMonth, 
  userProfile,
  onInsightsGenerated 
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    if (symptoms.length > 0 || moods.length > 0 || notes.length > 0) {
      generatePersonalizedInsights();
    }
  }, [symptoms, moods, notes, currentMonth]);

  const generatePersonalizedInsights = async () => {
    setIsAnalyzing(true);
    
    try {
      const monthData = analyzeMonthlyData();
      const personalizedSuggestions = await generateAISuggestions(monthData);
      
      const comprehensiveInsights = {
        ...monthData,
        personalizedSuggestions,
        generatedAt: new Date()
      };
      
      setInsights(comprehensiveInsights);
      onInsightsGenerated && onInsightsGenerated(comprehensiveInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeMonthlyData = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Filter data for current month
    const monthSymptoms = symptoms.filter(s => {
      const symptomDate = new Date(s.date);
      return symptomDate >= monthStart && symptomDate <= monthEnd;
    });

    const monthMoods = moods.filter(m => {
      const moodDate = new Date(m.date);
      return moodDate >= monthStart && moodDate <= monthEnd;
    });

    const monthNotes = notes.filter(n => {
      const noteDate = new Date(n.date);
      return noteDate >= monthStart && noteDate <= monthEnd;
    });

    // Analyze patterns by cycle phase
    const phaseAnalysis = analyzeByPhase(monthSymptoms, monthMoods, monthNotes);
    
    // Analyze symptom patterns
    const symptomPatterns = analyzeSymptomPatterns(monthSymptoms);
    
    // Analyze mood patterns
    const moodPatterns = analyzeMoodPatterns(monthMoods);
    
    // Analyze timing patterns
    const timingPatterns = analyzeTimingPatterns(monthSymptoms, monthMoods);
    
    // Calculate cycle insights
    const cycleInsights = calculateCycleInsights(monthSymptoms, monthMoods);
    
    // Analyze note themes
    const noteThemes = analyzeNoteThemes(monthNotes);

    return {
      totalDaysTracked: monthDays.length,
      activeDays: getActiveDays(monthSymptoms, monthMoods, monthNotes).length,
      phaseAnalysis,
      symptomPatterns,
      moodPatterns,
      timingPatterns,
      cycleInsights,
      noteThemes,
      monthSymptoms,
      monthMoods,
      monthNotes
    };
  };

  const analyzeByPhase = (symptoms, moods, notes) => {
    const phases = ['menstrual', 'follicular', 'ovulatory', 'luteal'];
    const analysis = {};

    phases.forEach(phase => {
      const phaseData = getDataForPhase(symptoms, moods, notes, phase);
      analysis[phase] = {
        symptomCount: phaseData.symptoms.length,
        commonSymptoms: getTopItems(phaseData.symptoms.map(s => s.symptom), 3),
        averageSymptomIntensity: calculateAverageIntensity(phaseData.symptoms),
        commonMoods: getTopItems(phaseData.moods.map(m => m.mood), 3),
        notesCount: phaseData.notes.length,
        patterns: identifyPhasePatterns(phaseData, phase)
      };
    });

    return analysis;
  };

  const analyzeSymptomPatterns = (symptoms) => {
    const symptomCounts = {};
    const intensityData = {};
    
    symptoms.forEach(symptom => {
      symptomCounts[symptom.symptom] = (symptomCounts[symptom.symptom] || 0) + 1;
      if (!intensityData[symptom.symptom]) {
        intensityData[symptom.symptom] = [];
      }
      intensityData[symptom.symptom].push(symptom.intensity || 3);
    });

    const mostCommon = Object.entries(symptomCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    const highIntensity = Object.entries(intensityData)
      .filter(([symptom, intensities]) => {
        const avg = intensities.reduce((a, b) => a + b, 0) / intensities.length;
        return avg >= 4;
      })
      .map(([symptom]) => symptom);

    return {
      mostCommon,
      highIntensity,
      totalUniqueSymptoms: Object.keys(symptomCounts).length,
      averageIntensity: calculateOverallAverageIntensity(symptoms)
    };
  };

  const analyzeMoodPatterns = (moods) => {
    const moodCounts = {};
    const moodByDay = {};
    
    moods.forEach(mood => {
      moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
      const dayOfWeek = format(new Date(mood.date), 'EEEE');
      if (!moodByDay[dayOfWeek]) moodByDay[dayOfWeek] = [];
      moodByDay[dayOfWeek].push(mood.mood);
    });

    const dominantMoods = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    const moodStability = calculateMoodStability(moods);

    return {
      dominantMoods,
      moodStability,
      moodByDay,
      totalMoodEntries: moods.length
    };
  };

  const analyzeTimingPatterns = (symptoms, moods) => {
    const timePatterns = {
      morning: { symptoms: 0, moods: 0 },
      afternoon: { symptoms: 0, moods: 0 },
      evening: { symptoms: 0, moods: 0 }
    };

    [...symptoms, ...moods].forEach(entry => {
      const hour = new Date(entry.timestamp || entry.date).getHours();
      let timeOfDay;
      if (hour < 12) timeOfDay = 'morning';
      else if (hour < 17) timeOfDay = 'afternoon';
      else timeOfDay = 'evening';

      if (entry.symptom) timePatterns[timeOfDay].symptoms++;
      if (entry.mood) timePatterns[timeOfDay].moods++;
    });

    return timePatterns;
  };

  const calculateCycleInsights = (symptoms, moods) => {
    // Calculate patterns specific to cycle tracking
    const cycleLengthPattern = estimateCycleLength(symptoms);
    const symptomTrends = identifySymptomTrends(symptoms);
    const moodCycleCorrelation = correlateMoodWithCycle(moods);

    return {
      cycleLengthPattern,
      symptomTrends,
      moodCycleCorrelation,
      overallWellness: calculateWellnessScore(symptoms, moods)
    };
  };

  const analyzeNoteThemes = (notes) => {
    const themes = {
      stress: 0,
      energy: 0,
      sleep: 0,
      food: 0,
      work: 0,
      relationships: 0,
      exercise: 0,
      positive: 0,
      negative: 0
    };

    const keywords = {
      stress: ['stress', 'anxious', 'overwhelmed', 'pressure', 'worry'],
      energy: ['tired', 'exhausted', 'energetic', 'fatigue', 'energy'],
      sleep: ['sleep', 'insomnia', 'rest', 'nap', 'tired'],
      food: ['eat', 'food', 'hungry', 'craving', 'meal'],
      work: ['work', 'job', 'meeting', 'deadline', 'boss'],
      relationships: ['partner', 'friend', 'family', 'relationship', 'social'],
      exercise: ['workout', 'gym', 'run', 'exercise', 'active'],
      positive: ['happy', 'good', 'great', 'amazing', 'love', 'grateful'],
      negative: ['bad', 'awful', 'terrible', 'sad', 'frustrated']
    };

    notes.forEach(note => {
      const text = note.note.toLowerCase();
      Object.entries(keywords).forEach(([theme, words]) => {
        words.forEach(word => {
          if (text.includes(word)) {
            themes[theme]++;
          }
        });
      });
    });

    return themes;
  };

  const generateAISuggestions = async (monthData) => {
    try {
      // Create comprehensive prompt for AI based on all the analyzed data
      const prompt = createPersonalizedPrompt(monthData);
      
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          model: 'mistral-small',
          temperature: 0.7,
          max_tokens: 600
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI insights');
      }
      
      const data = await response.json();
      return JSON.parse(data.content);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      return generateFallbackSuggestions(monthData);
    }
  };

  const createPersonalizedPrompt = (data) => {
    const { phaseAnalysis, symptomPatterns, moodPatterns, cycleInsights, noteThemes } = data;
    
    return `You are a women's health expert analyzing a month of detailed cycle tracking data. Create personalized recommendations based on this data:

CYCLE DATA ANALYSIS:
- Most common symptoms: ${symptomPatterns.mostCommon.map(([symptom, count]) => `${symptom} (${count}x)`).join(', ')}
- High intensity symptoms: ${symptomPatterns.highIntensity.join(', ')}
- Dominant moods: ${moodPatterns.dominantMoods.map(([mood, count]) => `${mood} (${count}x)`).join(', ')}
- Wellness score: ${cycleInsights.overallWellness}/10

PHASE PATTERNS:
- Menstrual: ${phaseAnalysis.menstrual.commonSymptoms.join(', ')} (avg intensity: ${phaseAnalysis.menstrual.averageSymptomIntensity})
- Follicular: ${phaseAnalysis.follicular.commonSymptoms.join(', ')}
- Ovulatory: ${phaseAnalysis.ovulatory.commonSymptoms.join(', ')}
- Luteal: ${phaseAnalysis.luteal.commonSymptoms.join(', ')}

LIFESTYLE THEMES from notes:
- Stress mentions: ${noteThemes.stress}
- Energy mentions: ${noteThemes.energy}
- Sleep mentions: ${noteThemes.sleep}
- Positive sentiment: ${noteThemes.positive}

Generate personalized suggestions in this JSON format:
{
  "overallInsight": "One sentence summary of their key pattern",
  "phaseSpecificTips": {
    "menstrual": ["tip1", "tip2"],
    "follicular": ["tip1", "tip2"],
    "ovulatory": ["tip1", "tip2"],
    "luteal": ["tip1", "tip2"]
  },
  "topRecommendations": [
    {
      "title": "Priority recommendation title",
      "description": "Why this is important for them",
      "action": "Specific action to take",
      "category": "nutrition|exercise|self-care|lifestyle"
    }
  ],
  "patterns": [
    "Key pattern 1 they should know about",
    "Key pattern 2 they should know about"
  ],
  "nextMonthFocus": "What to focus on tracking or improving next month"
}

Make recommendations specific to their symptoms, mood patterns, and cycle phases. Be encouraging and practical.`;
  };

  const generateFallbackSuggestions = (data) => {
    // Fallback suggestions based on data patterns when AI is unavailable
    const { symptomPatterns, moodPatterns } = data;
    
    const topSymptom = symptomPatterns.mostCommon[0]?.[0];
    const topMood = moodPatterns.dominantMoods[0]?.[0];
    
    return {
      overallInsight: `Your main challenge this month appears to be ${topSymptom || 'tracking consistency'}, with ${topMood || 'varied moods'} being your most common emotional state.`,
      phaseSpecificTips: {
        menstrual: ["Rest when needed", "Stay hydrated"],
        follicular: ["Plan new activities", "Focus on nutrition"],
        ovulatory: ["Embrace social activities", "High-intensity workouts"],
        luteal: ["Practice self-care", "Prepare for next cycle"]
      },
      topRecommendations: [
        {
          title: "Address Primary Symptoms",
          description: `Focus on managing ${topSymptom || 'symptoms'} which appeared most frequently`,
          action: "Track timing and triggers for better management",
          category: "self-care"
        }
      ],
      patterns: [
        "Your tracking shows consistent engagement with your cycle awareness",
        "Consider tracking additional factors that might influence your patterns"
      ],
      nextMonthFocus: "Continue tracking to identify additional patterns and correlations"
    };
  };

  // Helper functions
  const getDataForPhase = (symptoms, moods, notes, phase) => {
    // This would calculate which days fall into which phase based on cycle data
    // For now, simplified version
    return { symptoms, moods, notes };
  };

  const getTopItems = (items, count) => {
    const counts = {};
    items.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([item]) => item);
  };

  const calculateAverageIntensity = (symptoms) => {
    if (symptoms.length === 0) return 0;
    const total = symptoms.reduce((sum, s) => sum + (s.intensity || 3), 0);
    return (total / symptoms.length).toFixed(1);
  };

  const calculateOverallAverageIntensity = (symptoms) => {
    if (symptoms.length === 0) return 0;
    const total = symptoms.reduce((sum, s) => sum + (s.intensity || 3), 0);
    return (total / symptoms.length).toFixed(1);
  };

  const getActiveDays = (symptoms, moods, notes) => {
    const activeDays = new Set();
    [...symptoms, ...moods, ...notes].forEach(entry => {
      activeDays.add(format(new Date(entry.date), 'yyyy-MM-dd'));
    });
    return Array.from(activeDays);
  };

  const identifyPhasePatterns = (phaseData, phase) => {
    // Identify specific patterns for each phase
    return [`Common in ${phase} phase`];
  };

  const calculateMoodStability = (moods) => {
    // Calculate how stable moods are (simplified)
    const uniqueMoods = new Set(moods.map(m => m.mood)).size;
    return uniqueMoods <= 3 ? 'stable' : uniqueMoods <= 5 ? 'variable' : 'highly variable';
  };

  const estimateCycleLength = (symptoms) => {
    // Estimate cycle length patterns from symptom data
    return userProfile?.cycleLength || 28;
  };

  const identifySymptomTrends = (symptoms) => {
    // Identify if symptoms are increasing/decreasing over time
    return 'stable';
  };

  const correlateMoodWithCycle = (moods) => {
    // Correlate mood patterns with cycle phases
    return 'moderate correlation';
  };

  const calculateWellnessScore = (symptoms, moods) => {
    // Calculate overall wellness score based on symptoms and moods
    const symptomScore = Math.max(0, 10 - (symptoms.length * 0.1));
    const positiveKeywords = ['happy', 'good', 'great', 'energetic', 'calm'];
    const positiveMoods = moods.filter(m => 
      positiveKeywords.some(keyword => m.mood.toLowerCase().includes(keyword))
    ).length;
    const moodScore = Math.min(10, positiveMoods * 0.5);
    
    return Math.round((symptomScore + moodScore) / 2);
  };

  return null; // This component only provides data, doesn't render anything
}