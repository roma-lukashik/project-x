import { Engine } from "@babylonjs/core/Engines/engine"
import { Scene } from "@babylonjs/core/scene"
import { DirectionalLight, HemisphericLight, ShadowGenerator, type ShadowLight } from "@babylonjs/core/Lights"
import { Vector3 } from "@babylonjs/core/Maths"
import { CreateBox, Mesh } from "@babylonjs/core/Meshes"
import { SkyMaterial } from "@babylonjs/materials/sky"
import { Inspector } from "@babylonjs/inspector"
import { Player } from "./entities/player/player"
import { InputController } from "./controllers/input"
import { Box } from "./entities/box/box"
import { Terrain } from "./entities/terrain/terrain"
import { Pistol } from "./entities/pistol/pistol"
import { loadAssets } from "./loaders/assetsLoader"
import { gameBundle } from "./bundle"

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

  await loadAssets(scene, gameBundle)

  createAmbientLight(scene)
  createSkybox(scene)
  const light = createSunLight(scene)
  new Terrain(scene, 100)
  const player = new Player("Player", scene)
  const gun = new Pistol("Pistol", scene)
  const box = new Box(scene)
  const shadow = initialiseShadow(light)
  shadow
    .addShadowCaster(player.mesh)
    .addShadowCaster(box.mesh)
    .addShadowCaster(gun.mesh)

  gun.attach(player.rightHand.bone, player.transformNode)

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
  const light = new DirectionalLight("directionalLight", new Vector3(0, -10, -10).normalize(), scene)
  light.position = new Vector3(0, 10, 10)
  return light
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
