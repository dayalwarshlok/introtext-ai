import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { incomingMessage, userIntent, mode, language, isSmartMode, history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is missing. Please add GEMINI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    if (!incomingMessage && !userIntent) {
      return NextResponse.json({ error: 'Please provide either a message or your intent.' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Build Prompt
    let prompt = `You are "IntroText AI", an expert communication assistant designed to help people reply to messages effortlessly and naturally.\n\n`;
    
    prompt += `CONTEXT:\n`;
    if (history && history.length > 0) {
      prompt += `Recent Conversation History:\n${history.map((m: any) => `${m.role === 'user' ? 'Me' : 'Them'}: ${m.content}`).join('\n')}\n\n`;
    }
    
    prompt += `Incoming Message: "${incomingMessage || '(No incoming message)'}"\n`;
    prompt += `What I want to say (Intent/Situation): "${userIntent || '(No specific intent provided)'}"\n`;
    
    prompt += `\nSETTINGS:\n`;
    prompt += `Target Language: ${language} (Also support Hinglish and casual code-switching if the language is an Indian language like Hindi, Gujarati, etc. Keep slang natural).\n`;
    
    if (isSmartMode) {
      prompt += `Mode: SMART MODE. (Please analyze the context and choose the best tone: Friendly, Professional, Flirty, Respectful, etc. based on the incoming message).\n`;
    } else {
      prompt += `Mode: ${mode}\n`;
    }

    prompt += `\nINSTRUCTIONS:\n`;
    prompt += `Generate exactly 3 reply suggestions for me to send back. They must strictly follow the requested Tone/Mode and Language.\n`;
    prompt += `1. "Short": A quick, concise reply.\n`;
    prompt += `2. "Natural": A conversational, everyday reply.\n`;
    prompt += `3. "Creative": A fun, engaging, or uniquely phrased reply.\n`;
    
    prompt += `\nReturn the response as a JSON object with this exact structure (no markdown, just raw JSON):\n`;
    prompt += `{
  "detectedMode": "The mode you used (especially useful if Smart Mode was on)",
  "suggestions": {
    "short": "...",
    "natural": "...",
    "creative": "..."
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    
    let errorMessage = 'Something went wrong while generating the reply. Please try again.';
    
    // Check if the error is related to an invalid API key
    if (error.status === 400 && error.message && error.message.includes('API key not valid')) {
      errorMessage = 'Invalid Gemini API Key. Please update your GEMINI_API_KEY in .env.local with a valid key from Google AI Studio.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
