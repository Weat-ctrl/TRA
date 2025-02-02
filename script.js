const videoElement = document.getElementById('webcam');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');

// Initialize Hand Landmarker
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 2, // Detect up to two hands
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

// Process results from Hand Landmarker
hands.onResults(onHandResults);

// Start the camera
async function startCamera() {
  const constraints = {
    video: {
      facingMode: 'user', // Use the front camera
      width: 640,
      height: 480,
    },
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = stream;

    // Wait for the video to load
    videoElement.onloadedmetadata = () => {
      console.log('Camera started successfully');
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;

      // Start processing frames
      processFrame();
    };
  } catch (error) {
    console.error('Error starting camera:', error);
    alert(`Failed to start camera: ${error.message}`);
  }
}

// Process each frame
function processFrame() {
  if (videoElement.readyState >= 2) {
    // Send the video frame to the Hand Landmarker
    hands.send({ image: videoElement });
  }
  requestAnimationFrame(processFrame); // Continuously process frames
}

// Store previous index finger positions for the glowing tail
let previousIndexPositions = [];

// Handle Hand Landmarker results
function onHandResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      // Draw hand landmarks
      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });

      // Get the index finger tip (landmark 8)
      const indexFingerTip = landmarks[8];
      const indexX = indexFingerTip.x * canvasElement.width;
      const indexY = indexFingerTip.y * canvasElement.height;

      // Add the current position to the glowing tail
      previousIndexPositions.push({ x: indexX, y: indexY });

      // Limit the tail length
      if (previousIndexPositions.length > 20) {
        previousIndexPositions.shift();
      }

      // Draw the glowing tail
      canvasCtx.beginPath();
      canvasCtx.moveTo(previousIndexPositions[0].x, previousIndexPositions[0].y);
      for (let i = 1; i < previousIndexPositions.length; i++) {
        canvasCtx.lineTo(previousIndexPositions[i].x, previousIndexPositions[i].y);
      }
      canvasCtx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
      canvasCtx.lineWidth = 5;
      canvasCtx.stroke();

      // Detect pinch gesture (distance between thumb tip and index tip)
      const thumbTip = landmarks[4];
      const thumbX = thumbTip.x * canvasElement.width;
      const thumbY = thumbTip.y * canvasElement.height;
      const distance = Math.hypot(thumbX - indexX, thumbY - indexY);

      if (distance < 30) { // Pinch detected
        // Draw a fireball at the index finger tip
        canvasCtx.beginPath();
        canvasCtx.arc(indexX, indexY, 30, 0, 2 * Math.PI);
        canvasCtx.fillStyle = 'rgba(255, 165, 0, 0.7)';
        canvasCtx.fill();
      }
    }
  }
  canvasCtx.restore();
}

startCamera();
