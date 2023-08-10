import { Engine } from "@babylonjs/core/Engines/engine"
import { Scene } from "@babylonjs/core/scene"
import { DirectionalLight, HemisphericLight, ShadowGenerator, ShadowLight } from "@babylonjs/core/Lights"
import { Vector3 } from "@babylonjs/core/Maths"
import { SceneLoader, SceneLoaderAnimationGroupLoadingMode } from "@babylonjs/core/Loading"
import { CreateBox, Mesh } from "@babylonjs/core/Meshes"
import { SkyMaterial } from "@babylonjs/materials/sky"
import { Inspector } from "@babylonjs/inspector"
import "@babylonjs/loaders/glTF/2.0"
import { Player } from "./entities/player/player"
import { InputController } from "./controllers/input"
import { Box } from "./entities/box/box"
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

  InputController.init(scene)

  await loadMeshes(scene)

  createAmbientLight(scene)
  createSkybox(scene)
  const light = createSunLight(scene)
  new Terrain(scene, 100)
  const player = new Player("Player", scene)
  const box = new Box(scene)
  const shadow = initialiseShadow(light)
  shadow.addShadowCaster(player.mesh).addShadowCaster(box.mesh)

  Inspector.Show(scene, {})

  engine.runRenderLoop(() => {
    scene.render()
  })

  window.addEventListener("resize", () => engine.resize())
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

async function loadMeshes(scene: Scene) {
  await SceneLoader.ImportMeshAsync("", "/", "player.gltf", scene)
  await Promise.all([
    loadAnimation(scene, "walk"),
    loadAnimation(scene, "run"),
    loadAnimation(scene, "jumpInPlace"),
    loadAnimation(scene, "jumpInRun"),
    loadAnimation(scene, "idle"),
  ])
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

function createSkybox(scene: Scene) {
  const box = CreateBox("SkyBox", { size: 100, sideOrientation: Mesh.BACKSIDE }, scene)
  const material = new SkyMaterial("SkyMaterial", scene)
  material.inclination = -0.35
  box.material = material
}

main()
