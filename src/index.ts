import { Engine } from "@babylonjs/core/Engines/engine"
import { Scene } from "@babylonjs/core/scene"
import HavokPhysics from "@babylonjs/havok"
import { DirectionalLight, HemisphericLight, ShadowGenerator, ShadowLight } from "@babylonjs/core/Lights"
import { Vector3 } from "@babylonjs/core/Maths"
import { FollowCamera } from "@babylonjs/core/Cameras"
import { SceneLoader, SceneLoaderAnimationGroupLoadingMode } from "@babylonjs/core/Loading"
import { AbstractMesh } from "@babylonjs/core/Meshes"
import { Player } from "./entities/player/player"
import "@babylonjs/core/Helpers/sceneHelpers"
import "@babylonjs/core/Physics/joinedPhysicsEngineComponent"
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins"
import { KeyboardManager } from "./keyboard"
import "@babylonjs/loaders/glTF/2.0"
import { Box } from "./entities/box/box"
import { Inspector } from "@babylonjs/inspector"
import { Terrain } from "./entities/terrain/terrain"

export function main(): void {
  initialiseScene(createCanvas())
}

function createCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  document.body.appendChild(canvas)
  canvas.style.width = "100%"
  canvas.style.height = "100%"
  return canvas
}

async function initialiseScene(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas)
  const scene = new Scene(engine)

  KeyboardManager.init(scene)

  await createPhysics(scene)
  await loadMeshes(scene)
  await loadAnimation(scene, "walk")
  await loadAnimation(scene, "run")
  await loadAnimation(scene, "jumpInPlace")
  await loadAnimation(scene, "jumpInRun")
  await loadAnimation(scene, "idle")

  createAmbientLight(scene)
  const light = createSunLight(scene)
  new Terrain(scene, 100)
  const player = new Player(scene)
  const box = new Box(scene)
  const shadow = initialiseShadow(light)
  shadow.addShadowCaster(player.mesh).addShadowCaster(box.mesh)
  createCamera(scene, player.mesh)

  Inspector.Show(scene, {})

  engine.runRenderLoop(() => scene.render())
  window.addEventListener("resize", () => engine.resize())
}

async function createPhysics(scene: Scene) {
  const physics = await HavokPhysics()
  const physicsPlugin = new HavokPlugin(true, physics)
  scene.enablePhysics(new Vector3(0, -9.81, 0), physicsPlugin)
  scene.collisionsEnabled = true
}

function createAmbientLight(scene: Scene) {
  const light = new HemisphericLight("light", Vector3.Up(), scene)
  light.intensity = 0.7
  return light
}

function createSunLight(scene: Scene) {
  const light = new DirectionalLight("directionalLight", new Vector3(0.5, -0.5, -1.0), scene)
  light.position = new Vector3(0, 10, 10)
  return light
}

function createCamera(scene: Scene, target: AbstractMesh) {
  const camera = new FollowCamera("camera", new Vector3(0, 1, 0), scene, target)
  camera.heightOffset = 2.9
  camera.radius = -6
  camera.attachControl(true)
  camera.cameraAcceleration = .1
  camera.maxCameraSpeed = 2
  return camera
}

async function loadMeshes(scene: Scene) {
  return SceneLoader.ImportMeshAsync("", "/", "player.gltf", scene)
}

async function loadAnimation(scene: Scene, animation: string) {
  const mode = SceneLoaderAnimationGroupLoadingMode.NoSync
  return SceneLoader.ImportAnimationsAsync("", `${animation}.gltf`, scene, false, mode)
}

function initialiseShadow(light: ShadowLight) {
  const shadowGenerator = new ShadowGenerator(1024, light)
  shadowGenerator.useBlurExponentialShadowMap = true
  shadowGenerator.blurKernel = 32
  return shadowGenerator
}

main()
