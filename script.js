document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    // Create a static UniversalCamera
    const camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 0, -20), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    // Create a shallow cone with inverted normals to make it appear hollow
    const cone = BABYLON.MeshBuilder.CreateCylinder('cone', { height: 10, diameterTop: 0.1, diameterBottom: 10, tessellation: 32, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
    cone.rotation.x = Math.PI; // Rotate cone to make the inside face the camera
    cone.position = new BABYLON.Vector3(0, 0, 0);

    // Apply material to the cone
    const coneMaterial = new BABYLON.StandardMaterial('coneMaterial', scene);
    const videoTexture = new BABYLON.VideoTexture('videoTexture', 'https://raw.githubusercontent.com/Weat-ctrl/TRA/main/assets/mandala-pattern.mp4', scene, true, true);
    coneMaterial.diffuseTexture = videoTexture;
    coneMaterial.backFaceCulling = false; // Ensure the texture is visible on the inside
    cone.material = coneMaterial;

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
