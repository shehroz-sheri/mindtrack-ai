import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: "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",
});

// Crisis keywords that trigger safety responses
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'self harm', 'hurt myself',
  'cutting', 'overdose', 'jump off', 'hang myself', 'worthless', 'better off dead',
  'no point living', 'can\'t go on', 'end it all'
];

const CRISIS_RESPONSE = `🚨 I'm concerned about what you're sharing. Please reach out for immediate support:

• Call 988 (Suicide & Crisis Lifeline) - Available 24/7
• Text HOME to 741741 (Crisis Text Line)
• Go to your nearest emergency room
• Call 911 if you're in immediate danger

You matter, and there are people who want to help. Here's my response to your message:

`;

function containsCrisisKeywords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

export async function POST(request: NextRequest) {
  try {
    const { message, systemContext, chatHistory } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check for crisis keywords
    const hasCrisisContent = containsCrisisKeywords(message) || 
                           containsCrisisKeywords(systemContext || '');

    // Build conversation history for context
    const conversationHistory = chatHistory?.slice(-8) || []; // Last 8 messages for context
    
    const messages = [
      {
        role: "system",
        content: `You are a compassionate, supportive AI therapist assistant. Your role is to provide empathetic, non-judgmental support based on the user's journal entries and current conversation.

Guidelines:
- Be warm, understanding, and professionally supportive
- Ask thoughtful follow-up questions to encourage reflection
- Offer gentle insights and coping strategies when appropriate
- Validate emotions and experiences
- Keep responses conversational and not overly clinical
- Limit responses to 2-3 paragraphs maximum
- Never provide medical diagnoses or prescribe treatments
- Encourage professional help when appropriate
- Focus on emotional support and self-reflection

User's Journal Context:
${systemContext || 'No journal context available.'}

Remember: You're having a supportive conversation, not conducting therapy. Be genuine and caring.`
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: "user",
        content: message
      }
    ];

    const completion = await groq.chat.completions.create({
      messages: messages as any,
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 300,
    });

    let reply = completion.choices[0]?.message?.content || 
                "I'm here to listen and support you. Could you tell me more about what you're experiencing?";

    // Prepend crisis response if needed
    if (hasCrisisContent) {
      reply = CRISIS_RESPONSE + reply;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}