import {
  SceneLoader,
  SceneLoaderAnimationGroupLoadingMode,
} from "@babylonjs/core/Loading/sceneLoader"
import type { Scene } from "@babylonjs/core/scene"
import "@babylonjs/loaders/glTF/2.0"

export interface AssetsBundle {
  models?: AssetsMap
  animations?: AssetsMap
}

type AssetsMap = Record<AssetName, Path>
type AssetName = string
type Path = string

export async function loadAssets(scene: Scene, assetsBundle: AssetsBundle): Promise<any> {
  await Promise.all(loadMeshes(scene, assetsBundle.models ?? {}))
  await Promise.all(loadAnimations(scene, assetsBundle.animations ?? {}))
}

function loadMeshes(scene: Scene, meshesMap: AssetsMap) {
  return Object.keys(meshesMap).map((name) => loadMesh(scene, name, meshesMap[name]))
}

async function loadMesh(scene: Scene, meshName: string, path: string) {
  const [url, name] = splitPath(path)
  const result = await SceneLoader.ImportMeshAsync("", url, name, scene)
  result.meshes[0].name = meshName
  return result
}

function splitPath(path: string): [url: string, name: string] {
  const lastSeparator = path.lastIndexOf("/") + 1
  return [path.slice(0, lastSeparator), path.slice(lastSeparator)]
}

function loadAnimations(scene: Scene, animationsMap: AssetsMap) {
  return Object.values(animationsMap).map((path) => loadAnimation(scene, path))
}

function loadAnimation(scene: Scene, path: string) {
  return SceneLoader.ImportAnimationsAsync("", path, scene, false, SceneLoaderAnimationGroupLoadingMode.NoSync)
}

