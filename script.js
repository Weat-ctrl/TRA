document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    // Create a static UniversalCamera
    const camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 0, -20), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    // Add a light
    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Create a plane with the mandala pattern
    const plane = BABYLON.MeshBuilder.CreatePlane('plane', { width: 20, height: 20 }, scene);
    plane.position = new BABYLON.Vector3(0, 0, 0);

    const planeMaterial = new BABYLON.StandardMaterial('planeMaterial', scene);
    const videoTexture = new BABYLON.VideoTexture('videoTexture', 'https://raw.githubusercontent.com/Weat-ctrl/TRA/main/assets/mandala-pattern.mp4', scene, true, true);
    planeMaterial.diffuseTexture = videoTexture;
    plane.material = planeMaterial;

    // Function to create a random shape
    function createRandomShape(position, size, textures) {
        const shapeTypes = ['box', 'sphere', 'cylinder'];
        const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        let shape;

        switch (shapeType) {
            case 'box':
                shape = BABYLON.MeshBuilder.CreateBox('shape', { size: size }, scene);
                break;
            case 'sphere':
                shape = BABYLON.MeshBuilder.CreateSphere('shape', { diameter: size }, scene);
                break;
            case 'cylinder':
                shape = BABYLON.MeshBuilder.CreateCylinder('shape', { height: size, diameter: size / 2 }, scene);
                break;
        }

        const material = new BABYLON.StandardMaterial('shapeMaterial', scene);
        const textureIndex = Math.floor(Math.random() * textures.length);
        material.diffuseTexture = new BABYLON.Texture(textures[textureIndex], scene);
        shape.material = material;

        shape.position = position;
        return shape;
    }

    // Array of texture paths
    const textures = [
        'https://raw.githubusercontent.com/Weat-ctrl/TRA/main/assets/spirals.jpg',
        'https://raw.githubusercontent.com/Weat-ctrl/TRA/main/assets/spirals2.jpg',
        'https://raw.githubusercontent.com/Weat-ctrl/TRA/main/assets/spirals3.jpg',
        'https://raw.githubusercontent.com/Weat-ctrl/TRA/main/assets/Scratch_BG_disco.gif',
        'https://raw.githubusercontent.com/Weat-ctrl/TRA/main/assets/Mathmap-wave.gif',
        'https://raw.githubusercontent.com/Weat-ctrl/TRA/main/assets/Mathmap-mercator.gif',
        'https://raw.githubusercontent.com/Weat-ctrl/TRA/main/assets/SwiralTestav.gif'
    ];

    // Function to generate shapes
    function generateShapes() {
        const size = 1; // Initial size
        const xPos = (Math.random() - 0.5) * 2; // Random x position
        const yPos = -0.5 - Math.random(); // Random y position in the lower half
        const zPos = 0; // Start position

        const shape = createRandomShape(new BABYLON.Vector3(xPos, yPos, zPos), size, textures);

        // Move shape towards the camera and grow in size
        scene.onBeforeRenderObservable.add(function () {
            shape.position.z -= 0.1; // Move the shape along the z-axis
            shape.scaling.addInPlace(new BABYLON.Vector3(0.01, 0.01, 0.01)); // Grow in size
            if (shape.position.z < -20) {
                shape.dispose(); // Remove the shape once it is out of view
            }
        });
    }

    // Generate shapes at intervals
    setInterval(generateShapes, 1000); // Generate a shape every 1 second

    // Render loop
    engine.runRenderLoop(function () {
        scene.render();
    });

    // Resize the engine on window resize
    window.addEventListener('resize', function () {
        engine.resize();
    });
});
