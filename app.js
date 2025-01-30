// Initialize elements
const videoElement = document.getElementById('webcam');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');

const setupCamera = async () => {
    const constraints = {
        video: {
            facingMode: { ideal: 'environment' } // Use the back camera
        }
    };
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream;
        videoElement.play();
    } catch (error) {
        console.error('Error accessing the camera:', error);
    }
};

setupCamera();

// Initialize MediaPipe Hand Landmarker
const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
const handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: "hand_landmarker.task" },
    numHands: 1 // Detect one hand
});

// Handle results
function onResults(results) {
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
            drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
        }
    }
}

const sendVideoToHands = () => {
    handLandmarker.send({ image: videoElement });
    requestAnimationFrame(sendVideoToHands);
};

videoElement.addEventListener('loadeddata', sendVideoToHands);
