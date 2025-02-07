document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 1, -10), scene);
    camera.setTarget(new BABYLON.Vector3(0, 1, 0));

    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, scene);
    const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    ground.material = groundMaterial;

    function createEmissiveMaterial(color) {
        const material = new BABYLON.StandardMaterial('material', scene);
        material.emissiveColor = color;
        return material;
    }

    class Obstacle {
        constructor(position, size) {
            this.mesh = BABYLON.MeshBuilder.CreateBox('obstacle', { width: size, height: size, depth: size }, scene);
            this.mesh.position = position;
            this.mesh.material = createEmissiveMaterial(new BABYLON.Color3(0, 1, 0)); // Neon green
        }

        move(speed) {
            this.mesh.scaling.addInPlace(new BABYLON.Vector3(0.01, 0.01, 0.01)); // Grow in size
            this.mesh.position.z += speed; // Move towards the camera
        }
    }

    class Laser {
        constructor(position, size) {
            this.mesh = BABYLON.MeshBuilder.CreatePlane('laser', { width: size, height: size }, scene);
            this.mesh.position = position;
            this.mesh.material = createEmissiveMaterial(new BABYLON.Color3(1, 0, 0)); // Neon red
        }

        move(speed) {
            this.mesh.scaling.addInPlace(new BABYLON.Vector3(0.01, 0.01, 0.01)); // Grow in size
            this.mesh.position.z += speed; // Move towards the camera
        }
    }

    const obstacles = [];
    const lasers = [];

    function generateObstacle() {
        const size = 0.5; // Initial size
        const xPos = (Math.random() - 0.5) * 10; // Random x position
        const yPos = 1; // Keep above the ground
        const zPos = -50; // Start far from the camera
        const obstacle = new Obstacle(new BABYLON.Vector3(xPos, yPos, zPos), size);
        obstacles.push(obstacle);
    }

    function generateLaser() {
        const size = 0.1; // Initial size
        const xPos = (Math.random() - 0.5) * 10; // Random x position
        const yPos = 1 + (Math.random() * 2); // Random y position within a certain range
        const zPos = -50; // Start far from the camera
        const laser = new Laser(new BABYLON.Vector3(xPos, yPos, zPos), size);
        lasers.push(laser);
    }

    setInterval(generateObstacle, 2000); // Generate obstacle every 2 seconds
    setInterval(generateLaser, 3000); // Generate laser every 3 seconds

    function animate() {
        obstacles.forEach(obstacle => {
            obstacle.move(0.5); // Adjust speed as necessary
            if (obstacle.mesh.position.z > 10) {
                obstacle.mesh.dispose();
            }
        });

        lasers.forEach(laser => {
            laser.move(0.5); // Adjust speed as necessary
            if (laser.mesh.position.z > 10) {
                laser.mesh.dispose();
            }
        });

        scene.render();
        requestAnimationFrame(animate);
    }

    engine.runRenderLoop(animate);

    window.addEventListener('resize', function() {
        engine.resize();
    });
});
