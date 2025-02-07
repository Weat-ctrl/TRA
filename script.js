document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    // Create a static ArcRotateCamera
    const camera = new BABYLON.ArcRotateCamera('camera1', Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false); // Make it static

    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Create a pyramid (tetrahedron)
    const pyramid = BABYLON.MeshBuilder.CreatePolyhedron('pyramid', { type: 0, size: 5 }, scene);
    const pyramidMaterial = new BABYLON.StandardMaterial('pyramidMaterial', scene);
    
    // Create a video texture for the mandala pattern
    const videoTexture = new BABYLON.VideoTexture('videoTexture', 'https://raw.githubusercontent.com/USERNAME/REPOSITORY_NAME/main/assets/mandala-pattern.mp4', scene, true, true);
    pyramidMaterial.diffuseTexture = videoTexture;
    pyramid.material = pyramidMaterial;

    // Render loop
    engine.runRenderLoop(function() {
        scene.render();
    });

    // Resize the engine on window resize
    window.addEventListener('resize', function() {
        engine.resize();
    });
});
