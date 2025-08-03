import fetch from 'node-fetch';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-native-audio-dialog:streamGenerateContent';
const API_KEY = process.env.GEMINI_API_KEY;

export async function createGeminiSession(onAudioData) {
  let controller = new AbortController();

  // Initial prompt to guide Gemini responses
  const systemInstruction = {
    role: 'system',
    parts: [{ text: 'You are an assistant for Revolt Motors. Only discuss Revolt products, features, and services.' }]
  };

  const headers = {
    'Content-Type': 'application/json',
    'x-goog-api-key': API_KEY
  };

  const body = JSON.stringify({
    contents: [systemInstruction],
    generationConfig: {
      audioConfig: {
        audioEncoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
        speakingRate: 1.0
      }
    }
  });

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers,
    body,
    signal: controller.signal
  });

  if (!response.ok || !response.body) {
    throw new Error('Gemini Live API failed to start');
  }

  const reader = response.body.getReader();

  async function sendUserAudio(audioBlob) {
    // Not streaming to Gemini directly in this minimal version.
    // To implement real-time bi-directional streaming, use gRPC or client library once available.
    // Currently placeholder - Gemini's native audio dialog is not yet WebSocket-streamable directly.
  }

  async function readStream() {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        onAudioData(value);
      }
    } catch (err) {
      console.error('Stream error:', err);
    }
  }

  readStream();

  return {
    sendUserAudio,
    closeSession: () => controller.abort()
  };
}
