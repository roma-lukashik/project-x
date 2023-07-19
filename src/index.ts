import { Engine } from "@babylonjs/core/Engines/engine"
import { Scene } from "@babylonjs/core/scene"
import HavokPhysics from "@babylonjs/havok"
import { DirectionalLight, HemisphericLight, ShadowGenerator, ShadowLight } from "@babylonjs/core/Lights"
import { Color3, Vector3 } from "@babylonjs/core/Maths"
import { FollowCamera } from "@babylonjs/core/Cameras"
import { SceneLoader } from "@babylonjs/core/Loading"
import { AbstractMesh } from "@babylonjs/core/Meshes"
import { Player } from "./entities/player/player"
import "@babylonjs/core/Helpers/sceneHelpers"
import "@babylonjs/core/Physics/joinedPhysicsEngineComponent"
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins"
import { KeyboardManager } from "./keyboard";

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

  createEnvironment(scene)
  createAmbientLight(scene)
  const light = createSunLight(scene)
  const player = new Player(scene)
  initialiseShadow(light, player.mesh)
  createCamera(scene, player.mesh)

  engine.runRenderLoop(() => scene.render())
  window.addEventListener("resize", () => engine.resize())
}

async function createPhysics(scene: Scene) {
  const physics = await HavokPhysics()
  const physicsPlugin = new HavokPlugin(true, physics)
  scene.enablePhysics(new Vector3(0, -9.8, 0), physicsPlugin)
}

function createEnvironment(scene: Scene) {
  const env = scene.createDefaultEnvironment({
    enableGroundShadow: true,
    sizeAuto: true,
  })
  if (!env) {
    throw new Error("Cannot create a scene")
  }
  env.setMainColor(Color3.Gray())
}

function createAmbientLight(scene: Scene) {
  const light = new HemisphericLight("light", Vector3.Up(), scene)
  light.intensity = 0.7
  return light
}

function createSunLight(scene: Scene) {
  const light = new DirectionalLight("directionalLight", new Vector3(0, -0.5, -1.0), scene)
  light.position = new Vector3(0, 5, 5)
  return light
}

function createCamera(scene: Scene, target: AbstractMesh) {
  const camera = new FollowCamera("camera", new Vector3(0, 300, 0), scene, target)
  camera.heightOffset = 400
  camera.radius = 350
  camera.attachControl(true)
  return camera
}

async function loadMeshes(scene: Scene) {
  return SceneLoader.ImportMeshAsync("", "/", "bot.babylon", scene)
}

function initialiseShadow(light: ShadowLight, mesh: AbstractMesh) {
  const shadowGenerator = new ShadowGenerator(1024, light)
  shadowGenerator.useBlurExponentialShadowMap = true
  shadowGenerator.blurKernel = 32
  shadowGenerator.addShadowCaster(mesh, true)
  return shadowGenerator
}

main()
