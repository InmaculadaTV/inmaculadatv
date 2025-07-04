const audio = document.getElementById('radio');
const toggleButton = document.getElementById('audio-toggle');
const canvas = document.getElementById('waveform');
const ctx = canvas.getContext('2d');

let isPlaying = false;
let audioCtx;
let analyser;
let dataArray;
let bufferLength;

toggleButton.addEventListener('click', () => {
  if (!isPlaying) {
    audio.play();
    toggleButton.textContent = '⏸️ Detener';
    startVisualizer();
    isPlaying = true;
  } else {
    audio.pause();
    toggleButton.textContent = '▶️ Escuchar en Vivo';
    isPlaying = false;
  }
});

function startVisualizer() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i];
      ctx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
      ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
      x += barWidth + 1;
    }
  }

  draw();
}
