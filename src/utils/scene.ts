import type { AbstractMesh } from "@babylonjs/core/Meshes"
import type { Scene } from "@babylonjs/core/scene"
import type { Skeleton } from "@babylonjs/core/Bones"
import type { AnimationRange } from "@babylonjs/core/Animations"

export function getMeshByName<T extends AbstractMesh>(name: string, scene: Scene): T {
  const mesh = scene.getMeshByName(name)
  if (!mesh) {
    throw new Error(`Mesh with name ${name} not found`)
  }
  return mesh as T
}

export function getAnimationRange(name: string, skeleton: Skeleton): AnimationRange {
  const range = skeleton.getAnimationRange(name)
  if (!range) {
    throw new Error(`Animation range with name ${name} not found`)
  }
  return range
}
