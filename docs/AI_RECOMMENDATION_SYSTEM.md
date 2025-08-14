# AI Recommendation System Integration Guide

## Overview
The AI Recommendation System allows women to input their thoughts, symptoms, and experiences to receive personalized, AI-generated health and wellness recommendations tailored to their menstrual cycle phase.

## How It Works

### 1. User Input Collection
- Women can describe how they're feeling, symptoms they're experiencing, or what they need help with
- The system captures this along with their current cycle phase
- Input is analyzed for keywords and context

### 2. AI Processing
- User input is processed to understand symptoms, emotions, and needs
- Current cycle phase provides additional context
- AI generates personalized recommendations based on this combined information

### 3. Recommendation Display
- AI-generated recommendations appear above static recommendations
- Each recommendation shows confidence level and timestamp
- Users can save helpful recommendations for future reference

## Current Implementation

### Mock AI (Development)
Currently using a sophisticated mock AI that:
- Analyzes user input for keywords related to pain, energy, mood, and hunger
- Generates contextual recommendations based on detected themes
- Provides phase-appropriate suggestions
- Calculates confidence scores based on input specificity

### Files Structure
```
components/ai/
├── AIRecommendationEngine.js    # Main input and processing component
├── AIRecommendationCard.js      # Display component for AI recommendations

app/api/ai-recommendations/
└── route.js                     # API endpoint (ready for real AI integration)

app/dashboard/recommendations/
└── page.js                      # Updated recommendations page with AI integration
```

## Integration with Real AI Services

### Option 1: OpenAI Integration
```javascript
// In app/api/ai-recommendations/route.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content: `You are a women's health and menstrual cycle expert. 
                The user is in their ${currentPhase} phase. 
                Provide personalized, evidence-based recommendations.
                
                Format your response as JSON:
                {
                  "title": "Clear, helpful title",
                  "description": "Explanation of why this helps",
                  "tips": ["specific actionable tip 1", "tip 2", "tip 3"],
                  "category": "nutrition|exercise|self-care|productivity",
                  "icon": "relevant emoji"
                }`
    },
    {
      role: "user", 
      content: userInput
    }
  ],
  temperature: 0.7,
  max_tokens: 500
});
```

### Option 2: Claude Integration
```javascript
// Using Anthropic's Claude API
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.messages.create({
  model: 'claude-3-sonnet-20240229',
  max_tokens: 500,
  messages: [
    {
      role: 'user',
      content: `As a women's health expert, analyze this input from someone in their ${currentPhase} phase: "${userInput}"
                
                Provide personalized recommendations in this JSON format:
                {
                  "title": "recommendation title",
                  "description": "why this helps during ${currentPhase} phase", 
                  "tips": ["actionable tip 1", "tip 2", "tip 3"],
                  "category": "nutrition|exercise|self-care|productivity",
                  "icon": "emoji"
                }`
    }
  ]
});
```

### Option 3: Local AI Models
For privacy-focused implementations, you could use local models:
- Ollama with specialized health models
- Hugging Face transformers
- Custom fine-tuned models for women's health

## Environment Variables Required

```bash
# For OpenAI
OPENAI_API_KEY=your_openai_api_key

# For Claude
ANTHROPIC_API_KEY=your_anthropic_api_key

# For custom endpoints
AI_ENDPOINT_URL=your_custom_ai_endpoint
AI_API_KEY=your_custom_api_key
```

## Enabling Real AI

To switch from mock to real AI:

1. **Set up your AI service** (OpenAI, Claude, etc.)
2. **Add environment variables** to `.env.local`
3. **Update the API endpoint** in `app/api/ai-recommendations/route.js`
4. **Enable API mode** in `components/ai/AIRecommendationEngine.js`:
   ```javascript
   const useAPI = true; // Change from false to true
   ```

## Data Privacy Considerations

### User Data Handling
- User inputs contain sensitive health information
- Consider encryption for stored data
- Implement data retention policies
- Allow users to delete their data

### AI Service Privacy
- Review AI service data usage policies
- Consider using AI services that don't train on user data
- Implement request anonymization where possible
- Use local AI models for maximum privacy

## Customization Options

### Recommendation Categories
- Nutrition: Food suggestions, supplements, hydration
- Exercise: Workout recommendations, intensity levels
- Self-care: Relaxation, sleep, stress management
- Productivity: Energy management, task planning
- Social: Relationship advice, communication tips

### Personalization Factors
- Current cycle phase (menstrual, follicular, ovulatory, luteal)
- Symptoms mentioned in input
- Historical patterns and preferences
- Time of day and seasonal factors
- User's lifestyle and constraints

## Testing the System

### Manual Testing
1. Navigate to `/dashboard/recommendations`
2. Enter various types of input in the AI section
3. Observe generated recommendations
4. Test saving and dismissing functionality

### Example Test Inputs
- "I'm having terrible cramps and feeling so tired today"
- "Can't sleep well and feeling really emotional"
- "Craving chocolate but trying to eat healthy"
- "Have lots of energy but don't know how to use it"
- "Feeling anxious about my upcoming presentation"

## Future Enhancements

### Learning Capabilities
- Track which recommendations users find helpful
- Learn from user feedback and ratings
- Improve recommendations over time
- Build user preference profiles

### Advanced Features
- Integration with wearable data (sleep, activity)
- Photo analysis for symptom tracking
- Voice input for easier logging
- Community insights and patterns
- Predictive recommendations based on cycle patterns

### Analytics
- Track recommendation effectiveness
- Monitor user engagement patterns
- Identify common needs by cycle phase
- Generate insights for product improvement

## Monitoring and Maintenance

### API Usage Monitoring
- Track AI service costs and usage
- Monitor response times and errors
- Set up alerts for service issues
- Implement rate limiting and caching

### Quality Assurance
- Regular review of generated recommendations
- Medical professional validation of content
- User feedback collection and analysis
- Continuous improvement of AI prompts

This system provides a foundation for truly personalized women's health recommendations while maintaining the flexibility to integrate with various AI services based on your privacy, cost, and performance requirements.
