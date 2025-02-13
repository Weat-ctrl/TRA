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

    // Function to create a spinning coin with light
    function createCoin(position) {
        BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/Weat-ctrl/TRA/main/assets/", "coin.glb", scene, function (meshes) {
            const coin = meshes[0];
            coin.position = position;

            const coinLight = new BABYLON.PointLight('coinLight', position, scene);
            coinLight.diffuse = new BABYLON.Color3(1, 1, 0); // Yellow light
            coinLight.intensity = 0.5;

            // Apply random rotation
            const rotationAxis = new BABYLON.Vector3(Math.random(), Math.random(), Math.random()).normalize();
            scene.onBeforeRenderObservable.add(function () {
                coin.rotate(rotationAxis, 0.02, BABYLON.Space.LOCAL);
            });
        });
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

    // Function to generate shapes and coins
    function generateShapesAndCoins() {
        const size = 1; // Reverted to larger initial size
        const xPos = (Math.random() - 0.5) * 2; // Random x position
        const yPos = 0; // Center y position
        const zPos = 0; // Start position

        const shape = createRandomShape(new BABYLON.Vector3(xPos, yPos, zPos), size, textures);

        // Create coins behind and to the sides of the shape
        for (let i = 1; i <= 5; i++) {
            const coinPosition = new BABYLON.Vector3(
                xPos + (Math.random() > 0.5 ? i * 0.5 : -i * 0.5),
                yPos - 1 - Math.random(),
                zPos - i * 2
            );
            createCoin(coinPosition);
        }

        // Move shape towards the camera with various movement patterns
        scene.onBeforeRenderObservable.add(function () {
            const movementType = Math.floor(Math.random() * 3); // Randomly choose a movement type

            switch (movementType) {
                case 0: // Direct towards the camera
                    shape.position.z -= 0.1;
                    shape.scaling.addInPlace(new BABYLON.Vector3(0.01, 0.01, 0.01));
                    break;
                case 1: // Diagonal outward
                    shape.position.addInPlace(new BABYLON.Vector3((Math.random() > 0.5 ? 0.05 : -0.05), -0.05, -0.1));
                    shape.scaling.addInPlace(new BABYLON.Vector3(0.01, 0.01, 0.01));
                    break;
                case 2: // Slow zigzag
                    shape.position.x += Math.sin(engine.getDeltaTime() / 200) * 0.1;
                    shape.position.z -= 0.1;
                    shape.scaling.addInPlace(new BABYLON.Vector3(0.01, 0.01, 0.01));
                    break;
            }

            if (shape.position.z < -20 || shape.position.y < -10) {
                shape.dispose(); // Remove the shape once it is out of view
            }
        });
    }

    // Generate shapes and coins at intervals
    setInterval(generateShapesAndCoins, 2000); // Generate shapes and coins every 2 seconds

    // Render loop
    engine.runRenderLoop(function () {
        scene.render();
    });

    // Resize the engine on window resize
    window.addEventListener('resize', function () {
        engine.resize();
    });
});
