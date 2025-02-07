// Get the canvas element
     const canvas = document.getElementById("renderCanvas");

     // Generate the Babylon.js engine
     const engine = new BABYLON.Engine(canvas, true);

     // Create the scene
     const createScene = function () {
         const scene = new BABYLON.Scene(engine);

         // Add a camera
         const camera = new BABYLON.ArcRotateCamera(
             "camera1",
             Math.PI / 2,
             Math.PI / 4,
             10,
             BABYLON.Vector3.Zero(),
             scene
         );
         camera.attachControl(canvas, true);

         // Add a light
         const light = new BABYLON.HemisphericLight(
             "light1",
             new BABYLON.Vector3(1, 1, 0),
             scene
         );
         light.intensity = 0.7;

         // Add a sphere
         const sphere = BABYLON.MeshBuilder.CreateSphere(
             "sphere",
             { diameter: 2, segments: 32 },
             scene
         );
         sphere.position.y = 1;

         // Add a ground
         const ground = BABYLON.MeshBuilder.CreateGround(
             "ground",
             { width: 6, height: 6 },
             scene
         );

         return scene;
     };

     // Call the createScene function
     const scene = createScene();

     // Render the scene
     engine.runRenderLoop(function () {
         scene.render();
     });

     // Handle window resize
     window.addEventListener("resize", function () {
         engine.resize();
     });
