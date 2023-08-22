import type { AbstractMesh } from "@babylonjs/core/Meshes"
import type { Scene } from "@babylonjs/core/scene"
import type { AnimationGroup } from "@babylonjs/core/Animations"
import type { Bone } from "@babylonjs/core/Bones"

export function getMeshByName<T extends AbstractMesh>(name: string, scene: Scene): T {
  const mesh = scene.getMeshByName(name)
  if (!mesh) {
    throw new Error(`Mesh with name ${name} not found`)
  }
  return mesh as T
}

export function getBoneByName(name: string, scene: Scene): Bone {
  const bone = scene.getBoneByName(name)
  if (!bone) {
    throw new Error(`Bone with name ${name} not found`)
  }
  return bone
}

export function getAnimationGroupByName(name: string, scene: Scene): AnimationGroup {
  const animation = scene.getAnimationGroupByName(name)
  if (!animation) {
    throw new Error(`Animation group with name ${name} not found`)
  }
  return animation
}
