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

// Initialize Face Landmarker
const faceMesh = new FaceMesh({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
});

faceMesh.setOptions({
  maxNumFaces: 1, // Detect one face
  refineLandmarks: true, // Use refined landmarks for better accuracy
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

// Process results from Hand Landmarker
hands.onResults(onHandResults);

// Process results from Face Landmarker
faceMesh.onResults(onFaceResults);

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
    // Send the video frame to both Hand and Face Landmarkers
    hands.send({ image: videoElement });
    faceMesh.send({ image: videoElement });
  }
  requestAnimationFrame(processFrame); // Continuously process frames
}

// Handle Hand Landmarker results
function onHandResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  // Draw hand landmarks
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });

      // Add magic effects to hands (e.g., glowing circles)
      const indexFingerTip = landmarks[8]; // Tip of the index finger
      canvasCtx.beginPath();
      canvasCtx.arc(indexFingerTip.x * canvasElement.width, indexFingerTip.y * canvasElement.height, 20, 0, 2 * Math.PI);
      canvasCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      canvasCtx.fill();
    }
  }
  canvasCtx.restore();
}

// Handle Face Landmarker results
function onFaceResults(results) {
  canvasCtx.save();

  // Draw face landmarks
  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, { color: '#00FF00', lineWidth: 1 });

      // Add wizard hat to the face
      const forehead = landmarks[10]; // A landmark near the forehead
      canvasCtx.beginPath();
      canvasCtx.moveTo(forehead.x * canvasElement.width, forehead.y * canvasElement.height);
      canvasCtx.lineTo((forehead.x - 0.1) * canvasElement.width, (forehead.y - 0.2) * canvasElement.height);
      canvasCtx.lineTo((forehead.x + 0.1) * canvasElement.width, (forehead.y - 0.2) * canvasElement.height);
      canvasCtx.closePath();
      canvasCtx.fillStyle = 'rgba(0, 0, 255, 0.5)';
      canvasCtx.fill();
    }
  }
  canvasCtx.restore();
}

startCamera();
