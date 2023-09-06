import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

camera.position.z = 40;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let loadedModel;
const gltfLoader = new GLTFLoader();
gltfLoader.load('enterprise.glb', (gltf) => {
  loadedModel = gltf.scene;

  loadedModel.scale.set(1, 1, 1);
  loadedModel.rotation.x = Math.PI;
  loadedModel.rotation.z = Math.PI / 2;
  loadedModel.rotation.x = Math.PI / 2;

  // loadedModel.castShadow = true;

  // Add the loaded model to the scene
  scene.add(loadedModel);
  createLights();
  updateLightPositions();

  animate();
});


// Adds background stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.5, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = [THREE.MathUtils.randFloatSpread(400), THREE.MathUtils.randFloatSpread(300), THREE.MathUtils.randFloat(-60, -160)];

  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);

const lights = [];

function createLights() {
  // Create a point light source
  const center = new THREE.Vector3(0, 0, 0);
  const numLights = 24;
  const lightDistance = 40;
  for (let i = 0; i < numLights; i++) {
    const phi = Math.acos(-1 + (2 * i) / numLights); // Angle from top to bottom
    const theta = Math.sqrt(numLights * Math.PI * 2) * phi; // Angle around the sphere

    const light = new THREE.PointLight(0x606060, 1000);

    // Calculate the position using spherical coordinates
    light.position.x = center.x + lightDistance * Math.cos(theta) * Math.sin(phi);
    light.position.y = center.y + lightDistance * Math.sin(theta) * Math.sin(phi);
    light.position.z = center.z + lightDistance * Math.cos(phi);

    scene.add(light);

    // Make each light point at the cube
    light.target = loadedModel;
    lights.push(light);
  }
}

console.log(lights);

function updateLightPositions() {
  const center = loadedModel.position.clone();
  const numLights = 24;
  const lightDistance = 40;

  for (let i = 0; i < lights.length; i++) {

    const phi = Math.acos(-1 + (2 * i) / numLights); // Angle from top to bottom
    const theta = Math.sqrt(numLights * Math.PI * 2) * phi; // Angle around the sphere

    // Calculate the position using spherical coordinates
    lights[i].position.x = center.x + lightDistance * Math.cos(theta) * Math.sin(phi);
    lights[i].position.y = center.y + lightDistance * Math.sin(theta) * Math.sin(phi);
    lights[i].position.z = center.z + lightDistance * Math.cos(phi);
  }
}

// Create an ambient light
const ambientLight = new THREE.AmbientLight(0x333333); // Adjust the color as needed
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Color: white, Intensity: 1
directionalLight.position.set(1, 1, 1); // Set the direction of the light
scene.add(directionalLight);

// Function to animate the cube
const animate = () => {
  requestAnimationFrame(animate);

  // Rotate the cube
  loadedModel.rotation.x += 0.001;
  loadedModel.rotation.z -= 0.001;

  updateLightPositions();

  // Render the scene
  renderer.render(scene, camera);
};

// Call the animate function to start rendering


