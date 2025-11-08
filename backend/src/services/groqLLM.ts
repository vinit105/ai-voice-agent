import { Groq } from 'groq-sdk';

export class GroqLLM {
  private groq: Groq;
  private conversationHistory: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }> = [];

  constructor(apiKey: string) {
    this.groq = new Groq({ apiKey });
  }

  async generateResponse(
    transcript: string,
    language?: string
  ): Promise<string> {
    // Add user message to history
    this.conversationHistory.push({ role: 'user', content: transcript });

    // Detect language from transcript or use provided language
    const hasDevanagari = /[\u0900-\u097F]/.test(transcript); // Hindi/Devanagari
    const hasArabic = /[\u0600-\u06FF]/.test(transcript); // Arabic/Urdu

    console.log(
      'LLM Language code:',
      language,
      'Transcript:',
      transcript.substring(0, 50)
    );

    let systemPrompt =
      'You are a helpful AI voice assistant. Keep responses VERY short (1-2 sentences max). Answer in English.';

    // Language-specific prompts based on voice selection
    if (language === 'hi' || hasDevanagari) {
      systemPrompt =
        'आप एक सहायक AI हैं। केवल हिंदी में जवाब दें। बहुत छोटा जवाब (1-2 वाक्य)।';
    } else if (language === 'en-IN') {
      systemPrompt =
        'You are a helpful AI. Respond in pure English (Indian context). Very short (1-2 sentences). No Hindi words.';
    } else if (language === 'en-US') {
      systemPrompt =
        'You are a helpful AI. Respond in American English. Very short (1-2 sentences).';
    } else if (language === 'en-GB') {
      systemPrompt =
        'You are a helpful AI. Respond in British English. Very short (1-2 sentences).';
    } else if (language === 'es') {
      systemPrompt =
        'Eres un asistente de IA útil. Responde en español. Muy breve (1-2 oraciones).';
    } else if (language === 'fr') {
      systemPrompt =
        'Vous êtes un assistant IA utile. Répondez en français. Très court (1-2 phrases).';
    } else if (language === 'de') {
      systemPrompt =
        'Sie sind ein hilfreicher KI-Assistent. Antworten Sie auf Deutsch. Sehr kurz (1-2 Sätze).';
    } else if (language === 'ja') {
      systemPrompt =
        'あなたは役立つAIアシスタントです。日本語で答えてください。非常に短く（1〜2文）。';
    } else if (language === 'zh') {
      systemPrompt =
        '你是一个有帮助的AI助手。用中文回答。非常简短（1-2句话）。';
    } else if (language === 'ar' || hasArabic) {
      systemPrompt = 'أنت مساعد AI مفيد. أجب بالعربية. قصير جداً (1-2 جمل).';
    }

    console.log('Using system prompt for language:', language);

    const messages = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...this.conversationHistory.slice(-6), // Keep last 6 messages for context
    ];

    const completion = await this.groq.chat.completions.create({
      messages: messages as any,
      model: 'llama-3.3-70b-versatile',
      max_tokens: 150,
      temperature: 0.8,
    });

    const response =
      completion.choices[0]?.message?.content ||
      "I'm sorry, I didn't understand that.";

    // Add assistant response to history
    this.conversationHistory.push({ role: 'assistant', content: response });

    return response;
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}
