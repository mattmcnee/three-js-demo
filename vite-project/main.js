import './style.css'

import * as THREE from 'three';

// Import the GLTFLoader
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

const loader = new GLTFLoader();


loader.load( 'cube.glb', function ( gltf ) {
  const model = gltf.scene;
  model.position.set(0, 0, 0);
  scene.add(model);
  camera.lookAt(model.position);


  const bbox = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  bbox.getSize(size);
  // Log the size
  console.log('Cube Size (Width x Height x Depth):', size.x, 'x', size.y, 'x', size.z);
  if (model.children.length > 0) {
    const material = model.children[0].material;
    
    // Check if the material has a color property
    if (material.color) {
      const color = material.color.getHex();
      console.log('Cube Color (Hex):', `#${color.toString(16)}`);
    } else {
      console.log('Cube has no color property in its material.');
    }
  } else {
    console.log('No material found on the cube.');
  }

    const cubePosition = model.position;
  console.log('Cube Position (X, Y, Z):', cubePosition.x, cubePosition.y, cubePosition.z);
  
  if (model.children.length > 0) {
    const material = model.children[0].material;

    // Check and update opacity
    if (material.opacity !== 1) {
      material.opacity = 1; // Set opacity to fully opaque (1)
      material.transparent = false; // Disable transparency
      material.needsUpdate = true; // Ensure changes take effect
    }

    // Log the material's opacity
    console.log('Cube Material Opacity:', material.opacity);
  } else {
    console.log('No material found on the cube.');
  }

  console.log("Loaded cube");
}, undefined, function ( error ) {
  console.error( error );
});
renderer.render(scene, camera);