// Initialize MindAR for face tracking
const mindar = new MindAR.Face({
  container: document.getElementById('mindar-container'),
});

// Start MindAR
mindar.start().then(() => {
  console.log('MindAR started successfully');
});

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

// Handle Hand Landmarker results
function onHandResults(results) {
  console.log('Hand Landmarker results:', results);
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
    }
  }
  canvasCtx.restore();
}

startCamera();
