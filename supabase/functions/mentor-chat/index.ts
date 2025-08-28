import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MentorResponse {
  mood: 'cheer' | 'thinking' | 'proud' | 'curious' | 'gentle';
  text?: string;
  chips: string[];
  cards: Card[];
}

interface Card {
  type: 'quiz' | 'plan' | 'recap' | 'fix';
  id: string;
  title: string;
  [key: string]: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');

    if (!apiKey) {
      throw new Error('Google Cloud API key not configured');
    }

    console.log('Processing mentor chat message:', message);

    // System prompt for the financial mentor
    const systemPrompt = `You are MoneyQuest's AI financial mentor for UK students aged 11-16. You're encouraging, educational, and fun.

RESPONSE FORMAT: Always respond with valid JSON matching this structure:
{
  "mood": "cheer|thinking|proud|curious|gentle",
  "text": "Your response text (optional if cards provided)",
  "chips": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "cards": [card objects if applicable]
}

CARD TYPES:
- Quiz card: {"type": "quiz", "id": "unique_id", "title": "Quiz Title", "question": "Question?", "options": [{"id": "a", "text": "Option A"}, {"id": "b", "text": "Option B"}], "correctOptionId": "a", "explanation": "Why A is correct", "optionHints": {"b": "Hint for wrong option"}}
- Plan card: {"type": "plan", "id": "unique_id", "title": "Plan Title", "steps": ["Step 1", "Step 2"], "summary": "Brief summary", "actions": ["save", "export_pdf"]}
- Recap card: {"type": "recap", "id": "unique_id", "bullets": ["Point 1", "Point 2"], "suggestedNext": "Try a savings challenge"}
- Fix card: {"type": "fix", "id": "unique_id", "title": "Common Mistake", "mistake": "What went wrong", "correctRule": "The right way", "oneExample": "Example", "cta": "Try again"}

GUIDELINES:
- Use £ for currency, UK date format (12 Aug)
- Age-appropriate content, no regulated financial advice
- Encourage learning through practice
- Generate interactive content when possible
- Set mood based on context: "cheer" for encouragement, "thinking" for problem-solving, "proud" for achievements, "curious" for exploration, "gentle" for corrections`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          })),
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text;

    if (!generatedText) {
      throw new Error('No response from Gemini API');
    }

    console.log('Raw Gemini response:', generatedText);

    // Try to parse JSON response - handle markdown wrapping
    let mentorResponse: MentorResponse;
    try {
      // Remove markdown code block wrapper if present
      let cleanedText = generatedText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }
      
      mentorResponse = JSON.parse(cleanedText);
      console.log('Successfully parsed JSON response:', mentorResponse);
    } catch (parseError) {
      console.log('Failed to parse JSON, creating fallback response. Parse error:', parseError);
      console.log('Attempted to parse:', generatedText.substring(0, 200) + '...');
      // Fallback to plain text response
      mentorResponse = {
        mood: 'gentle',
        text: generatedText,
        chips: ["Give me a quiz", "Make a savings plan", "What did I learn?"],
        cards: []
      };
    }

    // Validate response structure
    if (!mentorResponse.mood) {
      mentorResponse.mood = 'gentle';
    }
    if (!mentorResponse.chips) {
      mentorResponse.chips = ["Give me a quiz", "Make a savings plan", "What did I learn?"];
    }
    if (!mentorResponse.cards) {
      mentorResponse.cards = [];
    }

    console.log('Final mentor response:', mentorResponse);

    return new Response(JSON.stringify(mentorResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in mentor-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        mood: 'gentle',
        text: "I'm having trouble thinking right now. Could you try asking me something else?",
        chips: ["Try again", "Give me a quiz", "Make a plan"],
        cards: []
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});