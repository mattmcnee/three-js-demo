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
camera.position.setY(20);

// Lights
const pointLight = new THREE.PointLight(0x000000);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

let loadedModel;
let angle = 0; // Initial angle for orbit
const radius = 50; // Radius of the orbit


function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = [THREE.MathUtils.randFloatSpread(800), THREE.MathUtils.randFloatSpread(600), THREE.MathUtils.randFloat(-60, -160)];

  star.position.set(x, y, z);
  scene.add(star);
}
Array(300).fill().forEach(addStar);


// Load the GLB model
const gltfLoader = new GLTFLoader();
gltfLoader.load('enterprise.glb', (gltf) => {
  loadedModel = gltf.scene;

  loadedModel.scale.set(1, 1, 1);
  loadedModel.rotation.x = Math.PI;
  loadedModel.rotation.z = Math.PI / 2;
  loadedModel.rotation.x = Math.PI / 2;

  // Add the loaded model to the scene
  scene.add(loadedModel);
  renderer.render(scene, camera);

  // animate(); // Start the animation loop
});

document.addEventListener('DOMContentLoaded', () => {
    // Your Three.js setup code here, including the definition of the animate() function
    
    // Add a scroll event listener to the window
    window.addEventListener('scroll', () => {
      clock.start();
        animate(); // Call the animate() function when the user scrolls
    });
});

console.log(window.innerWidth);

// Define the control points for the quadratic Bezier curve
const startPoint = new THREE.Vector3(0, 0, 0);
const controlPoint1 = new THREE.Vector3(50, 10, -10);
const endPoint = new THREE.Vector3(200, 30, -40);

// Create a quadratic Bezier curve
const curve = new THREE.QuadraticBezierCurve3(startPoint, controlPoint1, endPoint);

// Number of points on the curve
const numPoints = 100;
const points = curve.getPoints(numPoints);


// Display the curve
// const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
// const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
// const line = new THREE.Line(lineGeometry, lineMaterial);
// scene.add(line);

// Animation loop
const clock = new THREE.Clock();
const duration = 3; // Duration of the animation in seconds
const speed = 1;    // Adjust the speed of the animation

function animate() {
  const elapsed = clock.getElapsedTime();
  const progress = (elapsed * speed) / duration;

  // Get the position on the curve
  const position = new THREE.Vector3();
  curve.getPointAt(progress, position);




  const tangent = curve.getTangentAt(progress);

  // Set the object's rotation to align with the tangent
const rotation = new THREE.Euler().setFromVector3(tangent);
rotation.x += Math.PI/2;

  // Update the model's position
loadedModel.rotation.copy(rotation);
loadedModel.position.copy(position);


  // Render the scene
  renderer.render(scene, camera);

  // Continue the animation
  if (progress < 1) {
    requestAnimationFrame(animate);
  }
  // else{
  //   clock.start();
  //   requestAnimationFrame(animate);
  // }
}
