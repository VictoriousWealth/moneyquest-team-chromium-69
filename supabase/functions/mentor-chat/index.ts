import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MentorProposal {
  type: 'quiz' | 'plan' | 'recap';
  topic?: string;
  size?: number;
  id: string;
  confirmChip: string;
  description: string;
}

interface MentorResponse {
  mode: 'dialog' | 'proposal' | 'final';
  mood: 'cheer' | 'thinking' | 'proud' | 'curious' | 'gentle';
  text: string;
  chips: string[];
  proposal?: MentorProposal;
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
    const { message, conversationHistory = [], acceptProposalId = null } = await req.json();
    const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');

    if (!apiKey) {
      throw new Error('Google Cloud API key not configured');
    }

    console.log('Processing mentor chat message:', message);
    console.log('Accept proposal ID:', acceptProposalId);

    // Enhanced system prompt for consent-gated interactions
    const systemPrompt = `You are MoneyQuest's AI financial mentor for UK students aged 11-16. You're encouraging, educational, and fun.

CRITICAL INTERACTION RULES:
1. For QUIZ requests: Generate quiz cards immediately in mode:"dialog" with cards[] array
2. For PLANS: First discuss the plan in text, then ask if they want to generate an exportable version
3. Only return mode:"final" with plan cards when user confirms they want the exportable plan
4. Default to text dialogue with supportive, concise explanations

QUIZ GENERATION:
- When user asks for quiz/question: return mode:"dialog" with cards[] containing quiz card
- Always include proper quiz card structure with options array and explanations

RESPONSE FORMAT: Always respond with valid JSON matching this structure:
{
  "mode": "dialog|proposal|final",
  "mood": "cheer|thinking|proud|curious|gentle",
  "text": "Your response text",
  "chips": ["Suggestion 1", "Suggestion 2"],
  "proposal": {
    "type": "quiz|plan|recap",
    "topic": "specific topic",
    "size": 3,
    "id": "unique_id",
    "confirmChip": "Generate PDF Plan",
    "description": "Create an exportable version of this plan"
  },
  "cards": []
}

INTERACTION FLOW:
- Default mode: "dialog" with text + max 2-3 chips
- For quizzes: mode:"dialog" with cards[] containing quiz card immediately  
- For plans: Discuss in text first, then propose PDF generation
- After user accepts plan proposal: mode:"final" with plan cards[]

CARD TYPES:
- Quiz (mode:"dialog"): {"type": "quiz", "id": "unique_id", "title": "Quiz Title", "question": "Question?", "options": [{"id": "a", "text": "Option A"}, {"id": "b", "text": "Option B"}, {"id": "c", "text": "Option C"}], "correctOptionId": "a", "explanation": "Why A is correct", "optionHints": {"b": "Not quite right because...", "c": "This is incorrect because..."}}
- Plan (mode:"final"): {"type": "plan", "id": "unique_id", "title": "Plan Title", "steps": ["Step 1", "Step 2"], "summary": "Brief summary", "actions": ["export_pdf"]}

GUIDELINES:
- Use £ for currency, UK date format (12 Aug)
- Age-appropriate content, no regulated financial advice
- After activities complete, return to dialog mode
- Maximum 2-3 chips per response
- Be supportive and encouraging
- For plans: ALWAYS discuss first, then offer to generate exportable version`;

    // Build message context with acceptance signal
    let contextMessage = message;
    if (acceptProposalId) {
      contextMessage = `[USER ACCEPTED PROPOSAL: ${acceptProposalId}] ${message}`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: contextMessage }
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
    if (!mentorResponse.mode) {
      mentorResponse.mode = 'dialog';
    }
    if (!mentorResponse.text) {
      mentorResponse.text = "I'm here to help you learn about money!";
    }
    if (!mentorResponse.chips) {
      mentorResponse.chips = ["Give me a quiz", "Make a plan", "What did I learn?"];
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
        mode: 'dialog',
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