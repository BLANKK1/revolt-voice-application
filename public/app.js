const micBtn = document.getElementById('mic-btn');
const status = document.getElementById('status');

let socket;
let mediaRecorder;
let isRecording = false;

micBtn.addEventListener('click', async () => {
  if (isRecording) {
    stopRecording();
  } else {
    await startRecording();
  }
});

async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'audio/webm'
  });

  socket = new WebSocket('ws://localhost:3000/audio'); // Adjust if hosted elsewhere

  socket.onopen = () => {
    status.textContent = 'Status: Recording...';
    micBtn.textContent = '⏹️ Stop';

    mediaRecorder.start(250); // send audio every 250ms

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
        socket.send(event.data);
      }
    };
  };

  socket.onmessage = (event) => {
    // Assuming backend sends audio blob
    const audioBlob = new Blob([event.data], { type: 'audio/webm' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  };

  socket.onerror = (err) => {
    console.error('WebSocket error:', err);
    status.textContent = 'Status: Error';
  };

  isRecording = true;
}

function stopRecording() {
  mediaRecorder.stop();
  socket.close();
  status.textContent = 'Status: Idle';
  micBtn.textContent = '🎙️ Start Talking';
  isRecording = false;
}
