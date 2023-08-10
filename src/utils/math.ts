import type { AbstractMesh } from "@babylonjs/core/Meshes"
import type { Scene } from "@babylonjs/core/scene"
import { Ray } from "@babylonjs/core/Culling"
import { Vector3 } from "@babylonjs/core/Maths"

const Vector3Down = Vector3.Up().scaleInPlace(-1)

export function floorRayCast(targetMesh: AbstractMesh, scene: Scene, rayCastLength: number): boolean {
  const ray = new Ray(targetMesh.position, Vector3Down, rayCastLength)
  const pick = scene.pickWithRay(ray, (mesh) => mesh.isPickable && mesh.isEnabled())
  return !!pick?.hit
}
