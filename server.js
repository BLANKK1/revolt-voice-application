import express from 'express';
import { WebSocketServer } from 'ws';
import { createGeminiSession } from './gemini.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = 3000;

// Serve frontend (assumes frontend is in /public)
app.use(express.static('public'));

const server = app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

// WebSocket server
const wss = new WebSocketServer({ server, path: '/audio' });

wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');
  let abortGeminiStream;

  // Set up Gemini session per connection
  createGeminiSession((audioChunk) => {
    // Send Gemini audio chunk to client
    if (ws.readyState === ws.OPEN) {
      ws.send(audioChunk);
    }
  }).then(({ sendUserAudio, closeSession }) => {
    ws.on('message', async (data) => {
      try {
        // Pass frontend audio to Gemini
        await sendUserAudio(data);
      } catch (err) {
        console.error('Gemini stream error:', err);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      closeSession();
    });
  });
});
