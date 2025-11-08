# AI Voice Agent System

A production-ready AI voice agent system with real-time voice conversations using LiveKit, Groq, and PlayAI.

## 🏗️ Architecture

```
Frontend (Next.js on Vercel)
    ↓ WebRTC
LiveKit Cloud
    ↓
Backend (Express on Railway)
    → Groq STT (Whisper)
    → Groq LLM (LLaMA 3.3 70B)
    → Microsoft Edge TTS
```

## 📁 Project Structure

```
voice-chat/
├── voice-agent-frontend/     # Next.js frontend
└── voice-agent-backend/      # Express backend
```

## 🚀 Quick Start

### Prerequisites

1. **LiveKit Cloud Account**: Sign up at [cloud.livekit.io](https://cloud.livekit.io)
2. **Groq API Key**: Get from [console.groq.com](https://console.groq.com)
3. **PlayAI Account**: Sign up at [play.ai](https://play.ai)

### Frontend Setup

```bash
cd voice-agent-frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your API keys
npm run dev
```

### Backend Setup

```bash
cd voice-agent-backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev
```

## 🔧 Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
```

### Backend (.env)

```env
PORT=3001
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
LIVEKIT_URL=wss://your-project.livekit.cloud
GROQ_API_KEY=your-groq-api-key
```

## 🚀 Deployment

### Frontend - Vercel

1. Push frontend code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Backend - Railway

1. Push backend code to GitHub
2. Create new project on Railway
3. Connect GitHub repository
4. Add environment variables in Railway dashboard
5. Railway auto-detects Node.js and deploys

## 🧪 Testing

### Frontend Tests

- [ ] Microphone permissions granted
- [ ] LiveKit room connection successful
- [ ] Audio visualization works
- [ ] Transcript display updates
- [ ] Mute/unmute functionality
- [ ] Call end functionality

### Backend Tests

- [ ] Server starts without errors
- [ ] Health check endpoint responds
- [ ] LiveKit agent connection
- [ ] Audio transcription works
- [ ] LLM response generation
- [ ] TTS audio generation
- [ ] Audio publishing to room

## 📚 API Documentation

- **LiveKit**: https://docs.livekit.io/
- **Groq**: https://console.groq.com/docs
- **Microsoft Edge TTS**: https://www.npmjs.com/package/edge-tts-universal

## 🐛 Troubleshooting

### Common Issues

**Connection Issues:**

- Verify LiveKit WebSocket URL format
- Check API keys are correct
- Ensure CORS is configured

**Audio Issues:**

- Check browser audio permissions
- Verify microphone access
- Test with different browsers

**API Errors:**

- Confirm API keys are valid
- Check rate limits
- Review API documentation

## 💰 Cost Estimation

| Service  | Free Tier     | Paid After    |
| -------- | ------------- | ------------- |
| Vercel   | Unlimited     | $20/mo Pro    |
| Railway  | 500 hours     | $5/mo         |
| LiveKit  | 10k min/month | $0.006/min    |
| Groq     | Generous free | Pay as you go |
| Edge TTS | Free          | N/A           |

**Total: ~$0/month for low usage**

## 📝 License

MIT License - see LICENSE file for details.
