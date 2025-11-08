import { Groq } from 'groq-sdk';

export class GroqSTT {
  private groq: Groq;

  constructor(apiKey: string) {
    this.groq = new Groq({ apiKey });
  }

  async transcribe(audioBuffer: Buffer, language?: string): Promise<string> {
    // Convert Buffer to File-like object
    const audioFile = new File([audioBuffer], 'audio.webm', {
      type: 'audio/webm',
    });

    const options: any = {
      file: audioFile,
      model: 'whisper-large-v3',
      response_format: 'json',
      temperature: 0, // More deterministic transcription
    };

    // Add language hint and prompt for better accuracy
    if (language) {
      options.language = language;

      // Add context prompt to help Whisper understand better
      if (language === 'hi') {
        options.prompt = 'यह एक हिंदी बातचीत है। कृपया शुद्ध हिंदी में लिखें।';
      } else if (language === 'es') {
        options.prompt = 'Esta es una conversación en español.';
      } else if (language === 'fr') {
        options.prompt = 'Ceci est une conversation en français.';
      } else if (language === 'de') {
        options.prompt = 'Dies ist ein Gespräch auf Deutsch.';
      } else if (language === 'ja') {
        options.prompt = 'これは日本語の会話です。';
      } else if (language === 'zh') {
        options.prompt = '这是中文对话。';
      } else if (language === 'ar') {
        options.prompt = 'هذه محادثة بالعربية.';
      }
    }

    const transcription = await this.groq.audio.transcriptions.create(options);

    return transcription.text;
  }
}
