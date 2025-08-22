import { NextRequest, NextResponse } from 'next/server';
import { generateAIReflection } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const aiResponse = await generateAIReflection(text);
    
    return NextResponse.json({ aiResponse });
  } catch (error) {
    console.error('Error in AI reflection API:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI reflection' },
      { status: 500 }
    );
  }
}