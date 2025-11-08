import { GroqSTT } from './services/groqSTT';
import { GroqLLM } from './services/groqLLM';
import { EdgeTTS } from './services/edgeTTS';

class VoiceAgent {
  private stt!: GroqSTT;
  private llm!: GroqLLM;
  private tts!: EdgeTTS;
  private conversationHistory: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }> = [];

  initialize() {
    console.log('Initializing voice agent services...');
    this.stt = new GroqSTT(process.env.GROQ_API_KEY!);
    this.llm = new GroqLLM(process.env.GROQ_API_KEY!);
    this.tts = new EdgeTTS();
    console.log('Voice agent services initialized');
  }

  resetConversation() {
    console.log('Resetting conversation history');
    this.conversationHistory = [];
  }

  async processAudio(
    audioData: string,
    voice?: string
  ): Promise<string | null> {
    try {
      console.log('Processing audio data...');

      // Decode base64 audio data to Buffer
      const audioBuffer = Buffer.from(audioData, 'base64');
      console.log('Audio buffer size:', audioBuffer.length, 'bytes');

      if (audioBuffer.length === 0) {
        console.error('Audio buffer is empty');
        return null; // Don't respond to empty audio
      }

      // Determine language from voice selection - AUTO DETECT from voice name
      let language = undefined;
      let languageCode = undefined;

      if (voice) {
        // Extract language from voice name (e.g., hi-IN-SwaraNeural -> hi)
        if (voice.startsWith('hi-')) {
          language = 'hi';
          languageCode = 'hi';
        } else if (voice.startsWith('en-IN')) {
          language = 'en';
          languageCode = 'en-IN';
        } else if (voice.startsWith('en-US')) {
          language = 'en';
          languageCode = 'en-US';
        } else if (voice.startsWith('en-GB')) {
          language = 'en';
          languageCode = 'en-GB';
        } else if (voice.startsWith('es-')) {
          language = 'es';
          languageCode = 'es';
        } else if (voice.startsWith('fr-')) {
          language = 'fr';
          languageCode = 'fr';
        } else if (voice.startsWith('de-')) {
          language = 'de';
          languageCode = 'de';
        } else if (voice.startsWith('ja-')) {
          language = 'ja';
          languageCode = 'ja';
        } else if (voice.startsWith('zh-')) {
          language = 'zh';
          languageCode = 'zh';
        } else if (voice.startsWith('ar-')) {
          language = 'ar';
          languageCode = 'ar';
        } else {
          // Default to English
          language = 'en';
          languageCode = 'en';
        }
      }

      // Transcribe audio using Groq STT
      console.log(
        'Starting transcription with language:',
        language || 'auto-detect',
        'Voice:',
        voice
      );
      const transcript = await this.stt.transcribe(audioBuffer, language);
      console.log('Transcript:', transcript);

      // Filter out very short or meaningless transcripts
      if (!transcript || transcript.trim().length < 5) {
        console.log('Transcript too short or empty, ignoring');
        return null;
      }

      // Filter out single punctuation or repetitive short sounds
      const cleanTranscript = transcript.trim();

      // Check for meaningless patterns
      if (/^[.,!?…\s]+$/.test(cleanTranscript)) {
        console.log('Only punctuation, ignoring');
        return null;
      }

      // Check for repetitive patterns like "कर दो कर दो" or "a a a a"
      const words = cleanTranscript.split(/\s+/);
      if (words.length >= 2) {
        const uniqueWords = new Set(words);
        // If more than 70% of words are the same, it's probably noise
        if (uniqueWords.size / words.length < 0.3) {
          console.log('Repetitive pattern detected, ignoring');
          return null;
        }
      }

      // Minimum word count
      if (words.length < 2 && cleanTranscript.length < 10) {
        console.log('Too few words, ignoring');
        return null;
      }

      // Generate AI response with language context
      const response = await this.llm.generateResponse(
        cleanTranscript,
        languageCode
      );
      console.log('AI Response:', response);

      return response;
    } catch (error) {
      console.error('Error processing audio:', error);
      return null; // Don't respond on errors
    }
  }

  async generateSpeech(
    text: string,
    voice: string = 'en-IN-NeerjaNeural'
  ): Promise<Buffer> {
    console.log(
      'Generating speech with voice:',
      voice,
      'for text:',
      text.substring(0, 50)
    );

    // Just use the selected voice directly - let Edge TTS handle it
    // Edge TTS can handle Devanagari (Hindi) script with Hindi voices
    try {
      return await this.tts.generateSpeech(text, voice);
    } catch (error) {
      console.error('TTS generation failed:', error);
      return Buffer.alloc(0);
    }
  }
}

export const voiceAgent = new VoiceAgent();
