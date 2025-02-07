document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    // Create a static ArcRotateCamera
    const camera = new BABYLON.ArcRotateCamera('camera1', Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false); // Make it static

    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Create a shallow cone
    const cone = BABYLON.MeshBuilder.CreateCylinder('cone', { height: 2, diameterTop: 0.1, diameterBottom: 10, tessellation: 32 }, scene);
    cone.rotation.x = Math.PI; // Rotate cone to make the inside visible to the camera
    const coneMaterial = new BABYLON.StandardMaterial('coneMaterial', scene);

    // Create a video texture for the mandala pattern
    const videoTexture = new BABYLON.VideoTexture('videoTexture', 'https://raw.githubusercontent.com/Weat-ctrl/TRA/main/assets/mandala-pattern.mp4', scene, true, true);
    coneMaterial.diffuseTexture = videoTexture;
    coneMaterial.backFaceCulling = false; // Ensure the texture is visible on the inside
    cone.material = coneMaterial;

    // Render loop
    engine.runRenderLoop(function() {
        scene.render();
    });

    // Resize the engine on window resize
    window.addEventListener('resize', function() {
        engine.resize();
    });
});
