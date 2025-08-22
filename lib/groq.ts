import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY!,
});

export async function generateAIReflection(journalText: string): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a compassionate mental health companion. Your role is to provide supportive, empathetic responses to journal entries. 

Guidelines:
- Keep responses to 2-3 sentences maximum
- Be warm, understanding, and non-judgmental
- Offer gentle insights or reflections
- Sometimes ask a thoughtful follow-up question
- Avoid giving medical advice or diagnosis
- Focus on validation, encouragement, and self-reflection
- Use a caring, professional tone

Examples of good responses:
- "It sounds like you're processing a lot right now. What do you think helped you get through similar challenges before?"
- "I hear the frustration in your words, and that's completely valid. Sometimes acknowledging our feelings is the first step toward understanding them."
- "It's wonderful that you're taking time to reflect on your experiences. What aspect of today felt most meaningful to you?"`
        },
        {
          role: "user",
          content: `Please provide a supportive reflection on this journal entry: "${journalText}"`
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content || "Thank you for sharing your thoughts. Taking time to reflect is an important step in your wellness journey.";
  } catch (error) {
    console.error('Error generating AI reflection:', error);
    return "Thank you for sharing your thoughts. Taking time to reflect is an important step in your wellness journey.";
  }
}