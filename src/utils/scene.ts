import { AbstractMesh } from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";

export function getMeshByName<T extends AbstractMesh>(name: string, scene: Scene): T {
  const mesh = scene.getMeshByName(name)
  if (!mesh) {
    throw new Error(`Mesh with name ${name} not found`)
  }
  return mesh as T
}
