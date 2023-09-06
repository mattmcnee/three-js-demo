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
var noScroll;

// Adds background stars
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
  updatePosition(0);

  noScroll = true;
  document.addEventListener('click', () => {
      if (noScroll) {
          noScroll = false;
          clock.start();
          animate();
      }
  });
});

const curve1 = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, 0, 50),
    new THREE.Vector3(0, 20, 20),
    new THREE.Vector3(0, 50, 0),
    new THREE.Vector3(0, 50, 0)
);

const curve2 = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, 50, 0),
    new THREE.Vector3(0, 70, -10),
    new THREE.Vector3(100, 100, -50),
    new THREE.Vector3(100, 100, -50)
);

// const curve1 = new THREE.CubicBezierCurve3(
//   new THREE.Vector3(0, 0, 0),   // Start point
//   new THREE.Vector3(0, 5, 0),   // Control point 1 (vertical movement)
//   new THREE.Vector3(0, 10, 0),  // Control point 2 (vertical movement)
//   new THREE.Vector3(0, 15, 0)   // End point (higher up)
// );

// const curve2 = new THREE.CubicBezierCurve3(
//   new THREE.Vector3(0, 15, 0),  // Start point (end of the first curve)
//   new THREE.Vector3(0, 20, 0),  // Control point 1 (horizontal movement)
//   new THREE.Vector3(0, 25, -5), // Control point 2 (horizontal movement)
//   new THREE.Vector3(0, 30, -5)  // End point (further to the right)
// );

// const curve3 = new THREE.CubicBezierCurve3(
//   new THREE.Vector3(0, 30, -5),  // Start point (end of the first curve)
//   new THREE.Vector3(0, 35, -5),  // Control point 1 (horizontal movement)
//   new THREE.Vector3(10, 40, -5), // Control point 2 (horizontal movement)
//   new THREE.Vector3(10, 40, -5)  // End point (further to the right)
// );

// Create a CurvePath and add your curves to it
const curve = new THREE.CurvePath();
curve.add(curve1);
curve.add(curve2);
// curve.add(curve3);

// Number of points on the curve
const numPoints = 100;
const points = curve.getPoints(numPoints);

// Display the curve
const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

// Animation loop
const clock = new THREE.Clock();
const duration = 8; // Duration of the animation in seconds
const speed = 1;    // Adjust the speed of the animation

// Used for rotation calculations
const up = new THREE.Vector3( 0, 1, 0 );
const axis = new THREE.Vector3();

// Rotation of object after aligned to line
var euler = new THREE.Euler(0, -Math.PI / 2, Math.PI/2);
const fromAboveQuaternion = new THREE.Quaternion();
fromAboveQuaternion.setFromEuler(euler);


function updatePosition(prog){
  // update position
  const position = new THREE.Vector3();
  curve.getPointAt(prog, position);
  loadedModel.position.copy(position);

  // calculate updated rotation
  if (prog < 1) {
    console.log(prog);
    const tangent = curve.getTangentAt(prog);
    axis.crossVectors( up, tangent ).normalize();
    const radians = Math.acos(up.dot(tangent));
    loadedModel.quaternion.setFromAxisAngle( axis, radians );
    loadedModel.quaternion.multiply(fromAboveQuaternion);
  }

  // apply to scene
  renderer.render(scene, camera);
}

function animate() {
  const elapsed = clock.getElapsedTime();
  const progress = (elapsed * speed) / duration;

  // Get the position on the curve
  updatePosition(progress);

  // Continue the animation
  if (progress < 1) {
    requestAnimationFrame(animate);
  }
  else{
    updatePosition(0);
    noScroll = true;
  }
}