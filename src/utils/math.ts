import type { AbstractMesh } from "@babylonjs/core/Meshes"
import type { Scene } from "@babylonjs/core/scene"
import { Ray } from "@babylonjs/core/Culling"
import { Vector3 } from "@babylonjs/core/Maths"

const ray = new Ray(Vector3.Zero(), Vector3.Down())

export function floorRayCast(targetMesh: AbstractMesh, scene: Scene, rayCastLength: number): boolean {
  ray.origin.copyFrom(targetMesh.position).addInPlaceFromFloats(0, -0.9, 0)
  ray.length = rayCastLength
  const pick = scene.pickWithRay(ray, (mesh) => mesh !== targetMesh && mesh.isPickable && mesh.isEnabled())
  return !!pick?.hit
}
