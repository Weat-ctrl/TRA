document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    // Create a static UniversalCamera
    const camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 0, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    // Create a plane
    const plane = BABYLON.MeshBuilder.CreatePlane('plane', { size: 10 }, scene);
    plane.position = new BABYLON.Vector3(0, 0, 0);
    plane.rotation.x = Math.PI; // Rotate plane to face the camera

    // Apply material to the plane
    const planeMaterial = new BABYLON.StandardMaterial('planeMaterial', scene);
    const videoTexture = new BABYLON.VideoTexture('videoTexture', 'https://raw.githubusercontent.com/Weat-ctrl/TRA/main/assets/mandala-pattern.mp4', scene, true, true);
    planeMaterial.diffuseTexture = videoTexture;
    plane.material = planeMaterial;

    // Add a light
    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Render loop
    engine.runRenderLoop(function() {
        scene.render();
    });

    // Resize the engine on window resize
    window.addEventListener('resize', function() {
        engine.resize();
    });
});
