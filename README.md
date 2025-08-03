**Revolt Motors Voice Assistant**
A real-time voice chatbot that simulates the behavior of the official Revolt Motors Voice Chat using the Gemini Live API.

Built with:
🎤 Browser-based voice input (Web Speech API)
🔁 Real-time backend with WebSocket
🧠 Gemini 2.5 native audio dialog model (Google)
🎧 AI-generated audio responses streamed to the frontend

**🛠️ Features**
✅ Real-time conversation
✅ Handles voice input and AI voice output
✅ Simulated interruption support
✅ Designed to only talk about Revolt Motors
✅ Clean and minimal UI


**⚙️ Setup Instructions**
1. Clone the Repo
bash
git clone https://github.com/your-username/revolt-voice-app.git
cd revolt-voice-app
2. Install Dependencies
bash
npm install
3. Configure Environment
Create a .env file:
ini
GEMINI_API_KEY=your_api_key_here
Get your API key from: https://aistudio.google.com/app/apikey

4. Run the App
bash
npm start
Visit: http://localhost:3000

**🧪 Testing Checklist**
 Start the app and speak into the mic
 Receive a clear AI response
 Interrupt the AI mid-response by speaking again
 See response latency under 2 seconds
 AI only answers Revolt-specific queries


**🧠 System Prompt**
Gemini is instructed with the following:
text
You are an assistant for Revolt Motors. Only discuss Revolt products, features, and services.
