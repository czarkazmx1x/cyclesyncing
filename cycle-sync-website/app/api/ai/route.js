import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt, model = 'mistral-small', temperature = 0.7, max_tokens = 500 } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Dynamic import to avoid build issues
    const { Mistral } = await import('@mistralai/mistralai');
    const apiKey = process.env.MISTRAL_API_KEY;
    
    if (!apiKey) {
      console.error('MISTRAL_API_KEY not found');
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    const mistral = new Mistral({ apiKey });

    const chatResponse = await mistral.chat.complete({
      model,
      messages: [{
        role: 'user',
        content: prompt
      }],
      temperature,
      maxTokens: max_tokens
    });

    return NextResponse.json({
      content: chatResponse.choices[0].message.content
    });
  } catch (error) {
    console.error('Mistral API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response', details: error.message },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'AI API is running',
    timestamp: new Date().toISOString()
  });
}