import "./style/main.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import WaterVertexShader from "./shaders/water/vertex.glsl";
import WaterFragmentShader from "./shaders/water/fragment.glsl";
import dat from "dat.gui";

/**
 * GUI
 */
const gui = new dat.GUI();
gui.width = 300;
const debugObject = {};
debugObject.depthColor = "#186691";
debugObject.surfaceColor = "#9bd8ff";

/**
 * Sizes
 */
const sizes = {};
sizes.width = window.innerWidth;
sizes.height = window.innerHeight;

window.addEventListener("resize", () => {
  // Save sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

/**
 * Environnements
 */
// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(-3, 1, 2);
scene.add(camera);

// Geometry
const waterGeometry = new THREE.PlaneBufferGeometry(4, 4, 1024, 1024);
// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: WaterVertexShader,
  fragmentShader: WaterFragmentShader,
  uniforms: {
    uTime: { value: 0 },

    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(2.5, 1.0) },
    uBigWavesSpeed: { value: 0.75 },

    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },

    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 5 },
  },
});
waterMaterial.side = THREE.DoubleSide;
// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI / 2;
scene.add(water);

// dat gui
gui
  .add(waterMaterial.uniforms.uBigWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uBigWaveElevation");
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x")
  .min(1)
  .max(10)
  .step(0.01)
  .name("uFrequencyWaveX");
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y")
  .min(1)
  .max(10)
  .step(0.01)
  .name("uFrequencyWaveY");
gui
  .add(waterMaterial.uniforms.uBigWavesSpeed, "value")
  .min(0.75)
  .max(10)
  .step(0.1)
  .name("uBigWaveSpeed");

gui
  .addColor(debugObject, "depthColor")
  .name("DepthColor")
  .onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
  });
gui
  .addColor(debugObject, "surfaceColor")
  .name("SurfaceColor")
  .onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
  });

gui
  .add(waterMaterial.uniforms.uColorOffset, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uColorOffset");

gui
  .add(waterMaterial.uniforms.uColorMultiplier, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uColorMultiplier");
gui
  .add(waterMaterial.uniforms.uSmallWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uSmallWavesElevation");
gui
  .add(waterMaterial.uniforms.uSmallWavesFrequency, "value")
  .min(0)
  .max(30)
  .step(0.001)
  .name("uSmallWavesFrequency");
gui
  .add(waterMaterial.uniforms.uSmallWavesSpeed, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uSmallWavesSpeed");

/**
 * Lights
 */
// Create ambient light and add to scene.
var light = new THREE.AmbientLight(0x404040, 0.6); // soft white light
scene.add(light);
// Create directional light and add to scene.
var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);

/**
 * Controls
 */
const controls = new OrbitControls(camera, document.querySelector(".webgl"));
controls.target.y = 1;
controls.update();
controls.enableDamping = true;

// Time
const clock = new THREE.Clock();

/**
 * Loop
 */
const loop = () => {
  const currentTime = clock.getElapsedTime();
  controls.update();
  waterMaterial.uniforms.uTime.value = currentTime;
  // Render
  renderer.render(scene, camera);

  // Keep looping
  window.requestAnimationFrame(loop);
};
loop();
