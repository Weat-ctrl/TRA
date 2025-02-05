document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const ground = BABYLON.Mesh.CreateGround('ground1', 100, 100, 2, scene);

    function createEmissiveMaterial(color) {
        const material = new BABYLON.StandardMaterial('material', scene);
        material.emissiveColor = color;
        return material;
    }

    class Obstacle {
        constructor(position, type) {
            this.mesh = BABYLON.MeshBuilder.CreateBox('obstacle', { width: 1, height: 2, depth: 1 }, scene);
            this.mesh.position = position;
            this.mesh.material = createEmissiveMaterial(new BABYLON.Color3(0, 1, 0)); // Neon green
            this.type = type;
        }

        move(speed) {
            this.mesh.position.z += speed;
        }
    }

    class Laser {
        constructor(position, type) {
            this.mesh = BABYLON.MeshBuilder.CreatePlane('laser', { width: 2, height: 0.1 }, scene);
            this.mesh.position = position;
            this.mesh.material = createEmissiveMaterial(new BABYLON.Color3(1, 0, 0)); // Neon red
            this.type = type;
        }

        move(speed) {
            this.mesh.position.z += speed;
        }
    }

    const obstacles = [];
    const lasers = [];

    function generateObstacle() {
        const position = new BABYLON.Vector3(0, 1, -100); // Start from the center
        const type = 'movingBarrier'; // Example type
        const obstacle = new Obstacle(position, type);
        obstacles.push(obstacle);
    }

    function generateLaser() {
        const position = new BABYLON.Vector3(0, 1, -100); // Start from the center
        const type = 'laserGrid'; // Example type
        const laser = new Laser(position, type);
        lasers.push(laser);
    }

    setInterval(generateObstacle, 2000); // Generate obstacle every 2 seconds
    setInterval(generateLaser, 3000); // Generate laser every 3 seconds

    function animate() {
        obstacles.forEach(obstacle => {
            obstacle.move(1); // Adjust speed as necessary
            if (obstacle.mesh.position.z > 10) {
                obstacle.mesh.dispose();
            }
        });

        lasers.forEach(laser => {
            laser.move(1); // Adjust speed as necessary
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
