import './style.css'
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

// Create a red cube
const cubeGeometry = new THREE.BoxGeometry(); // Default cube geometry
const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red material
const redCube = new THREE.Mesh(cubeGeometry, redMaterial);

// Set the position of the red cube
redCube.position.set(0, 0, 0); // Adjust the position as needed
redCube.scale.set(2, 2, 2);

// Add the red cube to the scene
scene.add(redCube);

// Render the scene
renderer.render(scene, camera);
