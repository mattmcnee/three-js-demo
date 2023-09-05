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
camera.position.setZ(30);
camera.position.setX(-3);

// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Load the GLB model
const gltfLoader = new GLTFLoader();
gltfLoader.load('enterprise.glb', (gltf) => {
  // The model has been loaded, and you can access it here
  const loadedModel = gltf.scene;

  // Optionally, you can scale, position, or manipulate the loaded model here
  loadedModel.scale.set(.2, .2, .2);
  loadedModel.rotation.x = Math.PI;

  // Add the loaded model to the scene
  scene.add(loadedModel);

  // Render the scene
  renderer.render(scene, camera);
});
