import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(80);
camera.position.setX(-20);

// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

let loadedModel;
let angle = 0; // Initial angle for orbit
const radius = 50; // Radius of the orbit

// Load the GLB model
const gltfLoader = new GLTFLoader();
gltfLoader.load('enterprise.glb', (gltf) => {
  // The model has been loaded, and you can access it here
  loadedModel = gltf.scene;

  // Optionally, you can scale, position, or manipulate the loaded model here
  loadedModel.scale.set(1, 1, 1);
  loadedModel.rotation.x = Math.PI;
  loadedModel.rotation.y = Math.PI / 2;

  // Add the loaded model to the scene
  scene.add(loadedModel);

  animate(); // Start the animation loop
});

// Function to animate the rotation and orbit
function animate() {
  requestAnimationFrame(animate);

  // Update the position to create an orbit
  if (loadedModel) {
    angle += 0.005; // Adjust the orbit speed as needed
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);

    loadedModel.position.set(x, 0, z);
  }

  // Rotate the model around its own axis
  if (loadedModel) {
    loadedModel.rotation.y += 0.005; // Adjust the rotation speed as needed
  }

  // Render the scene
  renderer.render(scene, camera);
}
