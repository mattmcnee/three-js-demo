import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

window.addEventListener('resize', () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  // Update renderer size
  renderer.setSize(newWidth, newHeight);

  // Update camera aspect ratio
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
});

camera.position.z = 40;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Rotation of object after aligned to line
var euler = new THREE.Euler(0, Math.PI, Math.PI/2);
const fromLeft = new THREE.Quaternion();
fromLeft.setFromEuler(euler);

euler = new THREE.Euler(Math.PI, Math.PI, -Math.PI/2);
const fromRight = new THREE.Quaternion();
fromRight.setFromEuler(euler);

euler = new THREE.Euler(0, -Math.PI / 2, Math.PI/2);
const fromAbove = new THREE.Quaternion();
fromAbove.setFromEuler(euler);

var angle = new THREE.Quaternion().copy(fromAbove);
















let loadedModel;
let noScroll;
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
  setCurve("left1");
  updatePosition(0, angle);
  noScroll = true;
  document.addEventListener('scroll', () => {
      if (noScroll) {
          noScroll = false;
          clock.start();
          animate();
      }
  });

  document.addEventListener('click', () => {
      if (noScroll) {
          noScroll = false;
          clock.start();
          animate();
      }
  });
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



const curve = new THREE.CurvePath();
const curveNames = ["left1", "bottom1", "right1"]
function setCurve(curveName) {
  curve.curves = [];
  if (curveName == "left1") {
    const curve1 = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-150, 0, 0),
      new THREE.Vector3(-50, 0, 0),
      new THREE.Vector3(-30, 0, 10),
      new THREE.Vector3(0, 0, 10)
    );

    const curve2 = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(30, 0, 10),
      new THREE.Vector3(50, 0, 0),
      new THREE.Vector3(150, 0, 0)
    );
    curve.add(curve1);
    curve.add(curve2);
    angle = new THREE.Quaternion().copy(fromLeft);
  } 
  else if (curveName == "bottom1") {
    const curve1 = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, -50, 20),
      new THREE.Vector3(0, -10, 20),
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(0, 10, 0)
    );

    const curve2 = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 10, 0),
      new THREE.Vector3(0, 20, -10),
      new THREE.Vector3(5, 30, -70),
      new THREE.Vector3(10, 40, -100)
    );
    curve.add(curve1);
    curve.add(curve2);
    angle = new THREE.Quaternion().copy(fromAbove);
  }
  else if (curveName == "right1") {
    const curve1 = new THREE.CubicBezierCurve3(
        new THREE.Vector3(150, 0, 0),
        new THREE.Vector3(50, 0, 0),
        new THREE.Vector3(30, 0, 10),
        new THREE.Vector3(0, 0, 10)
    );

    const curve2 = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 10),
        new THREE.Vector3(-30, 0, 10),
        new THREE.Vector3(-50, 0, 0),
        new THREE.Vector3(-150, 0, 0)
    );
    curve.add(curve1);
    curve.add(curve2);
    angle = new THREE.Quaternion().copy(fromRight);
  }
}


// Number of points on the curve
const numPoints = 100;
const points = curve.getPoints(numPoints);

// Display the curve
const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

// These lights are mainly for the stars
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Animation loop
const clock = new THREE.Clock();
const duration = 5; // Duration of the animation in seconds
const speed = 1;    // Adjust the speed of the animation



// Used for rotation calculations
const up = new THREE.Vector3( 0, 1, 0 );
const axis = new THREE.Vector3();







function updatePosition(prog, afterQuat){
  // update position
  const position = new THREE.Vector3();
  curve.getPointAt(prog, position);
  loadedModel.position.copy(position);

  // calculate updated rotation
  if (prog < 1) {
    const tangent = curve.getTangentAt(prog);
    axis.crossVectors( up, tangent ).normalize();
    const radians = Math.acos(up.dot(tangent));
    loadedModel.quaternion.setFromAxisAngle( axis, radians );
    loadedModel.quaternion.multiply(afterQuat);
  }

  // apply to scene
  updateLightPositions();
  renderer.render(scene, camera);
}


function animate() {
  const elapsed = clock.getElapsedTime();
  const progress = (elapsed * speed) / duration;

  // Get the position on the curve
  updatePosition(progress, angle);

  // Continue the animation
  if (progress < 1) {
    requestAnimationFrame(animate);
  }
  else{
        var randomIndex = Math.floor(Math.random() * curveNames.length);
    setCurve(curveNames[randomIndex]);



    updatePosition(0, angle);
    noScroll = true;
  }
}

