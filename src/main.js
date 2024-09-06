import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
// canvas
const canvas = document.querySelector('canvas.webgl');
console.log(canvas);

const scene = new THREE.Scene();

// Loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('./draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
// 	* RBG Environment Loader
const rgbeLoader = new RGBELoader();

/**
 * Environment map
 
**/
rgbeLoader.load('./aerodynamics_workshop.hdr', envMap => {
	console.log('envMap', envMap);
	envMap.mapping = THREE.EquirectangularReflectionMapping;

	// add to scene
	scene.background = envMap;
});

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
	pixelRatio: window.devicePixelRatio,
};

// Resize
window.addEventListener('resize', () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(sizes.pixelRatio);
});

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	1000,
);

camera.position.set(-5, 5, 12);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
renderer.setClearColor('#0b0b0b');
// Oribit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Lights - Directional Light
 **/

const directionalLight = new THREE.DirectionalLight('#ffffff', 4);

const directionalLightHelper = new THREE.DirectionalLightHelper(
	directionalLight,
	0.2,
);

directionalLight.position.set(6.25, 3, 4);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 30;
directionalLight.shadow.normalBias = 0.05;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;

scene.add(directionalLight, directionalLightHelper);

/**
 * Model
 **/
// Sphere
const geometry = new THREE.IcosahedronGeometry(2.5, 5);
const material = new THREE.MeshStandardMaterial({ color: '#ff0000' });
const mesh = new THREE.Mesh(geometry, material);

mesh.receiveShadow = true;
mesh.castShadow = true;

scene.add(mesh);

// Planer
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({
	color: '#aaaaaa',
	side: THREE.DoubleSide,
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.position.x = -4;
plane.position.y = -3;
plane.position.z = -4;
plane.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(plane);
// plane.position.x = -5.5;

scene.add(plane);

// Grid and Axes
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const tick = () => {
	renderer.render(scene, camera);

	// Update controls
	controls.update();

	window.requestAnimationFrame(tick);
};

tick();
