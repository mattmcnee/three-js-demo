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


// renderer.shadowMap.enabled = true;

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

    const light = new THREE.PointLight(0x404040, 1000);

    // Calculate the position using spherical coordinates
    lights[i].position.x = center.x + lightDistance * Math.cos(theta) * Math.sin(phi);
    lights[i].position.y = center.y + lightDistance * Math.sin(theta) * Math.sin(phi);
    lights[i].position.z = center.z + lightDistance * Math.cos(phi);
  }
}

// Create an ambient light
const ambientLight = new THREE.AmbientLight(0x404040); // Adjust the color as needed
scene.add(ambientLight);

// Function to animate the cube
const animate = () => {
  requestAnimationFrame(animate);

  // Rotate the cube
  loadedModel.position.x += 0.02;
  loadedModel.position.z -= 0.1;

  updateLightPositions();

  // Render the scene
  renderer.render(scene, camera);
};

// Call the animate function to start rendering


