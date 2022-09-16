import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Door texture
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

// Walls texture
const wallAmbientTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const wallColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const wallNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const wallRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

// Grass texture
const grassAmbientTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

grassColorTexture.repeat.set(8, 8);
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;

grassNormalTexture.repeat.set(8, 8);
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;

grassAmbientTexture.repeat.set(8, 8);
grassAmbientTexture.wrapS = THREE.RepeatWrapping;
grassAmbientTexture.wrapT = THREE.RepeatWrapping;

grassRoughnessTexture.repeat.set(8, 8);
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    normalMap: wallNormalTexture,
    roughnessMap: wallRoughnessTexture,
    aoMap: wallAmbientTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 1.25;
house.add(walls);

/**
 * Roof */
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);

// walls height + half heigh of roof
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI / 4;
house.add(roof);

/**
 * Door
 * displacement map need more subdivision in geometry
 * aoMap need uv2 coordinates of geometry
 */
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    normalMap: doorNormalTexture,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    transparent: true,
    metalness: 0,
    roughness: 1,
  })
);

door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bushOne = new THREE.Mesh(bushGeometry, bushMaterial);
bushOne.scale.set(0.5, 0.5, 0.5);
bushOne.position.set(0.8, 0.2, 2.2);

const bushTwo = new THREE.Mesh(bushGeometry, bushMaterial);
bushTwo.scale.set(0.3, 0.3, 0.3);
bushTwo.position.set(1.5, 0.1, 2.1);

const bushThree = new THREE.Mesh(bushGeometry, bushMaterial);
bushThree.scale.set(0.4, 0.4, 0.4);
bushThree.position.set(-1, 0.1, 2.2);

const bushFour = new THREE.Mesh(bushGeometry, bushMaterial);
bushFour.scale.set(0.2, 0.2, 0.2);
bushFour.position.set(-1.5, 0.1, 2.4);

scene.add(bushOne, bushTwo, bushThree, bushFour);

// Graves
const graves = new THREE.Group();
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 4 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.castShadow = true;
  grave.position.set(x, 0.3, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  graves.add(grave);
}
scene.add(graves);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    roughnessMap: grassRoughnessTexture,
    normalMap: grassNormalTexture,
    aoMap: grassAmbientTexture,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

const ghostOne = new THREE.PointLight("#ff0000", 2, 3);
const ghostTwo = new THREE.PointLight("#00ffff", 2, 3);
const ghostThree = new THREE.PointLight("#ffff00", 2, 3);

scene.add(ghostOne, ghostTwo, ghostThree);

const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");

// shadows
renderer.shadowMap.enabled = true;
walls.castShadow = true;
moonLight.castShadow = true;
ambientLight.castShadow = true;
doorLight.castShadow = true;

ghostOne.castShadow = true;
ghostTwo.castShadow = true;
ghostThree.castShadow = true;

bushOne.castShadow = true;
bushTwo.castShadow = true;
bushThree.castShadow = true;
bushFour.castShadow = true;

floor.receiveShadow = true;

moonLight.shadow.mapSize.set(256, 256);
moonLight.shadow.camera.far = 15;

doorLight.shadow.mapSize.set(256, 256);
doorLight.shadow.camera.far = 4;

ghostOne.shadow.mapSize.set(256, 256);
ghostOne.shadow.camera.far = 2;

ghostTwo.shadow.mapSize.set(256, 256);
ghostTwo.shadow.camera.far = 2;

ghostThree.shadow.mapSize.set(256, 256);
ghostThree.shadow.camera.far = 2;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Ghosts
  const ghostAngle = elapsedTime * 0.5;
  ghostOne.position.x = Math.cos(ghostAngle) * 4;
  ghostOne.position.z = Math.sin(ghostAngle) * 4;
  ghostOne.position.y = Math.sin(ghostAngle * 3);

  const ghostAngleTwo = -elapsedTime * 0.25;
  ghostTwo.position.x = Math.cos(ghostAngleTwo) * 7;
  ghostTwo.position.z = Math.sin(ghostAngleTwo) * 7;
  ghostTwo.position.y =
    Math.sin(elapsedTime * 2.5) + Math.sin(elapsedTime * 4.5);

  const ghostAngleThree = -elapsedTime * 0.15;
  ghostThree.position.x =
    Math.cos(ghostAngleThree) * (7 + Math.sin(elapsedTime * 0.32));
  ghostThree.position.z =
    Math.sin(ghostAngleThree) * (7 + Math.sin(elapsedTime * 0.5));
  ghostThree.position.y =
    Math.sin(elapsedTime * 2.5) + Math.sin(elapsedTime * 4.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
