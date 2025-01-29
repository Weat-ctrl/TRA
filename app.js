// Initialize MediaPipe Hands
const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
});

hands.onResults(onResults);

// Set up video stream for hand tracking
const videoElement = document.createElement('video');
videoElement.width = 640;
videoElement.height = 480;

const startVideoStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    videoElement.play();
};

startVideoStream();

// Function to handle gesture results
function onResults(results) {
    const canvasElement = document.createElement('canvas');
    const canvasCtx = canvasElement.getContext('2d');
    canvasElement.width = videoElement.width;
    canvasElement.height = videoElement.height;

    // Draw landmarks on canvas
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
            drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });

            // Call a function to update the A-Frame scene
            updateGesturePanel(landmarks);
        }
    }
}

// Function to update A-Frame scene
function updateGesturePanel(handData) {
    const gesturePanel = document.getElementById('gesture-panel');
    // Example: Update position or content of gesturePanel based on handData
    gesturePanel.setAttribute('material', 'color', '#00FF00');
    gesturePanel.setAttribute('text', { value: 'Gesture Detected!', color: 'black' });
}

// Pass video frames to MediaPipe Hands
const sendVideoToHands = () => {
    hands.send({ image: videoElement });
    requestAnimationFrame(sendVideoToHands);
};

videoElement.addEventListener('loadeddata', sendVideoToHands);
