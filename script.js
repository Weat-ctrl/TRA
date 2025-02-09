document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    // Create a static ArcRotateCamera
    const camera = new BABYLON.ArcRotateCamera('camera1', Math.PI / 2, Math.PI / 4, 15, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false); // Make it static

    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Create a shallow cone with inverted normals to make it appear hollow
    const cone = BABYLON.MeshBuilder.CreateCylinder('cone', { height: 3, diameterTop: 0.1, diameterBottom: 10, tessellation: 32, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
    const coneMaterial = new BABYLON.StandardMaterial('coneMaterial', scene);

    // Create a video texture for the mandala pattern
    const videoTexture = new BABYLON.VideoTexture('videoTexture', 'https://raw.githubusercontent.com/Weat-ctrl/TRA/main/assets/mandala-pattern.mp4', scene, true, true);
    coneMaterial.diffuseTexture = videoTexture;
    cone.material = coneMaterial;

    // Function to create and move objects from the cone
    function createObject() {
        const size = 0.5; // Initial size
        const xPos = (Math.random() - 0.5) * 2; // Random x position inside the cone
        const yPos = (Math.random() - 0.5) * 2; // Random y position inside the cone
        const zPos = -1.5; // Start position inside the cone

        const object = BABYLON.MeshBuilder.CreateBox('object', { size: size }, scene);
        object.position = new BABYLON.Vector3(xPos, yPos, zPos);
        object.material = new BABYLON.StandardMaterial('objectMaterial', scene);
        object.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red

        // Move object outwards
        scene.onBeforeRenderObservable.add(function() {
            object.position.z += 0.1; // Move the object along the z-axis
            object.scaling.addInPlace(new BABYLON.Vector3(0.01, 0.01, 0.01)); // Grow in size
            if (object.position.z > 10) {
                object.dispose(); // Remove the object once it is out of view
            }
        });
    }

    // Generate objects at intervals
    setInterval(createObject, 2000); // Create an object every 2 seconds

    // Render loop
    engine.runRenderLoop(function() {
        scene.render();
    });

    // Resize the engine on window resize
    window.addEventListener('resize', function() {
        engine.resize();
    });
});
